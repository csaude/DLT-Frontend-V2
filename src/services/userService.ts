import { Q } from "@nozbe/watermelondb";
import { database } from "../database";

export const getUserDetail = async () => {
  const resultQ = await database.collections
    .get("user_details")
    .query()
    .fetch();
  const resultRaws = resultQ.map((item) => item._raw);
  return resultRaws[0];
};

export const getUsersById = async (id) => {
  const resultQ = await database.collections
    .get("users")
    .query(Q.where("online_id", Q.eq(id)))
    .fetch();
  const resultRaws = resultQ.map((item) => item._raw);
  return resultRaws;
};
