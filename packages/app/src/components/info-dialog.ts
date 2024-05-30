import { LitElement, css, html, TemplateResult } from "lit";
import reset from "../css/reset";
import page from "../css/page";
import 'boxicons';
import { property } from "lit/decorators.js";


export class InfoDialog extends LitElement {

    @property()
    name?: string;

    closeDialog() {
        const dialog = this.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
        dialog.close();
    }

    show() {
        console.log("Showing Info ***")
        const dialog = this.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
        dialog.show();
    }    

    render(): TemplateResult {

    return html`
        <div>
            <button @click=${this.show}>
                <box-icon name='info-circle' color="var(--text-color-body)" size="var(--text-font-size-body)"></box-icon>
            </button>
        </div>
        <dialog class="info">
            <div class="spread-apart info-header">
                    <h6>Info: ${this.name}</h6>
                    <button @click=${this.closeDialog} class="close">
                        <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                    </button>
            </div>
            <div class="dialog-content">
                <slot><p>Information Goes Here</p></slot>
            </div>
        </dialog>
    `;
    }

    static styles = [
        reset,
        page,
        css`
            .info-header {
                gap: var(--spacing-size-large);
                margin-bottom: var(--spacing-size-medium);
            }

            dialog.info {
                top: 85%;
                left: 50%;
                -webkit-transform: translateX(-50%) translateY(-50%);
                -moz-transform: translateX(-50%) translateY(-50%);
                -ms-transform: translateX(-50%) translateY(-50%);
                transform: translateX(-50%) translateY(-50%);
                max-width: calc(var(--spacing-size-large) * 25);
            }

            .dialog-content {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: space-evenly;
                width: 100%;
                gap: var(--spacing-size-medium);
            }

            button {
                padding: 0;
            }

            .close {
                padding: 0;
            }

            p {
                color: var(--accent-color-red);
            }

        `
    ];
}