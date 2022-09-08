import { stringify } from 'qs';
import { create, select, update } from './crud';

interface BeneficiaryFilter{
    name: string,
    nui: string
}

export async function query(payload?: any) {
    let url: string;
    if (payload.profile){
      url = '/api/beneficiaries?'.concat(stringify(payload));
    }
    else {
      url = '/api/beneficiaries/' + payload;
    }

    const res = await select(url);
    return res;
}

export async function add(payload: any) {
  const res = await create('/api/beneficiaries', payload);
  return res;
}

export async function edit(payload: any) {
  const res = await update('/api/beneficiaries', payload);
  return res;
}