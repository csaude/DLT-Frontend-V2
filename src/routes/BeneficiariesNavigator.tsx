import React from 'react';
import {Text} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BeneficiariesListScreen from '../screens/Beneficiarias';
import BeneficiariesViewScreen from '../screens/Beneficiarias/components/view';
import BeneficiarieServiceForm from '../screens/Beneficiarias/components/intervention';

const BeneficiaryStack = createNativeStackNavigator();

const BeneficiariesNavigator: React.FC = () => {

  return (
      <BeneficiaryStack.Navigator initialRouteName="BeneficiariesList"  screenOptions={{headerShown:false}}>
        <BeneficiaryStack.Screen name="BeneficiariesList" component={BeneficiariesListScreen} />
        <BeneficiaryStack.Screen name="BeneficiariesView" component={BeneficiariesViewScreen} options={{
                    headerTitle: (props) => (
                      <Text {...props} style={{ color: 'black', fontWeight: 'bold' }}>
                        back
                      </Text>
                    ),
                    headerShown:true
                }}/>
        <BeneficiaryStack.Screen name="BeneficiarieServiceForm" component={BeneficiarieServiceForm} options={{
                    headerTitle: (props) => (
                      <Text {...props} style={{ color: 'black', fontWeight: 'bold' }}>
                        back
                      </Text>
                    ),
                    headerShown:true
                }}/>
      </BeneficiaryStack.Navigator>
  );
}

export default BeneficiariesNavigator;
