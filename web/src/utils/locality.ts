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

export async function add(payload:any) {
    const res = await create('/api/localities', payload);
    return res;
}

export async function edit(payload:any) {
    const res = await update('/api/localities', payload);
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

interface NeighborhoodsFilter{
    localities: string[];
}

export async function queryNeighborhoodsByLocalities(payload?: NeighborhoodsFilter){
    let url: string;

    let dists = payload?.localities.map((v)=>{
        return `localities=${v}`
    });
     const param = dists?.join('&');

    if(param) {
        url = '/api/localneighborhoods?'.concat(param);
    } else {
        url = '/api/localneighborhoods';
    }
    const res = await select(url);
    return res;
}

export async function queryUsByLocalities(payload?: NeighborhoodsFilter){
    let url: string;

    let dists = payload?.localities.map((v)=>{
        return `localities=${v}`
    });
     const param = dists?.join('&');

    if(param) {
        url = '/api/localus?'.concat(param);
    } else {
        url = '/api/localus';
    }
    const res = await select(url);
    return res;
}