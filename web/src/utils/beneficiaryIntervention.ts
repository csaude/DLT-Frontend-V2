import { stringify } from 'qs';
import { create, select, update } from './crud';

interface BeneficiaryFilter{
    name: string,
    nui: string
}

export async function query(payload?: any) {
    let url: string;
    if (payload.profile){
      url = '/api/beneficiary-intervention?'.concat(stringify(payload));
    }
    else {
      url = '/api/beneficiary-intervention/byBeneficiaryId/' + payload;
    }

    const res = await select(url);
    return res;
}
