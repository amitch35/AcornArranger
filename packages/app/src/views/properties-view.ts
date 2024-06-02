import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { Property } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";
import 'boxicons';

interface StatusOption {
    id: number;
    label: string;
}

const STATUS_OPTIONS: Array<StatusOption> = [
    { id: 1, label: 'Active' },
    { id: 2, label: 'Inactive' }
  ];

type CheckboxField = "property_status";

function formatCleaningTime(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (!hours && !minutes) return html`<box-icon name='error' color="var(--accent-color-red)"></box-icon>`;
    else if (!hours) return `${mins} Minutes`;
    else if (mins && hours === 1) return `${hours} Hour ${mins} Minutes`;
    else if (mins) return `${hours} Hours ${mins} Minutes`;
    else if (hours === 1) return `${hours} Hour`;
    else return `${hours} Hours`;
  }

export class PropertiesViewElement extends View<Model, Msg> {

    @state()
    get properties(): Array<Property> | undefined {
        return this.model.properties;
    }

    @state()
    get showing_total(): number {
        if (this.properties) {
            return this.properties.length;
        } else {
            return 0;
        }
    }

    @state()
    filter_status_ids: number[] = [1];

    constructor() {
        super("acorn:model");
    }

    connectedCallback() {
        super.connectedCallback();
        this.updateProperties();
    }

    updateProperties() {
        this.dispatchMessage([
            "properties/",
            { filter_status_ids: this.filter_status_ids}
          ]);
    }

    handleTableOptionChange(event: Event) {
        this.handleInputChange(event);
        this.updateProperties();
    }

    handleInputChange(event: Event) {
        const input = event.target as HTMLInputElement | HTMLSelectElement;
        const { name, value, type } = input;
        if (type === "checkbox") {
            this.handleCheckboxChange(event);
        }
        else (this as any)[name] = value;
    }

    handleCheckboxChange(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        const { name } = checkbox;
        const box_field = name as CheckboxField;
        const value = parseInt(checkbox.value);
        switch(box_field) {
            case "property_status":
                if (checkbox.checked) {
                    // Add the value to the filter_status_ids array if checked
                    this.filter_status_ids = [...this.filter_status_ids, value];
                  } else {
                    // Remove the value from the filter_status_ids array if unchecked
                    this.filter_status_ids = this.filter_status_ids.filter(id => id !== value);
                  }
                break;
            default:
                const unhandled: never = box_field;
                throw new Error(`Unhandled Auth message "${unhandled}"`);
        }
    }

    render(): TemplateResult {
    const renderStatusOption = (option: StatusOption, opt_name: CheckboxField) => {
        var reflect_array: Array<number>;
        switch (opt_name) {
            case "property_status":
                reflect_array = this.filter_status_ids;
                break;
            default:
                const unhandled: never = opt_name;
                throw new Error(`Unhandled Auth message "${unhandled}"`);
        }
        return html`
            <label>
            <input
                name=${opt_name}
                type="checkbox"
                .value=${option.id.toString()}
                @change=${this.handleTableOptionChange}
                ?checked=${reflect_array.includes(option.id)}
            />
            ${option.label}
            </label>
        `
    }

    const renderDoubleUnit = (unit_ref: number) => {
        return html`
            <li>
                <span>${unit_ref}</span>
            </li>
        `;
        };

    const renderProperty = (property: Property) => {
        return html`
            <tr>
                <td class="center">
                    <a href="/app/property/${property.properties_id}">
                        <span>
                        ${property.properties_id}
                        </span>
                    </a>
                </td>
                <td>
                    <span>
                    ${property.property_name}
                    </span>
                </td>
                <td>
                    <span>
                    ${formatCleaningTime(property.estimated_cleaning_mins!)}
                    </span>
                </td>
                <td>
                    <ul>
                    ${property.double_unit?.map((d) => {return renderDoubleUnit(d)})}
                    </ul>
                </td>
                <td class="center">
                    <span>
                    ${property.status?.status}
                    </span>
                </td>
                <td>
                    <a href="/app/property/${property.properties_id}/edit">
                        <box-icon name='edit-alt' type='solid' color="var(--text-color-body)" ></box-icon>
                    </a>
                </td>
            </tr>
        `;
        };

    const properties_list = this.properties || [];

    return html`
        <div class="page">
            <header>
                <h1>
                    Properties
                </h1>
            </header>
            <main>
                <menu class="table-menu">
                    <div>
                        <span>Status:</span>
                        <div class="filters">
                            ${STATUS_OPTIONS.map((opt) => { return renderStatusOption(opt, "property_status")})}
                        </div>
                    </div>
                </menu>
                <section class="showing">
                    <p>Showing: </p><p class="in-bubble">${this.showing_total}</p>
                </section>
                <table>
                    <thead>
                        <tr>
                            <th>Propery ID</th>
                            <th>Name</th>
                            <th>Estimated Cleaning Time</th>
                            <th>Double Unit References</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    ${properties_list.map((p) => {
                        return renderProperty(p);
                    })}
                    </tbody>
                </table>
            </main>
        </div>
    `;
    }

    static styles = [
        reset,
        page,
        css`
            ul {
                list-style-type: none;
                display: flex;
                flex-wrap: wrap;
                gap: var(--spacing-size-xsmall);
                max-width: calc(var(--spacing-size-medium) * 16);
            }

            ul li {
                width: max-content;
                background-color: var(--background-color);
                border-radius: var(--border-size-radius);
                padding: 0 var(--spacing-size-small);
            }
        `
    ];
}