import {synchronize} from '@nozbe/watermelondb/sync';
import { database } from './index';
import { SYNC_API_URL, CUSTOM_SYNC_URL } from '../services/api'

export async function sync({ username }) {
    await synchronize({
        database,
        pullChanges: async ({lastPulledAt}) => {
            const response = await fetch(
              `${SYNC_API_URL}?lastPulledAt=${lastPulledAt}&username=${username}`,
            );

            if (!response.ok) {
                
              throw new Error(await response.text());
            }   
      
            const {changes, timestamp} = await response.json();
       
            return {changes, timestamp};


            /* https://github.com/Nozbe/WatermelonDB/issues/7
               https://github.com/Nozbe/WatermelonDB/issues/216

              import { sanitizedRaw } from 'watermelondb/RawRecord'
              const contactCollection = database.collections.get('contacts')
              contactCollection.create(record => {
                record._raw = sanitizedRaw({ id: c.id, sid: c.id, username: c.username, .... }, contactCollection.schema)
              })

            */
        },
        pushChanges: async ({changes, lastPulledAt}) => {
            const response = await fetch(`${SYNC_API_URL}?username=${username}`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({changes, lastPulledAt}),
            });
            if (!response.ok) {
      
              throw new Error(await response.text());
            }
        },
    });
}

export async function customSyncBeneficiary({ nui, userId }) {
    await synchronize({
        database,
        pullChanges: async ({lastPulledAt}) => {
            const response = await fetch(
              `${CUSTOM_SYNC_URL}/beneficiaries?lastPulledAt=${lastPulledAt}&nui=${nui}&userId=${userId}`,
            );
            if (!response.ok) {
                
              throw new Error(await response.text());
            }         
            const {changes, timestamp} = await response.json();
      
            return {changes, timestamp};
        },
        pushChanges: async () => { },
    });
}