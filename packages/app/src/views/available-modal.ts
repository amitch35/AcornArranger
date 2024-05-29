import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { Staff } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";
import 'boxicons'

interface StaffOption {
    id: number;
    label: string;
}

type CheckboxField = "available_staff";

export class AvailableStaffModal extends View<Model, Msg> {

    init_load = true;

    @state()
    get staff(): Array<Staff> | undefined {
        if (this.init_load && this.model.staff) {
            this.init_load = false;
            this.selectAll();
            this.updateAvailable();
        }
        return this.model.staff;
    }

    @state()
    available_staff: number[] = [];

    @state()
    get staff_options(): Array<StaffOption> {
        return this.staff ? this.staff.map(staff_member => ({
        id: staff_member.user_id,
        label: staff_member.name
        })) : [];
    }

    constructor() {
        super("acorn:model");
    }

    connectedCallback() {
        super.connectedCallback();
        this.dispatchMessage([
            "staff/", 
            { 
                filter_status_ids: [1],
                filter_can_clean: true
            }
          ]);
    }

    updateAvailable() {
        this.dispatchMessage([
            "available/save", 
            { 
                available: this.available_staff
            }
          ]);
    }

    handleCheckboxChange(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        const { name } = checkbox;
        const box_field = name as CheckboxField;
        const value = parseInt(checkbox.value);
        switch(box_field) {
            case "available_staff":
                if (checkbox.checked) {
                    // Add the value to the available_staff array if checked
                    this.available_staff = [...this.available_staff, value];
                  } else {
                    // Remove the value from the available_staff array if unchecked
                    this.available_staff = this.available_staff.filter(id => id !== value);
                  }
                this.updateAvailable();
                break;
            default:
                const unhandled: never = box_field;
                throw new Error(`Unhandled Auth message "${unhandled}"`);
        }
    }

    selectAll() {
        this.available_staff = this.staff!.map(s => s.user_id);
        this.updateAvailable();
    }

    clearSelection() {
        this.available_staff = [];
        this.updateAvailable();
    }

    closeDialog() {
        const dialog = this.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
        dialog.close();
    }

    showModal() {
        const dialog = this.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
        dialog.showModal();
    }    

    render(): TemplateResult {
    const renderCheckboxOption = (option: StaffOption, opt_name: CheckboxField) => {
        var reflect_array: Array<number>;
        switch (opt_name) {
            case "available_staff":
                reflect_array = this.available_staff;
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
                @change=${this.handleCheckboxChange}
                ?checked=${reflect_array.includes(option.id)}
            />
            ${option.label}
            </label>
        `
    }

    const renderStaff = (staff: Staff) => {
        return this.available_staff.includes(staff.user_id) ? html`
            <li>
                <span>${staff.name}</span>
            </li>
        ` : html``;
    };

    const staff_list = this.staff || [];

    return html`
        <div class="multi-select">
        <button @click=${this.showModal}>
            <box-icon name='select-multiple' color='var(--text-color-body)'></box-icon>
            <span>Select Available Staff</span>
        </button>
        <ul class="staff">
            ${staff_list.map((s) => { return renderStaff(s) })}
        </ul>
        </div>
        <dialog>
            <div class="modal-content">
            <div>
                <h4>Select Available Staff</h4>
                <button @click=${this.closeDialog}>Close</button>
            </div>
            <div>
                <button @click=${this.clearSelection}>Clear Selection</button>
                <button @click=${this.selectAll}>Select All</button>
            </div>
            <div>
                ${this.staff_options.map((opt) => { return renderCheckboxOption(opt, "available_staff")})}
            </div>
            </div>
        </dialog>
    `;
    }

    static styles = [
        reset,
        page,
        css`
        `
    ];
}