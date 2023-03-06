import { stringify } from 'qs';
import { create, select, update } from './crud';

export async function agywPrevQuery(districts?: any, startDate?: any, endDate?: any) {
    let url: string;
    url = '/api/agyw-prev?'.concat('districts='.concat(districts)).concat('&startDate='.concat(startDate)).concat('&endDate='.concat(endDate));
    const res = await select(url);
    return res;
}
