import { Property } from "./property";
import { Staff } from "./staff"

export interface Appointment {
    appointment_id: number;
    arrival_time: string;
    service_time: string;
    next_arrival_time: string;
    turn_around: boolean;
    cancelled_date: string;
    property_info: Property;
    staff?: Array<AppointmentStaff>;
    status: AppointmentStatus;
    service: Service;
}

interface AppointmentStaff {
    user_id: number;
    staff_info: Staff;
}

interface AppointmentStatus {
    status_id: number;
    status: string;
}

interface Service {
    service_id: number;
    service_name: string;
}