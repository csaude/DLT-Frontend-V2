import { create } from "./crud";

export async function addFromDevice(changes: any, username: any) {
  const res = await create(`/sync?username=${username}`, changes);
  return res;
}
