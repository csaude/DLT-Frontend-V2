import { Model } from "@nozbe/watermelondb";
import { field, children } from "@nozbe/watermelondb/decorators";


export default class Us extends Model {
    static table = "us";

    @field("name") name;
    @field("description") description;
    @field("status") status;     
    @field("online_id") online_id;     
    @field("entry_point") entry_point;   

}