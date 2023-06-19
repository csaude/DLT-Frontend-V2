import { database } from "../database";

export const fetchDistricts = async () => {
  const getDistrictsList = await database.get("districts").query().fetch();
  const distSerialized = getDistrictsList.map((item) => item._raw);

  return distSerialized;
};
