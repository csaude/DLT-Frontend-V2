import { create } from "./crud";

export async function addFromDevice(data: any, username: any) {
  const res = await create(`/sync?username=${username}`, data);
  return res;
}
