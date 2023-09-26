import { create, select, update } from "./crud";
import { stringify } from "qs";
interface UsersFilter {
  name: string;
}

export async function query(payload?: UsersFilter) {
  let url: string;
  if (payload) {
    url = "/api/users/" + payload;
  } else {
    url = "/api/users";
  }
  const res = await select(url);
  return res;
}

export async function queryByUserId(payload?: UsersFilter) {
  let res: any;
  if (payload) {
    const url = "/api/users/" + payload;
    res = await select(url);
  }
  return res;
}

interface UserParams {
  username: string;
  recoverPassword: string;
  recoverPasswordOrigin: string;
}
export async function add(payload: any) {
  const res = await create("/api/users", payload);
  return res;
}

export async function edit(payload: any) {
  const res = await update("/api/users/", payload);
  return res;
}

export async function requestUpdatePassword(payload: UserParams) {
  const res = await update("/users/update-password", payload);
  return res;
}

export async function allUsersByUs(payload?: any) {
  const url = "/api/users/us/".concat(payload);
  const res = await select(url);
  return res;
}

export async function allUsesByLocalities(payload?: any) {
  const url = "/api/users/locality/".concat(payload);
  const res = await select(url);
  return res;
}

interface Filter {
  profiles: string;
  userId: number;
}

export async function allUsersByProfilesAndUser(payload?: Filter) {
  const url =
    "/api/users/byProfilesAndUser/" + payload?.profiles + "/" + payload?.userId;
  const res = await select(url);
  return res;
}

export async function userById(payload?: any) {
  const url = "/api/users/".concat(payload);
  const res = await select(url);
  return res;
}

export async function getUsernamesQuery() {
  const url = "/api/users/get-usernames";
  const res = await select(url);
  return res;
}

interface ProvinceFilter {
  provinces: string[];
}

export async function allUsesByProvinces(payload?: ProvinceFilter) {
  let url: string;

  const provs = payload?.provinces.map((v) => {
    return `provinces=${v}`;
  });
  const param = provs?.join("&");

  if (param) {
    url = "/api/users/provinces?".concat(param);
  } else {
    url = "/api/users/provinces";
  }

  const res = await select(url);
  return res;
}

interface DistrictFilter {
  districts: string[];
}

export async function allUsesByDistricts(payload?: DistrictFilter) {
  let url: string;

  const dests = payload?.districts.map((v) => {
    return `districts=${v}`;
  });
  const param = dests?.join("&");

  if (param) {
    url = "/api/users/districts?".concat(param);
  } else {
    url = "/api/users/districts";
  }

  const res = await select(url);
  return res;
}

export async function pagedQueryByFilters(
  payload?: any,
  pageIndex?: any,
  pageSize?: any,
  searchUsername?: any,
  searchUserCreator?: number
) {
  let url: string;
  if (payload.userId) {
    url = `/api/users/paged?${stringify(
      payload
    )}&pageIndex=${pageIndex}&pageSize=${pageSize}&searchUsername=${searchUsername}&searchUserCreator=${searchUserCreator}`;
  } else {
    url = "/api/users/" + payload;
  }

  const res = await select(url);
  return res;
}
