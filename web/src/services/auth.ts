import {removeWindowClass} from '@app/utils/helpers';
import {Gatekeeper} from 'gatekeeper-client-sdk';
import {authenticate} from '../utils/login';
import { requestUpdatePassword } from '@app/utils/users';

export const loginByAuth = async (email: string, password: string) => {
  const response =  await authenticate({username:email, password:password});
  const { status, data } = response;
  localStorage.setItem('token', data.token);
  localStorage.setItem('userEmail', data.account.email);
  localStorage.setItem('userRole', data.account?.profiles.name);
  localStorage.setItem('isNewPassword', data.account.newPassword);
  removeWindowClass('login-page');
  removeWindowClass('hold-transition');
  return data;
  /*const token = await Gatekeeper.loginByAuth(email, password);
  localStorage.setItem('token', token);
  removeWindowClass('login-page');
  removeWindowClass('hold-transition');
  return token;*/


};

export const updatePassword = async (username: string, password: string) => {
  const response = await requestUpdatePassword({username:username, recoverPassword:password});
  const { status, data } = response;
  return data;
};

export const registerByAuth = async (email: string, password: string) => {
  const token = await Gatekeeper.registerByAuth(email, password);
  localStorage.setItem('token', token);
  removeWindowClass('register-page');
  removeWindowClass('hold-transition');
  return token;
};

export const loginByGoogle = async () => {
  const token = await Gatekeeper.loginByGoogle();
  localStorage.setItem('token', token);
  removeWindowClass('login-page');
  removeWindowClass('hold-transition');
  return token;
};

export const registerByGoogle = async () => {
  const token = await Gatekeeper.registerByGoogle();
  localStorage.setItem('token', token);
  removeWindowClass('register-page');
  removeWindowClass('hold-transition');
  return token;
};

export const loginByFacebook = async () => {
  const token = await Gatekeeper.loginByFacebook();
  localStorage.setItem('token', token);
  removeWindowClass('login-page');
  removeWindowClass('hold-transition');
  return token;
};

export const registerByFacebook = async () => {
  const token = await Gatekeeper.registerByFacebook();
  localStorage.setItem('token', token);
  removeWindowClass('register-page');
  removeWindowClass('hold-transition');
  return token;
};
