import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { Staff } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";

export class StaffViewElement extends View<Model, Msg> {

    @property()
    get staff(): Array<Staff> | undefined {
        return this.model.staff;
    }

    constructor() {
        super("acorn:model");
    }

    connectedCallback() {
        super.connectedCallback();
        this.dispatchMessage([
            "staff/",
            { }
          ]);
    }

    render(): TemplateResult {
    const renderStaff = (staff: Staff) => {
        return html`
            <tr>
                <td>
                    <span>
                    ${staff.user_id}
                    </span>
                </td>
                <td>
                    <span>
                    ${staff.name}
                    </span>
                </td>
                <td>
                    <span>
                    ${staff.role?.title}
                    </span>
                </td>
                <td>
                    <span>
                    ${staff.status?.status}
                    </span>
                </td>
            </tr>
        `;
        };

    const staff_list = this.staff || [];

    return html`
        <div class="page">
            <header>
                <h1>
                    Staff
                </h1>
            </header>
            <main>
                <table>
                    <thead>
                        <tr>
                            <th>Staff ID</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${staff_list.map((s) => {
                        return renderStaff(s);
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