import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { Role } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";

export class RolesViewElement extends View<Model, Msg> {

    @state()
    get roles(): Array<Role> | undefined {
        return this.model.roles;
    }

    @state()
    get showing_total(): number {
        if (this.roles) {
            return this.roles.length;
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
            "roles/",
            { }
          ]);
    }

    render(): TemplateResult {
    const renderRole = (role: Role) => {
        return html`
            <tr>
                <td class="center">
                    <span>
                    ${role.priority}
                    </span>
                </td>
                <td>
                    <span>
                    ${role.title}
                    </span>
                </td>
                <td class="center">
                    <span>
                    ${role.can_lead_team}
                    </span>
                </td>
                <td class="center">
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
                <section class="showing">
                    <p>Showing: </p><p class="in-bubble">${this.showing_total}</p>
                </section>
                <table>
                    <thead>
                        <tr>
                            <th>Priority</th>
                            <th>Role</th>
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
            
        `
    ];
}