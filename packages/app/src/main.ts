import { Auth, History, Store, Switch, define, Rest } from "@calpoly/mustang";
import { html } from "lit";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { SidebarElement } from "./components/side-bar";
import { LoginFormElement } from "./components/login-form";
import { SignupFormElement } from "./components/signup-form";
import { LandingViewElement } from "./views/landing-view";
import { StaffViewElement } from "./views/staff-view";
import { AppointmentsViewElement } from "./views/appointments-view";
import { RolesViewElement } from "./views/roles-view";
import { PropertiesViewElement } from "./views/properties-view";
import { PlansViewElement } from "./views/plans-view";
import { PropertyViewElement } from "./views/property-view";

const routes = [
  {
    path: "/app/appointments",
    view: () => html`
      <appointments-view></appointments-view>
    `
  },
  {
    path: "/app/staff",
    view: () => html`
      <staff-view></staff-view>
    `
  },
  {
    path: "/app/roles",
    view: () => html`
      <roles-view></roles-view>
    `
  },
  {
    path: "/app/properties",
    view: () => html`
      <properties-view></properties-view>
    `
  },
  {
    path: "/app/property/:id/edit",
    view: (params: Switch.Params) => html`
      <property-view edit properties-id=${params.id}></property-view>
    `
  },
  {
    path: "/app/property/:id",
    view: (params: Switch.Params) => html`
      <property-view properties-id=${params.id}></property-view>
    `
  },
  {
    path: "/app/schedule",
    view: () => html`
      <plans-view></plans-view>
    `
  },
  {
    path: "/app",
    view: () => html`
      <landing-view></landing-view>
    `
  },
  {
    path: "/",
    redirect: "/app"
  }
];

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
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "acorn:history");
    }
  },
  "side-bar": SidebarElement,
  "login-form": LoginFormElement,
  "signup-form": SignupFormElement,
  "restful-form": Rest.FormElement,
  "landing-view": LandingViewElement,
  "staff-view": StaffViewElement,
  "appointments-view": AppointmentsViewElement,
  "roles-view": RolesViewElement,
  "properties-view": PropertiesViewElement,
  "plans-view": PlansViewElement,
  "property-view": PropertyViewElement
});