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

export async function pagedQuery(payload?: any, pageIndex?: any, pageSize?: any) {
    let url: string;
    if (payload.profile){
      url = '/api/beneficiaries?'.concat(stringify(payload)).concat('&pageIndex='.concat(pageIndex).concat('&pageSize=').concat(pageSize));
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

export async function queryCount(payload?: any) {
    let url = '/api/beneficiaries/count?'.concat(stringify(payload));

    const res = await select(url);
    return res;
}