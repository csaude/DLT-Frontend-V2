import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export default class Vulnerabilities extends Model {
  static table = "vulnerabilities";

  @text("name") name;
  @text("description") description;
  @field("status") status;
}
