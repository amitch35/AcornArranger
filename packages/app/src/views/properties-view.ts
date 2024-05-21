import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { Property } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";

export class PropertiesViewElement extends View<Model, Msg> {

    @property()
    get properties(): Array<Property> | undefined {
        return this.model.properties;
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
    const renderProperty = (property: Property) => {
        return html`
            <tr>
                <td>
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
                    ${property.estimated_cleaning_mins}
                    </span>
                </td>
                <td>
                    <span>
                    ${property.double_unit}
                    </span>
                </td>
                <td>
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
            div.page main {
                background-color: var(--background-color-accent);
                border-radius: var(--border-size-radius);
            }
        `
    ];
}