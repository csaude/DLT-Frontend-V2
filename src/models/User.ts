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
    static associations = {
        localities: { type: 'belongs_to', key: 'locality_id' },
        partners: { type: 'belongs_to', key: 'partner_id' },
        profiles: { type: 'belongs_to', key: 'profile_id' },
        us: { type: 'belongs_to', key: 'us_id' },
    } as const;

    @text("name") name;
    @text("surname") surname;
    @text("phone_number") phoneNumber;     
    @text("email") email;
    @text("username") username;     
    @text("password") password;
    @text("entryPoint") entryPoint;     
    @field("status") status;   
    @field("online_id") online_id;   

    @relation("localities", "locality_id") locality;
    @relation("partners", "partner_id") partner;
    @relation("profiles", "profile_id") profile;
    @relation("us", "us_id") us;

    
}

