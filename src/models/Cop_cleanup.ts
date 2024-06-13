import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export interface COPCleanupModel {  
  user?: any;
  last_date?: string;
  next_date?: string
}

export default class COPCleanup extends Model {
  static table = "cop_cleanup";

  @field("user") user;
  @field("last_date") last_date;
  @field("next_date") next_date;
}
