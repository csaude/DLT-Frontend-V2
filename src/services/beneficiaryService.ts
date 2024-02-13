import { database } from "../database";
import { Q } from "@nozbe/watermelondb";

export const beneficiariesFetchCount = async () => {
  const count = await database.collections
    .get("beneficiaries")
    .query(Q.where("status", 1))
    .fetchCount();
  return count;
};

export const resolveBeneficiaryOfflineIds = async () => {
  const beneficiaryQ = await database
    .get("beneficiaries")
    .query(Q.where("offline_id", null))
    .fetch();
  const offlineIds = beneficiaryQ.map((item) => item._raw.id);

  await database.write(async () => {
    for (const offlineId of offlineIds) {
      const beneficiary = await database.get("beneficiaries").find(offlineId);
      await beneficiary.update((record: any) => {
        record.offline_id = beneficiary.id;
      });
    }
  });
};

export const pendingSyncBeneficiaries = async () => {
  const count = await database.collections
    .get("beneficiaries")
    .query(Q.where("_status", Q.notEq("synced")))
    .fetchCount();
  return count;
};

export const getBeneficiariesBy_status = async (status) => {
  const resultQ = await database.collections.get("beneficiaries")
  .query(Q.where("_status", Q.eq(status)))
  .fetch();
  const resultRaws = resultQ.map(item => item._raw)
  return resultRaws;
};

export const getBeneficiariesByNot_status = async (status) => {
  const resultQ = await database.collections.get("beneficiaries")
  .query(Q.where("_status", Q.notEq(status)))
  .fetch();
  const resultRaws = resultQ.map(item => item._raw)
  return resultRaws;
};
