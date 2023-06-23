import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export default class Province extends Model {
  static table = "provinces";

  @text("name") name;
  @text("code") code;
  @field("status") status;
  @field("online_id") online_id;
}
