import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { sync } from '../../database/sync';
import { Alert, Text, HStack, VStack } from "native-base";

export const ErrorHandlerInterventionAlreadyExists: React.FC = () => {
    return (
        <>
            <Alert w="100%" variant="left-accent" colorScheme="error" status="error">
                <VStack space={2} flexShrink={1} w="100%">
                    <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                        <HStack space={2} flexShrink={1} alignItems="center">
                            <Alert.Icon />
                            <Text color="coolGray.800">
                                Beneficiário já tem esta intervenção para esta data!
                            </Text>
                        </HStack>
                    </HStack>
                </VStack>
            </Alert>

        </>
    );
}
