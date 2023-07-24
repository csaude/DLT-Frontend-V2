export const range_10_14 = [9, 10, 11, 12, 13, 14];
export const range_15_19 = [15, 16, 17, 18, 19];
export const range_20_24 = [20, 21, 22, 23, 24];
export const range_25_29 = [25, 26, 27, 28, 29];

export const getPackageLabel = (id) => {
  if (id == 1) {
    return "Primária";
  } else if (id == 2) {
    return "Secundário";
  } else if (id == 3) {
    return "Contextual";
  } else if (id == 4) {
    return "N/A";
  } else if (id == 5) {
    return "Primária (Secundário Se Sexualmente Activa)";
  }
};

export const getAgeRangeByAge = (age: number) => {
  if (range_10_14.includes(age)) {
    return { age_band: 1, range: "9-14" };
  } else if (range_15_19.includes(age)) {
    return { age_band: 2, range: "15-19" };
  } else if (range_20_24.includes(age)) {
    return { age_band: 3, range: "20-24" };
  } else if (range_25_29.includes(age)) {
    return { age_band: 4, range: "25-29" };
  }
};

export const getAgeByDate = (dateCreated) => {
  const currentDate = new Date();
  const birthDate = new Date(dateCreated);

  // Calculate the difference in years
  let age = currentDate.getFullYear() - birthDate.getFullYear();

  // Adjust the age based on the month and day
  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export const getAgeAtRegistrationDate = (dateOfBirth, dateOfRegitration) => {
  const regitrationDate = new Date(dateOfRegitration);
  const birthDate = new Date(dateOfBirth);

  let age = regitrationDate.getFullYear() - birthDate.getFullYear();

  if (
    regitrationDate.getMonth() < birthDate.getMonth() ||
    (regitrationDate.getMonth() === birthDate.getMonth() &&
      regitrationDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export const getAgeRangeAtRegistrationDate = (
  dateOfBirth,
  dateOfRegitration
) => {
  const age = getAgeAtRegistrationDate(dateOfBirth, dateOfRegitration);
  return getAgeRangeByAge(age)?.range;
};

export const getAgeRangeByDate = (date) => {
  const age = getAgeByDate(date);
  return getAgeRangeByAge(age)?.range;
};

export const getAgeBandByDate = (date) => {
  const age = getAgeByDate(date);
  return getAgeRangeByAge(age)?.age_band;
};
