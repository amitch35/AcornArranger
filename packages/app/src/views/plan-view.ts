import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { Appointment, Plan, Staff } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";
import { formatDate } from "../utils/dates";

export class PlanViewElement extends View<Model, Msg> {

    @state()
    get model_plan(): Plan | undefined {
        return this.model.plan;
    }

    @property({ attribute: false })
    plan?: Plan;

    constructor() {
        super("acorn:model");
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        const modelPlan = this.model_plan;
        if (modelPlan && (!this.plan || modelPlan.plan_id === this.plan.plan_id)) {
          this.plan = modelPlan;
        }
    }

    render(): TemplateResult {
    if (!this.plan) {
        return html`<section><p>Loading...</p></section>`;
    }

    const renderStaff = (staff: Staff) => {
        return html`
            <li>
                <span>${staff.name}</span>
            </li>
        `;
    };

    const renderAppointment = (app: Appointment) => {
        return html`
            <li>
                <span>${app.property_info.property_name}</span>
            </li>
        `;
    };
    
    return html`
        <section>
            <div>
                <p>ID: ${this.plan.plan_id}</p>
                <p>${formatDate(this.plan.plan_date)}</p>
            </div>
            <h4>Team ${this.plan.team}</h4>
            <h5>Staff</h5>
            <ul>
                ${this.plan.staff.map((s) => renderStaff(s.staff_info))}
            </ul>
            <h5>Appointments</h5>
            <ul>
                ${this.plan.appointments.map((a) => renderAppointment(a.appointment_info))}
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
                min-width: calc(var(--spacing-size-medium) * 20);
                width: fit-content;
            }

            ul {
                list-style-type: none;
                padding: var(--spacing-size-small);
            }

            ul li {
                width: max-content;
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
        `
    ];
}