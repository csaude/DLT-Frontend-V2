import { stringify } from "qs";
import { create, select, update } from "./crud";

interface UsFilter {
  id: number;
}

export async function allUs(payload?: UsFilter) {
  let url: string;
  if (payload) {
    url = "/api/us?".concat(stringify(payload));
  } else {
    url = "/api/us";
  }
  const res = await select(url);
  return res;
}

export async function allUsType(payload?: UsFilter) {
  let url: string;
  if (payload) {
    url = "/api/ustypes?".concat(stringify(payload));
  } else {
    url = "/api/ustypes";
  }
  const res = await select(url);
  return res;
}

export async function add(payload: any) {
  const res = await create("/api/us", payload);
  return res;
}

export async function edit(payload: any) {
  const res = await update("/api/us", payload);
  return res;
}
interface UsTypeFilter {
  typeId: number;
  localityId: number;
}
export async function allUsByType(payload: UsTypeFilter) {
  let url: string;
  if (payload) {
    url = "/api/us/type/" + payload.typeId + "/" + payload.localityId;
    const res = await select(url);
    return res;
  }
}
interface UsUserFilter {
  userId: number;
  typeId: number;
}
export async function allUsByUser(payload: UsUserFilter) {
  let url: string;
  if (payload) {
    url = "/api/us/typeUser/" + payload.userId + "/" + payload.typeId;
    const res = await select(url);
    return res;
  }
}
