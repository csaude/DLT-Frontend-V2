import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BeneficiariasListScreen from '../screens/Beneficiarias';

const BeneficiariaStack = createNativeStackNavigator();

const BeneficiariasNavigator: React.FC = () => {

  return (
      <BeneficiariaStack.Navigator initialRouteName="BeneficiariasList"  screenOptions={{headerShown:false}}>
        <BeneficiariaStack.Screen name="BeneficiariasList" component={BeneficiariasListScreen} />
      </BeneficiariaStack.Navigator>
  );
}

export default BeneficiariasNavigator;
