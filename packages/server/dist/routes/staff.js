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
var staff_exports = {};
__export(staff_exports, {
  default: () => staff_default
});
module.exports = __toCommonJS(staff_exports);
var import_express = __toESM(require("express"));
var import_server = require("../utils/supabase/server");
const router = import_express.default.Router();
const supabase = import_server.supabaseClient;
const selectStaffBasic = `
    user_id,
    name,
    first_name,
    last_name,
    role:roles (
      role_id:id, 
      title
    ),
    status:staff_status_key (
      status_id,
      status
    )
  `;
const selectStaffFull = `
    user_id,
    name,
    first_name,
    last_name,
    role:roles (
      role_id:id, 
      title, 
      description, 
      priority, 
      can_lead_team, 
      can_clean
    ),
    status:staff_status_key (
      status_id,
      status
    )
  `;
router.get("/", (req, res) => __async(void 0, null, function* () {
  var filter_status_ids = [1, 2, 3];
  if (req.query.filter_status_id) {
    const filterStatusIdsStringArray = Array.isArray(req.query.filter_status_id) ? req.query.filter_status_id : [req.query.filter_status_id];
    filter_status_ids = filterStatusIdsStringArray.map((id) => Number(id)).filter((id) => !isNaN(id));
  }
  const { data, error, status } = yield supabase.from("rc_staff").select(selectStaffBasic).in("status_id", filter_status_ids).order("status_id", { ascending: true }).order("name", { ascending: true });
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
router.get("/:user_id", (req, res) => __async(void 0, null, function* () {
  const { data, error, status } = yield supabase.from("rc_staff").select(selectStaffFull).eq("user_id", req.params.user_id).maybeSingle();
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
var staff_default = router;
