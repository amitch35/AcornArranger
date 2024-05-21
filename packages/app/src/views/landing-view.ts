import { View, Events } from "@calpoly/mustang";
import { css, html, TemplateResult } from "lit";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../css/reset";
import page from "../css/page";

export class LandingViewElement extends View<Model, Msg> {

    constructor() {
        super("acorn:model");
    }

    render(): TemplateResult {
    return html`
        <div class="page">
            <header>
                <h1>
                    AcornArranger
                </h1>
            </header>
            <main>
                <section>
                    <h2>
                    Welcome
                    </h2>
                    <p>
                        If you are new here, please <a href="/login.html?next=/app/appointments" style="color: var(--text-color-link);" @click=${signOutUser}>create an account</a> and request access from your administrator. 
                        If not, feel free to <a href="/login.html?next=/app/appointments" style="color: var(--text-color-link);" @click=${signOutUser}>login</a>
                    </p>
                </section>
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
        `
    ];
}

function signOutUser(ev: Event) {
    Events.relay(ev, "auth:message", ["auth/signout"]);
}