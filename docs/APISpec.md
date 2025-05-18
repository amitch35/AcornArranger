# API Specification
Base URL: `~/api`
## 1. Properties
### 1.1 Show Properties `/properties` - GET
Allows users to see all properties available on the database

Query Parameters:
- `filter_status_id`: number from 1 to 2 - indicates which status_id's should be returned (parameter can be repeated to form array of desired status_ids)

Returns: 
```commandline
[
    {
        "properties_id": <id>,
        "property_name": <string>,
        "estimated_cleaning_mins": <smallint>,
        "double_unit": Array<id>,
        "address": {
            "city": <string>,
            "address": <string>,
            "country": <string>,
            "state_name": <string>,
            "postal_code": <int>
        },
        "status": {
            "status": <string>,
            "status_id": <smallint>
        }
    }
]
```
### 1.2 Get Property - `/properties/{properties_id}` - GET
Gets full information about a single property

Returns:
```commandline
{
    "properties_id": <id>,
    "property_name": <string>,
    "estimated_cleaning_mins": <smallint>,
    "double_unit": Array<id>,
    "address": {
        "city": <string>,
        "address": <string>,
        "country": <string>,
        "state_name": <string>,
        "postal_code": <int>
    },
    "status": {
        "status": <string>,
        "status_id": <smallint>
    }
}
```
### 1.3 Assign Property settings - `/properties/{properties_id}` - PUT
Gets full information about a single property

Input:
```commandline
{
    "estimated_cleaning_mins": <smallint>,
    "double_unit": Array<id>
}
```
Returns:
```commandline
{
    "properties_id": <id>,
    "property_name": <string>,
    "estimated_cleaning_mins": <smallint>,
    "double_unit": Array<id>,
    "address": {
        "city": <string>,
        "address": <string>,
        "country": <string>,
        "state_name": <string>,
        "postal_code": <int>
    },
    "status": {
        "status": <string>,
        "status_id": <smallint>
    }
}
```

## 2. Staff
### 2.1 Show Staff - `/staff` - GET
Allows users to see all staff populated from ResortCleaning and any information
linked from Homebase

Query Parameters:
- `filter_status_id`: number from 1 to 3 - indicates which status_id's should be returned (parameter can be repeated to form array of desired status_ids)
- `filter_can_clean`: boolean - indicates whether to filter for only those with roles that can clean

Returns:
```commandline
[
    {
        "user_id": <id>,
        "name": <string>,
        "first_name": <string>,
        "last_name": <string>,
        "role": {
            "role_id": <id>,
            "title": <string>
        },
        "status": {
            "status": <string>,
            "status_id": <smallint>
        }
    }
]
```
### 2.2 Get Staff Shifts - `/staff/shifts` - GET
Allows users to see staff's shifts in Homebase for given days

Query Parameters:
- `from_shift_date`: date YYYY-MM-DD - filters out any shifts with service date before this value (Can be supplied on its own to set both from and to)
- `to_shift_date`: date YYYY-MM-DD - filters out any shifts with service date after this value

Returns:
```commandline
[
  {
    "matched": <boolean>,
    "user_id": <number>,
    "name": <string>,
    "shift": {
      "id": <number>,
      "timecard_id": <number>,
      "open": <boolean>,
      "role": <string>,
      "department": <string>,
      "first_name": <string>,
      "last_name": <string>,
      "location_id": <number>,
      "job_id": <number>,
      "user_id": <number>,
      "wage_rate": <number>,
      "published": <boolean>,
      "scheduled": <boolean>,
      "labor": {
        "wage_type": <string>,
        "scheduled_hours": <number>,
        "scheduled_overtime": <number>,
        "scheduled_regular": <number>,
        "scheduled_daily_overtime": <number>,
        "scheduled_weekly_overtime": <number>,
        "scheduled_double_overtimes": <number>,
        "scheduled_seventh_day_overtime_15": <number>,
        "scheduled_seventh_day_overtime_20": <number>,
        "scheduled_unpaid_breaks_hours": <number>,
        "scheduled_costs": <number>,
        "scheduled_overtime_costs": <number>,
        "scheduled_spread_of_hours": <number>,
        "scheduled_blue_laws_hours": <number>
      },
      "created_at": <string (ISO Timestamp)>,
      "updated_at": <string (ISO Timestamp)>,
      "start_at": <string (ISO Timestamp)>,
      "end_at": <string (ISO Timestamp)>,
      "note": {
        "text": <string>,
        "author": <string>
      }
    }
  }
]
```
### 2.3 Get Staff - `/staff/{user_id}` - GET
Gets full information about a single staff member including more detailed 
information about their role

Returns:
```commandline
{
    "user_id": <id>,
    "name": <string>,
    "first_name": <string>,
    "last_name": <string>,
    "role": {
        "role_id": <id>,
        "title": <string>,
        "priority": <int>,
        "can_clean": <bool>,
        "description": <string>,
        "can_lead_team": <bool>
    },
    "status": {
        "status": <string>,
        "status_id": <smallint>
    }
}
```


## 3. Roles
### 3.1 Show Roles - `/roles` - GET
Returns all roles linked from Homebase

```commandline
[
    {
        "role_id": <id>,
        "title": <string>,
        "description": <string>,
        "priority": <int>,
        "can_lead_team": <bool>,
        "can_clean": <bool>
    }
]
```
### 3.2 Get Role - `/roles/{role_id}` - GET
Gets full information about a single role

```commandline
{
    "role_id": <id>,
    "title": <string>,
    "description": <string>,
    "priority": <int>,
    "can_lead_team": <bool>,
    "can_clean": <bool>
}
```
### 3.3 Assign Role Settings - `/roles/{role_id}` - PUT
Change settings for specified role

Input:
```commandline
{
    "description": <string>,
    "priority": <int>,
    "can_lead_team": <bool>,
    "can_clean": <bool>
}
```
Returns:
```commandline
{
    "role_id": <id>,
    "title": <string>,
    "description": <string>,
    "priority": <int>,
    "can_lead_team": <bool>,
    "can_clean": <bool>
}
```

## 4. Services
### 4.1 Show Services - `/roles` - GET
Returns all appointment services available

```commandline
[
    {
        "service_id": <id>,
        "service_name": <string>
    }
]
```

## 5. Appointments
### 5.1 Show Appointments - `/appointments` - GET
Allows users to see all properties available on the database
#### Note: Appointment data is only regularly updated for appointments ranging from the previous day to plus 9 days

Query Parameters:
- `per_page`: number from 1 to 1000 - indicates maximum number of appointment records to return
- `page`: number from 0 - indicates which page of results to return
- `from_service_date`: date YYYY-MM-DD - filters out any appointments with service date before this value
- `to_service_date`: date YYYY-MM-DD - filters out any appointments with service date after this value
- `filter_status_id`: number from 1 to 5 - indicates which status_id's should be returned (parameter can be repeated to form array of desired status_ids)
- `filter_service_id`: service_id - indicates which services should be returned (parameter can be repeated to form array of desired service_ids)
- `show_unscheduled`: boolean - filters results such that only appointments without staff assigned will be shown

Returns:
```commandline
[
    {
        "appointment_id": <id>,
        "arrival_time": <string (ISO Timestamp)>,
        "service_time": <string (ISO Timestamp)>,
        "next_arrival_time": <string (ISO Timestamp)>,
        "turn_around": <bool>,
        "cancelled_date": <string (ISO Timestamp)>,
        "property_info": {
            "properties_id": <id>,
            "property_name": <string>
        },
        "staff": [
            {
                "user_id": <id>,
                "staff_info": {
                    "user_id": <id>,
                    "name": <string>
                }
            }
        ],
        "status": {
            "status": <string>,
            "status_id": <smallint>
        },
        "service": {
            "service_id": <id>,
            "service_name": <string>
        }
    }
]
```
### 5.2 Get Appointment - `/appointments/{appointment_id}` - GET
Gets full information about a single appointment

Returns:
```commandline
{
    "appointment_id": <id>,
    "arrival_time": <string (ISO Timestamp)>,
    "service_time": <string (ISO Timestamp)>,
    "next_arrival_time": <string (ISO Timestamp)>,
    "turn_around": <bool>,
    "cancelled_date": <string (ISO Timestamp)>,
    "property_info": {
        "properties_id": <id>,
        "property_name": <string>
    },
    "staff": [
        {
            "user_id": <id>,
            "staff_info": {
                "user_id": <id>,
                "name": <string>
            }
        }
    ],
    "status": {
        "status": <string>,
        "status_id": <smallint>
    },
    "service": {
        "service_id": <id>,
        "service_name": <string>
    }
}
```

## 6. Schedule Plans
### 6.1 Show Plans - `/plans` - GET
Allows users to see all valid plans available on the database

Query Parameters:
- `per_page`: number from 1 to 1000 - indicates maximum number of appointment records to return
- `page`: number from 0 - indicates which page of results to return
- `from_plan_date`: date YYYY-MM-DD - filters out any plans with service date before this value (Can be supplied on its own to set both from and to)
- `to_plan_date`: date YYYY-MM-DD - filters out any plans with service date after this value

Returns:
```commandline
[
    {
        "plan_id": <id>,
        "plan_date": <string (ISO Date)>,
        "team": <smallint>,
        "appointments": [
            {
                "sent_to_rc": <string (ISO Timestamp)>,
                "appointment_id": <id>,
                "appointment_info": {
                    "appointment_id": <id>,
                    "arrival_time": <string (ISO Timestamp)>,
                    "service_time": <string (ISO Timestamp)>,
                    "next_arrival_time": <string (ISO Timestamp)>,
                    "cancelled_date": <string (ISO Timestamp)>,
                    "turn_around": <bool>
                    "status": {
                        "status_id": <smallint>,
                        "status": <string>
                    },
                    "service": {
                        "service_id": <id>,
                        "service_name": <string>
                    },
                    "property_info": {
                        "properties_id": <id>,
                        "property_name": <string>
                    }
                }
            }
        ],
        "staff": [
            {
                "user_id": <id>,
                "staff_info": {
                    "user_id": <id>,
                    "name": <string>
                }
            }
        ]
    }
]
```

### 6.2 Get Plan - `/plans/{plan_id}` - GET
Gets full information about a single plan

Returns:
```commandline
[
    {
        "plan_id": <id>,
        "plan_date": <string (ISO Date)>,
        "team": <smallint>,
        "appointments": [
            {
                "sent_to_rc": <string (ISO Timestamp)>,
                "appointment_id": <id>,
                "appointment_info": {
                    "appointment_id": <id>,
                    "arrival_time": <string (ISO Timestamp)>,
                    "service_time": <string (ISO Timestamp)>,
                    "next_arrival_time": <string (ISO Timestamp)>,
                    "cancelled_date": <string (ISO Timestamp)>,
                    "turn_around": <bool>
                    "status": {
                        "status_id": <smallint>,
                        "status": <string>
                    },
                    "service": {
                        "service_id": <id>,
                        "service_name": <string>
                    },
                    "property_info": {
                        "properties_id": <id>,
                        "property_name": <string>
                    }
                }
            }
        ],
        "staff": [
            {
                "user_id": <id>,
                "staff_info": {
                    "user_id": <id>,
                    "name": <string>
                }
            }
        ]
    }
]
```

### 6.3 Add Staff to Plan - `/plans/{plan_id}/staff/{user_id}` - POST
Adds given staff to a plan

### 6.4 Remove Staff from Plan - `/plans/{plan_id}/staff/{user_id}` - DELETE
Removes given staff from a plan

### 6.5 Add Appoinment to Plan - `/plans/{plan_id}/appointment/{appoinment_id}` - POST
Adds given appointment to a plan as long as that appointment is not already in 
another plan for the same day

### 6.6 Remove Appoinment from Plan - `/plans/{plan_id}/appointment/{appoinment_id}` - DELETE
Removes given appointment from a plan

### 6.7 Build Schedule Plans - `/plans/build/{plan_date}` - POST
Uses input parameters to run a complex scheduling algorithm and create plans to 
complete all appointments for the given day

Input:
```commandline
{
    "available_staff": Array<userId>,
    "office_location"?: <Geometry>,
    "services"?: Array<serviceId>,
    "omissions"?: Array<appointmentId>,
    "routing_type"?: <int 1 to 5>,
    "cleaning_window"?: <float>,
    "max_hours"?: <float>,
    "target_staff_count"?: <int>
}
```

### 6.8 Send Plan to ResortCleaning - `/plans/send/{plan_date}` - POST
Sends all valid plans for the given day to ResortCleaning to be assigned to staff

### 6.9 Create new Plan for day - `/plans/add/{plan_date}` - POST
Add a new plan empty, valid plan to the given day

### 6.10 Copy Schedule Plans for day to new mutable Plans - `/plans/copy/{plan_date}` - POST
Copy each plan for a day to new plans that are mutable and invalidate the old ones