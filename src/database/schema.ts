import {appSchema, tableSchema} from '@nozbe/watermelondb';

export default appSchema({
    version: 1,
    tables: [
      tableSchema({
        name: 'sequences',
        columns: [
          {name: 'prefix', type: 'string'},
          {name: 'last_nui', type: 'string', isOptional: true}
        ],
      }),
      tableSchema({
        name: 'localities',
        columns: [
          {name: 'name', type: 'string'},
          {name: 'description', type: 'string', isOptional: true},
          {name: 'status', type: 'string'},
          {name: 'online_id', type: 'number',isOptional: true}
        ],
      }),
      tableSchema({
        name: 'partners',
        columns: [
          {name: 'name', type: 'string'},
          {name: 'abbreviation', type: 'string'},
          {name: 'description', type: 'string', isOptional: true},
          {name: 'status', type: 'string'},
          {name: 'online_id', type: 'number',isOptional: true}
        ],
      }),
      tableSchema({
        name: 'profiles',
        columns: [
          {name: 'name', type: 'string'},
          {name: 'description', type: 'string', isOptional: true},
          {name: 'online_id', type: 'number',isOptional: true}
        ],
      }),
      tableSchema({
        name: 'us',
        columns: [
          {name: 'name', type: 'string'},
          {name: 'description', type: 'string', isOptional: true},
          {name: 'status', type: 'string'},
          {name: 'online_id', type: 'number',isOptional: true}
        ],
      }),
      tableSchema({
        name: 'users',
        columns: [
          {name: 'name', type: 'string'},
          {name: 'surname', type: 'string'},
          {name: 'phone_number', type: 'string', isOptional: true },
          {name: 'email', type: 'string'},
          {name: 'username', type: 'string'},
          {name: 'password', type: 'string'},
          {name: 'entry_point', type: 'string'},
          {name: 'status', type: 'string'},
          {name: "locality_id", type: "number", isIndexed: true },
          {name: "partner_id", type: "number" },
          {name: "profile_id", type: "number", isIndexed: true },
          {name: "us_id", type: "number", isIndexed: true },
          {name: 'online_id', type: 'number',isOptional: true }, // flag to control if entity is synchronized with the backend
        ],
      }),
      tableSchema({
        name: 'beneficiaries',
        columns: [
          {name: 'nui', type: 'string'},
          {name: 'surname', type: 'string'},
          {name: 'name', type: 'string'},
          {name: 'nick_name', type: 'string', isOptional: true},
          {name: 'organization_id', type: 'number', isOptional: true},
          {name: 'date_of_birth', type: 'string'},
          {name: 'gender', type: 'string'},
          {name: 'address', type: 'string'},
          {name: 'phone_number', type: 'string', isOptional: true},
          {name: 'e_mail', type: 'string', isOptional: true},
          {name: 'via', type: 'number'},
          {name: 'partner_id',  type: "number", isIndexed: true },
          {name: 'entry_point',  type: "string", isIndexed: true },
          {name: 'neighbourhood_id',  type: "number", isIndexed: true },
          {name: 'us_id',  type: "number", isIndexed: true },
          {name: 'status', type: 'number'},
          {name: 'online_id', type: 'number',isOptional: true},
          {name: 'vblt_lives_with', type: 'string',isOptional: true},
          {name: 'vblt_is_orphan', type: 'number',isOptional: true},
          {name: 'vblt_is_student', type: 'number',isOptional: true},
          {name: 'vblt_school_grade', type: 'number',isOptional: true},
          {name: 'vblt_school_name', type: 'string',isOptional: true},
          {name: 'vblt_is_deficient', type: 'number',isOptional: true},
          {name: 'vblt_deficiency_type', type: 'string',isOptional: true},
          {name: 'vblt_married_before', type: 'number',isOptional: true},
          {name: 'vblt_pregnant_before', type: 'number',isOptional: true},
          {name: 'vblt_children', type: 'number',isOptional: true},
          {name: 'vblt_pregnant_or_breastfeeding', type: 'number',isOptional: true},
          {name: 'vblt_is_employed', type: 'string',isOptional: true},
          {name: 'vblt_tested_hiv', type: 'string',isOptional: true},
          {name: 'vblt_sexually_active', type: 'number',isOptional: true},
          {name: 'vblt_multiple_partners', type: 'number',isOptional: true},
          {name: 'vblt_is_migrant', type: 'number',isOptional: true},
          {name: 'vblt_trafficking_victim', type: 'number',isOptional: true},
          {name: 'vblt_sexual_exploitation', type: 'number',isOptional: true},
          {name: 'vblt_sexploitation_time', type: 'string',isOptional: true},
          {name: 'vblt_vbg_victim', type: 'number',isOptional: true},
          {name: 'vblt_vbg_type', type: 'string',isOptional: true},
          {name: 'vblt_vbg_time', type: 'string',isOptional: true},
          {name: 'vblt_alcohol_drugs_use', type: 'number',isOptional: true},
          {name: 'vblt_sti_history', type: 'number',isOptional: true},
          {name: 'vblt_sex_worker', type: 'number',isOptional: true},
          {name: 'vblt_house_sustainer', type: 'number',isOptional: true},
          {name: 'references', type: 'string',isOptional: true},
        ],
      }),
      tableSchema({
        name: 'services',
        columns: [
          {name: 'name', type: 'string'},
          {name: 'description', type: 'string'},
          {name: 'core_service', type: 'number'},
          {name: 'hidden', type: 'number'},
          {name: 'service_type', type: 'string',isOptional: true},
          {name: 'status', type: 'number'},
          {name: 'online_id', type: 'number',isOptional: true}
        ],
      }),
      tableSchema({
        name: 'sub_services',
        columns: [
          {name: 'name', type: 'string'},
          {name: 'surname', type: 'string'},
          {name: 'remarks', type: 'string', isOptional: true},
          {name: 'hidden', type: 'number'},
          {name: 'mandatory', type: 'number'},
          {name: 'service_id', type: "number", isIndexed: true },
          {name: 'status', type: 'number'},
          {name: 'sort_order', type: 'number'},
          {name: 'online_id', type: 'number',isOptional: true}
        ],
      }),
      tableSchema({
        name: 'neighborhoods',
        columns: [
          {name: 'name', type: "string"},
          {name: 'description',type: "string"},
          {name: 'locality_id', type: "number", isIndexed: true },
          {name: 'status', type: 'number'},
          {name: 'online_id', type: 'number',isOptional: true}
        ],
      }),
      tableSchema({
        name: 'beneficiaries_interventions',
        columns: [
          {name: 'beneficiary_id', type: "number", isIndexed: true },
          {name: 'sub_service_id',type: "number", isIndexed: true },
          {name: 'result', type: 'string'},
          {name: 'date', type: 'string'},
          {name: 'us_id', type: "number", isIndexed: true },
          {name: 'activist_id', type: "number", isIndexed: true },
          {name: 'entry_point', type: 'string'},
          {name: 'provider', type: 'string'},
          {name: 'remarks', type: 'string', isOptional: true},
          {name: 'status', type: 'number'},
          {name: 'online_id', type: 'number',isOptional: true}
        ],
      }),
      tableSchema({
        name: 'references',
        columns: [
          {name: 'beneficiary_id', type: 'number', isIndexed: true},
          {name: 'refer_to', type: 'string', isIndexed: true},
          {name: 'notify_to', type: 'number', isIndexed: true},
          {name: 'reference_note', type: 'string'},
          {name: 'description', type: 'string'},
          {name: 'book_number', type: 'string'},
          {name: 'reference_code', type: 'string'},
          {name: 'service_type', type: 'string'},
          {name: 'remarks', type: 'string', isOptional: true},
          {name: 'status_ref', type: 'number'},
          {name: 'status', type: 'number'},
          {name: 'cancel_reason', type: 'number', isOptional: true},
          {name: 'other_reason', type: 'string', isOptional: true},
          {name: 'created_by', type: 'number', isIndexed: true},
          {name: 'online_id', type: 'number',isOptional: true}
        ],
      }),
    ],
});