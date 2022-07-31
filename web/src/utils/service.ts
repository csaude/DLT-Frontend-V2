import { stringify } from 'qs';
import { create, select, update } from './crud';

export async function query(payload?: any){
    let url: string;
    if(payload) {
        url = '/api/services?'.concat(stringify(payload));
    } else {
        url = '/api/services';
    }
    const res = await select(url);
    return res;
}

export async function queryByType(payload?: any){
    let url: string;
    url = '/api/services/'.concat(payload);
    const res = await select(url);
    return res;
}

export async function querySubServiceByService(payload?: any){
    let url: string;
    url = '/api/subservices/'.concat(payload);
    const res = await select(url);
    return res;
}

export interface SubServiceParams {
    id: {
        beneficiaryId: string;
        subServiceId: string;
        date: string;
    },
    beneficiaries: {
        id:string
    },
    subServices: {
        id:string
    };
    result: string;
    us: any;
    activistId: string;
    entryPoint: string;
    provider: string;
    remarks: string;
    status: string;
    createdBy: string;
}

export async function addSubService(payload: SubServiceParams) {
    const res = await create('/api/beneficiary-intervention', payload);
    return res;
}

export async function updateSubService(payload: SubServiceParams) {
    const res = await update('/api/beneficiary-intervention', payload);
    return res;
}
