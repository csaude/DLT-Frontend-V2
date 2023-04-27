import { stringify } from 'qs';
import { create, select, update } from './crud';

interface ReferenceFilter{
    referenceNote: string,
    statusRef: string
}

export interface Reference {
  id?: string;
  beneficiaries: {
      id: string
  },
  referredBy: {
      id:string
  },
  notifyTo: {
      id:string
  },
  us: {
      id:string
  },
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
	referencesServiceses:[];
}

export async function query(payload?: ReferenceFilter) {
    let url: string;
    if (payload) {
      url = '/api/references?'.concat(stringify(payload));
    } else {
      url = '/api/references';
    }
    const res = await select(url);
    return res;
}

export async function add(payload: Reference) {
  const res = await create('/api/references', payload);
  return res;
}
 
export async function edit(payload: any) {
  const res = await update('/api/references/', payload);
  return res;
}

export async function queryByCreated(id: any) {
  const res = await select('/api/references/user/'.concat(id));
  return res;
}

export async function queryByUser(id: any) {
  const res = await select('/api/references/byUser/'.concat(id));
  return res;
}

export async function pagedQueryByUser(id?: any, pageIndex?: any, pageSize?: any, searchNui?: any) {
    const res = await select(`/api/references/byUser/${id}?pageIndex=${pageIndex}&pageSize=${pageSize}&searchNui=${searchNui}`);

    return res;
}

export async function queryCount(id: any) {
    const res = await select('/api/references/byUser/'.concat(id).concat('/count'));
    return res;
}
