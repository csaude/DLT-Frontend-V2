import { stringify } from 'qs';
import { create, select, update } from './crud';

interface ProfileFilter{
    id: number
}

export async function allProfiles(payload?: ProfileFilter){
    let url: string;
    if(payload) {
        url = '/api/profiles?'.concat(stringify(payload));
    } else {
        url = '/api/profiles';
    }
    const res = await select(url);
    return res;
}