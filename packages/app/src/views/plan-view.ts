import { define, View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { Appointment, Plan, Staff } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";
import { formatDate } from "../utils/dates";
import 'boxicons';
import { AddStaffModal } from "./add-staff-modal";
import { AddAppointmentModal } from "./add-appointment-modal";

export class PlanViewElement extends View<Model, Msg> {
    static uses = define(
        {
            "add-staff-modal": AddStaffModal,
            "add-appointment-modal": AddAppointmentModal
        }
    );

    @state()
    get model_plan(): Plan | undefined {
        return this.model.plan;
    }

    @property({ attribute: false })
    plan?: Plan;

    @state()
    get other_appointment_ids(): Array<number> | undefined {
        return this.model.plans?.filter(p => p.plan_id !== this.plan?.plan_id)
            .flatMap(p => p.appointments.map(a => a.appointment_id))
            ?? [];
    }

    constructor() {
        super("acorn:model");
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        var modelPlan = this.model_plan;
        if (modelPlan && (!this.plan || modelPlan.plan_id === this.plan.plan_id)) {
          this.plan = modelPlan;
        }
    }

    handleStaffRemove(event: Event) {
        const button = event.target as HTMLButtonElement;
        const { name } = button;
        if (name !== undefined) {
            this.dispatchMessage([
                "plans/staff/remove", 
                { 
                    plan_id: this.plan!.plan_id,
                    user_id: parseInt(name)
                }
              ]);
            this.requestPlanUpdate();
        }
    }

    handleAppointmentRemove(event: Event) {
        const button = event.target as HTMLButtonElement;
        const { name } = button;
        if (name !== undefined) {
            this.dispatchMessage([
                "plans/appointment/remove", 
                { 
                    plan_id: this.plan!.plan_id,
                    appointment_id: parseInt(name)
                }
              ]);
            this.requestPlanUpdate();
        }
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

    render(): TemplateResult {
    if (!this.plan) {
        return html`<section><p>Loading...</p></section>`;
    }

    const renderStaff = (staff: Staff) => {
        return html`
            <li>
                <span>${staff.name}</span>
                <button class="trash" name=${staff.user_id} @click=${this.handleStaffRemove} ?disabled=${this.plan?.appointments[0] && this.plan?.appointments[0].sent_to_rc !== null}> 
                    <box-icon name='trash' size="var(--text-font-size-body)" color="var(--accent-color-red)"></box-icon>
                </button>
            </li>
        `;
    };

    const renderAppointment = (app: Appointment) => {
        return html`
            <li class="${this.other_appointment_ids?.includes(app.appointment_id) ? 'duplicate' : ''}">
                <span>${app.property_info.property_name}</span>
                <button class="trash" name=${app.appointment_id} @click=${this.handleAppointmentRemove} ?disabled=${this.plan?.appointments[0] && this.plan?.appointments[0].sent_to_rc !== null}> 
                    <box-icon name='trash' size="var(--text-font-size-body)" color="var(--accent-color-red)"></box-icon>
                </button>
            </li>
        `;
    };
    
    return html`
        <section>
            <div>
                <p>ID: ${this.plan.plan_id}</p>
                <p>${this.plan.appointments[0] && this.plan.appointments[0].sent_to_rc !== null ? html`<box-icon name='upload' color="var(--text-color-body)" size="var(--text-font-size-body)"></box-icon>` : html``}</p>
                <p>${formatDate(this.plan.plan_date)}</p>
            </div>
            <h4>Team ${this.plan.team}</h4>
            <h5>Staff</h5>
            <ul>
                ${this.plan.staff.map((s) => renderStaff(s.staff_info))}
                <add-staff-modal .plan=${this.plan}></add-staff-modal>
            </ul>
            <h5>Appointments</h5>
            <!-- show non-cancelled appointments in plan -->
            <ul> 
                ${this.plan.appointments.map((a) => a.appointment_info.status.status_id !== 5 ? renderAppointment(a.appointment_info) : html``)}
                <add-appointment-modal .plan=${this.plan}></add-appointment-modal>
            </ul>
        </section>
    `;
    }

    static styles = [
        reset,
        page,
        css`
            section {
                background-color: var(--background-color-accent);
                border-radius: var(--border-size-radius);
                padding: var(--spacing-size-small) var(--spacing-size-medium);
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                min-width: calc(var(--spacing-size-medium) * 18);
                width: fit-content;
            }

            ul {
                list-style-type: none;
                padding: var(--spacing-size-small);
                width: 100%;
            }

            ul li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: var(--spacing-size-medium);
                width: 100%;
                background-color: var(--background-color);
                border-radius: var(--border-size-radius);
                margin-bottom: var(--spacing-size-xsmall);
                padding: 0 var(--spacing-size-small);
            }

            div {
                display: flex;
                justify-content: space-between;
                width: 100%;
            }

            p {
                font-size: var(--text-font-size-small);
            }

            h4, h5 {
                padding: 0;
                width: 100%;
            }

            h4 {
                text-align: center;
                border-bottom: 2px solid currentColor;
                padding-bottom: var(--spacing-size-small);
                line-height: 1;
            }

            h5 {
                border-bottom: 1px solid currentColor;
                line-height: 1.5;
            }

            button.trash {
                background-color: var(--background-color);
            }

            button.trash:hover {
                background-color: var(--background-color-accent);
            }

            button[disabled].trash:hover {
                background-color: var(--background-color);
            }

            .duplicate {
                border: 2px solid var(--accent-color);
            }
        `
    ];
}