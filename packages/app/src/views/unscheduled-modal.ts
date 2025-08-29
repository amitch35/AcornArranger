import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { Appointment } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";
import 'boxicons';

export class UnscheduledModal extends View<Model, Msg> {

    @property({ attribute: true, reflect: true })
    services?: Array<number>;

    @property()
    date?: string;

    @state()
    get unscheduled(): Array<Appointment> | undefined {
        if (this.model.plans) { // Will also only show those that are not currently slated in a plan for the day as unscheduled
            const scheduledIds = new Set(
                this.model.plans.flatMap(plan => plan.appointments.map(a => a.appointment_id)) // Currently planned appiontments
              );
            return this.model.unscheduled?.filter(app => !scheduledIds.has(app.appointment_id)); // Only unplanned and unscheduled
        }
        return this.model.unscheduled
    }

    constructor() {
        super("acorn:model");
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("visibilitychange", this.handleVisibilityChange);
    }
    
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    }
    
    private handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
            this.updateUnscheduled();
        }
    };

    attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string
      ) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (
            (name === "date") &&
            oldValue !== newValue &&
            newValue
        ) {
            this.updateUnscheduled();
        }
      }

    updateUnscheduled() {
        this.dispatchMessage([
            "appointments/select-unscheduled", 
            { 
                from_service_date: this.date!, 
                to_service_date: this.date!,
                per_page: 100,
                page: 0,
                filter_status_ids: [1,2], // Only show appointments that are not complete and not canceled
                filter_service_ids: this.services?.length ? this.services : [21942, 23044],
                show_unscheduled: true
            }
          ]);
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
    const unscheduled_list = this.unscheduled || [];


    const renderUnscheduledButton = (unscheduled: Array<Appointment>) => {
        if (unscheduled.length) {
            return html`
                <button @click=${this.showModal}>
                    <div class="bubble-container">
                        <box-icon name='circle' type='solid' color="var(--accent-color-red)" size="var(--text-font-size-large)"></box-icon>
                        <p class="in-bubble">${unscheduled.length}</p>
                    </div>
                </button>
            `
        } else {
            return html`
                <button @click=${this.showModal} disabled>
                    <box-icon name='error-circle' color="var(--text-color-body)" size="var(--text-font-size-large)"></box-icon>
                </button>
            `
        }
    }

    return html`
        <div>
            ${renderUnscheduledButton(unscheduled_list)}
        </div>
        <dialog class="modal">
            <div class="modal-content">
                <div class="spread-apart modal-header">
                    <h4>Unscheduled Appointments</h4>
                    <button @click=${this.closeDialog} class="close">
                        <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                    </button>
                </div>
                <div class="spread-apart list-segment">
                    <h5>Confirmed but unscheduled:</h5>
                    <ul class="unscheduled">
                    ${unscheduled_list.map((app) => { return app.status.status_id === 2 ? html`
                        <li>
                            <span>${app.property_info.property_name}</span>
                        </li>
                    ` : html`` })}
                    </ul>
                    <h5>Unconfirmed:</h5>
                    <ul class="unscheduled">
                    ${unscheduled_list.map((app) => { return  app.status.status_id === 1 ? html`
                        <li>
                            <span>${app.property_info.property_name}</span>
                        </li>
                    ` : html`` })}
                    </ul>
                </div>
            </div>
        </dialog>
    `;
    }

    static styles = [
        reset,
        page,
        css`

            button[disabled]:hover {
                background-color: var(--background-color-accent);
            }

            ul.unscheduled {
                list-style-type: none;
                padding-top: var(--spacing-size-small);
                padding-bottom: var(--spacing-size-small);
            }

            ul.unscheduled li {
                width: max-content;
                background-color: var(--background-color-accent);
                border-radius: var(--border-size-radius);
                margin-bottom: var(--spacing-size-xsmall);
                padding: 0 var(--spacing-size-small);
            }

            .list-segment {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                align-content: space-between;
                justify-content: flex-start;
                overflow-y: auto;
                max-height: calc(var(--text-font-size-large) * 20);
                min-width: calc(var(--text-font-size-large) * 7);
                background-color: var(--background-color);
                padding: var(--spacing-size-xsmall) var(--spacing-size-small);
            }

            .list-segment::-webkit-scrollbar {
                -webkit-appearance: none;
                width: 7px;
            }

            .list-segment::-webkit-scrollbar-thumb {
                border-radius: 4px;
                background-color: rgba(0, 0, 0, .5);
                box-shadow: 0 0 1px var(--background-color-accent);
            }

        `
    ];
}