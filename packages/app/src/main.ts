import { Auth, Store, define, Rest } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { SidebarElement } from "./components/side-bar";
import { LoginFormElement } from "./components/login-form";
import { StaffViewElement } from "./views/staff-view";

define({
  "mu-auth": Auth.Provider,
  "mu-store": class AppStore extends Store.Provider<
    Model,
    Msg
  > {
    constructor() {
      super(update, init, "acorn:auth");
    }
  },
  "side-bar": SidebarElement,
  "login-form": LoginFormElement,
  "restful-form": Rest.FormElement,
  "staff-view": StaffViewElement
});

// document.body.addEventListener(
//     "dark-mode:toggle",
//     (event) => {
//         const page = event.currentTarget;
//         page.classList.toggle("dark-mode");
//     }
// );