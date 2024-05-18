import { Address } from "./address";

export interface Property {
  properties_id: number;
  property_name: string;
  address: Address;
  status: PropertyStatus;
  estimated_cleaning_mins?: number;
  double_unit?: Array<number>;
}

interface PropertyStatus {
  status_id: number;
  status: string;
}