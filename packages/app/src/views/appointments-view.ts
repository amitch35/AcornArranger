import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { Appointment, Staff } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";
import { formatDateTime, toISOLocal } from "../utils/dates";

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

    @property({ type: String })
    from_service_date: string = toISOLocal(new Date()).split('T')[0];

    @property({ type: String })
    to_service_date: string = toISOLocal(new Date()).split('T')[0];

    @property({ type: Number })
    per_page: number = 50;

    @property({ type: Number })
    page: number = 1;

    constructor() {
        super("acorn:model");
    }

    connectedCallback() {
        super.connectedCallback();
        this.updateAppointments();
    }

    updateAppointments() {
        // Parse the date strings into Date objects
        const fromDate = new Date(this.from_service_date);
        const toDate = new Date(this.to_service_date);

        // Check if fromDate is greater than toDate
        if (fromDate > toDate) {
            // Adjust toDate to be equal to fromDate
            this.to_service_date = this.from_service_date;
        }

        this.dispatchMessage([
            "appointments/", 
            { 
                from_service_date: this.from_service_date,
                to_service_date: this.to_service_date, 
                per_page: this.per_page,
                page: (this.page - 1),
                filter_status_ids: [1,2,3,4]
            }
          ]);
    }

    handleTableOptionChange(event: Event) {
        this.handleInputChange(event);
        this.updateAppointments();
    }

    handleInputChange(event: Event) {
        const input = event.target as HTMLInputElement | HTMLSelectElement;
        const { name, value } = input;
        (this as any)[name] = value;
    }

    previousPage() {
        if (this.page > 1) {
          this.page--;
          this.updateAppointments();
        }
    }
    
    nextPage() {
        this.page++;
        this.updateAppointments();
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
                    ${formatDateTime(app.service_time)}
                    </span>
                </td>
                <td>
                    <span>
                    ${app.property_info.property_name}
                    </span>
                </td>
                <td>
                    <ul class="staff">
                        ${app.staff?.map((s) => { return renderStaff(s.staff_info) })}
                    </ul>
                </td>
                <td class="center">
                    <span>
                    ${app.turn_around}
                    </span>
                </td>
                <td>
                    <span>
                    ${formatDateTime(app.next_arrival_time)}
                    </span>
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
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
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
                            <input name="from_service_date" autocomplete="off" .value=${this.from_service_date} type="date" @input=${this.handleTableOptionChange} />
                        </label>
                    </li>
                    <li>
                        <label>
                            <span>To Date:</span>
                            <input name="to_service_date" autocomplete="off" .value=${this.to_service_date} type="date" @input=${this.handleTableOptionChange} />
                        </label>
                    </li>
                </menu>
                <section class="showing">
                    <div><p>Showing: </p><p class="in-bubble">${this.showing_total}</p></div>
                    <div>
                        <label>
                            <span>Show:</span>
                            <select name="per_page" .value=${this.per_page.toString()} @change=${this.handleTableOptionChange} >
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="200">200</option>
                            </select>
                        </label>
                        <div class="page-selector">
                            <span>Page:</span>
                            <button @click=${this.previousPage} ?disabled=${this.page === 1}><i class='bx bxs-chevron-left' ></i></button>
                            <span class="highlight">${this.page}</span>
                            <button @click=${this.nextPage}><i class='bx bxs-chevron-right' ></i></button>
                        </div>
                    </div>
                </section>
                <table>
                    <thead>
                        <tr>
                            <th>Appointment ID</th>
                            <th>Service Time</th>
                            <th>Property</th>
                            <th>Staff</th>
                            <th>Turn Around</th>
                            <th>Next Arrival Time</th>
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
                gap: var(--spacing-size-medium);
                width: 100%;
            }

            ul.staff {
                list-style-type: none;
            }

            ul.staff li {
                width: max-content;
                background-color: var(--background-color);
                border-radius: var(--border-size-radius);
                margin-bottom: var(--spacing-size-xsmall);
                padding: 0 var(--spacing-size-small);
            }
        `
    ];
}