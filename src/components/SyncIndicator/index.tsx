import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import { sync } from '../../database/sync';

const SyncIndicator = () => {
    const [syncState, setSyncState] = useState<string>('Syncing data...');

    useEffect(() => {
        sync()
          .then(() => setSyncState('Synced Successfully'))
          .catch(() => setSyncState('Sync failed!'));
    });

    if (!syncState) {
        return null;
    }
    
    return (
        <View >
          <Text >{syncState}</Text>
        </View>
    );
}
export default SyncIndicator;