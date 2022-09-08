import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/routes/NavigationRef'
import AppMain from './src/routes';

const App = () => {

  return (
    <>
      <StatusBar />

      <NavigationContainer ref={navigationRef}>
        <NativeBaseProvider>
          <AppMain />
        </NativeBaseProvider>
      </NavigationContainer>
    
    </>
    );
};

export default App;
