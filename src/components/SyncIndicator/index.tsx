import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Alert, Text, HStack, VStack } from "native-base";

export const SuccessHandler: React.FC = () => {
  return (
    <>
      <Alert
        w="100%"
        variant="left-accent"
        colorScheme="success"
        status="success"
      >
        <VStack space={2} flexShrink={1} w="100%">
          <HStack
            flexShrink={1}
            space={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack space={2} flexShrink={1} alignItems="center">
              <Alert.Icon />
              <Text color="coolGray.800">
                Sincronização efectuada com sucesso!
              </Text>
            </HStack>
          </HStack>
        </VStack>
      </Alert>
    </>
  );
};

export const ErrorHandler: React.FC = () => {
  return (
    <>
      <Alert w="100%" variant="left-accent" colorScheme="error" status="error">
        <VStack space={2} flexShrink={1} w="100%">
          <HStack
            flexShrink={1}
            space={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack space={2} flexShrink={1} alignItems="center">
              <Alert.Icon />
              <Text color="coolGray.800">Falha na sincronização!</Text>
            </HStack>
          </HStack>
        </VStack>
      </Alert>
    </>
  );
};

export const WithoutNetwork: React.FC = () => {
  return (
    <>
      <Alert w="100%" variant="left-accent" colorScheme="success" status="info">
        <VStack space={2} flexShrink={1} w="100%">
          <HStack
            flexShrink={1}
            space={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack space={2} flexShrink={1} alignItems="center">
              <Alert.Icon />
              <Text color="coolGray.800">Sem conexão a internet!!!</Text>
            </HStack>
          </HStack>
        </VStack>
      </Alert>
    </>
  );
};

const SyncIndicator = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [syncState, setSyncState] = useState<string>("Syncing data...");

  useEffect(() => {
    /*sync()
          .then(() => setSyncState('Synced Successfully'))
          .catch(() => setSyncState('Sync failed!'));*/
  });

  if (!syncState) {
    return null;
  }

  return (
    <View>
      <Text>{syncState}</Text>
    </View>
  );
};
export default SyncIndicator;
