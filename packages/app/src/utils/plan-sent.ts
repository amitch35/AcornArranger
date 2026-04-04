import type { Plan } from "server/models";

export function planHasAnySentToRc(plan: Plan): boolean {
    return (plan.appointments ?? []).some((a) => a.sent_to_rc != null);
}

export function plansDayHasAnySentToRc(plans: Plan[] | undefined): boolean {
    return !!plans?.length && plans.some(planHasAnySentToRc);
}
