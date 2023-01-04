import { Model } from "@nozbe/watermelondb";
import { field, text, relation } from "@nozbe/watermelondb/decorators";

export default class UserDetails extends Model {
    static table = 'user_details' 

    @text("districts") districts;
    @text("provinces") provinces;
    @text("localities") localities;     
    @field("user_id") user_id;   
}