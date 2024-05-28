import { Property, Role, Staff, Appointment, Plan, Service, ErrorResponse } from "server/models";

export interface Model {
  role?: Role;
  roles?: Array<Role>;
  property?: Property;
  properties?: Array<Property>;
  staff_member?: Staff;
  staff?: Array<Staff>;
  appointment?: Appointment;
  appointments?: Array<Appointment>;
  plan?: Plan;
  plans?: Array<Plan>;
  services?: Array<Service>;
  build_error?: ErrorResponse;
  available?: Array<number>;
  omissions?: Array<number>;
}

export const init: Model = {};