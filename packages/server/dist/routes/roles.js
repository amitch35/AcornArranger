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
var roles_exports = {};
__export(roles_exports, {
  default: () => roles_default
});
module.exports = __toCommonJS(roles_exports);
var import_express = __toESM(require("express"));
var import_server = require("../utils/supabase/server");
const router = import_express.default.Router();
const supabase = import_server.supabaseClient;
const selectRoles = `
    role_id:id, 
    title, 
    description, 
    priority, 
    can_lead_team, 
    can_clean
  `;
router.get("/", (req, res) => __async(void 0, null, function* () {
  const { data, error, status } = yield supabase.from("roles").select(selectRoles).order("priority", { ascending: true });
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
router.get("/:role_id", (req, res) => __async(void 0, null, function* () {
  const { data, error, status } = yield supabase.from("roles").select(selectRoles).eq("id", req.params.role_id).maybeSingle();
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
router.put("/:role_id", (req, res) => __async(void 0, null, function* () {
  let { error, status } = yield supabase.from("roles").update({
    description: req.body.description,
    priority: req.body.priority,
    can_lead_team: req.body.can_lead_team,
    can_clean: req.body.can_clean
  }).eq("id", req.params.role_id);
  if (error) {
    res.status(status);
    res.send(error);
  } else {
    let { data, error: error2, status: status2 } = yield supabase.from("roles").select(selectRoles).eq("id", req.params.role_id).maybeSingle();
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
var roles_default = router;
