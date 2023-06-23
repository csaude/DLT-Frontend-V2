//import { stringify } from 'qs';
import { create, select, update } from './crud';

interface LoginParams {
    username: string,
    password: string;
}

export interface NewPasswordParams{
    username: string,
    recoverPassword: string;
}

export async function authenticate(payload: LoginParams) {
    const res = await create('/api/login', null, payload);
    return res;
}

export async function userNewPassword(payload: NewPasswordParams) {
    const res = await update('/api/users/change-password', payload);
    return res;
}

export async function verifyUserByUsername(username:string) {
    const res = await select(`/api/users/username/${username}`);
    return res;
}

export async function checkPasswordValidity(username:string) {
    const res = await select(`/api/users/username/${username}/password-validity`);
    return res;
}