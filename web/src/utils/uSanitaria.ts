import { stringify } from 'qs';
import { create, select, update } from './crud';

interface UsFilter{
    id: number
}

export async function allUs(payload?: UsFilter){
    let url: string;
    if(payload) {
        url = '/api/us?'.concat(stringify(payload));
    } else {
        url = '/api/us';
    }
    const res = await select(url);
    return res;
}