import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import { dbModels } from '../models/index';

const adapter = new SQLiteAdapter({
    dbName: 'dreams',
    schema: schema,

    onSetUpError: error => {
        // Database failed to load -- offer the user to reload the app or log out
        console.log('failed to load db!')
    }
});

export const database = new Database({
    adapter,
    modelClasses: dbModels,
});