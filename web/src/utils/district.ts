import { stringify } from 'qs';
import { create, select, update } from './crud';

interface DistrictFilter{
    id: number
}

export async function allDistrictById(payload?: DistrictFilter){
    let url: string;
    if(payload) {
        url = '/api/partners?'.concat(stringify(payload));
    } else {
        url = '/api/partners';
    }
    const res = await select(url);
    return res;
}
export async function allDistrict(){
    let url: string;
    url = '/api/getdistricts/';
    const res = await select(url);
    return res;
}