import React from "react";
import DrawerNavigation from "../routes/DrawerNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Signin from "../screens/Login";
import ChangePassword from "../screens/Login/changePassword";
import ResetPassword from "../screens/Login/ResetPassword";

const AppStack = createNativeStackNavigator();

const Routes: React.FC = () => (
  <AppStack.Navigator initialRouteName="Login">
    <AppStack.Screen
      name="Login"
      component={Signin}
      options={{ headerShown: false }}
    />
    <AppStack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={{ headerShown: false }}
    />
    <AppStack.Screen
      name="Main"
      component={DrawerNavigation}
      options={{ headerShown: false }}
    />
    <AppStack.Screen
      name="ResetPassword"
      component={ResetPassword}
      options={{ headerShown: false }}
    />
  </AppStack.Navigator>
);

export default Routes;
