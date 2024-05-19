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
var plans_exports = {};
__export(plans_exports, {
  default: () => plans_default
});
module.exports = __toCommonJS(plans_exports);
var import_express = __toESM(require("express"));
var import_server = require("../utils/supabase/server");
const router = import_express.default.Router();
const supabase = import_server.supabaseClient;
const selectPlans = `
    plan_id:id,
    plan_date,
    team,
    appointments:plan_appointments (
      appointment_id,
      sent_to_rc,
      appointment_info:rc_appointments (
        appointment_id,
        arrival_time, 
        service_time:departure_time, 
        next_arrival_time, 
        turn_around, 
        cancelled_date,
        property_info:rc_properties (
          properties_id,
          property_name
        ),
        service:service_key (
          service_id,
          service_name:name
        ),
        status:appointment_status_key (
          status_id,
          status
        )
      )
    ),
    staff:plan_staff (
      user_id:staff_id,
      staff_info:rc_staff (
        user_id, 
        name 
      )
    )
  `;
router.get("/", (req, res) => __async(void 0, null, function* () {
  const per_page = req.query.per_page || 20;
  const page = req.query.page || 0;
  const offset = per_page * page;
  let query = supabase.from("schedule_plans").select(selectPlans).eq("valid", true).filter("plan_appointments.valid", "eq", true).filter("plan_staff.valid", "eq", true);
  if (req.query.from_plan_date) {
    query = query.gte("plan_date", req.query.from_plan_date);
  }
  if (req.query.to_plan_date) {
    query = query.lte("plan_date", req.query.to_plan_date);
  }
  query = query.range(offset, offset + per_page - 1).order("plan_date", { ascending: false }).order("team", { ascending: true });
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
router.get("/:plan_id", (req, res) => __async(void 0, null, function* () {
  let query = supabase.from("schedule_plans").select(selectPlans).eq("valid", true).filter("plan_appointments.valid", "eq", true).filter("plan_staff.valid", "eq", true).eq("id", req.params.plan_id).maybeSingle();
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
router.post("/:plan_id/staff/:user_id", (req, res) => __async(void 0, null, function* () {
  const { data, error, status } = yield supabase.rpc(
    "plan_add_staff",
    {
      staff_to_add: req.params.user_id,
      target_plan: req.params.plan_id
    }
  );
  res.status(status);
  if (error) {
    res.send(error);
  } else {
    res.send(data);
  }
}));
router.delete("/:plan_id/staff/:user_id", (req, res) => __async(void 0, null, function* () {
  const { data, error, status } = yield supabase.rpc(
    "plan_remove_staff",
    {
      staff_to_remove: req.params.user_id,
      target_plan: req.params.plan_id
    }
  );
  res.status(status);
  if (error) {
    res.send(error);
  } else {
    res.send(data);
  }
}));
router.post("/:plan_id/appointment/:appointment_id", (req, res) => __async(void 0, null, function* () {
  const { data, error, status } = yield supabase.rpc(
    "plan_add_appointment",
    {
      appointment_to_add: req.params.user_id,
      target_plan: req.params.plan_id
    }
  );
  res.status(status);
  if (error) {
    res.send(error);
  } else {
    res.send(data);
  }
}));
router.delete("/:plan_id/appointment/:appointment_id", (req, res) => __async(void 0, null, function* () {
  const { data, error, status } = yield supabase.rpc(
    "plan_remove_appointment",
    {
      appointment_to_remove: req.params.user_id,
      target_plan: req.params.plan_id
    }
  );
  res.status(status);
  if (error) {
    res.send(error);
  } else {
    res.send(data);
  }
}));
router.post("/build/:plan_date", (req, res) => __async(void 0, null, function* () {
  const { data, error, status } = yield supabase.rpc(
    "build_schedule_plan",
    {
      date_to_schedule: req.params.plan_date,
      available_staff: req.body.available_staff,
      office_location: req.body.office_location || `0101000020E6100000D2DB44D213E95DC01D12088552AC4240`,
      services: req.body.services || [21942, 23044],
      omissions: req.body.omissions || null,
      routing_type: req.body.routing_type,
      cleaning_window: req.body.cleaning_window,
      max_hours: req.body.max_hours,
      target_staff_count: req.body.target_staff_count
    }
  );
  res.status(status);
  if (error) {
    res.send(error);
  } else {
    res.send(data);
  }
}));
router.post("/send/:plan_date", (req, res) => __async(void 0, null, function* () {
  const { data, error, status } = yield supabase.rpc(
    "send_rc_schedule_plans",
    {
      schedule_date: req.params.plan_date
    }
  );
  res.status(status);
  if (error) {
    res.send(error);
  } else {
    res.send(data);
  }
}));
var plans_default = router;
