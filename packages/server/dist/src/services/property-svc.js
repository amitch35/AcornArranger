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
var property_svc_exports = {};
__export(property_svc_exports, {
  default: () => property_svc_default,
  get: () => get
});
module.exports = __toCommonJS(property_svc_exports);
let properties = [
  {
    properties_id: 117138,
    property_name: "A Relaxing Place",
    address: "### Hangtree Ln.\nOakhurst, California 93644\nUSA",
    status_id: 1,
    status: "Active",
    estimated_cleaning_mins: 240
  },
  {
    properties_id: 128046,
    property_name: "Blue Door",
    address: "### W Sugar Pine Dr.\nOakhurst, California 93644\nUSA",
    status_id: 1,
    status: "Active",
    estimated_cleaning_mins: 120
  },
  {
    properties_id: 119634,
    property_name: "Old Yosemite Rd",
    address: "### Old Yosemite Rd.\nOakhurst, California 93644\nUSA",
    status_id: 1,
    status: "Active",
    estimated_cleaning_mins: 480
  }
];
function get(id) {
  return properties.find((t) => t.properties_id === id);
}
var property_svc_default = { get };
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  get
});
