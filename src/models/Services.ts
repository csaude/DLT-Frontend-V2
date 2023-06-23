import { Model } from "@nozbe/watermelondb";
import { field, text, children } from "@nozbe/watermelondb/decorators";


export default class Services extends Model {
    static table = "services"

    @text("name") name; 
    @text("description") description; 
    @field("core_service") core_service; 
    @text("hidden") hidden; 
    @field("service_type") service_type; 
    @field("status") status; 
}