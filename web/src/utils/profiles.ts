import { stringify } from "qs";
import { select } from "./crud";

interface ProfileFilter {
  id: number;
}

export async function allProfiles(payload?: ProfileFilter) {
  let url: string;
  if (payload) {
    url = "/api/profiles?".concat(stringify(payload));
  } else {
    url = "/api/profiles";
  }
  const res = await select(url);
  return res;
}

export async function getProfilesQuery() {
  const url = "/api/profiles/get-profiles";
  const res = await select(url);
  return res;
}
