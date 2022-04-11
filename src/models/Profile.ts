import { Model } from "@nozbe/watermelondb";
import { field, children } from "@nozbe/watermelondb/decorators";


export default class Profile extends Model {
    static table = "profiles";

    static associations = {
        users: { type: 'has_many', foreignKey: 'profile_id' },
    } as const;

    @field("name") name;
    @field("description") description;
    @field("online_id") online_id;   

    @children("users") users;
}