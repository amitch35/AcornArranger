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
const app = (0, import_express.default)();
const port = process.env.PORT || 4e3;
const staticDir = process.env.STATIC || "public";
app.use(import_express.default.static(staticDir));
app.use(import_express.default.json());
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
app.get("/api/properties/:propertyId", (req, res) => __async(exports, null, function* () {
  const { data, error } = yield supabase.from("rc_properties").select(`
      properties_id,
      property_name,
      address:rc_addresses (
        address, city, state_name, postal_code, country
      ),
      status_id,
      estimated_cleaning_mins,
      double_unit
    `).eq("properties_id", req.params.propertyId);
  if (error) {
    res.send(error);
  }
  res.send(data);
}));
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
