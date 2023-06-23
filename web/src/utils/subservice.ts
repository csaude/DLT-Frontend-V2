import { create, select, update } from "./crud";

export async function queryAll() {
  const url = "/api/subservices/all";
  const res = await select(url);
  return res;
}

export async function add(payload: any) {
  const res = await create("/api/subservices", payload);
  return res;
}

export async function edit(payload: any) {
  const res = await update("/api/subservices", payload);
  return res;
}
