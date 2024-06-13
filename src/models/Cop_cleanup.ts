import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export interface COPCleanupModel {  
  user?: any;
  next_date?: string;
  was_cleaned?: string;
}

export default class COPCleanup extends Model {
  static table = "cop_cleanup";

  @field("user") user;
  @field("next_date") next_date;
  @field("was_cleaned") was_cleaned;
}
