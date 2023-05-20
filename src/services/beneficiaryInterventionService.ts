import { Q } from "@nozbe/watermelondb";
import { database } from "../database";
import { InterventionCount } from "../store/beneficiaryInterventionSlice";

export const beneficiariesInterventionsFetchCount = async () => {
  const totals: InterventionCount[] = [];
  const beneficiaries = await database.collections
    .get("beneficiaries")
    .query()
    .fetch();
  const beneficiariesIds = beneficiaries.map((item) => item?.online_id);

  await Promise.all(
    beneficiariesIds.map(async (beneficiary_id) => {
      const count = await database.collections
        .get("beneficiaries_interventions")
        .query(Q.where("beneficiary_id", beneficiary_id))
        .fetchCount();

      const beneficiaryCount: InterventionCount = {
        beneficiary_id: beneficiary_id,
        total: count,
      };

      try {
        totals.push(beneficiaryCount);
      } catch (error) {
        console.log("----err----", error);
      }
    })
  );

  return totals;
};
