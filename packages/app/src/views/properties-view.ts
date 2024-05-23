import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { Property } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";

function formatCleaningTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (!hours && !minutes) return ``;
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

    constructor() {
        super("acorn:model");
    }

    connectedCallback() {
        super.connectedCallback();
        this.dispatchMessage([
            "properties/",
            { }
          ]);
    }

    render(): TemplateResult {
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
                    <span>
                    ${property.properties_id}
                    </span>
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
            }

            ul li {
                width: max-content;
                background-color: var(--background-color);
                border-radius: var(--border-size-radius);
                margin-right: var(--spacing-size-xsmall);
                padding: 0 var(--spacing-size-small);
            }
        `
    ];
}