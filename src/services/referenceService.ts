import { database } from "../database";

export const referencesFetchCount = async () => {
  const count = await database.collections
    .get("references")
    .query()
    .fetchCount();
  return count;
};
