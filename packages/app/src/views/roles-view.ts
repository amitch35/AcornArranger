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
        this.updateRoles();
    }

    updateRoles() {
        this.dispatchMessage([
            "roles/",
            { }
          ]);
    }

    handleInputChange(event: Event, role: Role, field: keyof Role) {
        const input = event.target as HTMLInputElement;
        if (field === 'priority') {
            if (input.value) {
                role[field] = parseInt(input.value);
            } else {
                return;
            }
        } else if (field === 'can_lead_team' || field === 'can_clean') {
          role[field] = input.checked;
        } else if (field === 'role_id') {
            return;
        } else {
          role[field] = input.value;
        }
        this.dispatchMessage([
            "roles/save",
            { role_id: role.role_id, role: role }
          ]);
      }

    render(): TemplateResult {
    const renderRole = (role: Role) => {
        return html`
            <tr>
                <td class="center">
                    <input
                    type="number"
                    .value=${role.priority.toString()}
                    @input=${(e: Event) => this.handleInputChange(e, role, 'priority')}
                    />
                </td>
                <td>
                    <span>
                        ${role.title}
                    </span>
                </td>
                <td class="center">
                    <input
                    type="checkbox"
                    .checked=${role.can_lead_team}
                    @change=${(e: Event) => this.handleInputChange(e, role, 'can_lead_team')}
                    />
                </td>
                <td class="center">
                    <input
                    type="checkbox"
                    .checked=${role.can_clean}
                    @change=${(e: Event) => this.handleInputChange(e, role, 'can_clean')}
                    />
                </td>
            </tr>
        `
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
                    <div>
                        <p>Showing: </p>
                        <div class="bubble-container">
                            <box-icon name='circle' type='solid' color="var(--accent-color)" size="var(--text-font-size-large)"></box-icon>
                            <p class="in-bubble">${this.showing_total}</p>
                        </div>
                    </div>
                </section>
                <table>
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <button @click=${this.updateRoles} alt="Sync Prorities">
                                        <box-icon name='sync' color="var(--text-color-body)" ></box-icon>
                                    </button>
                                    <span>
                                        Priority
                                    </span>
                                    <div class="not-shown">
                                        <box-icon name='sync' color="var(--text-color-body)" ></box-icon>
                                    </div>
                                </label>
                            </th>
                            <th>Role</th>
                            <th>Can Lead</th>
                            <th>Can Clean</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${roles_list.map((r) => renderRole(r))}
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
            th label {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--spacing-size-medium);
            }

            th button {
                display: inline;
                margin: 0;
            }

            .not-shown {
                visibility: hidden;
            }
        `
    ];
}
