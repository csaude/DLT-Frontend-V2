import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { sync } from '../../database/sync';
import { Alert, Text, HStack, VStack } from "native-base";

export const SuccessHandler: React.FC = () => {

    return (
        <>
            <Alert w="100%" variant="left-accent" colorScheme="success" status="success">
                <VStack space={2} flexShrink={1} w="100%">
                    <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                        <HStack space={2} flexShrink={1} alignItems="center">
                            <Alert.Icon />
                            <Text color="coolGray.800">
                                Synced Successfully!
                            </Text>
                        </HStack>
                    </HStack>
                </VStack>
            </Alert>
        </>
    );
}

export const ErrorHandler: React.FC = () => {
    return (
        <>
            <Alert w="100%" variant="left-accent" colorScheme="error" status="error">
                <VStack space={2} flexShrink={1} w="100%">
                    <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                        <HStack space={2} flexShrink={1} alignItems="center">
                            <Alert.Icon />
                            <Text color="coolGray.800">
                                Sync Failed!
                            </Text>
                        </HStack>
                    </HStack>
                </VStack>
            </Alert>

        </>
    );
}

const SyncIndicator = () => {
    const [syncState, setSyncState] = useState<string>('Syncing data...');

    useEffect(() => {
        /*sync()
          .then(() => setSyncState('Synced Successfully'))
          .catch(() => setSyncState('Sync failed!'));*/
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