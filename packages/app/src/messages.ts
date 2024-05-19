import { Property, Role } from "server/models";

export type Msg =
  | ["properties/save", { properties_id: number; property: Property; }]
  | ["properties/select", { properties_id: number; }]
  | ["properties/", { }]
  | ["roles/save", { role_id: number; role: Role; }]
  | ["roles/select", { role_id: number; }]
  | ["roles/", { }]
  | ["appointments/select", { appointment_id: number; }]
  | ["appointments/", { from_service_date: string; to_service_date: string; per_page?: number; page?: number; }]
  | ["plans/select", { plan_id: number; }]
  | ["plans/", { from_plan_date: string; to_plan_date: string; per_page?: number; page?: number; }]
  | ["staff/select", { user_id: number; }]
  | ["staff/", { }];