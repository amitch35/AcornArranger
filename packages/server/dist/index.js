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
var import_server = require("./utils/supabase/server");
var import_properties = __toESM(require("./routes/properties"));
var import_staff = __toESM(require("./routes/staff"));
var import_roles = __toESM(require("./routes/roles"));
var import_appointments = __toESM(require("./routes/appointments"));
var import_plans = __toESM(require("./routes/plans"));
var import_auth = __toESM(require("./routes/auth"));
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
const supabase = (0, import_server.supabaseClient)();
app.use("/auth", import_auth.default);
app.use("/api/properties", import_properties.default);
app.use("/api/staff", import_staff.default);
app.use("/api/roles", import_roles.default);
app.use("/api/appointments", import_appointments.default);
app.use("/api/plans", import_plans.default);
app.get("/api/user-session", (req, res) => __async(exports, null, function* () {
  const { data, error } = yield supabase.auth.getSession();
  if (error) {
    res.send(error);
  } else {
    res.send(data);
  }
}));
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
