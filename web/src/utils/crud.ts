import api from "./axios";

export async function create(url: any, payload: any = {}, params: any = {}) {
  return await api.post(url, payload, { params });
}

export async function update(params: any, payload: any = {}) {
  return await api.put(params, payload);
}

export async function select(params: any) {
  const res = await api.get(params);
  return res.data;
}

export async function download(params: any) {
  const res = await api.get(params, {
    responseType: "blob",
  });
  return res;
}
