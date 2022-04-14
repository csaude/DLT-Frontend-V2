import React, { createContext } from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import CustomDrawer from './components/CustomDrawer';
import UsersNavigator from './UsersNavigator';
import { Text } from 'react-native-svg';


function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Dreams Layering Tool </Text>
    </View>
  );
}


export const Context = createContext({});
const Drawer = createDrawerNavigator();

const DrawerNavigation: React.FC = ({ route }: any) => {
  const { loggedUser } = route.params;


  const onLogout = (e?: any) => {
    console.log("logged out", loggedUser);
  };


  return (
    <Context.Provider value={loggedUser}>
      <Drawer.Navigator 
        screenOptions={{
            headerStyle: {
                backgroundColor: '#0c4a6e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {   
            fontWeight: 'bold',
            },
        }}
        drawerContent={(props) => <CustomDrawer { ...props } onLogout={onLogout} /*loggedUser={loggedUser}*/ />}
      >
        <Drawer.Screen name="Home" 
            component={HomeScreen} 
            options={{                     
                title: 'Dashboard', 
                headerTitle: '',
            }}
        />
        <Drawer.Screen name="Users" 
            component={UsersNavigator}  
            options={{                     
                title: 'Utilizadores', 
                headerTitle: '',
            }}
            
        />
      
      </Drawer.Navigator>
    </Context.Provider>
  );
}

export default DrawerNavigation;