import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { Appointment } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";
import 'boxicons';

interface OmissionOption {
    id: number;
    label: string;
}

type CheckboxField = "app_omissions";

export class OmissionsModal extends View<Model, Msg> {

    @property({ attribute: true, reflect: true })
    services?: Array<number>;

    @property()
    date?: string;

    @state()
    get appointments(): Array<Appointment> | undefined {
        return this.model.appointments;
    }

    @state()
    appointment_omissions: number[] = [];

    @state()
    get appointment_options(): Array<OmissionOption> {
        return this.appointments && this.date ? this.appointments.map(app => ({
        id: app.appointment_id,
        label: app.property_info.property_name
        })) : [];
    }

    constructor() {
        super("acorn:model");
    }

    connectedCallback() {
        super.connectedCallback();
    }

    attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string
      ) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (
            (name === "date" || name === "services") &&
            oldValue !== newValue &&
            newValue
        ) {
            this.updateAppointments();
        }
      }

    updateAppointments() {
        this.dispatchMessage([
            "appointments/", 
            { 
                from_service_date: this.date!, 
                to_service_date: this.date!,
                per_page: 100,
                page: 0,
                filter_status_ids: [1,2], // Only show appointments that are not complete and not canceled
                filter_service_ids: this.services
            }
          ]);
    }

    updateOmissions() {
        this.dispatchMessage([
            "omissions/save", 
            { 
                omissions: this.appointment_omissions
            }
          ]);
    }

    handleCheckboxChange(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        const { name } = checkbox;
        const box_field = name as CheckboxField;
        const value = parseInt(checkbox.value);
        switch(box_field) {
            case "app_omissions":
                if (checkbox.checked) {
                    // Add the value to the appointment_omissions array if checked
                    this.appointment_omissions = [...this.appointment_omissions, value];
                  } else {
                    // Remove the value from the appointment_omissions array if unchecked
                    this.appointment_omissions = this.appointment_omissions.filter(id => id !== value);
                  }
                this.updateOmissions();
                break;
            default:
                const unhandled: never = box_field;
                throw new Error(`Unhandled Auth message "${unhandled}"`);
        }
    }

    selectAll() {
        this.appointment_omissions = this.appointments!.map(a => a.appointment_id);
        this.updateOmissions
    }

    clearSelection() {
        this.appointment_omissions = [];
        this.updateOmissions
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
    const renderCheckboxOption = (option: OmissionOption, opt_name: CheckboxField) => {
        var reflect_array: Array<number>;
        switch (opt_name) {
            case "app_omissions":
                reflect_array = this.appointment_omissions;
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

    const renderAppointment = (app: Appointment) => {
        return this.appointment_omissions.includes(app.appointment_id) ? html`
            <li>
                <span>${app.property_info.property_name}</span>
            </li>
        ` : html``;
    };

    const appointment_list = this.appointments || [];

    return html`
        <div class="multi-select">
        <button @click=${this.showModal}>
            <box-icon name='select-multiple' color='var(--text-color-body)'></box-icon>
            <span>Select Omissions</span>
        </button>
        <ul class="appointments">
            ${appointment_list.map((a) => { return renderAppointment(a) })}
        </ul>
        </div>
        <dialog class="modal">
            <div class="modal-content">
                <div class="spread-apart modal-header">
                    <h4>Select Appointments to Omit</h4>
                    <button @click=${this.closeDialog} class="close">
                        <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                    </button>
                </div>
                <div class="spread-apart clear-select">
                    <button @click=${this.clearSelection}>Clear Selection</button>
                    <button @click=${this.selectAll}>Select All</button>
                </div>
                <div class="filters checkboxes">
                    ${this.appointment_options.map((opt) => { return renderCheckboxOption(opt, "app_omissions")})}
                </div>
            </div>
        </dialog>
    `;
    }

    static styles = [
        reset,
        page,
        css`

            .appointments {
                max-width: calc(var(--spacing-size-medium) * 22);
            }

            .checkboxes {
                max-height: calc(var(--text-font-size-large) * 9.5);
                min-width: calc(var(--text-font-size-large) * 12);
            }
        `
    ];
}