import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { Appointment, Staff } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";

export class AppointmentsViewElement extends View<Model, Msg> {

    @state()
    get appointments(): Array<Appointment> | undefined {
        return this.model.appointments;
    }

    @state()
    get showing_total(): number {
        if (this.appointments) {
            return this.appointments.length;
        } else {
            return 0;
        }
    }

    constructor() {
        super("acorn:model");
    }

    connectedCallback() {
        super.connectedCallback();
        this.dispatchMessage([
            "appointments/", 
            { 
                from_service_date: '2024-05-19',
                to_service_date: '2024-05-20', 
                per_page: 50,
                page: 0 
            }
          ]);
    }

    render(): TemplateResult {
    const renderStaff = (staff: Staff) => {
        return html`
            <li>
                <span>${staff.name}</span>
            </li>
        `;
    };

    const renderAppointment = (app: Appointment) => {
        return html`
            <tr>
                <td class="center">
                    <span>
                    ${app.appointment_id}
                    </span>
                </td>
                <td>
                    <span>
                    ${app.service_time}
                    </span>
                </td>
                <td>
                    <span>
                    ${app.property_info.property_name}
                    </span>
                </td>
                <td>
                    <ul>
                        ${app.staff?.map((s) => { return renderStaff(s.staff_info) })}
                    </ul>
                </td>
                <td>
                    <span>
                    ${app.service.service_name}
                    </span>
                </td>
                <td>
                    <span>
                    ${app.status?.status}
                    </span>
                </td>
            </tr>
        `;
    };

    const appointment_list = this.appointments || [];

    return html`
        <div class="page">
            <header>
                <h1>
                    Appointments
                </h1>
            </header>
            <main>
                <menu>
                    <li>
                        <label>
                            <span>From Date:</span>
                            <input name="from_service_date" autocomplete="off" value="2024-05-19" type="date" />
                        </label>
                    </li>
                    <li>
                        <label>
                            <span>To Date:</span>
                            <input name="to_service_date" autocomplete="off" value="2024-05-20" type="date" />
                        </label>
                    </li>
                    <li>
                        <label>
                            <span>Show:</span>
                            <input name="per_page" autocomplete="off" value="50" type="number" />
                        </label>
                    </li>
                    <li>
                        <label>
                            <span>Page:</span>
                            <input name="page" autocomplete="off" value="1" type="number" />
                        </label>
                    </li>
                </menu>
                <section class="showing">
                    <p>Showing: </p><p class="in-bubble">${this.showing_total}</p>
                </section>
                <table>
                    <thead>
                        <tr>
                            <th>Appointment ID</th>
                            <th>Service Time</th>
                            <th>Property</th>
                            <th>Staff</th>
                            <th>Service</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${appointment_list.map((a) => {
                        return renderAppointment(a);
                    })}
                    </tbody>
                </table>
            </main>
        </div>
    `;
    }

    static styles = [
        reset,
        page,
        css`

            menu {
                background-color: var(--background-color-accent);
                border-radius: var(--border-size-radius);
                list-style-type: none;
                display: flex;
                justify-content: space-evenly;
                padding: var(--spacing-size-small);
                margin-bottom: var(--spacing-size-medium);
                gap: var(--spacing-size-medium);
                width: 100%;
            }

            ul {
                list-style-type: none;
            }

            ul li {
                width: max-content;
                background-color: var(--background-color);
                border-radius: var(--border-size-radius);
                margin-bottom: var(--spacing-size-xsmall);
                padding: 0 var(--spacing-size-small);
            }
        `
    ];
}