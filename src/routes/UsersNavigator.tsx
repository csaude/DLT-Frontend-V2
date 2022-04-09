import * as React from 'react';
import {Text, Platform} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UsersListScreen from '../screens/Users';
import UsersFormScreen from '../screens/Users/components/register';
import UsersViewScreen from '../screens/Users/components/view';

const UserStack = createNativeStackNavigator();

const UsersNavigator: React.FC = ({ loggedUser }:any) => {
  return (
      <UserStack.Navigator initialRouteName="UserList"  screenOptions={{headerShown:false}}>
        <UserStack.Screen name="UserList" component={UsersListScreen} initialParams={{ loggedUser}} />
        <UserStack.Screen name="UserForm" component={UsersFormScreen} options={{
                    headerTitle: (props) => (
                      <Text {...props} style={{ color: 'black', fontWeight: 'bold' }}>
                        back
                      </Text>
                    ),
                    headerShown:(Platform.OS==='web' ? false: true)
                }}/>
        <UserStack.Screen name="UserView" component={UsersViewScreen} options={{
                    headerTitle: (props) => (
                      <Text {...props} style={{ color: 'black', fontWeight: 'bold' }}>
                        back
                      </Text>
                    ),
                    headerShown:(Platform.OS==='web' ? false: true)
                }}/>
      </UserStack.Navigator>
  );
}

export default UsersNavigator;
