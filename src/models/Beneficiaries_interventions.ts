import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export interface BeneficiariesInterventionsModel {
  id?: string;
  beneficiary_id?: any;
  beneficiary_offline_id?: string;
  sub_service_id?: any;
  result?: string;
  date?: string;
  us_id?: any;
  activist_id?: any;
  entry_point?: any;
  provider?: any;
  remarks?: string;
  end_date?: string;
  status?: any;
  online_id?: any;
  date_created: string;
}

export default class Beneficiaries_interventions extends Model {
  static table = "beneficiaries_interventions";

  @field("beneficiary_id") beneficiary_id;
  @text("beneficiary_offline_id") beneficiary_offline_id;
  @field("sub_service_id") sub_service_id;
  @text("result") result;
  @field("date") date;
  @field("us_id") us_id;
  @field("activist_id") activist_id;
  @field("entry_point") entry_point;
  @field("provider") provider;
  @text("remarks") remarks;
  @field("end_date") end_date;
  @field("status") status;
  @field("online_id") online_id;
  @text("date_created") date_created;
}
