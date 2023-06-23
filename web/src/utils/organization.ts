import { stringify } from "qs";
import { create, select, update } from "./crud";

export async function allOrganization() {
  const url = "/api/partners/";
  const res = await select(url);
  return res;
}

export async function add(payload: any) {
  const res = await create("/api/partners", payload);
  return res;
}

export async function edit(payload: any) {
  const res = await update("/api/partners", payload);
  return res;
}
interface OrganizationFilter {
  id: number;
}

export async function allOrganizationById(payload?: OrganizationFilter) {
  let url: string;
  if (payload) {
    url = "/api/partners?".concat(stringify(payload));
  } else {
    url = "/api/partners";
  }
  const res = await select(url);
  return res;
}
