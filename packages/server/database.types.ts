export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointment_status_key: {
        Row: {
          created_at: string
          id: number
          status: string | null
          status_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          status?: string | null
          status_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          status?: string | null
          status_id?: number | null
        }
        Relationships: []
      }
      appointments_staff: {
        Row: {
          appointment_id: number | null
          created_at: string
          id: number
          staff_id: number | null
        }
        Insert: {
          appointment_id?: number | null
          created_at?: string
          id?: number
          staff_id?: number | null
        }
        Update: {
          appointment_id?: number | null
          created_at?: string
          id?: number
          staff_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_staff_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment_details"
            referencedColumns: ["appointment_id"]
          },
          {
            foreignKeyName: "appointments_staff_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "rc_appointments"
            referencedColumns: ["appointment_id"]
          },
          {
            foreignKeyName: "appointments_staff_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "schedule_plan_details"
            referencedColumns: ["appointment_id"]
          },
          {
            foreignKeyName: "appointments_staff_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "rc_staff"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "appointments_staff_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_details"
            referencedColumns: ["user_id"]
          },
        ]
      }
      error_log: {
        Row: {
          created_at: string
          error_message: string | null
          function_name: string | null
          id: number
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          function_name?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          error_message?: string | null
          function_name?: string | null
          id?: number
        }
        Relationships: []
      }
      http_response: {
        Row: {
          content: string | null
          content_type: string | null
          created_at: string
          headers: string | null
          id: number
          status: number | null
        }
        Insert: {
          content?: string | null
          content_type?: string | null
          created_at?: string
          headers?: string | null
          id?: number
          status?: number | null
        }
        Update: {
          content?: string | null
          content_type?: string | null
          created_at?: string
          headers?: string | null
          id?: number
          status?: number | null
        }
        Relationships: []
      }
      plan_appointments: {
        Row: {
          appointment_id: number | null
          created_at: string
          id: number
          ord: number | null
          plan_id: number | null
          sent_to_rc: string | null
          valid: boolean
        }
        Insert: {
          appointment_id?: number | null
          created_at?: string
          id?: number
          ord?: number | null
          plan_id?: number | null
          sent_to_rc?: string | null
          valid?: boolean
        }
        Update: {
          appointment_id?: number | null
          created_at?: string
          id?: number
          ord?: number | null
          plan_id?: number | null
          sent_to_rc?: string | null
          valid?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "public_plan_appointments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment_details"
            referencedColumns: ["appointment_id"]
          },
          {
            foreignKeyName: "public_plan_appointments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "rc_appointments"
            referencedColumns: ["appointment_id"]
          },
          {
            foreignKeyName: "public_plan_appointments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "schedule_plan_details"
            referencedColumns: ["appointment_id"]
          },
          {
            foreignKeyName: "public_plan_appointments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "planned_appointment_ids"
            referencedColumns: ["plan_id"]
          },
          {
            foreignKeyName: "public_plan_appointments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "schedule_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_staff: {
        Row: {
          created_at: string
          id: number
          plan_id: number | null
          staff_id: number | null
          valid: boolean
        }
        Insert: {
          created_at?: string
          id?: number
          plan_id?: number | null
          staff_id?: number | null
          valid?: boolean
        }
        Update: {
          created_at?: string
          id?: number
          plan_id?: number | null
          staff_id?: number | null
          valid?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "public_plan_staff_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "planned_appointment_ids"
            referencedColumns: ["plan_id"]
          },
          {
            foreignKeyName: "public_plan_staff_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "schedule_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_plan_staff_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "rc_staff"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "public_plan_staff_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_details"
            referencedColumns: ["user_id"]
          },
        ]
      }
      property_status_key: {
        Row: {
          created_at: string
          id: number
          status: string | null
          status_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          status?: string | null
          status_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          status?: string | null
          status_id?: number | null
        }
        Relationships: []
      }
      rc_addresses: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          country_code: string | null
          created_at: string
          id: number
          location: unknown | null
          place_id: string | null
          postal_code: string | null
          state_name: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          id?: number
          location?: unknown | null
          place_id?: string | null
          postal_code?: string | null
          state_name?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          id?: number
          location?: unknown | null
          place_id?: string | null
          postal_code?: string | null
          state_name?: string | null
        }
        Relationships: []
      }
      rc_appointments: {
        Row: {
          app_status_id: number | null
          appointment_id: number | null
          arrival_time: string | null
          cancelled_date: string | null
          created_at: string
          departure_time: string | null
          id: number
          next_arrival_time: string | null
          property: number | null
          service: number | null
          turn_around: boolean | null
        }
        Insert: {
          app_status_id?: number | null
          appointment_id?: number | null
          arrival_time?: string | null
          cancelled_date?: string | null
          created_at?: string
          departure_time?: string | null
          id?: number
          next_arrival_time?: string | null
          property?: number | null
          service?: number | null
          turn_around?: boolean | null
        }
        Update: {
          app_status_id?: number | null
          appointment_id?: number | null
          arrival_time?: string | null
          cancelled_date?: string | null
          created_at?: string
          departure_time?: string | null
          id?: number
          next_arrival_time?: string | null
          property?: number | null
          service?: number | null
          turn_around?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "public_rc_appointments_service_fkey"
            columns: ["service"]
            isOneToOne: false
            referencedRelation: "service_key"
            referencedColumns: ["service_id"]
          },
          {
            foreignKeyName: "rc_appointments_property_fkey"
            columns: ["property"]
            isOneToOne: false
            referencedRelation: "rc_properties"
            referencedColumns: ["properties_id"]
          },
        ]
      }
      rc_properties: {
        Row: {
          address: number | null
          created_at: string
          double_unit: number[] | null
          estimated_cleaning_mins: number | null
          id: number
          properties_id: number | null
          property_name: string | null
          status_id: number | null
        }
        Insert: {
          address?: number | null
          created_at?: string
          double_unit?: number[] | null
          estimated_cleaning_mins?: number | null
          id?: number
          properties_id?: number | null
          property_name?: string | null
          status_id?: number | null
        }
        Update: {
          address?: number | null
          created_at?: string
          double_unit?: number[] | null
          estimated_cleaning_mins?: number | null
          id?: number
          properties_id?: number | null
          property_name?: string | null
          status_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_rc_properties_address_fkey"
            columns: ["address"]
            isOneToOne: false
            referencedRelation: "rc_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      rc_staff: {
        Row: {
          created_at: string
          first_name: string | null
          id: number
          last_name: string | null
          name: string | null
          role: number | null
          status_id: number | null
          user_id: number | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: number
          last_name?: string | null
          name?: string | null
          role?: number | null
          status_id?: number | null
          user_id?: number | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: number
          last_name?: string | null
          name?: string | null
          role?: number | null
          status_id?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_rc_staff_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      rc_tokens: {
        Row: {
          access_token: string | null
          created_at: string
          expires: string | null
          id: number
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          expires?: string | null
          id?: number
        }
        Update: {
          access_token?: string | null
          created_at?: string
          expires?: string | null
          id?: number
        }
        Relationships: []
      }
      roles: {
        Row: {
          can_clean: boolean
          can_lead_team: boolean
          created_at: string
          description: string | null
          id: number
          priority: number | null
          title: string | null
        }
        Insert: {
          can_clean?: boolean
          can_lead_team?: boolean
          created_at?: string
          description?: string | null
          id?: number
          priority?: number | null
          title?: string | null
        }
        Update: {
          can_clean?: boolean
          can_lead_team?: boolean
          created_at?: string
          description?: string | null
          id?: number
          priority?: number | null
          title?: string | null
        }
        Relationships: []
      }
      schedule_plans: {
        Row: {
          created_at: string
          id: number
          plan_date: string | null
          team: number | null
          valid: boolean
        }
        Insert: {
          created_at?: string
          id?: number
          plan_date?: string | null
          team?: number | null
          valid?: boolean
        }
        Update: {
          created_at?: string
          id?: number
          plan_date?: string | null
          team?: number | null
          valid?: boolean
        }
        Relationships: []
      }
      server_log: {
        Row: {
          created_at: string
          function: string | null
          id: number
          message: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          function?: string | null
          id?: number
          message?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          function?: string | null
          id?: number
          message?: string | null
          status?: string | null
        }
        Relationships: []
      }
      service_key: {
        Row: {
          created_at: string
          id: number
          name: string | null
          service_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          service_id: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          service_id?: number
        }
        Relationships: []
      }
      staff_assignments: {
        Row: {
          appointment_id: number | null
          created_at: string
          id: number
          ord: number | null
          sent_to_rc: string | null
          staff_id: number | null
          team: number | null
          valid: boolean
        }
        Insert: {
          appointment_id?: number | null
          created_at?: string
          id?: number
          ord?: number | null
          sent_to_rc?: string | null
          staff_id?: number | null
          team?: number | null
          valid?: boolean
        }
        Update: {
          appointment_id?: number | null
          created_at?: string
          id?: number
          ord?: number | null
          sent_to_rc?: string | null
          staff_id?: number | null
          team?: number | null
          valid?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "staff_assignments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment_details"
            referencedColumns: ["appointment_id"]
          },
          {
            foreignKeyName: "staff_assignments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "rc_appointments"
            referencedColumns: ["appointment_id"]
          },
          {
            foreignKeyName: "staff_assignments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "schedule_plan_details"
            referencedColumns: ["appointment_id"]
          },
          {
            foreignKeyName: "staff_assignments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "rc_staff"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "staff_assignments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_details"
            referencedColumns: ["user_id"]
          },
        ]
      }
      staff_status_key: {
        Row: {
          created_at: string
          id: number
          status: string | null
          status_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          status?: string | null
          status_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          status?: string | null
          status_id?: number | null
        }
        Relationships: []
      }
      travel_times: {
        Row: {
          created_at: string
          dest_address_id: number
          distance_in_meters: number | null
          id: number
          src_address_id: number
          travel_time_minutes: number
        }
        Insert: {
          created_at?: string
          dest_address_id: number
          distance_in_meters?: number | null
          id?: number
          src_address_id: number
          travel_time_minutes: number
        }
        Update: {
          created_at?: string
          dest_address_id?: number
          distance_in_meters?: number | null
          id?: number
          src_address_id?: number
          travel_time_minutes?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_travel_times_dest_address_id_fkey"
            columns: ["dest_address_id"]
            isOneToOne: false
            referencedRelation: "rc_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_travel_times_src_address_id_fkey"
            columns: ["src_address_id"]
            isOneToOne: false
            referencedRelation: "rc_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      appointment_details: {
        Row: {
          appointment_id: number | null
          departure_time: string | null
          next_arrival: string | null
          property_name: string | null
          service_name: string | null
          staff_name: string | null
          status: string | null
          turn_around: boolean | null
        }
        Relationships: []
      }
      decrypted_rc_tokens: {
        Row: {
          access_token: string | null
          created_at: string | null
          decrypted_access_token: string | null
          expires: string | null
          id: number | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          decrypted_access_token?: never
          expires?: string | null
          id?: number | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          decrypted_access_token?: never
          expires?: string | null
          id?: number | null
        }
        Relationships: []
      }
      planned_appointment_ids: {
        Row: {
          appointment_id: number | null
          plan_date: string | null
          plan_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_plan_appointments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "rc_appointments"
            referencedColumns: ["appointment_id"]
          },
          {
            foreignKeyName: "public_plan_appointments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointment_details"
            referencedColumns: ["appointment_id"]
          },
          {
            foreignKeyName: "public_plan_appointments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "schedule_plan_details"
            referencedColumns: ["appointment_id"]
          },
        ]
      }
      schedule_plan_details: {
        Row: {
          appointment_id: number | null
          departure_time: string | null
          estimated_cleaning_mins: number | null
          next_arrival: string | null
          ord: number | null
          property_name: string | null
          sent_to_rc: string | null
          service_name: string | null
          staff_name: string | null
          status: string | null
          team: number | null
        }
        Relationships: []
      }
      staff_details: {
        Row: {
          name: string | null
          status: string | null
          title: string | null
          user_id: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      build_schedule_plan: {
        Args: {
          available_staff: number[]
          date_to_schedule: string
          office_location: unknown
          services: number[]
          omissions: number[]
          routing_type?: number
          cleaning_window?: number
          max_hours?: number
          target_staff_count?: number
        }
        Returns: undefined
      }
      get_geom_and_placeid_from_address: {
        Args: {
          address: string
        }
        Returns: Record<string, unknown>
      }
      get_geom_from_address: {
        Args: {
          address: string
        }
        Returns: unknown
      }
      get_rc_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_total_time: {
        Args: {
          date_to_check: string
          office_location: unknown
          services: number[]
          omissions: number[]
        }
        Returns: Record<string, unknown>
      }
      http_get_appointments: {
        Args: {
          date_from: string
          date_to: string
        }
        Returns: number
      }
      http_get_distance_matrix: {
        Args: {
          origin_place_ids: string[]
          destination_place_ids: string[]
        }
        Returns: number
      }
      http_get_employees: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      http_get_geocode: {
        Args: {
          address: string
        }
        Returns: number
      }
      http_get_properties: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      http_get_staff: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      http_put_appointment_staff: {
        Args: {
          appointment_id: number
          assignment_json: Json
        }
        Returns: number
      }
      set_rc_appointment_staff: {
        Args: {
          appointment_id: number
          staff_ids: number[]
        }
        Returns: undefined
      }
      set_staff_group: {
        Args: {
          appt_id: number
          staff_json: Json
        }
        Returns: undefined
      }
      set_travel_times: {
        Args: {
          address_id: number
        }
        Returns: undefined
      }
      team_plan_add_appointment: {
        Args: {
          target_plan_date: string
          target_team: number
          appointment_to_add: number
        }
        Returns: undefined
      }
      team_plan_add_staff: {
        Args: {
          target_plan_date: string
          target_team: number
          staff_to_add: number
        }
        Returns: undefined
      }
      team_plan_create_new: {
        Args: {
          target_plan_date: string
        }
        Returns: number
      }
      team_plan_remove_appointment: {
        Args: {
          target_plan_date: string
          appointment_to_remove: number
        }
        Returns: undefined
      }
      team_plan_remove_staff:
        | {
            Args: {
              target_plan_date: string
              staff_to_remove: number
            }
            Returns: undefined
          }
        | {
            Args: {
              target_plan_date: string
              target_team: number
              staff_to_remove: number
            }
            Returns: undefined
          }
      update_appointments: {
        Args: {
          date_from: string
          date_to: string
        }
        Returns: undefined
      }
      update_employee_roles: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>
      }
      update_properties: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_staff: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
