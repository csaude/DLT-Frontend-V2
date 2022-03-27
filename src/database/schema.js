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
        ],
      }),
      tableSchema({
        name: 'partners',
        columns: [
          {name: 'name', type: 'string'},
          {name: 'abbreviation', type: 'string'},
          {name: 'description', type: 'string', isOptional: true},
          {name: 'status', type: 'string'},
        ],
      }),
      tableSchema({
        name: 'profiles',
        columns: [
          {name: 'name', type: 'string'},
          {name: 'description', type: 'string', isOptional: true},
          {name: 'status', type: 'string'},
        ],
      }),
      tableSchema({
        name: 'us',
        columns: [
          {name: 'name', type: 'string'},
          {name: 'description', type: 'string', isOptional: true},
          {name: 'status', type: 'string'},
        ],
      }),
      tableSchema({
        name: 'users',
        columns: [
          {name: 'name', type: 'string'},
          {name: 'surname', type: 'string'},
          {name: 'phone_number', type: 'string', isOptional: true},
          {name: 'email', type: 'string'},
          {name: 'username', type: 'string'},
          {name: 'password', type: 'string'},
          {name: 'entry_point', type: 'string'},
          {name: 'description', type: 'string', isOptional: true},
          {name: 'status', type: 'string'},
          { name: "locality_id", type: "string", isIndexed: true },
          { name: "partner_id", type: "string" },
          { name: "profile_id", type: "string", isIndexed: true },
          { name: "us_id", type: "string", isIndexed: true }
        ],
      }),
    ],
});