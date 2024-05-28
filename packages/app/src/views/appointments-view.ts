import { View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { Appointment, Service, Staff } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";
import { formatDateTime, toISOLocal } from "../utils/dates";
import 'boxicons';

interface StatusOption {
    id: number;
    label: string;
}

interface ServiceOption {
    id: number;
    label: string;
}

const STATUS_OPTIONS: Array<StatusOption> = [
    { id: 1, label: 'Unconfirmed' },
    { id: 2, label: 'Confirmed' },
    { id: 3, label: 'Completed' },
    { id: 4, label: 'Completed (Invoiced)'},
    { id: 5, label: 'Cancelled'}
  ];

type CheckboxField = "app_status" | "app_service";

export class AppointmentsViewElement extends View<Model, Msg> {

    @state()
    get appointments(): Array<Appointment> | undefined {
        return this.model.appointments;
    }

    @state()
    get services(): Array<Service> | undefined {
        return this.model.services;
    }

    @state()
    get showing_total(): number {
        if (this.appointments) {
            return this.appointments.length;
        } else {
            return 0;
        }
    }

    @state()
    get service_options(): Array<ServiceOption> {
        return this.services ? this.services.map(service => ({
        id: service.service_id,
        label: service.service_name
        })) : [];
    }

    @state()
    from_service_date: string = toISOLocal(new Date()).split('T')[0];

    @state()
    to_service_date: string = toISOLocal(new Date()).split('T')[0];

    @state()
    per_page: number = 50;

    @state()
    page: number = 1;

    @state()
    filter_status_ids: number[] = [1, 2, 3, 4];

    @state()
    filter_service_ids: number[] = [21942, 23044];

    constructor() {
        super("acorn:model");
    }

    connectedCallback() {
        super.connectedCallback();
        this.dispatchMessage([
            "services/", 
            { 
                
            }
          ]);
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
                filter_status_ids: this.filter_status_ids,
                filter_service_ids: this.filter_service_ids
            }
          ]);
    }

    handleTableOptionChange(event: Event) {
        this.handleInputChange(event);
        this.updateAppointments();
    }

    handleInputChange(event: Event) {
        const input = event.target as HTMLInputElement | HTMLSelectElement;
        const { name, value, type } = input;
        if (type === "checkbox") {
            this.handleCheckboxChange(event);
        }
        else (this as any)[name] = value;
    }

    handleCheckboxChange(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        const { name } = checkbox;
        const box_field = name as CheckboxField;
        const value = parseInt(checkbox.value);
        switch(box_field) {
            case "app_status":
                if (checkbox.checked) {
                    // Add the value to the filter_status_ids array if checked
                    this.filter_status_ids = [...this.filter_status_ids, value];
                  } else {
                    // Remove the value from the filter_status_ids array if unchecked
                    this.filter_status_ids = this.filter_status_ids.filter(id => id !== value);
                  }
                break;
            case "app_service":
                if (checkbox.checked) {
                    this.filter_service_ids = [...this.filter_service_ids, value];
                  } else {
                    this.filter_service_ids = this.filter_service_ids.filter(id => id !== value);
                  }
                break
            default:
                const unhandled: never = box_field;
                throw new Error(`Unhandled Auth message "${unhandled}"`);
        }
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
    const renderCheckboxOption = (option: StatusOption | ServiceOption, opt_name: CheckboxField) => {
        var reflect_array: Array<number>;
        switch (opt_name) {
            case "app_status":
                reflect_array = this.filter_status_ids;
                break;
            case "app_service":
                reflect_array = this.filter_service_ids;
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
                @change=${this.handleTableOptionChange}
                ?checked=${reflect_array.includes(option.id)}
            />
            ${option.label}
            </label>
        `
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
                        ${app.turn_around ? html`<box-icon name='revision' color="var(--text-color-body)" ></box-icon>` : html``}
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
        <div class="page">
            <header>
                <h1>
                    Appointments
                </h1>
            </header>
            <main>
                <menu class="table-menu">
                    <div>
                        <label>
                            <span>From Date:</span>
                            <input name="from_service_date" autocomplete="off" .value=${this.from_service_date} type="date" @input=${this.handleTableOptionChange} />
                        </label>
                    </div>
                    <div>
                        <label>
                            <span>To Date:</span>
                            <input name="to_service_date" autocomplete="off" .value=${this.to_service_date} type="date" @input=${this.handleTableOptionChange} />
                        </label>
                    </div>
                    <div>
                        <span>Status:</span>
                        <div class="filters">
                            ${STATUS_OPTIONS.map((opt) => { return renderCheckboxOption(opt, "app_status")})}
                        </div>
                    </div>
                    <div>
                        <span>Services:</span>
                        <div class="filters">
                            ${this.service_options.map((opt) => { return renderCheckboxOption(opt, "app_service")})}
                        </div>
                    </div>
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
                            <button @click=${this.previousPage} ?disabled=${this.page === 1}><box-icon name='chevron-left' color="var(--text-color-body)"></box-icon></button>
                            <span class="highlight">${this.page}</span>
                            <button @click=${this.nextPage}><box-icon name='chevron-right' color="var(--text-color-body)"></box-icon></button>
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
                            <th>T/A</th>
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