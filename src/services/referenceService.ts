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

export const getAllReferences = async () => {
  const resultQ = await database.collections.get("references").query().fetch();
  const resultRaws = resultQ.map(item => item._raw)
  return resultRaws;
};

export const getAllReferenceServices = async () => {
  const resultQ = await database.collections.get("references_services").query().fetch();
  const resultRaws = resultQ.map(item => item._raw)
  return resultRaws;
};