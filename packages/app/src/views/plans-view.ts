import { define, View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { Plan, Service, PlanBuildOptions, ErrorResponse} from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";
import { PlanViewElement } from "./plan-view";
import { toISOLocal } from "../utils/dates";
import { AvailableStaffModal } from "./available-modal";
import { OmissionsModal } from "./omissions-modal";
import { BuildErrorDialog } from "../components/build-error-dialog";

interface ServiceOption {
    id: number;
    label: string;
}

type CheckboxField = "app_service";

export class PlansViewElement extends View<Model, Msg> {
    static uses = define(
        {
            "plan-view": PlanViewElement,
            "available-modal": AvailableStaffModal,
            "omissions-modal": OmissionsModal,
            "build-error-dialog": BuildErrorDialog
        }
    );

    build_count = 0;

    @state()
    get plans(): Array<Plan> | undefined {
        return this.model.plans;
    }

    @state()
    get services(): Array<Service> | undefined {
        return this.model.services;
    }

    @state()
    get build_error(): ErrorResponse | undefined {
        return this.model.build_error;
    }

    @state()
    get showing_total(): number {
        if (this.plans) {
            return this.plans.length;
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
    from_plan_date: string = toISOLocal(new Date()).split('T')[0];

    @state()
    per_page: number = 10;

    @state()
    page: number = 1;

    @state()
    filter_service_ids: number[] = [21942, 23044];

    @state()
    routing_type: number = 1;

    @state()
    cleaning_window: number = 6.0;

    @state()
    max_hours: number = 8.0;

    @state()
    target_staff_count?: number;

    constructor() {
        super("acorn:model");

        this.addEventListener("build-error-dialog:no-error", () => {
            this.updatePlans();
          });
    }

    connectedCallback() {
        super.connectedCallback();
        this.dispatchMessage([
            "services/", 
            { 
                
            }
          ]);
        this.updatePlans();
    }

    updatePlans() {
        this.dispatchMessage([
            "plans/", 
            { 
                from_plan_date: this.from_plan_date,
                per_page: this.per_page,
                page: (this.page - 1)
            }
          ]);
    }

    buildSchedule() {
        this.build_count++;
        this.dispatchMessage([
            "plans/build", 
            { 
                plan_date: this.from_plan_date, 
                build_options: { 
                    available_staff: this.model.available ? this.model.available : [],
                    services: this.filter_service_ids,
                    omissions: this.model.omissions ? this.model.omissions : [],
                    routing_type: this.routing_type,
                    cleaning_window: this.cleaning_window,
                    max_hours: this.max_hours,
                    target_staff_count: this.target_staff_count
                 } as PlanBuildOptions
            }
          ]);
    }

    handleTableOptionChange(event: Event) {
        this.handleInputChange(event);
        const input = event.target as HTMLInputElement | HTMLSelectElement;
        const { name } = input;
        if (name === "per_page" || name === "from_plan_date") this.updatePlans();
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
          this.updatePlans();
        }
    }
    
    nextPage() {
        this.page++;
        this.updatePlans();
    }


    render(): TemplateResult {
    const renderCheckboxOption = (option:  ServiceOption, opt_name: CheckboxField) => {
        var reflect_array: Array<number>;
        switch (opt_name) {
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

    const renderPlan = (plan: Plan) => {
        return html`
            <plan-view .plan=${plan}></plan-view>
        `;
    };

    const plans_list = this.plans || [];

    return html`
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
        <div class="page">
            <header>
                <h1>
                    Schedule Plans
                </h1>
            </header>
            <main>
                <build-error-dialog code=${(this.build_error ? this.build_error.code! : `no-error:${this.build_count}`)} .error=${this.build_error}></build-error-dialog>
                <menu class="table-menu">
                    <div>
                        <label>
                            <span>Schedule Date:</span>
                            <input name="from_plan_date" autocomplete="off" .value=${this.from_plan_date} type="date" @input=${this.handleTableOptionChange} />
                        </label>
                    </div>
                    <available-modal></available-modal>
                </menu>
                <menu class="table-menu">
                    <div>
                        <span>Services:</span>
                        <div class="filters">
                            ${this.service_options.map((opt) => { return renderCheckboxOption(opt, "app_service")})}
                        </div>
                    </div>
                    <omissions-modal date=${this.from_plan_date} .services=${this.filter_service_ids}></omissions-modal>
                    <div>
                        <label>
                            <span>Routing Type:</span>
                            <select name="routing_type" .value=${this.routing_type.toString()} @change=${this.handleTableOptionChange} >
                                <option value="1">Farthest to Office (Recommended)</option>
                                <option value="2">Farthest to Anywhere</option>
                                <option value="3">Office to Farthest</option>
                                <option value="4">Office to Anywhere</option>
                                <option value="4">Start and end Anywhere</option>
                            </select>
                        </label>
                        <label>
                            <span>Cleaning Window:</span>
                            <input name="cleaning_window" autocomplete="off" .value=${this.cleaning_window.toString()} type="number" @input=${this.handleTableOptionChange} />
                        </label>
                        <label>
                            <span>Max Hours:</span>
                            <input name="max_hours" autocomplete="off" .value=${this.max_hours.toString()} type="number" @input=${this.handleTableOptionChange} />
                        </label>
                        <label>
                            <span>Target Staff Count:</span>
                            <input name="target_staff_count" autocomplete="off" .value=${this.target_staff_count ? this.target_staff_count.toString() : ''} type="number" @input=${this.handleTableOptionChange} />
                        </label>
                    </div>
                </menu>
                <button @click=${this.buildSchedule}>
                    <i class='bx bxs-wrench'></i>
                    <span>Build Plan</span>
                </button>
                <section class="showing">
                    <div><p>Showing: </p><p class="in-bubble">${this.showing_total}</p></div>
                    <div>
                        <label>
                            <span>Show:</span>
                            <select name="per_page" .value=${this.per_page.toString()} @change=${this.handleTableOptionChange} >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
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
                <div class="plans">
                    ${plans_list.map((p) => renderPlan(p))}
                </div>
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

            .plans {
                display: flex;
                width: 100%;
                flex-wrap: wrap;
                align-items: flex-start;
                justify-content: space-evenly;
                gap: var(--spacing-size-large);
            }
        `
    ];
}