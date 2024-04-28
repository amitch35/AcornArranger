"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var import_ssr = require("@supabase/ssr");
exports.createClient = (context) => {
  return (0, import_ssr.createServerClient)(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => {
        var _a;
        const cookies = context.req.cookies;
        const cookie = (_a = cookies[key]) != null ? _a : "";
        return decodeURIComponent(cookie);
      },
      set: (key, value, options) => {
        if (!context.res)
          return;
        context.res.cookie(key, encodeURIComponent(value), __spreadProps(__spreadValues({}, options), {
          sameSite: "Lax",
          httpOnly: true
        }));
      },
      remove: (key, options) => {
        if (!context.res)
          return;
        context.res.cookie(key, "", __spreadProps(__spreadValues({}, options), { httpOnly: true }));
      }
    }
  });
};
