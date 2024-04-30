"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_express = __toESM(require("express"));
var import_supabase_js = require("@supabase/supabase-js");
require("dotenv").config({ path: [".env.local", ".env"] });
const { queryParser } = require("express-query-parser");
const app = (0, import_express.default)();
const port = process.env.PORT || 4e3;
const staticDir = process.env.STATIC || "public";
app.use(import_express.default.static(staticDir));
app.use(import_express.default.json());
app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true
  })
);
const supabase = (0, import_supabase_js.createClient)(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
app.get("/api/properties", (req, res) => __async(exports, null, function* () {
  const { data, error } = yield supabase.from("rc_properties").select(`
      properties_id,
      property_name,
      address:rc_addresses (
        address, city, state_name, postal_code, country
      ),
      status_id,
      estimated_cleaning_mins,
      double_unit
    `);
  if (error) {
    res.send(error);
  }
  res.send(data);
}));
app.get("/api/properties/:property_id", (req, res) => __async(exports, null, function* () {
  const { data, error } = yield supabase.from("rc_properties").select(`
      properties_id,
      property_name,
      address:rc_addresses (
        address, 
        city, 
        state_name, 
        postal_code, 
        country
      ),
      status_id,
      estimated_cleaning_mins,
      double_unit
    `).eq("properties_id", req.params.property_id);
  if (error) {
    res.send(error);
  }
  res.send(data);
}));
app.get("/api/staff", (req, res) => __async(exports, null, function* () {
  const { data, error } = yield supabase.from("rc_staff").select(`
      user_id,
      name,
      role:roles (
        role_id:id, 
        title
      ),
      status_id,
      first_name,
      last_name
    `);
  if (error) {
    res.send(error);
  }
  res.send(data);
}));
app.get("/api/staff/:user_id", (req, res) => __async(exports, null, function* () {
  const { data, error } = yield supabase.from("rc_staff").select(`
      user_id,
      name,
      role:roles (
        role_id:id, 
        title, 
        description, 
        priority, 
        can_lead_team, 
        can_clean
      ),
      status_id,
      first_name,
      last_name
    `).eq("user_id", req.params.user_id);
  if (error) {
    res.send(error);
  }
  res.send(data);
}));
app.get("/api/roles", (req, res) => __async(exports, null, function* () {
  const { data, error } = yield supabase.from("roles").select(`
      role_id:id, 
      title, 
      description, 
      priority, 
      can_lead_team, 
      can_clean
    `);
  if (error) {
    res.send(error);
  }
  res.send(data);
}));
app.get("/api/roles/:role_id", (req, res) => __async(exports, null, function* () {
  const { data, error } = yield supabase.from("roles").select(`
      role_id:id, 
      title, 
      description, 
      priority, 
      can_lead_team, 
      can_clean
    `).eq("id", req.params.role_id);
  if (error) {
    res.send(error);
  }
  res.send(data);
}));
app.put("/api/roles/:role_id", (req, res) => __async(exports, null, function* () {
  const { error } = yield supabase.from("roles").update({
    priority: 4,
    title: "",
    description: "",
    can_lead_team: false,
    can_clean: false
  }).eq("id", req.params.role_id);
  if (error) {
    res.send(error);
  }
}));
app.get("/api/appointments", (req, res) => __async(exports, null, function* () {
  const per_page = req.query.per_page || 50;
  const page = req.query.page || 0;
  const offset = per_page * page;
  let query = supabase.from("rc_appointments").select(`
    appointment_id, 
    arrival_time, 
    service_time:departure_time, 
    next_arrival_time, 
    turn_around, 
    app_status_id,
    cancelled_date,
    service,
    property:rc_properties (
      properties_id,
      property_name
    ),
    staff:appointments_staff (
      user_id:staff_id,
      staff_info:rc_staff ( 
        name 
      )
    )
  `);
  if (req.query.from_service_date) {
    query = query.gte("departure_time", req.query.from_service_date);
  }
  if (req.query.to_service_date) {
    query = query.lte("departure_time", `${req.query.to_service_date}  23:59:59+00`);
  }
  query = query.range(offset, offset + per_page - 1).order("departure_time", { ascending: false }).order("property_name", { referencedTable: "rc_properties", ascending: true }).order("appointment_id", { ascending: true });
  const { data, error } = yield query;
  if (error) {
    res.send(error);
  }
  res.send(data);
}));
app.get("/api/appointments/:appointment_id", (req, res) => __async(exports, null, function* () {
  let query = supabase.from("rc_appointments").select(`
    appointment_id, 
    arrival_time, 
    service_time:departure_time, 
    next_arrival_time, 
    turn_around, 
    app_status_id,
    cancelled_date,
    service,
    property:rc_properties (
      properties_id,
      property_name
    ),
    staff:appointments_staff (
      user_id:staff_id,
      staff_info:rc_staff ( 
        name 
      )
    )
  `).eq("appointment_id", req.params.appointment_id);
  const { data, error } = yield query;
  if (error) {
    res.send(error);
  }
  res.send(data);
}));
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
