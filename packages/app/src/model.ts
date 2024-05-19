import { Property, Role, Staff, Appointment, Plan } from "server/models";

export interface Model {
  role?: Role;
  roles?: Array<Role>;
  property?: Property;
  properties?: Array<Property>;
  single_staff?: Staff;
  staff?: Array<Staff>;
  appointment?: Appointment;
  appointments?: Array<Appointment>;
  plan?: Plan;
  plans?: Array<Plan>;
}

export const init: Model = {};