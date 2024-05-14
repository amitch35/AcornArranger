import { prepareTemplate } from "./template.js";
import { Observer } from "@calpoly/mustang";

export class RestfulFormElement extends HTMLElement {
  static observedAttributes = ["src", "new"];

  get src() {
    return this.getAttribute("src");
  }

  get isNew() {
    return this.hasAttribute("new");
  }

  static styles = `
    form {
      display: grid;
      gap: var(--spacing-size-medium);
      grid-template-columns: [start] 1fr [label] 1fr [input] 1fr [input-center] 3fr [input-end] 1fr [end];
    }
    
    ::slotted(label) {
      display: contents;
      grid-template-columns: subgrid;
      color: var(--accent-color);
      font-family: var(--text-font-family-display);
    }
    
    ::slotted(label > span) {
      grid-column-start: label;
      color: orange;
    }
    
    ::slotted(input) {
      grid-column: input / input-end;
      height: calc(var(--text-font-size-body) + 1rem);
    }
    
    button[type="submit"] {
      grid-column-start: input;
    }
    `

  static template = prepareTemplate(`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit"><button type="submit">Submit</button></slot>
      </form>
      <slot name="delete"></slot>
      <style>
      ${this.styles}
      </style>
    </template>
  `);

  get form() {
    return this.shadowRoot.querySelector("form");
  }

  constructor() {
    super();
    this._state = {};
    this.attachShadow({ mode: "open" }).appendChild(
      RestfulFormElement.template.cloneNode(true)
    );

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      console.log("Submitting form", this._state);
      const method = this.isNew ? "POST" : "PUT";
      const action = this.isNew ? "created" : "updated";
      const src = this.isNew
        ? this.src.replace(/[/][$]new$/, "")
        : this.src;

      submitForm(src, this._state, method, this.authorization)
        .then((json) => populateForm(json, this))
        .then((json) => {
          const customType = `restful-form:${action}`;
          const event = new CustomEvent(customType, {
            bubbles: true,
            composed: true,
            detail: {
              method,
              [action]: json,
              url: src
            }
          });
          this.dispatchEvent(event);
        });
    });

    this.addEventListener("change", (event) => {
      const target = event.target;
      const name = target.name;
      const value = target.value;

      if (name) this._state[name] = value;
    });
  }

  _authObserver = new Observer(this, "acorn:auth");

  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${this._user.token}`
      }
    );
  }

  connectedCallback() {
    this._authObserver.observe().then((obs) => {
      obs.setEffect(({ user }) => {
        this._user = user;
        if (this.src) {
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
    switch (name) {
      case "src":
        if (newValue && newValue !== oldValue && !this.isNew) {
          fetchData(this.src, this.authorization).then(
            (json) => {
              this._state = json;
              populateForm(json, this);
            }
          );
        }
        break;
      case "new":
        if (newValue) {
          this._state = {};
          populateForm({}, this);
        }
        break;
    }
  }
}

customElements.define("restful-form", RestfulFormElement);

export function fetchData(src, authorization) {
  return fetch(src, { headers: authorization })
    .then((response) => {
      if (response.status !== 200) {
        throw `Status: ${response.status}`;
      }
      return response.json();
    })
    .catch((error) =>
      console.log(`Failed to load form from ${src}:`, error)
    );
}

function populateForm(json, formBody) {
  const entries = Object.entries(json);

  for (const [key, val] of entries) {
    if (typeof(val) === "object" && val && !(Array.isArray(val))) {
        populateForm(val, formBody)
      } else {
        const input = formBody.querySelector(`[name="${key}"]`);

        // console.log(`Populating ${key}`, input);
        if (input) {
            switch (input.type) {
                case "checkbox":
                input.checked = Boolean(value);
                break;
            default:
                input.value = val;
                break;
            }
        }
    }
  }

  return json;
}

function submitForm(
  src,
  json,
  method = "PUT",
  authorization = {}
) {
  return fetch(src, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authorization
    },
    body: JSON.stringify(json)
  })
    .then((res) => {
      if (res.status != 200 && res.status != 201)
        throw `Form submission failed: Status ${res.status}`;
      return res.json();
    })
    .catch((err) => console.log("Error submitting form:", err));
}