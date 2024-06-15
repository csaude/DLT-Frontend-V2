import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export default class UserDetails extends Model {
  static table = "user_details";

  @text("districts") districts;
  @text("provinces") provinces;
  @text("localities") localities;
  @text("uss") uss;
  @field("user_id") user_id;
  @field("last_login_date") last_login_date;
  @field("password_last_change_date") password_last_change_date;
  @field("profile_id") profile_id;
  @field("entry_point") entry_point;
  @field("partner_id") partner_id;
  @field("next_clean_date") next_clean_date;
  @field("was_cleaned") was_cleaned;
}
