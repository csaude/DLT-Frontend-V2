import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DadosPessoaisView from './DadosPessoaisView';
import InterventionsView from './InterventionsView';
import Ionicons from 'react-native-vector-icons/Ionicons';

function VulnerabilitiesScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Vulnerabilities!</Text>
      </View>
    );
  }

function ReferencesScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>References!</Text>
      </View>
    );
  }

const Tab = createBottomTabNavigator();

export default function BeneficiariesViewStack({route}) {
  return (

      <Tab.Navigator initialRouteName='Dados Pessoais' screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dados Pessoais') {
            iconName = focused ? 'woman' : 'woman-outline';
          }else if (route.name === 'Vulnerabilidades') {
            iconName = focused ? 'pulse' : 'pulse-outline';
          } else if (route.name === 'Serviços') {
            iconName = focused ? 'medkit' : 'medkit-outline';
          }else if (route.name === 'Referencias') {
            iconName = focused ? 'sync' : 'sync-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray', 
      })}>
        <Tab.Screen name="Dados Pessoais" component={DadosPessoaisView}  options={{ headerShown:false }} 
                                            initialParams={{beneficiary: route.params?.beneficiary,
                                                            interventions: route.params?.interventions}} />
        <Tab.Screen name="Vulnerabilidades" component={VulnerabilitiesScreen} options={{ headerShown:false }}
                                              initialParams={{beneficiary: route.params?.beneficiary,
                                                              interventions: route.params?.interventions}} />
        <Tab.Screen name="Serviços" component={InterventionsView} options={{ headerShown:false }} 
                                              initialParams={{beneficiary: route.params?.beneficiary,
                                                              interventions: route.params?.interventions}}/>
        <Tab.Screen name="Referencias" component={ReferencesScreen} options={{ headerShown:false }}/>
      </Tab.Navigator>

  );
}