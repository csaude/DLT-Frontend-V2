import { useDispatch } from "react-redux";
import { database } from "../database";
import { getBeneficiariesTotal } from "../store/beneficiarySlice";

export const beneficiariesFetchCount = async () => {
  const count = await database.collections
    .get("beneficiaries")
    .query()
    .fetchCount();
  // console.log(count);
  return count;
};