import { Model } from "@nozbe/watermelondb";
import { field, children } from "@nozbe/watermelondb/decorators";


export default class Us extends Model {
    static table = "us";

    static associations = {
        users: { type: 'has_many', foreignKey: 'us_id' },
    }

    @field("name") name;
    @field("description") description;
    @field("status") status;     

    @children("users") users;
}