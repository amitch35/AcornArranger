import { prepareTemplate } from "./template.js";

export class DropdownElement extends HTMLElement {
  static template = prepareTemplate(`<template>
    <slot name="actuator"><button> Menu </button></slot>
    <div id="panel">
      <slot></slot>
    </div>
    
    <style>
      :host {
        position: relative;
      }
      #panel {
        display: none;
        position: absolute;
        right: 0;
        margin-top: var(--spacing-size-small);
        width: max-content;
        padding: var(--spacing-size-small);
        border-radius: var(--border-size-radius);
        background: var(--background-color-accent);
        color: var(--text-color-body);
        box-shadow: var(--shadow-popover);
      }
      :host([open]) #panel {
        display: block;
      }
    </style>
  </template>`);

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).appendChild(
      DropdownElement.template.cloneNode(true)
    );
    this.shadowRoot
      .querySelector("slot[name='actuator']")
      .addEventListener("click", () => this.toggle());
  }

  toggle() {
    if (this.hasAttribute("open")) this.removeAttribute("open");
    else this.setAttribute("open", "open");
  }
}

customElements.define("drop-down", DropdownElement);