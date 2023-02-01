import { stringify } from 'qs';
import { create, select, update } from './crud';

export async function query(payload?: any) {
    let url: string;
    if (payload.profile){
      url = '/api/reference-service?'.concat(stringify(payload));
    }
    else {
      url = '/api/reference-service/byReferenceId/' + payload;
    }

    const res = await select(url);
    return res;
}
