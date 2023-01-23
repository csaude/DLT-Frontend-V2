import { Model } from "@nozbe/watermelondb";
import { field, text, relation } from "@nozbe/watermelondb/decorators";

export default class UserDetails extends Model {
    static table = 'user_details' 

    @text("districts") districts;
    @text("provinces") provinces;
    @text("localities") localities;    
    @text("uss") uss;
    @field("user_id") user_id;  
    @field("password_last_change_date") password_last_change_date; 
}