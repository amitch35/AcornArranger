"use strict";
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
var import_supabase_js = require("@supabase/supabase-js");
function getToken(req) {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}
const supabase_middleware = (req, res) => __async(exports, null, function* () {
  const supabase = (0, import_supabase_js.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {});
  const JWT = getToken(req);
  switch (JWT) {
    case null:
      res.status(401).json({ "error": "no JWT parsed" });
      break;
    default:
      const { data: { user }, error } = yield supabase.auth.getUser(JWT);
      if (error) {
        res.status(401).json(error);
      } else {
        yield supabase.auth.setAuth(JWT);
        return { user, supabase };
      }
      break;
  }
});
