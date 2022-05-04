import {appSchema, tableSchema} from '@nozbe/watermelondb';

export default appSchema({
    version: 1,
    tables: [
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
          {name: 'date_of_birth', type: 'string'},
          {name: 'gender', type: 'string'},
          {name: 'address', type: 'string'},
          {name: 'phone_number', type: 'string', isOptional: true},
          {name: 'e_mail', type: 'string', isOptional: true},
          {name: 'lives_with', type: 'string'},
          {name: 'is_orphan', type: 'number'},
          {name: 'via', type: 'number'},
          {name: 'partner_id',  type: "number", isIndexed: true },
          {name: 'is_student', type: 'number'},
          {name: 'grade', type: 'number'},
          {name: 'school_name', type: 'string'},
          {name: 'is_deficient', type: 'number'},
          {name: 'deficiency_type', type: 'string'},
          {name: 'entry_point',  type: "number", isIndexed: true },
          {name: 'neighbourhood_id',  type: "number", isIndexed: true },
          {name: 'us_id',  type: "number", isIndexed: true },
          {name: 'status', type: 'number'},
          {name: 'online_id', type: 'number',isOptional: true }
        ],
      }),
      tableSchema({
        name: 'services',
        columns: [
          {name: 'name', type: 'string'},
          {name: 'description', type: 'string'},
          {name: 'core_service', type: 'number'},
          {name: 'hidden', type: 'number'},
          {name: 'service_type', type: 'string'},
          {name: 'status', type: 'number'},
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
        ],
      }),
      tableSchema({
        name: 'vulnerabilities',
        columns: [
          {name: 'name', type: 'string'},
          {name: 'description', type: 'string'},
          {name: 'status', type: 'number'},
        ],
      }),
      tableSchema({
        name: 'beneficiaries_vulnerabilities',
        columns: [
          {name: 'beneficiary_id', type: "number", isIndexed: true },
          {name: 'vulnerability_id',type: "number", isIndexed: true },
          {name: 'value', type: 'string'},
          {name: 'evaluation_date', type: 'string'},
          {name: 'status', type: 'number'},
          {name: 'remarks', type: 'string', isOptional: true},
        ],
      }),
      tableSchema({
        name: 'neighborhoods',
        columns: [
          {name: 'name', type: "string"},
          {name: 'description',type: "string"},
          {name: 'locality_id', type: "number", isIndexed: true },
          {name: 'status', type: 'number'},
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
        ],
      }),
    ],
});