import { Property } from "server/models";

export type Msg =
  | ["property/save", { properties_id: number; property: Property }]
  | ["property/select", { properties_id: number }]
  | ["role/select", { role_id: number }];