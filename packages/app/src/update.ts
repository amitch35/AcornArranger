import { Auth, Update } from "@calpoly/mustang";
import { Property, Role, Staff } from "server/models";
import { Msg } from "./messages";
import { Model } from "./model";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "properties/save":
        saveProperty(message[1], user).then((property) =>
        apply((model) => ({ ...model, property }))
      );
      break;
    case "properties/select":
      selectProperty(message[1], user).then((property) =>
        apply((model) => ({ ...model, property }))
      );
      break;
    case "roles/select":
        selectRole(message[1], user).then(
        (role: Role | undefined) =>
          apply((model) => ({ ...model, role }))
      );
      break;
    case "staff/":
        selectStaff(message[1], user).then(
        (staff: Array<Staff> | undefined) =>
          apply((model) => ({ ...model, staff }))
      );
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

function selectStaff(
  msg: { filter_status_ids?: Array<number> },
  user: Auth.User
) {
  // Base URL
  let url = `/api/staff`;

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
        console.log("Staff:", json);
        return json as Array<Staff>;
      }
    });
}