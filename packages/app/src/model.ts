import { Property, Role, Staff, Appointment, Plan, Service, ErrorResponse, StaffShift } from "server/models";

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
  unscheduled?: Array<Appointment>;
  shifts?: Array<StaffShift>;
}

export const init: Model = {};