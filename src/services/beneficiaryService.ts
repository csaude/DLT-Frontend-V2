import { useDispatch } from "react-redux";
import { database } from "../database";
import { Q } from "@nozbe/watermelondb";

export const beneficiariesFetchCount = async () => {
  const count = await database.collections
    .get("beneficiaries")
    .query()
    .fetchCount();
  // console.log(count);
  return count;
};

export const resolveBeneficiaryOfflineIds = async () => {
  const beneficiaryQ = await database
        .get("beneficiaries")
        .query(Q.where("offline_id", null))
        .fetch();
  const offlineIds = beneficiaryQ.map(item=>item._raw.id)
        console.log('-----offlineIds------',offlineIds)  

  await database.write(async () => {
    for (const offlineId of offlineIds) {    
      const beneficiary = await database.get('beneficiaries').find(offlineId)    
      await beneficiary.update((record:any) => {
        record.offline_id = beneficiary.id;
      })
    }
  });
};
