import { Model } from "@nozbe/watermelondb";
import { field, children } from "@nozbe/watermelondb/decorators";


export default class Partner extends Model {
    static table = 'partners'

    @field("name") name;
    @field("abbreviation") abbreviation;
    @field("description") description;
    @field("status") status;     
    @field("online_id") online_id;   

}