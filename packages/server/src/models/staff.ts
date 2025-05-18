import { Role } from "./role";

export interface Staff {
    user_id: number;
    name: string;
    first_name?: string;
    last_name?: number;
    role?: Role;
    status?: StaffStatus;
}

interface StaffStatus {
    status_id: number;
    status: string;
}

export interface StaffShift {
    matched: boolean;
    user_id: number;
    name: string;
    shift: Shift;
}

export interface Shift {
    id: number;
    timecard_id: number;
    open: boolean;
    role: string;
    department: string;
    first_name: string;
    last_name: string;
    location_id: number;
    job_id: number;
    user_id: number;
    wage_rate: number;
    published: boolean;
    scheduled: boolean;
    labor: {
      wage_type: string;
      scheduled_hours: number;
      scheduled_overtime: number;
      scheduled_regular: number;
      scheduled_daily_overtime: number;
      scheduled_weekly_overtime: number;
      scheduled_double_overtimes: number;
      scheduled_seventh_day_overtime_15: number;
      scheduled_seventh_day_overtime_20: number;
      scheduled_unpaid_breaks_hours: number;
      scheduled_costs: number;
      scheduled_overtime_costs: number;
      scheduled_spread_of_hours: number;
      scheduled_blue_laws_hours: number;
    };
    created_at: string; // ISO 8601 timestamp
    updated_at: string;
    start_at: string;
    end_at: string;
    note: {
      text: string;
      author: string;
    };
  }
  