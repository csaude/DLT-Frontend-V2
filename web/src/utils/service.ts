import { stringify } from "qs";
import { create, select, update } from "./crud";

export async function queryAll() {
  const url = "/api/services/all";
  const res = await select(url);
  return res;
}

export async function query(payload?: any) {
  let url: string;
  if (payload) {
    url = "/api/services?".concat(stringify(payload));
  } else {
    url = "/api/services";
  }
  const res = await select(url);
  return res;
}

export async function queryByType(payload?: any) {
  const url = "/api/services/".concat(payload);
  const res = await select(url);
  return res;
}

interface ServicesFilter {
  serviceType: string;
  beneficiaryId: number;
}

export async function queryByTypeAndBeneficiary(payload?: ServicesFilter) {
  const url =
    "/api/services/byTypeAndBeneficiary/" +
    payload?.serviceType +
    "/" +
    payload?.beneficiaryId;
  const res = await select(url);
  return res;
}

export async function querySubServiceByService(payload?: any) {
  const url = "/api/subservices/".concat(payload);
  const res = await select(url);
  return res;
}

export async function add(payload: any) {
  const res = await create("/api/services", payload);
  return res;
}

export async function edit(payload: any) {
  const res = await update("/api/services", payload);
  return res;
}

export interface SubServiceParams {
  id: {
    beneficiaryId: string;
    subServiceId: string;
    date: string;
  };
  beneficiaries: {
    id: string;
  };
  subServices: {
    id: string;
  };
  date: string;
  result: string;
  us: any;
  activistId: string;
  entryPoint: string;
  provider: string;
  remarks: string;
  endDate: string;
  status: string;
  createdBy: string;
  updatedBy?: string;
}

export async function addSubService(payload: SubServiceParams) {
  const res = await create("/api/beneficiary-intervention", payload);
  return res;
}

export async function updateSubService(payload: SubServiceParams) {
  const res = await update("/api/beneficiary-intervention", payload);
  return res;
}
