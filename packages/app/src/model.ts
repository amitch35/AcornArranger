import { Property, Role } from "server/models";

export interface Model {
  role?: Role;
  property?: Property;
}

export const init: Model = {};