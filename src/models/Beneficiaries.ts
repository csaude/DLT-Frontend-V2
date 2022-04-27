import { Model } from "@nozbe/watermelondb";
import { field, text, relation } from "@nozbe/watermelondb/decorators";

export interface BeneficiariesModel {
    id?: string,
    nui?: string,
    surname?: string,
    name?: string,
    nick_name?: string,
    date_of_birth?: string,
    gender?: string,
    address?: string,
    phone_number?: any,
    e_mail?: string,
    lives_with?: string,
    is_orphan?: any,
    via?: any,
    partner_id?: any,
    is_student?: any,
    grade?: any,
    school_name?: string,
    is_deficient?: any,
    deficiency_type?: string,
    entry_point?: any,
    neighbourhood_id?: any,
    us_id?: any,
    status?: any
}

export default class Beneficiarie extends Model {
    static table = 'beneficiaries'

    @text("nui") nui;
    @text("surname") surname;
    @text("name") name;
    @text("nick_name") nick_name;
    @text("date_of_birth") date_of_birth;
    @field("gender") gender;
    @text("address") address;
    @text("phone_number") phone_number;
    @text("e_mail") e_mail;
    @field("lives_with") lives_with;
    @field("is_orphan") is_orphan;
    @text("via") via;
    @field("partner_id") partner_id;
    @field("is_student") is_student;
    @text("grade") grade;
    @text("school_name") school_name;
    @field("is_deficient") is_deficient;
    @field("deficiency_type") deficiency_type;
    @field("entry_point") entry_point;
    @field("neighbourhood_id") neighbourhood_id;
    @field("us_id") us_id;
    @field("status") status;
    
}

