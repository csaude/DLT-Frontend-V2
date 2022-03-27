
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
/*
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import schema from './src/database/schema'
import { dbModels } from './src/models/index'

const adapter = new SQLiteAdapter({
    dbName: 'dreams',
    schema: schema,

    onSetUpError: error => {
        // Database failed to load -- offer the user to reload the app or log out
        console.log('failed to load db!')
    }
})

const database = new Database({
    adapter,
    modelClasses: dbModels,
})
*/

AppRegistry.registerComponent(appName, () => App);
