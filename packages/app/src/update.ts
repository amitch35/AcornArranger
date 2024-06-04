import { Auth, Update } from "@calpoly/mustang";
import { Appointment, Property, Role, Staff, Plan, PlanBuildOptions, Service } from "server/models";
import { Msg } from "./messages";
import { Model } from "./model";
import { ErrorResponse } from "server/models";

// // Type guard to check if the value is an array of plans
// function isPlanArray(item: any): item is Array<Plan> {
//   return Array.isArray(item) && 'plan_id' in item[0];
// }

// // Type guard to check if the value is an error response
// function isErrorResponse(item: any): item is ErrorResponse {
//   return item && 'details' in item;
// }

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "properties/save":
      saveProperty(message[1], user)
        .then((property) =>
          apply((model) => ({ ...model, property }))
        ).then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      break;
    case "properties/select":
      selectProperty(message[1], user).then((property) =>
        apply((model) => ({ ...model, property }))
      );
      break;
    case "properties/":
      selectProperties(message[1], user).then((properties) =>
        apply((model) => ({ ...model, properties }))
      );
      break;
    case "roles/save":
      saveRole(message[1], user).then((role) =>
        apply((model) => ({ ...model, role }))
      );
      break;
    case "roles/select":
      selectRole(message[1], user).then(
      (role: Role | undefined) =>
        apply((model) => ({ ...model, role }))
      );
      break;
    case "roles/":
      selectRoles(user).then((roles) =>
        apply((model) => ({ ...model, roles }))
      );
      break;
    case "appointments/select":
      selectAppointment(message[1], user).then(
      (appointment: Appointment | undefined) =>
        apply((model) => ({ ...model, appointment }))
      );
      break;
    case "appointments/":
      selectAppointments(message[1], user).then(
      (appointments: Array<Appointment> | undefined) =>
        apply((model) => ({ ...model, appointments }))
      );
      break;
    case "plans/select":
      selectPlan(message[1], user).then(
      (plan: Plan | undefined) =>
        apply((model) => ({ ...model, plan }))
      );
      break;
    case "plans/":
      selectPlans(message[1], user).then(
      (plans: Array<Plan> | undefined) =>
        apply((model) => ({ ...model, plans }))
      );
      break;
    case "plans/staff/add":
      addPlanStaff(message[1], user).then(
      (plan: Plan | undefined) =>
        apply((model) => ({ ...model, plan }))
      );
      break;
    case "plans/staff/remove":
      removePlanStaff(message[1], user).then(
      (plan: Plan | undefined) =>
        apply((model) => ({ ...model, plan }))
      );
      break;
    case "plans/appointment/add":
      addPlanAppointment(message[1], user).then(
      (plan: Plan | undefined) =>
        apply((model) => ({ ...model, plan }))
      );
      break;
    case "plans/appointment/remove":
      removePlanAppointment(message[1], user).then(
      (plan: Plan | undefined) =>
        apply((model) => ({ ...model, plan }))
      );
      break;
    case "plans/build":
      buildPlan(message[1], user).then(
      (error: ErrorResponse | undefined) => {
          apply((model) => ({ ...model, build_error: error }))
      });
      break;
    case "plans/copy":
      copyPlan(message[1], user).then(
      (error: ErrorResponse | undefined) => {
          apply((model) => ({ ...model, build_error: error }))
      });
      break;
    case "plans/send":
      sendPlan(message[1], user).then(
      (error: ErrorResponse | undefined) => {
          apply((model) => ({ ...model, build_error: error }))
      });
      break;
    case "plans/add":
      addPlan(message[1], user).then(
      (error: ErrorResponse | undefined) => {
          apply((model) => ({ ...model, build_error: error }))
      });
      break;
    case "staff/select":
      selectStaffMember(message[1], user).then(
      (staff_member: Staff | undefined) =>
        apply((model) => ({ ...model, staff_member }))
      );
      break;
    case "staff/":
      selectStaff(message[1], user).then(
        (staff: Array<Staff> | undefined) =>
          apply((model) => ({ ...model, staff }))
      );
      break;
    case "services/":
      selectServices(user).then((services) =>
        apply((model) => ({ ...model, services }))
      );
      break;
    case "available/save":
      apply((model) => ({ ...model, available: message[1].available }));
      break;
    case "omissions/save":
      apply((model) => ({ ...model, omissions: message[1].omissions }));
      break;
    default:
      const unhandled: never = message[0];
      throw new Error(`Unhandled Auth message "${unhandled}"`);
  }
}

function saveProperty(
  msg: {
    properties_id: number;
    property: Property;
  },
  user: Auth.User
) {
  return fetch(`/api/properties/${msg.properties_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(msg.property)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      return undefined;
    })
    .then((json: unknown) => {
      if (json) return json as Property;
      return undefined;
    });
}

function selectProperty(
  msg: { properties_id: number },
  user: Auth.User
) {
  return fetch(`/api/properties/${msg.properties_id}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Property:", json);
        return json as Property;
      }
    });
}

function selectProperties(
  msg: { filter_status_ids?: Array<number> },
  user: Auth.User
) {
  // Base URL
  let url = `/api/properties`;

  // Add query parameters if filter_status_ids is defined and not empty
  if (msg.filter_status_ids && msg.filter_status_ids.length > 0) {
    const queryParams = msg.filter_status_ids.map(id => `filter_status_id=${id}`).join('&');
    url += `?${queryParams}`;
  }

  return fetch(url, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Properties:", json);
        return json as Array<Property>;
      }
    });
}

function saveRole(
  msg: {
    role_id: number;
    role: Role;
  },
  user: Auth.User
) {
  return fetch(`/api/roles/${msg.role_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(msg.role)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      return undefined;
    })
    .then((json: unknown) => {
      if (json) return json as Role;
      return undefined;
    });
}

function selectRole(
  msg: { role_id: number },
  user: Auth.User
) {
  return fetch(`/api/roles/${msg.role_id}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Role:", json);
        return json as Role;
      }
    });
}

function selectRoles(
  user: Auth.User
) {
  return fetch(`/api/roles`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Roles:", json);
        return json as Array<Role>;
      }
    });
}

function selectAppointment(
  msg: { appointment_id: number },
  user: Auth.User
) {
  return fetch(`/api/appointments/${msg.appointment_id}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Appointment:", json);
        return json as Appointment;
      }
    });
}

function selectAppointments(
  msg: { 
    from_service_date: string; 
    to_service_date: string; 
    per_page?: number; 
    page?: number;
    filter_status_ids?: Array<number>;
    filter_service_ids?: Array<number>; },
  user: Auth.User
) {
  // Base URL
  let url = `/api/appointments?from_service_date=${msg.from_service_date}&to_service_date=${msg.to_service_date}`;

  // Add query parameters if present
  if (msg.per_page) {
    url += `&per_page=${msg.per_page}`;
  }
  if (msg.page) {
    url += `&page=${msg.page}`;
  }

  // Add query parameters if filter_status_ids is defined and not empty
  if (msg.filter_status_ids && msg.filter_status_ids.length > 0) {
    const queryParams = msg.filter_status_ids.map(id => `filter_status_id=${id}`).join('&');
    url += `&${queryParams}`;
  }

  // Add query parameters if filter_service_ids is defined and not empty
  if (msg.filter_service_ids && msg.filter_service_ids.length > 0) {
    const queryParams = msg.filter_service_ids.map(id => `filter_service_id=${id}`).join('&');
    url += `&${queryParams}`;
  }

  return fetch(url, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Appointments:", json);
        return json as Array<Appointment>;
      }
    });
}

function selectPlan(
  msg: { plan_id: number },
  user: Auth.User
) {
  return fetch(`/api/plans/${msg.plan_id}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Plan:", json);
        return json as Plan;
      }
    });
}

function selectPlans(
  msg: { 
    from_plan_date: string; 
    to_plan_date?: string; 
    per_page?: number; 
    page?: number; },
  user: Auth.User
) {
  // Base URL
  let url = `/api/plans?from_plan_date=${msg.from_plan_date}`;

  // Add query parameters if present
  if (msg.to_plan_date) {
    url += `&to_plan_date=${msg.to_plan_date}`;
  }
  if (msg.per_page) {
    url += `&per_page=${msg.per_page}`;
  }
  if (msg.page) {
    url += `&page=${msg.page}`;
  }

  return fetch(url, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Plans:", json);
        return json as Array<Plan>;
      }
    });
}

function addPlanStaff(
  msg: { plan_id: number; user_id: number; },
  user: Auth.User
) {
  return fetch(`/api/plans/${msg.plan_id}/staff/${msg.user_id}`, {
    method: "POST",
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 204) return selectPlan(msg, user);
      return undefined;
    });
}

function removePlanStaff(
  msg: { plan_id: number; user_id: number; },
  user: Auth.User
) {
  return fetch(`/api/plans/${msg.plan_id}/staff/${msg.user_id}`, {
    method: "DELETE",
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 204) return selectPlan(msg, user);
      return undefined;
    });
}

function addPlanAppointment(
  msg: { plan_id: number; appointment_id: number; },
  user: Auth.User
) {
  return fetch(`/api/plans/${msg.plan_id}/appointment/${msg.appointment_id}`, {
    method: "POST",
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 204) return selectPlan(msg, user);
      return undefined;
    });
}

function removePlanAppointment(
  msg: { plan_id: number; appointment_id: number; },
  user: Auth.User
) {
  return fetch(`/api/plans/${msg.plan_id}/appointment/${msg.appointment_id}`, {
    method: "DELETE",
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 204) return selectPlan(msg, user);
      return undefined;
    });
}

function buildPlan(
  msg: { plan_date: string; build_options: PlanBuildOptions; },
  user: Auth.User
) {
  return fetch(`/api/plans/build/${msg.plan_date}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(msg.build_options)
  })
    .then((response: Response) => {
        if (response.status === 400) return response.json();
        else return undefined;
      })
      .then((json: unknown) => {
        if (json) {
          const error_json = json as ErrorResponse;
          if (error_json.details) {
            return error_json;
          }
          return undefined;
        }
      });
}

function copyPlan(
  msg: { plan_date: string; },
  user: Auth.User
) {
  return fetch(`/api/plans/copy/${msg.plan_date}`, {
    method: "POST",
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 400) return response.json();
      else return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        const error_json = json as ErrorResponse;
        if (error_json.details) {
          return error_json;
        }
        return undefined;
      }
    });
}

function sendPlan(
  msg: { plan_date: string; },
  user: Auth.User
) {
  return fetch(`/api/plans/send/${msg.plan_date}`, {
    method: "POST",
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 400) return response.json();
      else return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        const error_json = json as ErrorResponse;
        if (error_json.details) {
          return error_json;
        }
        return undefined;
      }
    });
}

function addPlan(
  msg: { plan_date: string; },
  user: Auth.User
) {
  return fetch(`/api/plans/add/${msg.plan_date}`, {
    method: "POST",
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 400) return response.json();
      else return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        const error_json = json as ErrorResponse;
        if (error_json.details) {
          return error_json;
        }
        return undefined;
      }
    });
}

function selectStaffMember(
  msg: { user_id: number },
  user: Auth.User
) {
  return fetch(`/api/staff/${msg.user_id}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Staff Member:", json);
        return json as Staff;
      }
    });
}

function selectStaff(
  msg: { filter_status_ids?: Array<number>; filter_can_clean?: boolean; },
  user: Auth.User
) {
  // Base URL
  let url = `/api/staff`;

  // Add query parameters if filter_status_ids is defined and not empty
  if (msg.filter_status_ids && msg.filter_status_ids.length > 0) {
    const queryParams = msg.filter_status_ids.map(id => `filter_status_id=${id}`).join('&');
    url += `?${queryParams}`;
    if (msg.filter_can_clean) {
      url += `&filter_can_clean=true`
    }
  } else if (msg.filter_can_clean) {
    url += `?filter_can_clean=true`
  }

  return fetch(url, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Staff:", json);
        return json as Array<Staff>;
      }
    });
}

function selectServices(
  user: Auth.User
) {
  return fetch(`/api/services`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Services:", json);
        return json as Array<Service>;
      }
    });
}