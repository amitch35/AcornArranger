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
var client_d_exports = {};
__export(client_d_exports, {
  createClient: () => createClient
});
module.exports = __toCommonJS(client_d_exports);
var import_ssr = require("@supabase/ssr");
const createClient = () => (0, import_ssr.createBrowserClient)(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createClient
});
