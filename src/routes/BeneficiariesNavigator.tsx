import React from 'react';
import {Text} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BeneficiariesListScreen from '../screens/Beneficiarias';
import BeneficiariesViewStack from '../screens/Beneficiarias/components/BeneficiariesViewStack';
import BeneficiarieServiceForm from '../screens/Beneficiarias/components/intervention';
import ReferenceForm from '../screens/References/components/ReferenceForm';
import BeneficiaryForm from '../screens/Beneficiarias/components/BeneficiaryForm';

const BeneficiaryStack = createNativeStackNavigator();

const BeneficiariesNavigator: React.FC = () => {

  return (
      <BeneficiaryStack.Navigator initialRouteName="BeneficiariesList"  screenOptions={{headerShown:false}}>
        <BeneficiaryStack.Screen name="BeneficiariesList" component={BeneficiariesListScreen} />
        <BeneficiaryStack.Screen name="BeneficiariesView" component={BeneficiariesViewStack} options={{
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
        <BeneficiaryStack.Screen name="BeneficiaryForm" component={BeneficiaryForm} options={{
                    headerTitle: (props) => (
                      <Text {...props} style={{ color: 'black', fontWeight: 'bold' }}>
                        back
                      </Text>
                    ),
                    headerShown:true
                }}/>
        <BeneficiaryStack.Screen name="ReferenceForm" component={ReferenceForm} options={{
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
