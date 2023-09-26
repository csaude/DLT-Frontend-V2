import { stringify } from "qs";
import { create, select, update } from "./crud";

export async function query(payload?: any) {
  let url: string;
  if (payload.profile) {
    url = "/api/beneficiaries?".concat(stringify(payload));
  } else {
    url = "/api/beneficiaries/" + payload;
  }

  const res = await select(url);
  return res;
}

export async function pagedQueryByFilters(
  payload?: any,
  pageIndex?: any,
  pageSize?: any,
  searchNui?: any,
  searchUserCreator?: number,
  searchDistrict?: number
) {
  let url: string;
  if (payload.userId) {
    url = `/api/beneficiaries?${stringify(
      payload
    )}&pageIndex=${pageIndex}&pageSize=${pageSize}&searchNui=${searchNui}&searchUserCreator=${searchUserCreator}&searchDistrict=${searchDistrict}`;
  } else {
    url = "/api/beneficiaries/" + payload;
  }

  const res = await select(url);
  return res;
}

export async function pagedQueryByIds(
  pageIndex?: any,
  pageSize?: any,
  ids?: number[]
) {
  const url = `/api/beneficiaries/ids?pageIndex=${pageIndex}&pageSize=${pageSize}&params=${ids}`;
  const res = await select(url);
  return res;
}

export async function add(payload: any) {
  const res = await create("/api/beneficiaries", payload);
  return res;
}

export async function edit(payload: any) {
  const res = await update("/api/beneficiaries", payload);
  return res;
}

export async function queryCountByFilters(
  payload?: any,
  searchNui?: any,
  searchUserCreator?: number,
  searchDistrict?: number
) {
  const url = `/api/beneficiaries/countByFilters?${stringify(
    payload
  )}&searchNui=${searchNui}&searchUserCreator=${searchUserCreator}&searchDistrict=${searchDistrict}`;

  const res = await select(url);
  return res;
}
