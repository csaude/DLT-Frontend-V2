import { Model } from "@nozbe/watermelondb";
import { field, text, children } from "@nozbe/watermelondb/decorators";


export default class Sub_services extends Model {
    static table = "sub_services"

    @text("name") name;
    @text("surname") surname;
    @text("remarks") remarks;
    @field("hidden") hidden;
    @field("mandatory") mandatory;
    @field("service_id") service_id;
    @field("status") status;
    @text("sort_order") sort_order;
}