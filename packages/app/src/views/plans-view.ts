import { define, View } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { Plan } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";
import { PlanViewElement } from "./plan-view";
import { toISOLocal } from "../utils/dates";

export class PlansViewElement extends View<Model, Msg> {
    static uses = define(
        {
            "plan-view": PlanViewElement
        }
    );

    @state()
    get plans(): Array<Plan> | undefined {
        return this.model.plans;
    }

    @state()
    get showing_total(): number {
        if (this.plans) {
            return this.plans.length;
        } else {
            return 0;
        }
    }

    @property({ type: String })
    from_plan_date: string = toISOLocal(new Date()).split('T')[0];

    @property({ type: Number })
    per_page: number = 10;

    @property({ type: Number })
    page: number = 1;

    constructor() {
        super("acorn:model");
    }

    connectedCallback() {
        super.connectedCallback();
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

    handleTableOptionChange(event: Event) {
        this.handleInputChange(event);
        this.updatePlans();
    }

    handleInputChange(event: Event) {
        const input = event.target as HTMLInputElement | HTMLSelectElement;
        const { name, value } = input;
        (this as any)[name] = value;
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
                <menu class="table-menu">
                    <div>
                        <label>
                            <span>Schedule Date:</span>
                            <input name="from_plan_date" autocomplete="off" .value=${this.from_plan_date} type="date" @input=${this.handleTableOptionChange} />
                        </label>
                    </div>
                </menu>
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