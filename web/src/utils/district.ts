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

interface DistrictIdsFilter {
  districts: string[];
}

export async function allDistrictsByIds(payload?: DistrictIdsFilter) {
  let url: string;

  const dests = payload?.districts.map((v) => {
    return `id=${v}`;
  });
  const param = dests?.join("&");

  if (param) {
    url = "/api/districtsIds?".concat(param);
  } else {
    url = "/api/districts";
  }

  const res = await select(url);
  return res;
}
