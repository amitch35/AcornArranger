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
var import_server = require("../utils/supabase/server");
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config({ path: [".env.local", ".env"] });
const TOKEN_SECRET = process.env.SUPABASE_JWT_SECRET || "NOT_A_SECRET";
const router = import_express.default.Router();
const supabase = import_server.supabaseClient;
router.post("/signup", (req, res) => __async(void 0, null, function* () {
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
router.post("/login", (req, res) => __async(void 0, null, function* () {
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
router.get("/user", (req, res) => __async(void 0, null, function* () {
  const token = getToken(req);
  if (token) {
    const { data: { user }, error } = yield supabase.auth.getUser(token);
    if (error) {
      res.send(error);
    } else {
      res.send(user);
    }
  } else {
    res.status(401).json({ "error": "Authorization header not present" });
  }
}));
function getToken(req) {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}
function supabaseMiddleware(req, res, next) {
  return __async(this, null, function* () {
    const token = getToken(req);
    switch (token) {
      case null:
        res.status(401).json({ "error": "Authorization header not present" }).end();
        break;
      default:
        import_jsonwebtoken.default.verify(token, TOKEN_SECRET, (error, decoded) => {
          if (error)
            res.send(error).end();
          else if (decoded)
            next();
          else
            res.status(403).end();
        });
        break;
    }
  });
}
var auth_default = router;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  supabaseMiddleware
});
