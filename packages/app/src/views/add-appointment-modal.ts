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
    app_to_add?: number;

    constructor() {
        super("acorn:model");
    }

    handleInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const { name, value } = input;
        (this as any)[name] = value;
    }

    addPlanAppointment() {
        if (this.plan && this.app_to_add) {
            this.dispatchMessage([
                "plans/appointment/add", 
                { 
                    plan_id: this.plan.plan_id,
                    appointment_id: this.app_to_add
                }
              ]);
            this.requestPlanUpdate();
        }
        this.closeDialog();
        this.app_to_add = undefined;
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

    closeDialog() {
        const dialog = this.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
        dialog.close();
    }

    showModal() {
        const dialog = this.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
        dialog.showModal();
    }    

    render(): TemplateResult {
    const renderAppointmentOption = (option: AppointmentOption) => {
        return html`
            <option value=${option.id}>${option.label}</option>
        `
    }

    return html`
        <div class="add-one">
            <button @click=${this.showModal}>
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
                <div>
                    <label>
                        <span>Add: </span>
                        <select name="app_to_add" .value=${this.app_to_add ? this.app_to_add.toString() : '0'} @change=${this.handleInputChange} >
                            <option value='0'></option>
                            ${this.appointment_options.map((opt) => { return renderAppointmentOption(opt)})}
                        </select>
                    </label>
                </div>
                <div>
                    <button @click=${this.addPlanAppointment}>
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