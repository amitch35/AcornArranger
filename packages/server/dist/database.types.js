"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var database_types_exports = {};
__export(database_types_exports, {
  Constants: () => Constants
});
module.exports = __toCommonJS(database_types_exports);
const Constants = {
  public: {
    Enums: {
      app_permission: [
        "rc_addresses.select",
        "rc_appointments.select",
        "rc_properties.select",
        "rc_properties.update",
        "rc_staff.select",
        "rc_tokens.select",
        "roles.select",
        "roles.update",
        "schedule_plans.select",
        "schedule_plans.update",
        "schedule_plans.insert",
        "plan_appointments.select",
        "plan_appointments.update",
        "plan_appointments.insert",
        "plan_staff.select",
        "plan_staff.update",
        "plan_staff.insert",
        "service_key.select",
        "appointment_status_key.select",
        "property_status_key.select",
        "staff_status_key.select",
        "appointments_staff.select",
        "error_log.select",
        "error_log.insert",
        "http_response.select",
        "http_response.insert",
        "travel_times.select",
        "send_schedule_job_queue.insert"
      ],
      app_role: ["authenticated", "authorized_user"]
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Constants
});
