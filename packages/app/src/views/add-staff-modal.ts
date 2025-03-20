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

type CheckboxField = "staff_additions";

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
    staff_additions: number[] = [];

    constructor() {
        super("acorn:model");
    }

    addPlanStaff() {
        if (this.plan && this.staff_additions.length) {
            this.staff_additions.map( (staff_id) => {
                this.dispatchMessage([
                    "plans/staff/add", 
                    { 
                        plan_id: this.plan!.plan_id,
                        user_id: staff_id
                    }
                ]);
            })
            this.requestPlanUpdate();
        }
        this.closeDialog();
        this.staff_additions = [];
    }

    requestPlanUpdate() {
        const requestUpdateEvent = new CustomEvent(
          "plan-view:update",
          {
            bubbles: true,
            composed: true,
            detail: { }
          }
        );
    
        this.dispatchEvent(requestUpdateEvent);
    }

    handleCheckboxChange(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        const { name } = checkbox;
        const box_field = name as CheckboxField;
        const value = parseInt(checkbox.value);
        switch(box_field) {
            case "staff_additions":
                if (checkbox.checked) {
                    // Add the value to the staff_additions array if checked
                    this.staff_additions = [...this.staff_additions, value];
                  } else {
                    // Remove the value from the staff_additions array if unchecked
                    this.staff_additions = this.staff_additions.filter(id => id !== value);
                  }
                break;
            default:
                const unhandled: never = box_field;
                throw new Error(`Unhandled Auth message "${unhandled}"`);
        }
    }

    selectAll() {
        this.staff_additions = this.staff_options!.map(a => a.id);
    }

    clearSelection() {
        this.staff_additions = [];
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
            case "staff_additions":
                reflect_array = this.staff_additions;
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

    return html`
        <div class="add-one">
            <button @click=${this.showModal} ?disabled=${this.plan?.appointments[0] && this.plan?.appointments[0].sent_to_rc !== null}>
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
                <div class="spread-apart clear-select">
                    <button @click=${this.clearSelection}>Clear Selection</button>
                    <button @click=${this.selectAll}>Select All</button>
                </div>
                <div class="filters checkboxes">
                    ${this.staff_options.map((opt) => { return renderCheckboxOption(opt, "staff_additions")})}
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

            .checkboxes {
                max-height: calc(var(--text-font-size-large) * 20);
                min-width: calc(var(--text-font-size-large) * 12);
            }
        `
    ];
}