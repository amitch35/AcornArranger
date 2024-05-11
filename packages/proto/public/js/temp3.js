import { addFragment } from "./html-loader.js";
import { prepareTemplate } from "./template.js";

export class JsonObjectElement extends HTMLElement {
  static template = prepareTemplate(`<template>
      <dl>
        <slot></slot>
      </dl>
      <style>
        dl {
          display: grid;
          grid-template-columns: 1fr 3fr;
        }
        ::slotted(dt) {
          color: var(--accent-color);
          grid-column-start: 1;
        }
        ::slotted(dd) {
          grid-column-start: 2;
        }
      </style>
    </template>`);

  get dl() {
    return this.shadowRoot.querySelector("dl");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(
      JsonObjectElement.template.cloneNode(true)
    );
  }

  connectedCallback() {
    const src = this.getAttribute("src");
    const open = this.hasAttribute("open");

    if (open) loadJSON(src, this, renderJSON);

    this.addEventListener("json-object:open", () =>
      loadJSON(src, this, renderJSON)
    );
  }
}

customElements.define("json-object", JsonObjectElement);

export function loadJSON(src, container, render) {
  container.replaceChildren();
  fetch(src)
    .then((response) => {
      if (response.status !== 200) {
        throw `Status: ${response.status}`;
      }
      return response.json();
    })
    .then((json) => addFragment(render(json), container)) //render(json[0] for always list encapsulated
    .catch((error) =>
      addFragment(
        `<dt class="error">Error</dt>
         <dd>${error}</dd>
         <dt>While Loading</dt>
         <dd>${src}</dd>
        `,
        container
      )
    );
}

function renderJSON(json) {
  const entries = Object.entries(json);
  const dtdd = ([key, value]) => {
    if (typeof(value) === "object" && value) {
        if (Array.isArray(value)) {
            return (`
                <dt>${key}</dt>
                <dd>
                    <ul><dl>${value.map(renderJSON).join('</dl><dl>')}</dl></ul>
                </dd>
            `)
        } else {
            return (`
                <dt>${key}</dt>
                <dd><dl>${renderJSON(value)}</dl></dd>
            `)
        }
        
    }
    return (`
        <dt>${key}</dt>
        <dd>${value}</dd>
    `)
  };
  return entries.map(dtdd).join("\n");
}