import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { Keyboard, StatusBar } from "react-native";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { navigationRef } from "./src/routes/NavigationRef";
import { Provider as ReduxProvider } from "react-redux";
import AppMain from "./src/routes";
import store from "./src/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      async () => {
        await AsyncStorage.setItem("event", "keyboardDidShow");
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      async () => {
        await AsyncStorage.setItem("event", "keyboardDidHide");
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const MyTheme = {
    ...DefaultTheme,
    DarkTheme: false,
    colors: {
      ...DefaultTheme.colors,
      text: "rgb(0, 0, 0)",
      background: "rgb(232, 232, 232)",
      border: "rgb(10, 10, 10)",
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
