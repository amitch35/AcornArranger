# API Specification
Base URL: `~/api`
## 1. Properties
### 1.1 Show Properties `/properties/` - GET
Allows users to see all properties available on the database

Returns: 
```commandline
[
    {
        "properties_id": <id>,
        "property_name": <string>,
        "status_id": <smallint>,
        "estimated_cleaning_mins": <smallint>,
        "double_unit": <list[id]>,
        "address": {
            "city": <string>,
            "address": <string>,
            "country": <string>,
            "state_name": <string>,
            "postal_code": <int>
        }
    }
]
```
### 1.2 Get Property - `/properties/{properties_id}` - GET
Gets full information about a single property

Returns:
```commandline
[
    {
        "properties_id": <id>,
        "property_name": <string>,
        "status_id": <smallint>,
        "estimated_cleaning_mins": <smallint>,
        "double_unit": <list[id]>,
        "address": {
            "city": <string>,
            "address": <string>,
            "country": <string>,
            "state_name": <string>,
            "postal_code": <int>
        }
    }
]
```

## 2. Staff
### 2.1 Show Staff - `/staff` - GET
Allows users to see all staff populated from ResortCleaning and any information
linked from Homebase

Returns:
```commandline
[
    {
        
    }
]
```
### 2.2 Get Staff - `/staff/{user_id}` - GET
Gets full information about a single staff member

Returns:
```commandline
[
    {
        
    }
]
```
### 2.3 Uodate Staff Role - `/staff/{user_id}/role/{role_id}` - POST
Change the role of the given staff member

Input:
```commandline
{
    
}
```
Returns:
```commandline
[
    {
        
    }
]
```

## 3. Roles
### 3.1 Show Roles - `/roles` - GET
Returns all roles linked from Homebase

```commandline
[
    {
        
    }
]
```
### 3.2 Update Role Settings - `/roles/{role_id}` - POST
Updates settings for specified role

Input:
```commandline
{
    
}
```
Returns:
```commandline
{
    
}
```

## 4. Appointments
### 4.1 Show Appointments - `/appointments` - GET
Allows users to see all properties available on the database
#### Note: Appointment data is only regularly updated for appointments ranging from the previous day to plus 9 days

Returns:
```commandline
{
    
}
```
### 4.2 Get Appointment - `/appointments/{appointment_id}` - GET
Gets full information about a single appointment

Returns:
```commandline
{
    
}
```

## 5. Schedule Plans
