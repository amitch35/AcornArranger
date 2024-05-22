import { define, Events, Rest } from "@calpoly/mustang";
import { html, LitElement } from "lit";

define({ "restful-form": Rest.FormElement });

export class SignupFormElement extends LitElement {
  render() {
    return html`
      <restful-form new src="/auth/signup">
        <slot></slot>
      </restful-form>
    `;
  }

  constructor() {
    super();

    this.addEventListener(
      "mu-rest-form:created",
      (event: Event) => {
        const detail = (event as CustomEvent).detail;
        const { token } = { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxa2NneGZhcWhwcXJ5dGNpeHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAyNzU3ODQsImV4cCI6MjAyNTg1MTc4NH0.f2OUbu37RF-NMV1iSj16rBOgmcarmjnntUMNGLZm7Xc" };
        const redirect = "/";
        console.log("Signup successful", detail, redirect);

        Events.relay(event, "auth:message", [
          "auth/signin",
          { token, redirect }
        ]);
      }
    );
  }
}