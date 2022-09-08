import { stringify } from 'qs';
import { create, select, update } from './crud';

interface UsersFilter{
    name: string
}

export async function query(payload?: UsersFilter) {
    let url: string;
    if (payload) {
      url = '/api/users/' + payload;
    } else {
      url = '/api/users';
    }
    const res = await select(url);
    return res;
}

interface UserParams {
    username: string;
    recoverPassword: string;
}
export async function add(payload: any) {
    const res = await create('/api/users', payload);
    return res;
}
  
export async function edit(payload: any) {
    const res = await update('/api/users/', payload);
    return res;
}

export async function requestUpdatePassword(payload: UserParams) {
    const res = await update('/users/update-password', payload);
    return res;
}

export async function allUsesByUs(payload?: any){
    let url: string;
    url = '/api/users/us/'.concat(payload);
    const res = await select(url);
    return res;
}

export async function userById(payload?: any){
    let url: string;
    url = '/api/users/'.concat(payload);
    const res = await select(url);
    return res;
}