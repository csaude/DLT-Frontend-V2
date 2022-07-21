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
    references?: any
}

export default class Beneficiarie extends Model {
    static table = 'beneficiaries'

    @text("nui") nui;
    @text("surname") surname;
    @text("name") name;
    @text("nick_name") nick_name;
    @text("organization_id") organization_id;
    @field("date_of_birth") date_of_birth;
    @text("gender") gender;
    @text("address") address;
    @text("phone_number") phone_number;
    @text("e_mail") e_mail;
    @text("via") via;
    @field("partner_id") partner_id;
    @field("entry_point") entry_point;
    @field("neighbourhood_id") neighbourhood_id;
    @field("us_id") us_id;
    @field("status") status;
    @field("online_id") online_id;
    @field("vblt_lives_with") vblt_lives_with;
    @field("vblt_is_orphan") vblt_is_orphan;
    @field("vblt_is_student") vblt_is_student;
    @field("vblt_school_grade") vblt_school_grade;
    @field("vblt_school_name") vblt_school_name;
    @field("vblt_is_deficient") vblt_is_deficient;
    @field("vblt_deficiency_type") vblt_deficiency_type;
    @field("vblt_married_before") vblt_married_before;
    @field("vblt_pregnant_before") vblt_pregnant_before;
    @field("vblt_children") vblt_children;
    @field("vblt_pregnant_or_breastfeeding") vblt_pregnant_or_breastfeeding;
    @field("vblt_is_employed") vblt_is_employed;
    @field("vblt_tested_hiv") vblt_tested_hiv;
    @field("vblt_sexually_active") vblt_sexually_active;
    @field("vblt_multiple_partners") vblt_multiple_partners;
    @field("vblt_is_migrant") vblt_is_migrant;
    @field("vblt_trafficking_victim") vblt_trafficking_victim;
    @field("vblt_sexual_exploitation") vblt_sexual_exploitation;
    @field("vblt_sexploitation_time") vblt_sexploitation_time;
    @field("vblt_vbg_victim") vblt_vbg_victim;
    @field("vblt_vbg_type") vblt_vbg_type;
    @field("vblt_vbg_time") vblt_vbg_time;
    @field("vblt_alcohol_drugs_use") vblt_alcohol_drugs_use;
    @field("vblt_sti_history") vblt_sti_history;
    @field("vblt_sex_worker") vblt_sex_worker;
    @field("vblt_house_sustainer") vblt_house_sustainer;
    @field("references") references;
    
}