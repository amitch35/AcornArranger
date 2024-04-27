import { Property } from "../models/property";

// in-memory DB
let properties: Array<Property> = [
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
  },
];

export function get(id: number): Property | undefined {
  return properties.find((t) => t.properties_id === id);
}

export default { get };