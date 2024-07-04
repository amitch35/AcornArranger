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
var server_exports = {};
__export(server_exports, {
  supabaseClient: () => supabaseClient
});
module.exports = __toCommonJS(server_exports);
var import_supabase_js = require("@supabase/supabase-js");
var import_dotenv = __toESM(require("dotenv"));
var import_nodemailer = __toESM(require("nodemailer"));
import_dotenv.default.config({ path: [".env.local", ".env"] });
const supabase = (0, import_supabase_js.createClient)(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);
supabase.auth.signInWithPassword(
  {
    email: process.env.SUPABASE_SERVER_ACCT_EMAIL,
    password: process.env.SUPABASE_SERVER_ACCT_PSWD
  }
);
function sendErrorEmail(errorLog, retryCount = 3) {
  return __async(this, null, function* () {
    var transporter = import_nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USR,
        pass: process.env.SMTP_PSWD
      }
    });
    const mailOptions = {
      from: `"AcornArranger" <${process.env.SMTP_EMAIL}>`,
      to: `${process.env.DEV_EMAIL}`,
      subject: `Error in function: ${errorLog.function_name}`,
      html: `<p>An error occurred in function <strong>${errorLog.function_name}</strong>:</p><p>${errorLog.error_message}</p>`
    };
    try {
      yield transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      if (retryCount > 0) {
        console.log(`Retrying... Attempts left: ${retryCount}`);
        yield new Promise((resolve) => setTimeout(resolve, 5e3));
        return sendErrorEmail(errorLog, retryCount - 1);
      }
    }
  });
}
;
function handleErrorLogInserts(payload) {
  return __async(this, null, function* () {
    const { new: errorLog } = payload;
    if (errorLog.function_name !== "build_schedule_plan") {
      yield sendErrorEmail(errorLog);
    }
  });
}
supabase.channel("error_log").on("postgres_changes", { event: "INSERT", schema: "public", table: "error_log" }, handleErrorLogInserts).subscribe();
const supabaseClient = supabase;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  supabaseClient
});
