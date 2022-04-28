import { stringify } from 'qs';
import { create, select, update } from './crud';

interface BeneficiaryFilter{
    name: string,
    nui: string
}

export async function query(payload?: BeneficiaryFilter) {
    let url: string;
    if (payload) {
      url = '/api/beneficiaries?'.concat(stringify(payload));
    } else {
      url = '/api/beneficiaries';
    }
    const res = await select(url);
    return res;
}