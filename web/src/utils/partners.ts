import { stringify } from 'qs';
import { create, select, update } from './crud';

interface PartnersFilter{
    id: number,
    partnerType: number
}

export async function allPartners(payload?: PartnersFilter){
    let url: string;
    if(payload) {
        url = '/api/partners?'.concat(stringify(payload));
    } else {
        url = '/api/partners';
    }
    const res = await select(url);
    return res;
}
export async function allPartnersByType(payload?: any){
    let url: string;
    url = '/api/partners/'.concat(payload);
    const res = await select(url);
    return res;
}