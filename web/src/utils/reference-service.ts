import { stringify } from "qs";
import { select, update } from "./crud";

export async function query(payload?: any) {
  let url: string;
  if (payload.profile) {
    url = "/api/reference-service?".concat(stringify(payload));
  } else {
    url = "/api/reference-service/byReferenceId/" + payload;
  }

  const res = await select(url);
  return res;
}

export async function decline(byReferenceId: number, serviceId: number) {
  const res = await update(
    `/api/reference-service/decline/${byReferenceId}/${serviceId}`
  );
  return res;
}
