import { Model } from "@nozbe/watermelondb";
import { field, text, children } from "@nozbe/watermelondb/decorators";


export default class Locality extends Model {
    static table = "localities"

    static associations = {
        users: { type: 'has_many', foreignKey: 'locality_id' },
    } as const;

    @text("name") name;
    @text("description") description;
    @field("status") status;
    @field("online_id") online_id;   

    @children('users') users;
}