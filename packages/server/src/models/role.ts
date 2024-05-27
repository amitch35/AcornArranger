export interface Role {
    role_id: number;
    title: string;
    description?: string;
    priority: number;
    can_lead_team: boolean;
    can_clean: boolean;
}