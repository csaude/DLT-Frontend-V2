import { create, select, update } from "./crud";

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

export async function allUsesByUs(payload?: any) {
  const url = "/api/users/us/".concat(payload);
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

export async function requestUpdatePassword(payload: UserParams) {
    const res = await update('/users/update-password', payload);
    return res;
}

export async function allUsesByUs(payload?: any){
    let url: string;
    url = '/api/users/us/'.concat(payload);
    const res = await select(url);
    return res;
}

export async function userById(payload?: any){
    let url: string;
    url = '/api/users/'.concat(payload);
    const res = await select(url);
    return res;
}