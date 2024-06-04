import { LitElement, css, html, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { ErrorResponse } from "server/models";
import reset from "../css/reset";
import page from "../css/page";
import 'boxicons';


export class BuildErrorDialog extends LitElement {

    @property({ attribute: false })
    error?: ErrorResponse;

    @property()
    code?: string;

    attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string
      ) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (
          name === "code" &&
          oldValue !== newValue &&
          newValue
        ) {
            if (newValue.split(':')[0] === "no-error") {
                this.requestPlanUpdate();
            } else {
                this.show();
            }
            
        }
      }

    requestPlanUpdate() {
        const noErrorEvent = new CustomEvent(
          "build-error-dialog:no-error",
          {
            bubbles: true,
            composed: true,
            detail: { }
          }
        );
    
        this.dispatchEvent(noErrorEvent);
    }

    closeDialog() {
        const dialog = this.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
        dialog.close();
    }

    show() {
        const dialog = this.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
        dialog.show();
    }    

    render(): TemplateResult {
    const renderErrorButton = (error: ErrorResponse | undefined) => {
        if (error) {
            return html`
                <button @click=${this.show}>
                    <box-icon name='error-alt' type='solid' color="var(--accent-color-red)" size="var(--text-font-size-large)"></box-icon>
                </button>
            `
        } else {
            return html`
                <button @click=${this.show} disabled>
                    <box-icon name='error-alt' color="var(--text-color-body)" size="var(--text-font-size-large)"></box-icon>
                </button>
            `
        }
    }

    const renderError = (error: ErrorResponse | undefined) => {
        if (error) {
            return html`
                <div class="spread-apart">
                    <h6>Code: ${error.code}</h6>
                    <button @click=${this.closeDialog} class="close">
                        <box-icon name='x' color="var(--text-color-body)" ></box-icon>
                    </button>
                </div>
                <p>Error: ${error.details}</p>
                <P>Message: ${error.message}</P>
                <p>Hint: ${error.hint}</p>
            `;
        } else return html``;
        
    };

    return html`
        <div>
            ${renderErrorButton(this.error)}
        </div>
        <dialog class="error">
            <div class="dialog-content">
                ${renderError(this.error)}
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

            dialog.error {
                background-color: var(--background-color-red);
                border: 3px solid var(--accent-color-red);
                top: 15%;
                left: 50%;
                -webkit-transform: translateX(-50%) translateY(-50%);
                -moz-transform: translateX(-50%) translateY(-50%);
                -ms-transform: translateX(-50%) translateY(-50%);
                transform: translateX(-50%) translateY(-50%);
            }

            .close {
                padding: 0;
                background-color: var(--accent-color-red);
            }

            .close:hover {
                background-color: var(--accent-color-red);
            }

            h6, p {
                color: var(--accent-color-red);
            }

        `
    ];
}