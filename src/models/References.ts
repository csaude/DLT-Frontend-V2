import { Model } from "@nozbe/watermelondb";
import { field, text, relation } from "@nozbe/watermelondb/decorators";

export interface ReferencesModel {
    id?: string,
    beneficiary_id?: any,
    beneficiary_offline_id?: string,
    refer_to?: any,
    referred_by?: any,
    notify_to?: any,
    reference_note?: string,
    description?: string,
    book_number?: string,
    reference_code?: string,
    service_type?: string,
    remarks?: string,
    status?: any,
    us_id?: any,
    cancel_reason?: any,
    other_reason?: string,
    online_id?: string,
    user_created?: string,
    is_awaiting_sync?: any;
    date_created: string

}

export default class References extends Model {
    static table = 'references'

    @field("beneficiary_id") beneficiary_id;
    @text("beneficiary_offline_id") beneficiary_offline_id;
    @field("refer_to") refer_to;
    @field("referred_by") referred_by;
    @field("notify_to") notify_to;
    @text("reference_note") reference_note;
    @text("description") description;
    @text("book_number") book_number;
    @text("reference_code") reference_code;
    @text("service_type") service_type;
    @text("remarks") remarks;
    @field("status") status;
    @field("us_id") us_id;
    @field("cancel_reason") cancel_reason;
    @text("other_reason") other_reason;
    @text("user_created") user_created;
    @text("date_created") date_created;
    @text("is_awaiting_sync") is_awaiting_sync;
    @text("online_id") online_id;
}