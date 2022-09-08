import React from "react";
import { Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReferencesListScreen from '../screens/References';
import ReferenceViewStack from "../screens/References/components/ReferenceViewStack";
import ServicesForm from "../screens/References/components/ServicesForm";

const ReferenceStack = createNativeStackNavigator();

const ReferencesNavigator: React.FC = () => {
    return (
        <ReferenceStack.Navigator initialRouteName="ReferencesList" screenOptions={{headerShown:false}}>
            <ReferenceStack.Screen name="ReferencesList" component={ReferencesListScreen} />
            <ReferenceStack.Screen name="ReferenceView" component={ReferenceViewStack} options={{
                    headerTitle: (props) => (
                      <Text {...props} style={{ color: 'black', fontWeight: 'bold' }}>
                        back
                      </Text>
                    ),
                    headerShown:true
                }} />
             <ReferenceStack.Screen name="ServicesForm" component={ServicesForm} options={{
                    headerTitle: (props) => (
                      <Text {...props} style={{ color: 'black', fontWeight: 'bold' }}>
                        Atender Serviço de Referência
                      </Text>
                    ),
                    headerShown:true
                }}/>
        </ReferenceStack.Navigator>
    );
}

export default ReferencesNavigator;