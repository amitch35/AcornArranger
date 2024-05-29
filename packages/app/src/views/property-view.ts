import {
    define,
    Form,
    History,
    InputArray,
    View
  } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { Property } from "server/models";
import reset from "../css/reset";
import page from "../css/page";
import { Msg } from "../messages";
import { Model } from "../model";
import 'boxicons';
  
const propertyStyles = css`
div.detail-header {
    padding-left: var(--spacing-size-small);
}

section.property-details {
    display: flex;
    align-items: flex-start;
    justify-content: space-evenly;
    background-color: var(--background-color-accent);
    border-radius: var(--border-size-radius);
    padding: var(--spacing-size-medium) var(--spacing-size-large) var(--spacing-size-small) var(--spacing-size-large);
    width: 100%;
    gap: var(--spacing-size-xlarge);
}

div.options-header {
    padding-left: var(--spacing-size-small);
}

section.property-options {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    background-color: var(--background-color-accent);
    border-radius: var(--border-size-radius);
    padding: var(--spacing-size-medium) var(--spacing-size-large) var(--spacing-size-small) var(--spacing-size-large);
    width: 100%;
    gap: var(--spacing-size-medium);
}

a {
    display: flex;
    align-items: center;
    gap: var(--spacing-size-xsmall);
    text-decoration: none;
    color: var(--text-color-body);
    border-radius: var(--border-size-radius);
    height: calc(var(--icon-size) + 1rem);
    padding: var(--spacing-size-xsmall) var(--spacing-size-small);
    background-color: var(--background-color-accent);
}

a:hover {
    background-color: var(--background-color-dark);
}
`

class PropertyViewer extends LitElement {
@property()
property?: number;

render() {
    return html`
    <div class="page">
        <header>
            <h1>
                <slot name="property_name_header"><span>Property View</span></slot>
            </h1>
        </header>
        <main>
            <div class="detail-header align-left"><h4>Details</h4></div>
            <section class="property-details">
                <dl>
                    <dt>Property ID:</dt>
                    <dd><slot name="properties_id"></slot></dd>
                    <dt>Property Name:</dt>
                    <dd><slot name="property_name"></slot></dd>
                    <dt>Status ID:</dt>
                    <dd><slot name="status_id"></slot></dd>
                    <dt>Status:</dt>
                    <dd><slot name="status"></slot></dd>
                </dl>
                <dl>
                    <dt>Address:</dt>
                    <dd><slot name="address"></slot></dd>
                    <dt>City:</dt>
                    <dd><slot name="city"></slot></dd>
                    <dt>State:</dt>
                    <dd><slot name="state_name"></slot></dd>
                </dl>
                <dl>
                    <dt>Postal Code:</dt>
                    <dd><slot name="postal_code"></slot></dd>
                    <dt>Country:</dt>
                    <dd><slot name="country"></slot></dd>
                </dl>
            </section>
            <div class="options-header spread-apart">
                <h4>Options</h4>
                <nav>
                    <a href="/app/property/${this.property}/edit" class="edit">
                        <box-icon name='edit-alt' type='solid' color="var(--text-color-body)" ></box-icon>
                        <span>Edit</span>
                    </a>
                </nav>
            </div>
            <section class="property-options">
                <dl>
                    <dt>Estimated Cleaning Time (minutes):</dt>
                    <dd><slot name="estimated_cleaning_mins"></slot></dd>
                    <dt>Double Unit Links</dt>
                    <dd><slot name="double_unit"></slot></dd>
                </dl>
            </section>
        </main>
    </div>
    `;
}

static styles = [
    reset,
    page,
    propertyStyles,
    css`
    ::slotted(ul) {
        list-style-type: none;
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-size-small);
        max-width: calc(var(--spacing-size-medium) * 16);
    }
    `
];
}

class PropertyEditor extends LitElement {
static uses = define({
    "mu-form": Form.Element,
    "input-array": InputArray.Element
});
@property()
property?: number;

@property({ attribute: false })
init?: Property;

render() {
    return html`
    <div class="page">
        <header>
            <h1>
                <slot name="property_name_header"><span>Property View</span></slot>
            </h1>
        </header>
        <main>
        <div class="detail-header align-left"><h4>Details</h4></div>
            <section class="property-details">
                <dl>
                    <dt>Property ID:</dt>
                    <dd><slot name="properties_id"></slot></dd>
                    <dt>Property Name:</dt>
                    <dd><slot name="property_name"></slot></dd>
                    <dt>Status ID:</dt>
                    <dd><slot name="status_id"></slot></dd>
                    <dt>Status:</dt>
                    <dd><slot name="status"></slot></dd>
                </dl>
                <dl>
                    <dt>Address:</dt>
                    <dd><slot name="address"></slot></dd>
                    <dt>City:</dt>
                    <dd><slot name="city"></slot></dd>
                    <dt>State:</dt>
                    <dd><slot name="state_name"></slot></dd>
                </dl>
                <dl>
                    <dt>Postal Code:</dt>
                    <dd><slot name="postal_code"></slot></dd>
                    <dt>Country:</dt>
                    <dd><slot name="country"></slot></dd>
                </dl>
            </section>
            <div class="options-header spread-apart">
                <h4>Options</h4>
                <nav>
                    <a href="/app/property/${this.property}" class="close">
                        <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                        <span>Close</span>
                    </a>
                </nav>
            </div>
            <section class="property-options">
                <mu-form .init=${this.init}>
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
                </mu-form>
            </section>
        </main>
    </div>
    `;
}

static styles = [
    reset,
    page,
    propertyStyles,
    css`
        mu-form {
        grid-column: key / end;
        }
        mu-form input {
        grid-column: input;
        }

        a.close {
            gap: 0;
        }
    `
];
}

export class PropertyViewElement extends View<Model, Msg> {
static uses = define({
    "property-viewer": PropertyViewer,
    "property-editor": PropertyEditor
});

@property({ type: Boolean, reflect: true })
edit = false;

@property({ attribute: "properties-id", reflect: true, type: Number })
properties_id: number = 0;

@state()
get property(): Property | undefined {
    return this.model.property;
}

constructor() {
    super("acorn:model");
}

attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
    name === "properties-id" &&
    oldValue !== newValue &&
    newValue
    ) {
    console.log("Property Page:", newValue);
    this.dispatchMessage([
        "properties/select",
        { properties_id: parseInt(newValue) }
        ]);
    }
}

render() {
    const {
    properties_id,
    property_name,
    address,
    status,
    estimated_cleaning_mins,
    double_unit = []
    } = this.property || { properties_id: 0 };

    const double_unit_html = double_unit.map(
    (id) =>
        html`
        <li>${id}</li>
        `
    );

    const fields = html`
    <span slot="properties_id">${properties_id}</span>
    <span slot="property_name_header">${property_name}</span>
    <span slot="property_name">${property_name}</span>
    <span slot="address">${address?.address}</span>
    <span slot="city">${address?.city}</span>
    <span slot="state_name">${address?.state_name}</span>
    <span slot="postal_code">${address?.postal_code}</span>
    <span slot="country">${address?.country}</span>
    <span slot="status_id">${status?.status_id}</span>
    <span slot="status">${status?.status}</span>
    `;

    return this.edit
    ? html`
        <property-editor
            property=${properties_id}
            .init=${this.property}
            @mu-form:submit=${(
                event: Form.SubmitEvent<Property>
            ) => this._handleSubmit(event)}>
            ${fields}
        </property-editor>
        `
    : html`
        <property-viewer property=${properties_id}>
            ${fields}
            <span slot="estimated_cleaning_mins">${estimated_cleaning_mins}</span>
            <ul slot="double_unit">
            ${double_unit_html}
            </ul>
        </property-viewer>
        `;
}

_handleSubmit(event: Form.SubmitEvent<Property>) {
    console.log("Handling submit of mu-form");
    this.dispatchMessage([
    "properties/save",
    {
        properties_id: this.properties_id,
        property: event.detail,
        onSuccess: () =>
        History.dispatch(this, "history/navigate", {
            href: `/app/property/${this.properties_id}`
        }),
        onFailure: (error: Error) =>
        console.log("ERROR:", error)
    }
    ]);
}

static styles = [
    reset, 
    page,
    css`
        li {
            width: max-content;
            background-color: var(--background-color);
            border-radius: var(--border-size-radius);
            padding: 0 var(--spacing-size-small);
        }
    `
];
}