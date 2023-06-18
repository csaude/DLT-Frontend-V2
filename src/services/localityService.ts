import { database } from "../database";

export const fetchLocalities = async () => {
  const getLocalitiesList = await database.get("localities").query().fetch();
  const locSerialized = getLocalitiesList.map((item) => item._raw);

  return locSerialized;
};
