import { Q } from "@nozbe/watermelondb";
import { database } from "../database";

export const referencesFetchCount = async () => {
  const count = await database.collections
    .get("references")
    .query()
    .fetchCount();
  return count;
};

export const pendingSyncReferences = async () => {
  const count = await database.collections
    .get("references")
    .query(Q.where("_status", Q.notEq("synced")))
    .fetchCount();
  return count;
};