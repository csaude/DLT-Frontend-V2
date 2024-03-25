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
  searchName?: any,
  searchUserCreator?: number,
  searchDistrict?: number
) {
  let url: string;
  if (payload.userId) {
    url = `/api/beneficiaries?${stringify(
      payload
    )}&pageIndex=${pageIndex}&pageSize=${pageSize}&searchNui=${searchNui}&searchName=${searchName}&searchUserCreator=${searchUserCreator}&searchDistrict=${searchDistrict}`;
  } else {
    url = "/api/beneficiaries/" + payload;
  }

  const res = await select(url);
  return res;
}

export async function pagedQueryAnyByFilters(
  payload?: any,
  pageIndex?: any,
  pageSize?: any,
  searchNui?: any,
  searchName?: any,
  searchUserCreator?: number,
  searchDistrict?: number
) {
  let url: string;
  if (payload.userId) {
    url = `/api/beneficiaries/any?${stringify(
      payload
    )}&pageIndex=${pageIndex}&pageSize=${pageSize}&searchNui=${searchNui}&searchName=${searchName}&searchUserCreator=${searchUserCreator}&searchDistrict=${searchDistrict}`;
  } else {
    url = "/api/beneficiaries/any/" + payload;
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
  searchName?: any,
  searchUserCreator?: number,
  searchDistrict?: number
) {
  const url = `/api/beneficiaries/countByFilters?${stringify(
    payload
  )}&searchNui=${undefinedToEmpty(searchNui)}&searchName=${undefinedToEmpty(
    searchName
  )}&searchUserCreator=${undefinedToEmpty(
    searchUserCreator
  )}&searchDistrict=${undefinedToEmpty(searchDistrict)}`;

  const res = await select(url);
  return res;
}

function undefinedToEmpty(value: any) {
  return value == undefined ? "" : value;
}

export async function queryByPartnerId(partnerId?: number) {
  const url = `/api/beneficiaries/findByPartnerId?partnerId=${partnerId}`;
  const res = await select(url);
  return res;
}

export async function findByNameAndDateOfBirthAndLocality(
  name?: any,
  dateOfBirth?: any,
  locality?: any
) {
  const url = `/api/beneficiaries/findByNameAndDateOfBirthAndLocality?name=${name}&dateOfBirth=${dateOfBirth}&locality=${locality}`;
  const res = await select(url);
  return res;
}
