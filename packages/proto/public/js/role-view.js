import { prepareTemplate } from "./template.js";
import { loadJSON } from "./json-loader.js";
import { Auth, Observer } from "@calpoly/mustang";

export class RoleViewElement extends HTMLElement {
  static observedAttributes = ["src", "mode"];

  get src() {
    return this.getAttribute("src");
  }

  get srcCollection() {
    const path = this.src.split("/");
    const collection = path.slice(0, -1);
    return collection.join("/");
  }

  get mode() {
    return this.getAttribute("mode");
  }

  set mode(m) {
    return this.setAttribute("mode", m);
  }

  static styles = `
    :host {
      --display-new-button: inline-block;
      --display-edit-button: inline-block;
      --display-close-button: none;
      --display-delete-button: none;
    }
    :host([mode="edit"]) {
      --display-new-button: none;
      --display-edit-button: none;
      --display-close-button: inline-block;
      --display-delete-button: inline-block;
    }
    :host([mode="new"]) {
      --display-new-button: none;
      --display-edit-button: none;
      --display-close-button: inline-block;
    }
    * {
      margin: 0;
      box-sizing: border-box;
    }
    section {
      display: grid;
      grid-template-columns: [key] 1fr [value] 3fr [controls] 1fr [end];
      gap: var(--spacing-size-medium) var(--spacing-size-xlarge);
      align-items: end;
    }
    h1 {
      grid-column: value;
    }
    nav {
      display: contents;
      text-align: right;
    }
    nav > * {
      grid-column: controls;
    }
    nav > .new {
      display: var(--display-new-button);
    }
    nav > .edit {
      display: var(--display-edit-button);
    }
    nav > .close {
      display: var(--display-close-button);
    }
    nav > .delete {
      display: var(--display-delete-button);
    }
    restful-form {
      display: none;
      grid-column: key / controls;
    }
    restful-form input {
      grid-column: value;
    }
    restful-form[src] {
      display: block;
      grid-template-columns: subgrid;
    }
    dl {
      display: grid;
      grid-column: key / controls;
      grid-template-columns: subgrid;
      gap: 0 var(--spacing-size-xlarge);
      align-items: baseline;
    }
    restful-form[src] + dl {
      display: none;
    }
    dt {
      grid-column: key;
      justify-self: stretch;
      color: var(--accent-color);
      font-family: var(--text-font-family-display);
    }
    dd {
      grid-column: value;
    }
    ::slotted(ul) {
      list-style: none;
      display: flex;
      gap: var(--spacing-size-medium);
    }
  `;

  static template = prepareTemplate(`
    <template>
    <section>
        <dl>
        <dt>Role ID</dt>
        <dd><slot name="role_id"></slot></dd>
        <dt>Title</dt>
        <dd><slot name="title"></slot></dd>
        </dl>
        <restful-form>
        <label>
            <span>Description</span>
            <input name="description" />
        </label>
        <label>
            <span>Priority</span>
            <input name="priority" />
        </label>
        <label>
            <span>Can Lead</span>
            <input name="can_lead_team" />
        </label>
        <label>
            <span>Can Clean</span>
            <input name="can_clean" />
        </label>
        </restful-form>
        <dl>
        <dt>Description</dt>
        <dd><slot name="description"></slot></dd>
        <dt>Priority</dt>
        <dd><slot name="priority"></slot></dd>
        <dt>Can Lead</dt>
        <dd><slot name="can_lead_team"></slot></dd>
        <dt>Can Clean</dt>
        <dd><slot name="can_clean"></slot></dd>
        </dl>
        <nav>
        <!--
        <button class="new"
            onclick="relayEvent(event,'role-view:new-mode')"
        >New…</button>  
        -->
        <button class="edit"
            onclick="relayEvent(event,'role-view:edit-mode')"
        >Edit</button>
        <button class="close"
            onclick="relayEvent(event,'role-view:view-mode')"
        >Close</button>
        <!--
        <button class="delete"
            onclick="relayEvent(event,'role-view:delete')"
            >Delete</button
        >
        -->
        </nav>
    </section>
    <style>${RoleViewElement.styles}</style>
    </template>
`);

  get form() {
    return this.shadowRoot.querySelector("restful-form");
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).appendChild(
        RoleViewElement.template.cloneNode(true)
    );

    this.addEventListener(
      "role-view:edit-mode",
      (event) => (this.mode = "edit")
    );

    this.addEventListener(
      "role-view:view-mode",
      (event) => (this.mode = "view")
    );

    this.addEventListener(
      "role-view:new-mode",
      (event) => (this.mode = "new")
    );

    this.addEventListener("role-view:delete", (event) => {
      event.stopPropagation();
      deleteResource(this.src).then(() => (this.mode = "new"));
    });

    this.addEventListener("restful-form:created", (event) => {
      console.log("Created a role", event.detail);
      const userid = event.detail.created.userid;
      this.mode = "view";
      this.setAttribute(
        "src",
        `${this.srcCollection}/${userid}`
      );
    });

    this.addEventListener("restful-form:updated", (event) => {
      console.log("Updated a role", event.detail);
      this.mode = "view";
      console.log("Loading JSON", this.authorization);
      loadJSON(this.src, this, renderSlots, this.authorization);
    });
  }

  _authObserver = new Observer(this, "acorn:auth");

  get authorization() {
    console.log("Authorization for user, ", this._user);
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${this._user.token}`
      }
    );
  }

  connectedCallback() {
    this._authObserver.observe().then((obs) => {
      obs.setEffect(({ user }) => {
        console.log("Setting user as effect of change", user);
        this._user = user;
        if (this.src) {
          console.log("Loading JSON", this.authorization);
          loadJSON(
            this.src,
            this,
            renderSlots,
            this.authorization
          );
        }
      });
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      `Atribute ${name} changed from ${oldValue} to`,
      newValue
    );
    switch (name) {
      case "src":
        if (
          newValue &&
          this.mode !== "new" &&
          this.authorization
        ) {
          console.log("LOading JSON", this.authorization);
          loadJSON(
            this.src,
            this,
            renderSlots,
            this.authorization
          );
        } else {
          console.log('src change: load failed', newValue, this.mode, this.authorization)
        }
        break;
      case "mode":
        if (newValue === "edit" && this.src) {
          this.form.removeAttribute("new");
          this.form.setAttribute("src", this.src);
        }
        if (newValue === "view") {
          this.form.removeAttribute("new");
          this.form.removeAttribute("src");
        }
        if (newValue === "new") {
          const newSrc = `${this.srcCollection}/$new`;
          this.replaceChildren();
          this.form.setAttribute("new", "new");
          this.form.setAttribute("src", newSrc);
        }
        break;
    }
  }
}

customElements.define("role-view", RoleViewElement);

function renderSlots(json) {
  console.log("RenderingSlots:", json);
  const entries = Object.entries(json);
  const slot = ([key, value]) => {
    let type = typeof value;

    if (type === "object") {
      if (Array.isArray(value)) type = "array";
    }

    switch (type) {
      case "array":
        return `<ul slot="${key}">
          ${value.map((s) => `<li>${s}</li>`).join("")}
          </ul>`;
      default:
        return `<span slot="${key}">${value}</span>`;
    }
  };

  return entries.map(slot).join("\n");
}

function deleteResource(src) {
  return fetch(src, { method: "DELETE" })
    .then((res) => {
      if (res.status != 204)
        throw `Deletion failed: Status ${res.status}`;
    })
    .catch((err) =>
      console.log("Error deleting resource:", err)
    );
}