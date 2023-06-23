import { database } from "../database";

export const fetchProvinces = async () => {
  const getProvsList = await database.get("provinces").query().fetch();
  const provSerialized = getProvsList.map((item) => item._raw);

  return provSerialized;
};
