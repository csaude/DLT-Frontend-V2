import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export default class Locality extends Model {
  static table = "localities";

  @text("name") name;
  @text("description") description;
  @field("status") status;
  @field("online_id") online_id;
}
