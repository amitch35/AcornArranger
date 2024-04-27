export interface Property {
    properties_id: number;
    property_name: string;
    address: string;
    status_id: number;
    status: string;
    estimated_cleaning_mins?: number;
    double_unit?: Array<number>;
  }