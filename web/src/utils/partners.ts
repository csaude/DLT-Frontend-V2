import { stringify } from "qs";
import { select } from "./crud";

interface PartnersFilter {
  id: number;
  partnerType: number;
}

export async function allPartners(payload?: PartnersFilter) {
  let url: string;
  if (payload) {
    url = "/api/partners?".concat(stringify(payload));
  } else {
    url = "/api/partners";
  }
  const res = await select(url);
  return res;
}

export async function allPartnersByType(payload?: any) {
  const url = "/api/partners/".concat(payload);
  const res = await select(url);
  return res;
}

interface PartnerTypeFilter {
  type: string;
  districtId: number;
}

export async function allPartnersByTypeDistrict(payload?: PartnerTypeFilter) {
  let url: string;
  if (payload) {
    url = "/api/partners/" + payload.type + "/" + payload.districtId;
    const res = await select(url);
    return res;
  }
}

interface PartnerFilter {
  districts: string[];
}

export async function allPartnersByDistricts(payload?: PartnerFilter) {
  let url: string;

  const dists = payload?.districts.map((v) => {
    return `districts=${v}`;
  });
  const param = dists?.join("&");

  if (param) {
    url = "/api/partners/byDistricts?".concat(param);
  } else {
    url = "/api/partners";
  }
  const res = await select(url);
  return res;
}

export async function getPartnersQuery() {
  const url = "/api/partners/get-partners";
  const res = await select(url);
  return res;
}
