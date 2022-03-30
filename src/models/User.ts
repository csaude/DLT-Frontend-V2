import { Model } from "@nozbe/watermelondb";
import { field, text, relation } from "@nozbe/watermelondb/decorators";


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
   // @text("description") description;
    @field("status") status;   

    @relation("localities", "locality_id") locality;
    @relation("partners", "partner_id") partner;
    @relation("profiles", "profile_id") profile;
    @relation("us", "us_id") us;
}

