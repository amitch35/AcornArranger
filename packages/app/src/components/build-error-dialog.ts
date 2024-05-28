import { LitElement, css, html, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { ErrorResponse } from "server/models";
import reset from "../css/reset";
import page from "../css/page";


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
    const renderError = (error: ErrorResponse | undefined) => {
        if (error) {
            return html`
                <h6>Code: ${error.code}</h6>
                <p>Error: ${error.details}</p>
                <P>Message: ${error.message}</P>
                <p>Hint: ${error.hint}</p>
            `;
        } else return html``;
        
    };

    return html`
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
        <div>
        <button @click=${this.show}>
            <i class='bx bx-error-alt' ></i>
        </button>
        </div>
        <dialog>
            <div class="dialog-content">
                <button @click=${this.closeDialog}>Close</button>
                ${renderError(this.error)}
            </div>
        </dialog>
    `;
    }

    static styles = [
        reset,
        page,
        css`

            i.bx {
                font-size: var(--text-font-size-large);
            }
        `
    ];
}