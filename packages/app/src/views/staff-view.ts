import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { Staff } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";

interface StatusOption {
    id: number;
    label: string;
}

const STATUS_OPTIONS: Array<StatusOption> = [
    { id: 1, label: 'Active' },
    { id: 2, label: 'Inactive' },
    { id: 3, label: 'Unverified' }
  ];

type CheckboxField = "staff_status";

export class StaffViewElement extends View<Model, Msg> {

    @state()
    get staff(): Array<Staff> | undefined {
        return this.model.staff;
    }

    @state()
    get showing_total(): number {
        if (this.staff) {
            return this.staff.length;
        } else {
            return 0;
        }
    }

    @state()
    filter_status_ids: number[] = [1, 3];

    constructor() {
        super("acorn:model");
    }

    connectedCallback() {
        super.connectedCallback();
        this.updateStaff();
    }

    updateStaff() {
        this.dispatchMessage([
            "staff/",
            { filter_status_ids: this.filter_status_ids}
          ]);
    }

    handleTableOptionChange(event: Event) {
        this.handleInputChange(event);
        this.updateStaff();
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
            case "staff_status":
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
            case "staff_status":
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

    const renderStaff = (staff: Staff) => {
        return html`
            <tr>
                <td class="center">
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
                <td class="center">
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
                <menu class="table-menu">
                    <div>
                        <span>Status:</span>
                        <div class="filters">
                            ${STATUS_OPTIONS.map((opt) => { return renderStatusOption(opt, "staff_status")})}
                        </div>
                    </div>
                </menu>
                <section class="showing">
                    <p>Showing: </p><p class="in-bubble">${this.showing_total}</p>
                </section>
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