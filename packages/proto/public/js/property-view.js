import { prepareTemplate } from "./template.js";
import { loadJSON } from "./json-loader.js";

export class PropertyViewElement extends HTMLElement {
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
        <dt>Property ID</dt>
        <dd><slot name="properties_id"></slot></dd>
        <dt>Property Name</dt>
        <dd><slot name="property_name"></slot></dd>
        <dt>Address</dt>
        <dd><slot name="address"></slot></dd>
        <dt>City</dt>
        <dd><slot name="city"></slot></dd>
        <dt>State</dt>
        <dd><slot name="state_name"></slot></dd>
        <dt>Postal Code</dt>
        <dd><slot name="postal_code"></slot></dd>
        <dt>Country</dt>
        <dd><slot name="country"></slot></dd>
        <dt>Status ID</dt>
        <dd><slot name="status_id"></slot></dd>
        <dt>Status</dt>
        <dd><slot name="status"></slot></dd>
        </dl>
        <restful-form>
            <label>
                <span>Estimated Cleaning Time (minutes)</span>
                <input name="estimated_cleaning_mins" />
            </label>
            <label>
                <span>Double Unit Links</span>
                <input-array name="double_unit">
                    <span slot="label-add">Add a property_id</span>
                </input-array>
            </label>
        </restful-form>
        <dl>
        <dt>Estimated Cleaning Time (minutes)</dt>
        <dd><slot name="estimated_cleaning_mins"></slot></dd>
        <dt>Double Unit Links</dt>
        <dd><slot name="double_unit"></slot></dd>
        </dl>
        <nav>
        <!--
        <button class="new"
            onclick="relayEvent(event,'property-view:new-mode')"
        >New…</button>  
        -->
        <button class="edit"
            onclick="relayEvent(event,'property-view:edit-mode')"
        >Edit</button>
        <button class="close"
            onclick="relayEvent(event,'property-view:view-mode')"
        >Close</button>
        <!--
        <button class="delete"
            onclick="relayEvent(event,'property-view:delete')"
            >Delete</button
        >
        -->
        </nav>
    </section>
    <style>${PropertyViewElement.styles}</style>
    </template>
`);

  get form() {
    return this.shadowRoot.querySelector("restful-form");
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).appendChild(
        PropertyViewElement.template.cloneNode(true)
    );

    this.addEventListener(
      "property-view:edit-mode",
      (event) => (this.mode = "edit")
    );

    this.addEventListener(
      "property-view:view-mode",
      (event) => (this.mode = "view")
    );

    this.addEventListener(
      "property-view:new-mode",
      (event) => (this.mode = "new")
    );

    this.addEventListener("property-view:delete", (event) => {
      event.stopPropagation();
      deleteResource(this.src).then(() => (this.mode = "new"));
    });

    this.addEventListener("restful-form:created", (event) => {
      console.log("Created a property", event.detail);
      const userid = event.detail.created.userid;
      this.mode = "view";
      this.setAttribute(
        "src",
        `${this.srcCollection}/${userid}`
      );
    });

    this.addEventListener("restful-form:updated", (event) => {
      console.log("Updated a property", event.detail);
      this.mode = "view";
      loadJSON(this.src, this, renderSlots);
    });
  }

  connectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      `Atribute ${name} changed from ${oldValue} to`,
      newValue
    );
    switch (name) {
      case "src":
        if (newValue && this.mode !== "new") {
          console.log("Loading JSON");
          loadJSON(this.src, this, renderSlots);
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

customElements.define("property-view", PropertyViewElement);

function renderSlots(json) {
    console.log("RenderingSlots:", json);
    const entries = Object.entries(json);
    const slot = ([key, value]) => {
      let type = typeof value;
  
      if (type === "object") {
        if (Array.isArray(value)) { type = "array"; }
        else if (!value) { type = "null" }
      }

      switch (type) {
          case "array":
            return `<ul slot="${key}">
                ${value.map((s) => `<li>${s}</li>`).join("")}
                </ul>`;
          case "object":
            return renderSlots(value)
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