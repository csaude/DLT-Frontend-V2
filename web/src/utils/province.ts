import { create, select, update } from "./crud";

export async function queryAll() {
  const url = "/api/provinces";
  const res = await select(url);
  return res;
}

export async function add(payload: any) {
  const res = await create("/api/provinces", payload);
  return res;
}

export async function edit(payload: any) {
  const res = await update("/api/provinces", payload);
  return res;
}
