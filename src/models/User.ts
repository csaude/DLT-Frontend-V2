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
    entryPoint?: any,
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
    @text("phone_number") phoneNumber;     
    @text("email") email;
    @text("username") username;     
    @text("password") password;
    @text("entryPoint") entryPoint;     
    @field("status") status;   
    @field("online_id") online_id;   
    
}

