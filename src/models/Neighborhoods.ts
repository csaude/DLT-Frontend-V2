import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export default class Neighborhoods extends Model {
  static table = "neighborhoods";

  @text("name") name;
  @text("description") description;
  @field("locality_id") locality_id;
  @field("status") status;
}
