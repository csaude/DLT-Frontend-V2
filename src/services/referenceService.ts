import { useDispatch } from "react-redux";
import { database } from "../database";
import { getReferencesTotal } from "../store/referenceSlice";

export const referencesFetchCount = async () => {
  const count = await database.collections
    .get("references")
    .query()
    .fetchCount();
  return count;
};
