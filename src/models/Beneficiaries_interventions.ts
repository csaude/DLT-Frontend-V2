import { Model } from "@nozbe/watermelondb";
import { field, text, children } from "@nozbe/watermelondb/decorators";


export default class Beneficiaries_interventions extends Model {
    static table = "beneficiaries_interventions"

    @text("name") name;
    @text("description") description;
    @field("status") status;
    @field("online_id") online_id;   

}