import { Auth } from "@calpoly/mustang";
import type { ThenUpdate } from "@calpoly/mustang";
import { Appointment, Property, Role, Staff, Plan, PlanBuildOptions, Service, StaffShift } from "server/models";
import { Msg } from "./messages";
import { Model } from "./model";
import { ErrorResponse } from "server/models";

// `Message.None` is exported as `[]`. Use a local alias for readability.
type None = [];

// Helper: build a model/patch message that mustang will dispatch back to update.
// Returning `None` instead skips the patch (used when the fetch returned no data).
function patch(p: Partial<Model>): Msg {
  return ["model/patch", p];
}

export default function update(
  message: Msg,
  model: Model,
  user: Auth.User
): Model | ThenUpdate<Model, Msg> {
  switch (message[0]) {
    case "properties/save":
      return [
        model,
        saveProperty(message[1], user)
          .then((property): Msg | None => {
            const { onSuccess } = message[1];
            if (onSuccess) onSuccess();
            return property ? patch({ property }) : [];
          })
          .catch((error: Error): None => {
            const { onFailure } = message[1];
            if (onFailure) onFailure(error);
            return [];
          })
      ];

    case "properties/select":
      return [
        model,
        selectProperty(message[1], user).then(
          (property): Msg | None =>
            property ? patch({ property }) : []
        )
      ];

    case "properties/":
      return [
        model,
        selectProperties(message[1], user).then(
          (properties): Msg | None =>
            properties ? patch({ properties }) : []
        )
      ];

    case "roles/save":
      return [
        model,
        saveRole(message[1], user).then(
          (role): Msg | None => (role ? patch({ role }) : [])
        )
      ];

    case "roles/select":
      return [
        model,
        selectRole(message[1], user).then(
          (role: Role | undefined): Msg | None =>
            role ? patch({ role }) : []
        )
      ];

    case "roles/":
      return [
        model,
        selectRoles(user).then(
          (roles): Msg | None => (roles ? patch({ roles }) : [])
        )
      ];

    case "appointments/select":
      return [
        model,
        selectAppointment(message[1], user).then(
          (appointment: Appointment | undefined): Msg | None =>
            appointment ? patch({ appointment }) : []
        )
      ];

    case "appointments/":
      return [
        model,
        selectAppointments(message[1], user).then(
          (appointments: Array<Appointment> | undefined): Msg | None =>
            appointments ? patch({ appointments }) : []
        )
      ];

    case "appointments/select-unscheduled":
      return [
        model,
        selectAppointments(message[1], user).then(
          (unscheduled: Array<Appointment> | undefined): Msg | None =>
            unscheduled ? patch({ unscheduled }) : []
        )
      ];

    case "plans/select":
      return [
        model,
        selectPlan(message[1], user).then(
          (plan: Plan | undefined): Msg | None =>
            plan ? patch({ plan }) : []
        )
      ];

    case "plans/":
      return [
        model,
        selectPlans(message[1], user).then(
          (plans: Array<Plan> | undefined): Msg | None =>
            plans ? patch({ plans }) : []
        )
      ];

    case "plans/staff/add":
      return [
        model,
        addPlanStaff(message[1], user).then(
          (plan: Plan | undefined): Msg | None =>
            plan ? patch({ plan }) : []
        )
      ];

    case "plans/staff/remove":
      return [
        model,
        removePlanStaff(message[1], user).then(
          (plan: Plan | undefined): Msg | None =>
            plan ? patch({ plan }) : []
        )
      ];

    case "plans/appointment/add":
      return [
        model,
        addPlanAppointment(message[1], user).then(
          (plan: Plan | undefined): Msg | None =>
            plan ? patch({ plan }) : []
        )
      ];

    case "plans/appointment/remove":
      return [
        model,
        removePlanAppointment(message[1], user).then(
          (plan: Plan | undefined): Msg | None =>
            plan ? patch({ plan }) : []
        )
      ];

    case "plans/build":
      return [
        model,
        buildPlan(message[1], user).then(
          (error: ErrorResponse | undefined): Msg => patch({ build_error: error })
        )
      ];

    case "plans/copy":
      return [
        model,
        copyPlan(message[1], user).then(
          (error: ErrorResponse | undefined): Msg => patch({ build_error: error })
        )
      ];

    case "plans/send":
      return [
        model,
        sendPlan(message[1], user).then(
          (error: ErrorResponse | undefined): Msg => patch({ build_error: error })
        )
      ];

    case "plans/add":
      return [
        model,
        addPlan(message[1], user).then(
          (error: ErrorResponse | undefined): Msg => patch({ build_error: error })
        )
      ];

    case "staff/select":
      return [
        model,
        selectStaffMember(message[1], user).then(
          (staff_member: Staff | undefined): Msg | None =>
            staff_member ? patch({ staff_member }) : []
        )
      ];

    case "staff/":
      return [
        model,
        selectStaff(message[1], user).then(
          (staff: Array<Staff> | undefined): Msg | None =>
            staff ? patch({ staff }) : []
        )
      ];

    case "staff/shifts":
      return [
        model,
        selectShifts(message[1], user).then(
          (shifts: Array<StaffShift> | undefined): Msg | None =>
            shifts ? patch({ shifts }) : []
        )
      ];

    case "services/":
      return [
        model,
        selectServices(user).then(
          (services: Array<Service> | undefined): Msg | None =>
            services ? patch({ services }) : []
        )
      ];

    case "available/save":
      return { ...model, available: message[1].available };

    case "omissions/save":
      return { ...model, omissions: message[1].omissions };

    case "build_error/reset":
      return { ...model, build_error: undefined };

    case "model/patch":
      return { ...model, ...message[1] };

    default:
      const unhandled: never = message;
      throw new Error(`Unhandled message ${JSON.stringify(unhandled)}`);
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
      return undefined;
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
      return undefined;
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
      return undefined;
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
      return undefined;
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
      return undefined;
    });
}

function selectAppointments(
  msg: {
    from_service_date: string;
    to_service_date: string;
    per_page?: number;
    page?: number;
    filter_status_ids?: Array<number>;
    filter_service_ids?: Array<number>;
    show_unscheduled?: boolean;
  },
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
  if (msg.show_unscheduled) {
    url += `&show_unscheduled=${msg.show_unscheduled}`;
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
      return undefined;
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
      return undefined;
    });
}

function selectPlans(
  msg: {
    from_plan_date: string;
    to_plan_date?: string;
    per_page?: number;
    page?: number;
  },
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
      return undefined;
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
      return undefined;
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
      return undefined;
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
      return undefined;
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
      return undefined;
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
      return undefined;
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
      return undefined;
    });
}

function selectShifts(
  msg: {
    from_shift_date: string;
    to_shift_date?: string;
  },
  user: Auth.User
) {
  // Base URL
  let url = `/api/staff/shifts?from_shift_date=${msg.from_shift_date}`;

  // Add query parameters if present
  if (msg.to_shift_date) {
    url += `&to_shift_date=${msg.to_shift_date}`;
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
        console.log("Shifts:", json);
        return json as Array<StaffShift>;
      }
      return undefined;
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
      return undefined;
    });
}
