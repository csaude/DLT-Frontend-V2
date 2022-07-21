import { Model } from "@nozbe/watermelondb";
import { field, text, relation } from "@nozbe/watermelondb/decorators";

export interface ReferencesModel {
    id?: string,
    beneficiary_id?: any,
    refer_to?: any,
    notify_to?: any,
    reference_note?: string,
    description?: string,
    book_number?: string,
    reference_code?: string,
    service_type?: string,
    remarks?: string,
    status_ref?: any,
    status?: any,
    cancel_reason?: any,
    other_reason?: string,
    online_id?: string
}

export default class References extends Model {
    static table = 'references'

    @field("beneficiary_id") beneficiary_id;
    @field("refer_to") refer_to;
    @field("notify_to") notify_to;
    @text("reference_note") reference_note;
    @text("description") description;
    @text("book_number") book_number;
    @text("reference_code") reference_code;
    @text("service_type") service_type;
    @text("remarks") remarks;
    @field("status_ref") status_ref;
    @field("status") status;
    @field("cancel_reason") cancel_reason;
    @text("other_reason") other_reason;
    @text("online_id") online_id;
}