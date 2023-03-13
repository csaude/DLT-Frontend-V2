import { stringify } from 'qs';
import { create, select, update } from './crud';

export async function agywPrevQuery(districts?: any, startDate?: any, endDate?: any) {
    let url: string;
      url = `/api/agyw-prev?districts=${districts}&startDate=${startDate}&endDate=${endDate}`;
    const res = await select(url);
    return res;
}
