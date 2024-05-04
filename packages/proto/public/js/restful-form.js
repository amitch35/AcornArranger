import { prepareTemplate } from "./template.js";

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

      submitForm(src, this._state, method)
        .then((json) => populateForm(json, this))
        .then((json) => {
          const customType = `restful-form:${action}`;
          const event = new CustomEvent(customType, {
            bubbles: true,
            composed: true,
            detail: {
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

  connectedCallback() {
    console.log(`ConnectedCallback: src=`, this.src);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      `restful-form: Attribute ${name} changed from ${oldValue} to`,
      newValue
    );
    switch (name) {
      case "src":
        if (newValue && newValue !== oldValue && !this.isNew) {
          fetchData(this.src).then((json) => {
            this._state = json;
            populateForm(json, this);
          });
        }
        break;
      case "new":
        if (newValue) {
          console.log("Blanking state for new form");
          this._state = {};
          populateForm({}, this);
        }
        break;
    }
  }
}

customElements.define("restful-form", RestfulFormElement);

export function fetchData(src) {
  return fetch(src)
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

function submitForm(src, json, method = "PUT") {
  return fetch(src, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json)
  })
    .then((res) => {
      if (res.status != 200 && res.status != 201)
        throw `Form submission failed: Status ${res.status}`;
      return res.json();
    })
    .catch((err) => console.log("Error submitting form:", err));
}