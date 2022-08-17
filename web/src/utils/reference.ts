import { stringify } from 'qs';
import { create, select, update } from './crud';

interface ReferenceFilter{
    referenceNote: string,
    statusRef: string
}

export interface Reference {
  beneficiaries: {
      id: string
  },
  users: {
      id:string
  },
  referenceNote: string;
	description: string;
	referTo: string;
	bookNumber: string;
	referenceCode: string; 
	serviceType: string;
	remarks: string;
	statusRef: string;
	status: string;
	cancelReason: string; 
	otherReason: string;
	createdBy: string;
	dateCreated: string;
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