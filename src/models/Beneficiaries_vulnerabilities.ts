import { Model } from "@nozbe/watermelondb";
import { field, text, children } from "@nozbe/watermelondb/decorators";


export default class Beneficiaries_vulnerabilities extends Model {
    static table = "beneficiaries_vulnerabilities"

    @field("beneficiary_id") beneficiary_id;
    @field("vulnerability_id") vulnerability_id;
    @text("value") value;
    @text("evaluation_date") evaluation_date;
    @field("status") status;
    @text("remarks") remarks;

}