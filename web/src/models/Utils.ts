import moment from "moment";

export function calculateAge(value: any) {
  const today = new Date();
  const bday = moment(value).format("YYYY-MM-DD");
  const birthDate = new Date(bday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function getMinDate() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  return new Date(year - 24 + "/" + month + "/" + day);
}

export function getMaleMinDate() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  return new Date(year - 40 + "/" + month + "/" + day);
}

export function getMaxDate() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  return new Date(year - 9 + "/" + month + "/" + day);
}

export function getUserParams(user: any) {
  let params;
  let level;
  if (user.provinces.length === 0 && user.districts.length === 0) {
    level = "CENTRAL";
    params = [];
  } else if (user.districts.length === 0) {
    level = "PROVINCIAL";
    params = user.provinces.map((p) => p.id);
  } else if (user.localities.length === 0) {
    level = "DISTRITAL";
    params = user.districts.map((d) => d.id);
  } else {
    level = "LOCAL";
    params = user.localities.map((l) => l.id);
  }

  return {
    userId: user.id,
    level: level,
    params: params.join(","),
  };
}
