"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var appointments_exports = {};
__export(appointments_exports, {
  default: () => appointments_default
});
module.exports = __toCommonJS(appointments_exports);
var import_express = __toESM(require("express"));
var import_server = require("../utils/supabase/server");
require("dotenv").config({ path: [".env.local", ".env"] });
const router = import_express.default.Router();
const supabase = (0, import_server.supabaseClient)();
const selectAppointments = `
    appointment_id, 
    arrival_time, 
    service_time:departure_time, 
    next_arrival_time, 
    turn_around, 
    cancelled_date,
    property:rc_properties (
      properties_id,
      property_name
    ),
    staff:appointments_staff (
      user_id:staff_id,
      staff_info:rc_staff ( 
        name 
      )
    ),
    service:service_key (
      service_id,
      service_name:name
    ),
    status:appointment_status_key (
      status_id,
      status
    )
  `;
router.get("/", (req, res) => __async(void 0, null, function* () {
  const per_page = req.query.per_page || 50;
  const page = req.query.page || 0;
  const offset = per_page * page;
  let query = supabase.from("rc_appointments").select(selectAppointments);
  if (req.query.from_service_date) {
    query = query.gte("departure_time", req.query.from_service_date);
  }
  if (req.query.to_service_date) {
    query = query.lte("departure_time", `${req.query.to_service_date}  23:59:59+00`);
  }
  query = query.range(offset, offset + per_page - 1).order("departure_time", { ascending: false }).order("property_name", { referencedTable: "rc_properties", ascending: true }).order("appointment_id", { ascending: true });
  const { data, error, status } = yield query;
  res.status(status);
  if (error) {
    res.send(error);
  } else if (data) {
    res.send(data);
  } else {
    res.status(404);
    res.send();
  }
}));
router.get("/:appointment_id", (req, res) => __async(void 0, null, function* () {
  let query = supabase.from("rc_appointments").select(selectAppointments).eq("appointment_id", req.params.appointment_id).maybeSingle();
  const { data, error, status } = yield query;
  res.status(status);
  if (error) {
    res.send(error);
  } else if (data) {
    res.send(data);
  } else {
    res.status(404);
    res.send();
  }
}));
var appointments_default = router;
