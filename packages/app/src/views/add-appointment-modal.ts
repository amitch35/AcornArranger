import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { Appointment, Plan } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";
import 'boxicons';

interface AppointmentOption {
    id: number;
    label: string;
}

type CheckboxField = "app_additions";

export class AddAppointmentModal extends View<Model, Msg> {

    @state()
    get appointments(): Array<Appointment> | undefined {
        return this.model.appointments;
    }

    @property({ attribute: false })
    plan?: Plan;

    @state()
    get appointment_options(): Array<AppointmentOption> {
        if (this.appointments && this.plan && this.plan.appointments) {
            return this.appointments
                .filter(app => 
                    !this.plan!.appointments.map(pa => pa.appointment_info.appointment_id)
                        .includes(app.appointment_id)
                )
                .map(app => ({
                    id: app.appointment_id,
                    label: app.property_info.property_name
                }));
        } else if (this.appointments) {
            return this.appointments.map(app => ({
                id: app.appointment_id,
                label: app.property_info.property_name
            }));
        } else return [];
    }

    @state()
    appointment_additions: number[] = [];

    constructor() {
        super("acorn:model");
    }

    addPlanAppointments() {
        if (this.plan && this.appointment_additions.length) {
            this.appointment_additions.map( (app_id) => {
                this.dispatchMessage([
                    "plans/appointment/add", 
                    { 
                        plan_id: this.plan!.plan_id,
                        appointment_id: app_id
                    }
                ]);
            })
            this.requestPlanUpdate();
        }
        this.closeDialog();
        this.appointment_additions = [];
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
            case "app_additions":
                if (checkbox.checked) {
                    // Add the value to the appointment_additions array if checked
                    this.appointment_additions = [...this.appointment_additions, value];
                  } else {
                    // Remove the value from the appointment_additions array if unchecked
                    this.appointment_additions = this.appointment_additions.filter(id => id !== value);
                  }
                break;
            default:
                const unhandled: never = box_field;
                throw new Error(`Unhandled Auth message "${unhandled}"`);
        }
    }

    selectAll() {
        this.appointment_additions = this.appointment_options!.map(a => a.id);
    }

    clearSelection() {
        this.appointment_additions = [];
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
    const renderCheckboxOption = (option: AppointmentOption, opt_name: CheckboxField) => {
        var reflect_array: Array<number>;
        switch (opt_name) {
            case "app_additions":
                reflect_array = this.appointment_additions;
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
                <span>Add Appointment</span>
            </button>
        </div>
        <dialog class="modal">
            <div class="modal-content">
                <div class="spread-apart modal-header">
                    <h5>Select Appointment to Add</h5>
                    <button @click=${this.closeDialog} class="close">
                        <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                    </button>
                </div>
                <div class="spread-apart clear-select">
                    <button @click=${this.clearSelection}>Clear Selection</button>
                    <button @click=${this.selectAll}>Select All</button>
                </div>
                <div class="filters checkboxes">
                    ${this.appointment_options.map((opt) => { return renderCheckboxOption(opt, "app_additions")})}
                </div>
                <div>
                    <button @click=${this.addPlanAppointments}>
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