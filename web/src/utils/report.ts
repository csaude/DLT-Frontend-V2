import { select } from "./crud";

export async function agywPrevQuery(
  districts?: any,
  startDate?: any,
  endDate?: any
) {
  const url = `/api/agyw-prev?districts=${districts}&startDate=${startDate}&endDate=${endDate}`;
  const res = await select(url);
  return res;
}

export async function serviceAgesBandsQuery() {
  const url = "/api/service-agebands";
  const res = await select(url);
  return res;
}

export async function getNewlyEnrolledAgywAndServices(
  districts?: any,
  startDate?: any,
  endDate?: any
) {
  const url = `/api/agyw-prev/getNewlyEnrolledAgywAndServices?districts=${districts}&startDate=${startDate}&endDate=${endDate}`;
  const res = await select(url);
  return res;
}
