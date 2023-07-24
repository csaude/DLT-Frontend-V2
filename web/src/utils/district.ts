import { stringify } from "qs";
import { create, select, update } from "./crud";

export async function allDistrict() {
  const url = "/api/districts/";
  const res = await select(url);
  return res;
}

export async function add(payload: any) {
  const res = await create("/api/districts", payload);
  return res;
}

export async function edit(payload: any) {
  const res = await update("/api/districts", payload);
  return res;
}
interface DistrictFilter {
  id: number;
}

export async function allDistrictById(payload?: DistrictFilter) {
  let url: string;
  if (payload) {
    url = "/api/partners?".concat(stringify(payload));
  } else {
    url = "/api/partners";
  }
  const res = await select(url);
  return res;
}
