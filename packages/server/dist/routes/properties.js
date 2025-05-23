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
var properties_exports = {};
__export(properties_exports, {
  default: () => properties_default
});
module.exports = __toCommonJS(properties_exports);
var import_express = __toESM(require("express"));
var import_server = require("../utils/supabase/server");
const router = import_express.default.Router();
const supabase = import_server.supabaseClient;
const selectProperties = `
properties_id,
property_name,
estimated_cleaning_mins,
double_unit,
address:rc_addresses (
  address, 
  city, 
  state_name, 
  postal_code, 
  country
),
status:property_status_key (
  status_id,
  status
)
`;
router.get("/", (req, res) => __async(null, null, function* () {
  var filter_status_ids = [1];
  if (req.query.filter_status_id) {
    const filterStatusIdsStringArray = Array.isArray(req.query.filter_status_id) ? req.query.filter_status_id : [req.query.filter_status_id];
    filter_status_ids = filterStatusIdsStringArray.map((id) => Number(id)).filter((id) => !isNaN(id));
  }
  const { data, error, status } = yield supabase.from("rc_properties").select(selectProperties).in("status_id", filter_status_ids).order("status_id", { ascending: true }).order("property_name", { ascending: true });
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
router.get("/:property_id", (req, res) => __async(null, null, function* () {
  const { data, error, status } = yield supabase.from("rc_properties").select(selectProperties).eq("properties_id", req.params.property_id).maybeSingle();
  res.status(status);
  if (error) {
    res.send(error);
  } else if (data) {
    if (!data.double_unit) {
      data.double_unit = [];
    }
    res.send(data);
  } else {
    res.status(404);
    res.send();
  }
}));
router.put("/:property_id", (req, res) => __async(null, null, function* () {
  if (req.body.estimated_cleaning_mins === void 0 && req.body.double_unit === void 0) {
    res.status(400).json({ Error: "Bad Request, must provide estimated_cleaning_mins and/or double_unit " });
  }
  let { error, status } = yield supabase.from("rc_properties").update({
    estimated_cleaning_mins: req.body.estimated_cleaning_mins,
    double_unit: req.body.double_unit && req.body.double_unit[0] && req.body.double_unit.length > 0 ? req.body.double_unit : null
  }).eq("properties_id", req.params.property_id);
  if (error) {
    res.status(status);
    res.send(error);
  } else {
    let { data, error: error2, status: status2 } = yield supabase.from("rc_properties").select(selectProperties).eq("properties_id", req.params.property_id).maybeSingle();
    res.status(status2);
    if (error2) {
      res.send(error2);
    } else if (data) {
      res.send(data);
    } else {
      res.status(404);
      res.send();
    }
  }
}));
var properties_default = router;
