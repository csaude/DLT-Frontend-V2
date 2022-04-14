import { Model } from "@nozbe/watermelondb";
import { field, text, relation } from "@nozbe/watermelondb/decorators";

export interface UsersModel {
    id?: string,
    surname?: string,
    name?: string,
    phone_number?: string,
    email?: string,
    username?: string,
    password?: string,
    entry_point?: any,
    status?: any,
    locality_id?: any,
    partner_id?: any,
    profile_id?: any,
    us_id?: any
}

export default class User extends Model {
    static table = 'users'

    @text("name") name;
    @text("surname") surname;
    @text("phone_number") phone_number;     
    @text("email") email;
    @text("username") username;     
    @text("password") password;
    @text("entry_point") entry_point;     
    @field("status") status;   
    @field("locality_id") locality_id;   
    @field("partner_id") partner_id;   
    @field("profile_id") profile_id;   
    @field("us_id") us_id;   
    @field("online_id") online_id;   
    
}

