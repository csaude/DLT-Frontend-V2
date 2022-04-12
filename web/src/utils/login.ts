//import { stringify } from 'qs';
import { create, select, update } from './crud';

interface LoginParams {
    username: string,
    password: string;
}
export async function authenticate(payload: LoginParams) {
    const res = await create('/api/login', null, payload);
    return res;
}