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
import { InfoDialog } from "../components/info-dialog";
import 'boxicons';

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
            "build-error-dialog": BuildErrorDialog,
            "info-dialog": InfoDialog
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

        this.addEventListener("plan-view:update", () => {
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
        if (this.build_error) this.dispatchMessage([ "build_error/reset", { } ]);
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
        this.build_count++;
    }

    copySchedule() {
        this.dispatchMessage([
            "plans/copy", 
            { 
                plan_date: this.from_plan_date
            }
          ]);
        this.build_count++;
    }

    sendSchedule() {
        this.dispatchMessage([
            "plans/send", 
            { 
                plan_date: this.from_plan_date
            }
          ]);
        this.build_count++;
        this.closeSendModal();
    }

    addPlan() {
        this.dispatchMessage([
            "plans/add", 
            { 
                plan_date: this.from_plan_date
            }
          ]);
        this.build_count++;
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

    closeSendModal() {
        const dialog = this.shadowRoot!.querySelector('dialog.send-modal') as HTMLDialogElement;
        dialog.close();
    }

    showSendModal() {
        const dialog = this.shadowRoot!.querySelector('dialog.send-modal') as HTMLDialogElement;
        dialog.showModal();
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
        <dialog class="send-modal modal">
            <div class="modal-content">
                <div class="align-center">
                    <h4>Confirm Send</h4>
                </div>
                <div>
                    <p>Are you sure you want to send this plan to ResortCleaning?</p>
                </div>
                <div class="spread-apart cancel-send">
                    <button @click=${this.closeSendModal}>Cancel</button>
                    <button @click=${this.sendSchedule}>Send</button>
                </div>
            </div>
        </dialog>
        <div class="page">
            <header>
                <h1>
                    Schedule Plans
                </h1>
            </header>
            <main>
                <div class="align-left">
                    <h4>Parameters</h4>
                </div>
                <menu class="parameter-menu">
                    <div>
                        <label>
                            <span>Schedule Date:</span>
                            <input name="from_plan_date" autocomplete="off" .value=${this.from_plan_date} type="date" @input=${this.handleTableOptionChange} />
                        </label>
                    </div>
                    <available-modal></available-modal>
                </menu>
                <div class="align-left">
                    <h4>Options</h4>
                </div>
                <menu class="table-menu options-menu">
                    <div>
                        <span>Services:</span>
                        <div class="filters">
                            ${this.service_options.map((opt) => { return renderCheckboxOption(opt, "app_service")})}
                        </div>
                    </div>
                    <omissions-modal date=${this.from_plan_date} .services=${this.filter_service_ids}></omissions-modal>
                    <div class="labeled-options">
                        <div>
                            <label>
                                <info-dialog name="Routing Type">
                                    <p>Determines start and end nodes used in Traveling Sales Person routing algorithm.</p>
                                </info-dialog>
                                <span>Routing Type:</span>
                                <select name="routing_type" .value=${this.routing_type.toString()} @change=${this.handleTableOptionChange} >
                                    <option value="1">Farthest to Office (Recommended)</option>
                                    <option value="2">Farthest to Anywhere</option>
                                    <option value="3">Office to Farthest</option>
                                    <option value="4">Office to Anywhere</option>
                                    <option value="4">Start and end Anywhere</option>
                                </select>
                            </label>
                        </div>
                        <div>
                            <label>
                                <info-dialog name="Cleaning Window">
                                    <p>Assumed Cleaning Window (hours) used for estimating number of cleaners needed for a day.</p>
                                    <p>Lower this value to schedule more housekeepers</p>
                                    <p>Increase to be more optimistic and potentially schedule less housekeepers</p>
                                </info-dialog>
                                <span>Cleaning Window:</span>
                                <input name="cleaning_window" autocomplete="off" .value=${this.cleaning_window.toString()} type="number" @input=${this.handleTableOptionChange} />
                            </label>
                        </div>
                        <div>
                            <label>
                                <info-dialog name="Max Hours">
                                    <p>Max total field hours before a team times out (does not include travel to/from office).</p>
                                    <p>Lower this value if teams are getting too much to handle</p>                                </info-dialog>
                                <span>Max Hours:</span>
                                <input name="max_hours" autocomplete="off" .value=${this.max_hours.toString()} type="number" @input=${this.handleTableOptionChange} />
                            </label>
                        </div>
                        <div>
                            <label>
                                <info-dialog name="Target Staff Count">
                                    <p>Target number of staff to schedule.</p>
                                    <p>(Takes effect only if larger than calculated required number of staff)</p>
                                </info-dialog>
                                <span>Target Staff Count:</span>
                                <input name="target_staff_count" autocomplete="off" .value=${this.target_staff_count ? this.target_staff_count.toString() : ''} type="number" @input=${this.handleTableOptionChange} />
                            </label>
                        </div>
                    </div>
                </menu>
                <div class="spread-apart">
                    <build-error-dialog code=${(this.build_error ? this.build_error.code! : `no-error:${this.build_count}`)} .error=${this.build_error}></build-error-dialog>
                    <button @click=${this.buildSchedule}>
                        <box-icon type='solid' name='wrench' color="var(--text-color-body)"></box-icon>
                        <span>Build</span>
                    </button>
                    <button class="copy" @click=${this.copySchedule} ?disabled=${!this.plans || this.plans.length < 1 || (this.plans[0].appointments[0] && this.plans[0].appointments[0].sent_to_rc === null)}>
                        <box-icon name='copy' color="var(--text-color-body)"></box-icon>
                        <span>Copy</span>
                    </button>
                    <button @click=${this.showSendModal}>
                        <box-icon name='upload' color="var(--text-color-body)"></box-icon>
                        <span>Send</span>
                    </button>
                </div>
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
                            <button @click=${this.previousPage} ?disabled=${this.page === 1}><box-icon name='chevron-left' type='solid' color="var(--text-color-body)"></box-icon></button>
                            <span class="highlight">${this.page}</span>
                            <button @click=${this.nextPage}><box-icon name='chevron-right' type='solid' color="var(--text-color-body)"></box-icon></button>
                        </div>
                    </div>
                </section>
                <div class="plans">
                    ${plans_list.map((p) => renderPlan(p))}
                    <div class="add-one">
                        <button @click=${this.addPlan}> 
                            <box-icon name='plus' size="var(--text-font-size-xlarge)" color="var(--text-color-body)"></box-icon>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    `;
    }

    static styles = [
        reset,
        page,
        css`

            menu.parameter-menu {
                background-color: var(--background-color-accent);
                border-radius: var(--border-size-radius);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-evenly;
                padding: var(--spacing-size-medium) var(--spacing-size-medium);
                gap: var(--spacing-size-medium);
                width: 100%;
            }

            menu.parameter-menu > div > label {
                display: flex;
                gap: var(--spacing-size-small);
            }

            menu.options-menu {
                gap: var(--spacing-size-xlarge);
            }

            .labeled-options {
                flex-grow: 1;
                max-width: calc(var(--spacing-size-large) * 30);
                width: 50%;
                display: flex;
                flex-wrap: wrap;
                gap: var(--spacing-size-large);
            }

            .labeled-options > div > label {
                display: flex;
                align-items: center;
                gap: var(--spacing-size-xsmall);
            }

            .labeled-options > div > label > span {
                margin-right: var(--spacing-size-small);
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
                justify-content: flex-start;
                gap: var(--spacing-size-xxlarge);
            }

            .add-one {
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: calc(var(--spacing-size-medium) * 18);
                min-height: calc(var(--spacing-size-medium) * 14);
            }

            .add-one button {
                padding: var(--spacing-size-medium);
            }

            .cancel-send {
                max-width: calc(var(--spacing-size-medium) * 10);
            }

            button[disabled].copy:hover {
                background-color: var(--background-color-accent);
            }
        `
    ];
}