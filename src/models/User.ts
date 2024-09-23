import { Model } from "@nozbe/watermelondb";
import { field, text } from "@nozbe/watermelondb/decorators";

export interface UsersModel {
  us_id: string;
  locality_id: string;
  id?: string;
  surname?: string;
  name?: string;
  phone_number?: string;
  email?: string;
  username?: string;
  password?: string;
  entry_point?: any;
  status?: any;
  localities_ids?: any;
  partner_id?: any;
  profile_id?: any;
  us_ids?: any;
  organization_name: any;
  last_login_date: any;
  password_last_change_date: any;
  is_awaiting_sync?: any;
}

export default class User extends Model {
  static table = "users";

  @text("name") name;
  @text("surname") surname;
  @text("phone_number") phone_number;
  @text("email") email;
  @text("username") username;
  @text("password") password;
  @text("entry_point") entry_point;
  @field("status") status;
  @field("localities_ids") localities_ids;
  @field("partner_id") partner_id;
  @field("profile_id") profile_id;
  @field("us_ids") us_ids;
  @field("online_id") online_id;
  @field("organization_name") organization_name;
  @field("last_login_date") last_login_date;
  @field("password_last_change_date") password_last_change_date;
  @text("is_awaiting_sync") is_awaiting_sync;
}
