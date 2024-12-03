import { stringify } from "qs";
import { create, select, update } from "./crud";

interface ReferenceFilter {
  referenceNote: string;
  statusRef: string;
}
export interface BulkReferenceCancel {
  ids: any[];
  status: string;
  cancelReason: string;
  otherReason: string;
  updatedBy?: string;
}
export interface Reference {
  id?: string;
  beneficiaries: {
    id: string;
  };
  referredBy: {
    id: string;
  };
  notifyTo: {
    id: string;
  };
  us: {
    id: string;
  };
  referenceNote: string;
  description: string;
  referTo: string;
  bookNumber: string;
  referenceCode: string;
  serviceType: string;
  date: string;
  remarks: string;
  status: string;
  cancelReason: string;
  otherReason: string;
  userCreated: string;
  dateCreated: any;
  updatedBy?: string;
  dateUpdated?: any;
  referencesServiceses: [];
}

export async function query(payload?: ReferenceFilter) {
  let url: string;
  if (payload) {
    url = "/api/references?".concat(stringify(payload));
  } else {
    url = "/api/references";
  }
  const res = await select(url);
  return res;
}

export async function add(payload: Reference) {
  const res = await create("/api/references", payload);
  return res;
}

export async function edit(payload: any) {
  const res = await update("/api/references/", payload);
  return res;
}

export async function bulkCancelSelected(payload: BulkReferenceCancel) {
  const res = await update("/api/references/bulkCancel", payload);
  return res;
}

export async function bulkCancelAll(
  payload: BulkReferenceCancel,
  userId: number
) {
  const res = await update(`/api/references/bulkCancelAll/${userId}`, payload);
  return res;
}

export async function queryByCreated(id: any) {
  const res = await select("/api/references/user/".concat(id));
  return res;
}

export async function queryByUser(id: any) {
  const res = await select("/api/references/byUser/".concat(id));
  return res;
}

export async function pagedQueryByUser(
  id?: any,
  pageIndex?: any,
  pageSize?: any,
  searchNui?: any,
  searchUserCreator?: number,
  searchDistrict?: number,
  searchStartDate?: any,
  searchEndDate?: any
) {
  if (searchStartDate === undefined || searchEndDate === undefined) {
    searchStartDate = 1483252734; // 01 de Janeiro de 2017 -- Para poder pegar todos dados desde inicio do uso do sistema
    searchEndDate = dateTotimestamp(new Date());
  } else {
    searchStartDate = dateTotimestamp(searchStartDate);
    searchEndDate = dateTotimestamp(searchEndDate);
  }

  const res = await select(
    `/api/references/byUser/${id}?pageIndex=${pageIndex}&pageSize=${pageSize}&searchNui=${undefinedToEmpty(
      searchNui
    )}&searchUserCreator=${undefinedToEmpty(
      searchUserCreator
    )}&searchDistrict=${undefinedToEmpty(
      searchDistrict
    )}&searchStartDate=${searchStartDate}&searchEndDate=${searchEndDate}`
  );

  return res;
}

function dateTotimestamp(value: any) {
  const temp = (new Date(value).getTime() / 1000).toString();
  const res = temp.slice(0, 10);

  return res;
}

export async function pagedQueryPendingByUser(
  id?: any,
  pageIndex?: any,
  pageSize?: any,
  searchStartDate?: any,
  searchEndDate?: any
) {
  if (searchStartDate === undefined || searchEndDate === undefined) {
    searchStartDate = 1483252734; // 01 de Janeiro de 2017 -- Para poder pegar todos dados desde inicio do uso do sistema
    searchEndDate = dateTotimestamp(new Date());
  } else {
    searchStartDate = dateTotimestamp(searchStartDate);
    searchEndDate = dateTotimestamp(searchEndDate);
  }

  const res = await select(
    `/api/references/pendingByUser/${id}?pageIndex=${pageIndex}&pageSize=${pageSize}&searchStartDate=${searchStartDate}&searchEndDate=${searchEndDate}`
  );

  return res;
}

export async function queryCountByFilters(
  id?: any,
  searchNui?: any,
  searchUserCreator?: number,
  searchDistrict?: number,
  searchStartDate?: any,
  searchEndDate?: any
) {
  if (searchStartDate === undefined || searchEndDate === undefined) {
    searchStartDate = 1483252734;
    searchEndDate = dateTotimestamp(new Date());
  } else {
    searchStartDate = dateTotimestamp(searchStartDate);
    searchEndDate = dateTotimestamp(searchEndDate);
  }

  const res = await select(
    `/api/references/byUser/${id}/countByFilters?searchNui=${undefinedToEmpty(
      searchNui
    )}&searchUserCreator=${undefinedToEmpty(
      searchUserCreator
    )}&searchDistrict=${undefinedToEmpty(
      searchDistrict
    )}&searchStartDate=${searchStartDate}&searchEndDate=${searchEndDate}`
  );
  return res;
}

export async function queryCountByPendingFilters(
  id?: any,
  searchStartDate?: any,
  searchEndDate?: any
) {
  if (searchStartDate === undefined || searchEndDate === undefined) {
    searchStartDate = 1483252734;
    searchEndDate = dateTotimestamp(new Date());
  } else {
    searchStartDate = dateTotimestamp(searchStartDate);
    searchEndDate = dateTotimestamp(searchEndDate);
  }
  const res = await select(
    `/api/references/byPeddingUser/${id}/countByFilters?searchStartDate=${searchStartDate}&searchEndDate=${searchEndDate}`
  );
  return res;
}

function undefinedToEmpty(value: any) {
  return value == undefined ? "" : value;
}

export async function getReferencesCountByBeneficiaryQuery(
  beneficiaryId: number
) {
  const res = await select(
    `/api/references/countByBeneficiary/${beneficiaryId}`
  );
  return res;
}

export async function queryById(id: number) {
  let res: any;
  if (id) {
    const url = `/api/references/${id}`;
    res = await select(url);
  }
  return res;
}
