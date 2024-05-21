import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { Appointment, Staff } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";

export class AppointmentsViewElement extends View<Model, Msg> {

    @property()
    get appointments(): Array<Appointment> | undefined {
        return this.model.appointments;
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
                <td>
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
                        ${app.staff?.map((s) => { renderStaff(s.staff_info) })}
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
                </menu>
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
            div.page main {
                background-color: var(--background-color-accent);
                border-radius: var(--border-size-radius);
            }

            menu {
                list-style-type: none;
                display: flex;
                padding: 0;
                margin-bottom: 0;
                gap: var(--spacing-size-medium);
            }
        `
    ];
}