import React from "react";
import { Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReferencesListScreen from '../screens/References';
import BeneficiariesNavigator from "./BeneficiariesNavigator";

const ReferenceStack = createNativeStackNavigator();

const ReferencesNavigator: React.FC = () => {
    return (
        <ReferenceStack.Navigator initialRouteName="ReferencesList" screenOptions={{headerShown:false}}>
            <ReferenceStack.Screen name="ReferencesList" component={ReferencesListScreen} />
        </ReferenceStack.Navigator>
    );
}

export default ReferencesNavigator;