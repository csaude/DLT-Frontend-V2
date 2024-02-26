import { Q } from "@nozbe/watermelondb";
import { database } from "../database";
import { InterventionCount } from "../store/beneficiaryInterventionSlice";

export const beneficiariesInterventionsFetchCount = async () => {
  const totals: InterventionCount[] = [];
  const beneficiaries = await database.collections
    .get("beneficiaries")
    .query()
    .fetch();
  const beneficiariesOfflineIds = beneficiaries.map((item) => item?.["offline_id"]);

  await Promise.all(
    beneficiariesOfflineIds.map(async (beneficiary_offline_id) => {
      const count = await database.collections
        .get("beneficiaries_interventions")
        .query(Q.where("beneficiary_offline_id", beneficiary_offline_id))
        .fetchCount();

      const beneficiaryCount: InterventionCount = {
        beneficiary_offline_id: beneficiary_offline_id,
        total: count,
      };

      try {
        totals.push(beneficiaryCount);
      } catch (error) {
        console.error(error);
      }
    })
  );

  return totals;
};

export const pendingSyncBeneficiariesInterventions = async () => {
  const count = await database.collections
    .get("beneficiaries_interventions")
    .query(Q.where("_status", Q.notEq("synced")))
    .fetchCount();
  return count;
};

export const getBeneficiariesInterventionsBy_status = async (status) => {
  const resultQ = await database.collections
    .get("beneficiaries_interventions")
    .query(Q.where("_status", Q.eq(status)))
    .fetch();
    const resultRaws = resultQ.map(item => item._raw)
    return resultRaws
};

export const getBeneficiariesInterventionsByNot_status = async (status) => {
  const resultQ = await database.collections
    .get("beneficiaries_interventions")
    .query(Q.where("_status", Q.notEq(status)))
    .fetch();
    const resultRaws = resultQ.map(item => item._raw)
    return resultRaws
};
