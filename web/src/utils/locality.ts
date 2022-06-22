import { stringify } from 'qs';
import { create, select, update } from './crud';

interface LocalityFilter{
    id: number
}

export async function allLocality(payload?: LocalityFilter){
    let url: string;

    if(payload) {
        url = '/api/localities?'.concat(stringify(payload));
    } else {
        url = '/api/localities';
    }
    const res = await select(url);
    return res;
}


export async function allProvinces(payload?: any){
    let url: string;
    if(payload) {
        url = '/api/getprovinces?'.concat(stringify(payload));
    } else {
        url = '/api/getprovinces';
    }
    const res = await select(url);
    return res;
}
interface DistrictFilter{
    provinces: string[];
}
export async function queryDistrictsByProvinces(payload?: DistrictFilter){
    let url: string;

    let provs = payload?.provinces.map((v)=>{
        return `provinces=${v}`
    });
     const param = provs?.join('&');

    if(param) {
        url = '/api/provdisctricts?'.concat(param);
    } else {
        url = '/api/provdisctricts';
    }
    const res = await select(url);
    return res;
}

interface LocalitiesFilter{
    districts: string[];
}
export async function queryLocalitiesByDistricts(payload?: LocalitiesFilter){
    let url: string;

    let dists = payload?.districts.map((v)=>{
        return `districts=${v}`
    });
     const param = dists?.join('&');

    if(param) {
        url = '/api/distlocalities?'.concat(param);
    } else {
        url = '/api/distlocalities';
    }
    const res = await select(url);
    return res;
}