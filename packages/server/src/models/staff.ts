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