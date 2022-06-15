import { stringify } from 'qs';
import { create, select, update } from './crud';

interface ReferenceFilter{
    referenceNote: string,
    statusRef: string
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

export async function add(payload: any) {
  const res = await create('/api/references', payload);
  return res;
}