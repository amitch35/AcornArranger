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
        <div>
        <button @click=${this.show}>
            <box-icon name='error-alt' color="var(--text-color-body)" size="var(--text-font-size-large)"></box-icon>
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
        `
    ];
}