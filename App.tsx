import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { navigationRef } from './src/routes/NavigationRef'
import {Provider as ReduxProvider} from 'react-redux';
import AppMain from './src/routes';
import store from './src/store';

const App = () => {
  const scheme = useColorScheme();
  const MyTheme = {
    ...DefaultTheme,
    DarkTheme:false,
    colors: {
      ...DefaultTheme.colors,
      text: 'rgb(0, 0, 0)',
      background: 'rgb(232, 232, 232)',
      border: 'rgb(10, 10, 10)',
    },
  };
  return (
    <>
      <StatusBar />

      <NavigationContainer ref={navigationRef} theme={MyTheme}>
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
