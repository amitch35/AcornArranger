import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";
import 'boxicons';
// TODO: Add to APIspec, save changes to database git, Build out Element
export class ShiftCheckModal extends View<Model, Msg> { 

    @property()
    date?: string;

    @state()
    get staff_shift_issues() {
        let shifts = this.model.shifts || [];
        const plans = this.model.plans || [];

        // Only include shifts with the desired roles
        shifts = shifts.filter(shift =>
            shift.shift.role === "Lead Housekeeper" || 
            shift.shift.role === "Housekeeper" || 
            shift.shift.role === "Hospitality Manager" ||
            shift.shift.role === "Quality Control Manager"
        );
    
        const planned_staff = new Map<number, { user_id: number; name: string }>();
        const scheduled_staff = new Map<number, { user_id: number; name: string }>();
        const unmatched_shifts = shifts.filter(s => !s.matched);
    
        // Collect all staff from plans into a Map
        for (const plan of plans) {
            for (const staff of plan.staff) {
                planned_staff.set(staff.user_id, {
                    user_id: staff.user_id,
                    name: staff.staff_info.name
                });
            }
        }
    
        // Collect matched staff from shifts into a Map
        for (const shift of shifts) {
            if (shift.matched) {
                scheduled_staff.set(shift.user_id, {
                    user_id: shift.user_id,
                    name: shift.name
                });
            }
        }
    
        const staff_on_plans_without_shifts = [...planned_staff.values()].filter(
            staff => !scheduled_staff.has(staff.user_id)
        );
    
        const staff_with_shifts_not_on_plans = [...scheduled_staff.values()].filter(
            staff => !planned_staff.has(staff.user_id)
        );
    
        return {
            staff_on_plans_without_shifts,
            staff_with_shifts_not_on_plans,
            unmatched_shifts
        };
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
            this.updateShifts();
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
            this.updateShifts();
        }
      }

    updateShifts() {
        this.dispatchMessage([
            "staff/shifts", 
            { 
                from_shift_date: this.date!, 
                to_shift_date: this.date!
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
    const { staff_on_plans_without_shifts, staff_with_shifts_not_on_plans, unmatched_shifts } = this.staff_shift_issues;


    const renderShiftCheckButton = (shift_issues: number) => {
        if (shift_issues) {
            return html`
                <button @click=${this.showModal}>
                    <div class="bubble-container">
                        <box-icon name='circle' type='solid' color="var(--accent-color-red)" size="var(--text-font-size-large)"></box-icon>
                        <p class="in-bubble">${shift_issues}</p>
                    </div>
                </button>
            `
        } else {
            return html`
                <button @click=${this.showModal} disabled>
                    <box-icon name='happy' color="var(--text-color-body)" size="var(--text-font-size-large)"></box-icon>
                </button>
            `
        }
    }

    return html`
        <div>
            ${renderShiftCheckButton(
                    staff_on_plans_without_shifts.length + 
                    staff_with_shifts_not_on_plans.length + 
                    unmatched_shifts.length
                )}
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
                    <h5>Staff on Plans Without Shifts:</h5>
                    <ul class="issue-list">
                    ${staff_on_plans_without_shifts.map(staff => html`
                        <li>
                            <span>${staff.name}</span>
                        </li>
                    `)}
                    </ul>
                    <h5>Shifts Not On Plans:</h5>
                    <ul class="issue-list">
                    ${staff_with_shifts_not_on_plans.map(staff => html`
                        <li>
                            <span>${staff.name}</span>
                        </li>
                    `)}
                    </ul>
                    <label>
                        <info-dialog name="Unmatched Shifts">
                            <p>Some shifts cannot always be properly matched to a particular staff member.</p>
                            <p>This often happens when a staff member has a name in Homebase that differs from the one in AcornArranger/ResortCleaning.</p>
                        </info-dialog>
                        <h5>Unmatched Shifts:</h5>
                    </label>
                    <ul class="issue-list">
                    ${unmatched_shifts.map(staff_shift => html`
                        <li>
                            <span>${staff_shift.shift.first_name} ${staff_shift.shift.last_name}</span>
                        </li>
                    `)}
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

            ul.issue-list {
                list-style-type: none;
                padding-top: var(--spacing-size-small);
                padding-bottom: var(--spacing-size-small);
            }

            ul.issue-list li {
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

            div.list-segment label {
                display: flex;
                align-items: center;
                gap: var(--spacing-size-xsmall);
            }

        `
    ];
}