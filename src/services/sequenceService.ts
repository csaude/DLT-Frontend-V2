import { Q } from "@nozbe/watermelondb";
import { database } from "../database";

export const getSequencesBy_status = async (status) => {
  const resultQ = await database.collections
    .get("sequences")
    .query(Q.where("_status", Q.eq(status)))
    .fetch();
  const resultRaws = resultQ.map((item) => item._raw);
  return resultRaws;
};

export const getSequencesByNot_status = async (status) => {
  const resultQ = await database.collections
    .get("sequences")
    .query(Q.where("_status", Q.notEq(status)))
    .fetch();
  const resultRaws = resultQ.map((item) => item._raw);
  return resultRaws;
};
