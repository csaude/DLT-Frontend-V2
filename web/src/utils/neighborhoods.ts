import { stringify } from "qs";
import { create, select, update } from "./crud";

interface NeighboiurhoodFilter {
  id: number;
}

export async function allNeighborhoods(payload?: NeighboiurhoodFilter) {
  let url: string;
  if (payload) {
    url = "/api/neighborhood".concat(stringify(payload));
  } else {
    url = "/api/neighborhood";
  }
  const res = await select(url);
  return res;
}

export async function add(payload: any) {
  const res = await create("/api/neighborhood", payload);
  return res;
}

export async function edit(payload: any) {
  const res = await update("/api/neighborhood", payload);
  return res;
}
