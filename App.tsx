import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/routes/NavigationRef'
import {Provider as ReduxProvider} from 'react-redux';
import AppMain from './src/routes';
import store from './src/store';

const App = () => {

  return (
    <>
      <StatusBar />

      <NavigationContainer ref={navigationRef}>
        <NativeBaseProvider>
          <ReduxProvider store={store}>
              <AppMain />
          </ReduxProvider>          
        </NativeBaseProvider>
      </NavigationContainer>
    
    </>
    );
};

export default App;
