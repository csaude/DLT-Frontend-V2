import React from "react";
import { View } from 'react-native';
import {  Text } from "native-base";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DadosReferenciaView from './DadosReferenciaView';
import InterventionsView from './InterventionsView';
import ServiceView from './ServiceView';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function ReferenceViewStack({ route }) {
  
  return (

    <Tab.Navigator initialRouteName='Dados Referência' screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Dados Referência') {
          iconName = focused ? 'exit' : 'exit-outline';
        } else if (route.name === 'Serviços Solicitados') {
          iconName = focused ? 'medkit' : 'medkit-outline';
        } else if (route.name === 'Intervenções Recebidas') {
          iconName = focused ? 'medkit' : 'medkit-outline';
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#17a2b8',
      tabBarInactiveTintColor: 'gray',
    })}>
      <Tab.Screen name="Dados Referência" component={DadosReferenciaView} options={{ headerShown: false }}
        initialParams={{
          reference: route.params?.reference,
          beneficiary:  route.params?.beneficiary,
          referer:  route.params?.referer,
          organization:  route.params?.organization
        }} />
      <Tab.Screen name="Serviços Solicitados" component={ServiceView} options={{ headerShown: false }}
        initialParams={{
          beneficiary: route.params?.beneficiary,
          services: route.params?.services
        }} />
      <Tab.Screen name="Intervenções Recebidas" component={InterventionsView} options={{ headerShown: false }}
        initialParams={{
          beneficiary: route.params?.beneficiary,
          interventions: route.params?.interventions
        }} />
    </Tab.Navigator>
  );
}