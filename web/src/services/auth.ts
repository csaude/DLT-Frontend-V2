import { removeWindowClass } from "@app/utils/helpers";
import { Gatekeeper } from "gatekeeper-client-sdk";
import { authenticate, userNewPassword } from "../utils/login";
import { requestUpdatePassword } from "@app/utils/users";

export const loginByAuth = async (email: string, password: string) => {
  const response = await authenticate({ username: email, password: password });
  const { data } = response;
  localStorage.setItem("token", data.token);
  localStorage.setItem("username", data.account.username);
  localStorage.setItem("userEmail", data.account.email);
  localStorage.setItem("userRole", data.account?.profiles.name);
  localStorage.setItem("isNewPassword", data.account.newPassword);
  localStorage.setItem("entryPoint", data.account.entryPoint);
  localStorage.setItem("organization", data.account.partners.id);
  localStorage.setItem(
    "us",
    data.account.us.map((u) => u.id)
  );
  localStorage.setItem("user", data.account.id);
  removeWindowClass("login-page");
  removeWindowClass("hold-transition");
  return data;
  /*const token = await Gatekeeper.loginByAuth(email, password);
  localStorage.setItem('token', token);
  removeWindowClass('login-page');
  removeWindowClass('hold-transition');
  return token;*/
};

export const newPassword = async (username: string, newPassword: string) => {
  const response = await userNewPassword({
    username: username,
    recoverPassword: newPassword,
  });
  const { data } = response;
  localStorage.setItem("isNewPassword", "0");
  return data;
};

export const updatePassword = async (username: string, password: string) => {
  const recoverPasswordOrigin = document.location.origin;
  const response = await requestUpdatePassword({
    username: username,
    recoverPassword: password,
    recoverPasswordOrigin: recoverPasswordOrigin,
  });
  const { data } = response;
  return data;
};

export const registerByAuth = async (email: string, password: string) => {
  const token = await Gatekeeper.registerByAuth(email, password);
  localStorage.setItem("token", token);
  removeWindowClass("register-page");
  removeWindowClass("hold-transition");
  return token;
};

export const loginByGoogle = async () => {
  const token = await Gatekeeper.loginByGoogle();
  localStorage.setItem("token", token);
  removeWindowClass("login-page");
  removeWindowClass("hold-transition");
  return token;
};

export const registerByGoogle = async () => {
  const token = await Gatekeeper.registerByGoogle();
  localStorage.setItem("token", token);
  removeWindowClass("register-page");
  removeWindowClass("hold-transition");
  return token;
};

export const loginByFacebook = async () => {
  const token = await Gatekeeper.loginByFacebook();
  localStorage.setItem("token", token);
  removeWindowClass("login-page");
  removeWindowClass("hold-transition");
  return token;
};

export const registerByFacebook = async () => {
  const token = await Gatekeeper.registerByFacebook();
  localStorage.setItem("token", token);
  removeWindowClass("register-page");
  removeWindowClass("hold-transition");
  return token;
};
