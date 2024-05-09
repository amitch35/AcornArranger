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
var auth_exports = {};
__export(auth_exports, {
  default: () => auth_default
});
module.exports = __toCommonJS(auth_exports);
var import_express = __toESM(require("express"));
var import_supabase_js = require("@supabase/supabase-js");
require("dotenv").config({ path: [".env.local", ".env"] });
const router = import_express.default.Router();
const supabase = (0, import_supabase_js.createClient)(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
router.post("/signup", (req, res) => __async(void 0, null, function* () {
  const { data, error } = yield supabase.auth.signUp(
    {
      email: req.body.email,
      password: req.body.password,
      options: {
        data: {
          display_name: req.body.first_name + " " + req.body.last_name,
          first_name: req.body.first_name,
          last_name: req.body.last_name
        },
        emailRedirectTo: "/"
      }
    }
  );
  if (error) {
    res.send(error);
  } else {
    res.send(data);
  }
}));
router.post("/login", (req, res) => __async(void 0, null, function* () {
  const supabase_login_client = (0, import_supabase_js.createClient)(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  const { data, error } = yield supabase_login_client.auth.signInWithPassword(
    {
      email: req.body.email,
      password: req.body.password
    }
  );
  if (error) {
    res.send(error);
  } else {
    res.send(data);
  }
}));
router.post("/logout", (req, res) => __async(void 0, null, function* () {
  const { error } = yield supabase.auth.signOut();
  if (error) {
    res.send(error);
  } else {
    res.send();
  }
}));
router.get("/user", (req, res) => __async(void 0, null, function* () {
  const { data: { user }, error } = yield supabase.auth.getUser();
  if (error) {
    res.send(error);
  } else {
    res.send(user);
  }
}));
router.put("/user", (req, res) => __async(void 0, null, function* () {
  const { data, error } = yield supabase.auth.updateUser({
    data: {
      display_name: req.body.first_name + " " + req.body.last_name,
      first_name: req.body.first_name,
      last_name: req.body.last_name
    }
  });
  if (error) {
    res.send(error);
  } else {
    res.send(data);
  }
}));
var auth_default = router;
