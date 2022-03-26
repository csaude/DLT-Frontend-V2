import 'react-native-gesture-handler';
import React from 'react';
import { NativeBaseProvider,Text,Button } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/routes/NavigationRef'
import AppMain from './src/routes';

const App = () => {

  return (
    <NavigationContainer ref={navigationRef}>
      <NativeBaseProvider>
        <AppMain />
      </NativeBaseProvider>
    </NavigationContainer>
  );
};

export default App;
