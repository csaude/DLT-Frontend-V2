import { Model } from "@nozbe/watermelondb";
import { field, text, children } from "@nozbe/watermelondb/decorators";


export default class District extends Model {
    static table = "districts"

    @text("name") name;
    @text("code") code;
    @field("province_id") province_id;
    @field("status") status;
    @field("online_id") online_id;   

}