import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView, StatusBar} from 'react-native';
import { NativeBaseProvider,Text,Button } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/routes/NavigationRef'
import SyncIndicator from './src/components/SyncIndicator';
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
