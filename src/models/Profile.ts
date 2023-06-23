import { Model } from "@nozbe/watermelondb";
import { field, children } from "@nozbe/watermelondb/decorators";


export default class Profile extends Model {
    static table = "profiles";

    @field("name") name;
    @field("description") description;
    @field("online_id") online_id;   

}