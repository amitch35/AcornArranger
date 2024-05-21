import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { Role } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";

export class RolesViewElement extends View<Model, Msg> {

    @property()
    get roles(): Array<Role> | undefined {
        return this.model.roles;
    }

    constructor() {
        super("acorn:model");
    }

    connectedCallback() {
        super.connectedCallback();
        this.dispatchMessage([
            "roles/",
            { }
          ]);
    }

    render(): TemplateResult {
    const renderRole = (role: Role) => {
        return html`
            <tr>
                <td>
                    <span>
                    ${role.title}
                    </span>
                </td>
                <td>
                    <span>
                    ${role.priority}
                    </span>
                </td>
                <td>
                    <span>
                    ${role.can_lead_team}
                    </span>
                </td>
                <td>
                    <span>
                    ${role.can_clean}
                    </span>
                </td>
            </tr>
        `;
        };

    const roles_list = this.roles || [];

    return html`
        <div class="page">
            <header>
                <h1>
                    Staff Roles
                </h1>
            </header>
            <main>
                <table>
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Priority</th>
                            <th>Can Lead</th>
                            <th>Can Clean</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${roles_list.map((r) => {
                        return renderRole(r);
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