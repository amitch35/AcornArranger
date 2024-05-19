import { Appointment } from "./appointment";
import { Staff } from "./staff";


export interface Plan {
    plan_id: number;
    plan_date: string;
    team: number;
    appointments: Array<PlanAppointment>;
    staff: Array<PlanStaff>;
}

export interface PlanBuildOptions {
    available_staff: Array<number>;
    office_location?: string;
    services?: Array<number>;
    omissions?: Array<number>;
    routing_type?: number;
    cleaning_window?: number;
    max_hours?: number;
    target_staff_count?: number;
}

interface PlanAppointment {
    appointment_id: number;
    sent_to_rc: string;
    appointment_info: Appointment;
}

interface PlanStaff {
    user_id: number;
    staff_info: Staff;
}