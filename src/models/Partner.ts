import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export default class Partner extends Model {
  static table = "partners";

  @field("name") name;
  @field("abbreviation") abbreviation;
  @field("description") description;
  @field("status") status;
  @field("partner_type") partner_type;
  @field("district_id") district_id;
  @field("online_id") online_id;
}
