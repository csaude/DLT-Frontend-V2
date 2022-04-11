import { Model } from "@nozbe/watermelondb";
import { field, children } from "@nozbe/watermelondb/decorators";


export default class Partner extends Model {
    static table = 'partners'

    static associations = {
        users: { type: 'has_many', foreignKey: 'partner_id' },
    } as const;

    @field("name") name;
    @field("abbreviation") abbreviation;
    @field("description") description;
    @field("status") status;     
    @field("online_id") online_id;   

    @children("users") users;
}