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

export const getReferencesBy_status = async (status) => {
  const resultQ = await database.collections
    .get("references")
    .query(Q.where("_status", Q.eq(status)))
    .fetch();
  const resultRaws = resultQ.map((item) => item._raw);
  return resultRaws;
};

export const getReferenceServicesBy_status = async (status) => {
  const resultQ = await database.collections
    .get("references_services")
    .query(Q.where("_status", Q.eq(status)))
    .fetch();
  const resultRaws = resultQ.map((item) => item._raw);
  return resultRaws;
};

export const getReferenceServicesByNot_status = async (status) => {
  const resultQ = await database.collections
    .get("references_services")
    .query(Q.where("_status", Q.notEq(status)))
    .fetch();
  const resultRaws = resultQ.map((item) => item._raw);
  return resultRaws;
};
