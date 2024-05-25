import { Property, Role, PlanBuildOptions } from "server/models";

export type Msg =
  | ["properties/save", { properties_id: number; property: Property; }]
  | ["properties/select", { properties_id: number; }]
  | ["properties/", { filter_status_ids?: Array<number> }]
  | ["roles/save", { role_id: number; role: Role; }]
  | ["roles/select", { role_id: number; }]
  | ["roles/", { }]
  | ["appointments/select", { appointment_id: number; }]
  | ["appointments/", { from_service_date: string; to_service_date: string; per_page?: number; page?: number; filter_status_ids?: Array<number>; }]
  | ["plans/select", { plan_id: number; }]
  | ["plans/", { from_plan_date: string; to_plan_date?: string; per_page?: number; page?: number; }]
  | ["plans/staff/add", { plan_id: number; user_id: number; }]
  | ["plans/staff/remove", { plan_id: number; user_id: number; }]
  | ["plans/appointment/add", { plan_id: number; appointment_id: number; }]
  | ["plans/appointment/remove", { plan_id: number; appointment_id: number; }]
  | ["plans/build", { plan_date: string; build_options: PlanBuildOptions; }]
  | ["plans/send", { plan_date: string; }]
  | ["plans/add", { plan_date: string; }]
  | ["staff/select", { user_id: number; }]
  | ["staff/", { filter_status_ids?: Array<number> }]
  | ["services/", { }];