import { database } from "../database";

export const fetchNeighborhoods = async () => {
  const getNeighborhoodsList = await database
    .get("neighborhoods")
    .query()
    .fetch();
  const locSerialized = getNeighborhoodsList.map((item) => item._raw);

  return locSerialized;
};
