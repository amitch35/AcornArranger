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
  default: () => auth_default,
  supabaseMiddleware: () => supabaseMiddleware
});
module.exports = __toCommonJS(auth_exports);
var import_express = __toESM(require("express"));
var import_client = require("../utils/supabase/client");
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config({ path: [".env.local", ".env"] });
const router = import_express.default.Router();
const supabase = import_client.supabaseClient;
router.post("/signup", (req, res) => __async(null, null, function* () {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ "error": "Bad request: Invalid input data. Make sure you provide an email and password" });
  } else {
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
  }
}));
router.post("/login", (req, res) => __async(null, null, function* () {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ "error": "Bad request: Invalid input data. Make sure you provide an email and password" });
  } else {
    const { data, error } = yield supabase.auth.signInWithPassword(
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
  }
}));
router.get("/user", (req, res) => __async(null, null, function* () {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ "error": "Authorization header not present" });
  }
  try {
    const { data, error } = yield supabase.auth.getClaims(token);
    if (error || !(data == null ? void 0 : data.claims)) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    return res.send(data.claims);
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ error: "Token verification failed" });
  }
}));
function getToken(req) {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}
function supabaseMiddleware(req, res, next) {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ error: "Authorization header not present" }).end();
  }
  supabase.auth.getClaims(token).then(({ data, error }) => {
    if (error || !(data == null ? void 0 : data.claims)) {
      return res.status(401).json({ error: "Invalid or expired token" }).end();
    }
    if (data.claims.user_role === "authorized_user") {
      return next();
    } else {
      return res.status(403).json({
        error: "User not Authorized, contact administrator for authorization"
      }).end();
    }
  }).catch((err) => {
    console.error("Token verification error:", err);
    return res.status(401).json({ error: "Token verification failed" }).end();
  });
}
var auth_default = router;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  supabaseMiddleware
});
