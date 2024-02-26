import { stringify } from "qs";
import { select } from "./crud";

export async function query(payload?: any) {
  let url: string;
  if (payload.profile) {
    url = "/api/beneficiary-intervention?".concat(stringify(payload));
  } else {
    url = "/api/beneficiary-intervention/byBeneficiaryId/" + payload;
  }

  const res = await select(url);
  return res;
}

export async function getInterventionCountAllInterventionsAndbByServiceTypeQuery() {
  const url =
    "/api/beneficiary-intervention/countAllInterventionsAndbByServiceType";

  const res = await select(url);
  return res;
}

export async function pagedQueryByBeneficiariesIds(ids?: number[]) {
  const url = `/api/beneficiary-intervention/byBeneficiariesIds?&params=${ids}`;
  const res = await select(url);
  return res;
}

export async function getInterventionCountByBeneficiaryAndServiceTypeQuery(
  beneficiaryId: number
) {
  const url = `/api/beneficiary-intervention/countByBeneficiaryAndServiceType/${beneficiaryId}`;

  const res = await select(url);
  return res;
}

export async function getInterventionCountByBeneficiaryIdAndAgeBandAndLevelQuery(
  beneficiaryId: number,
  ageBand: number,
  level: number
) {
  const url = `/api/beneficiary-intervention/countByBeneficiaryAndAgeBandAndLevel/${beneficiaryId}/${ageBand}/${level}`;

  const res = await select(url);
  return res;
}
