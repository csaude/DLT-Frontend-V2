import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export default class Sequences extends Model {
  static table = "sequences";

  @field("prefix") prefix;
  @field("last_nui") last_nui;
}
