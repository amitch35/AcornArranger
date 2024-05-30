import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { Plan, Staff } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";
import 'boxicons'

interface StaffOption {
    id: number;
    label: string;
}

export class AddStaffModal extends View<Model, Msg> {

    @state()
    get staff(): Array<Staff> | undefined {
        return this.model.staff;
    }

    @property({ attribute: false })
    plan?: Plan;

    @state()
    get staff_options(): Array<StaffOption> {
        if (this.staff && this.plan && this.plan.staff) {
            return this.staff
                .filter(staff_member => 
                    !this.plan!.staff.map(ps => ps.staff_info.user_id)
                        .includes(staff_member.user_id)
                )
                .map(staff_member => ({
                    id: staff_member.user_id,
                    label: staff_member.name
                }));
        } else if (this.staff) {
            return this.staff.map(staff_member => ({
                id: staff_member.user_id,
                label: staff_member.name
                }));
        } else return [];
    }

    @state()
    staff_to_add?: number;

    constructor() {
        super("acorn:model");
    }

    handleInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const { name, value } = input;
        (this as any)[name] = value;
    }

    addPlanStaff() {
        if (this.plan && this.staff_to_add) {
            this.dispatchMessage([
                "plans/staff/add", 
                { 
                    plan_id: this.plan.plan_id,
                    user_id: this.staff_to_add
                }
              ]);
        }
        this.closeDialog();
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
    const renderStaffOption = (option: StaffOption) => {
        return html`
            <option value=${option.id}>${option.label}</option>
        `
    }

    return html`
        <div class="add-one">
            <button @click=${this.showModal}>
                <box-icon name='plus' color='var(--text-color-body)'></box-icon>
                <span>Add Staff</span>
            </button>
        </div>
        <dialog class="modal">
            <div class="modal-content">
                <div class="spread-apart modal-header">
                    <h5>Select Staff to Add</h5>
                    <button @click=${this.closeDialog} class="close">
                        <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                    </button>
                </div>
                <div>
                    <label>
                        <span>Add: </span>
                        <select name="staff_to_add" .value=${this.staff_to_add ? this.staff_to_add.toString() : '0'} @change=${this.handleInputChange} >
                            <option value='0'></option>
                            ${this.staff_options.map((opt) => { return renderStaffOption(opt)})}
                        </select>
                    </label>
                </div>
                <div>
                    <button @click=${this.addPlanStaff}>
                        <span>Confirm</span>
                    </button>
                </div>
            </div>
        </dialog>
    `;
    }

    static styles = [
        reset,
        page,
        css`

            .add-one button {
                width: 100%;
                padding: var(--spacing-size-xsmall);
                font-size: var(--text-font-size-small);
                gap: var(--spacing-size-xsmall);
                background-color: var(--background-color-accent);
            }

            .add-one button:hover {
                background-color: var(--background-color);
            }
        `
    ];
}