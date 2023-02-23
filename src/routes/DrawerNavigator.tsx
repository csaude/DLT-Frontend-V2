import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, View , Text} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import CustomDrawer from './components/CustomDrawer';
import UsersNavigator from './UsersNavigator';
import BeneficiariesNavigator from './BeneficiariesNavigator';
import RefencesNavigator from './ReferencesNavigator'
import { navigate } from './NavigationRef';
import { Q } from "@nozbe/watermelondb";
import { database } from '../database';
import { loadLocalRawResource } from 'react-native-svg';
import { useDispatch } from 'react-redux';
import { loadUserProvinces, loadUserDistricts, loadUserLocalities, loadUserUss } from '../store/authSlice';

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
  const { loggedUser } = route?.params;

  const userDetailsCollection = database.get('user_details')
  const dispatch = useDispatch()

  useEffect(()=>{
      const getUserDetails = async()=>{   
        if(loggedUser.online_id !== undefined)    {
            const userDetailsQ = await userDetailsCollection.query(
                              Q.where('user_id', loggedUser.online_id)
                          ).fetch();
            const userDetailRaw = userDetailsQ[0]?._raw
            getProvincesByIds(userDetailRaw).catch(err => console.error(err));
            getDistrictsByIds(userDetailRaw).catch(err => console.error(err));
            getLocalitiesByIds(userDetailRaw).catch(err => console.error(err));
            getUssByIds(userDetailRaw).catch(err => console.error(err)); 
        }               
      }   
      getUserDetails().catch(error=>console.log(error));   
  },[])

  const getProvincesByIds =async (userDetails)=>{   
                var a = userDetails?.provinces                
                if(a!==''){
                    var b = a?.split(',').map(Number); 
                    const provincesQ = await database.get('provinces').query(Q.where('online_id', Q.oneOf(b))).fetch();
                    const provRaws = provincesQ.map(item=>item._raw)
                    dispatch(loadUserProvinces({provinces:provRaws}))          
                }else{
                    const getAllProvs = await database.get('provinces').query().fetch();
                    const provRaws = getAllProvs.map(item => item._raw)
                    dispatch(loadUserProvinces({provinces:provRaws}))
                }   
          }

          const getDistrictsByIds =async (userDetails)=>{         
              var a = userDetails?.districts
              if(a!==''){
                var b = a?.split(',').map(Number);                
                const districtsQ = await database.get('districts').query(Q.where('online_id', Q.oneOf(b))).fetch();
                const districtRaws= districtsQ.map(item=>item._raw)
                dispatch(loadUserDistricts({districts:districtRaws})) 
              }else{
                  const getAllDists = await database.get('districts').query().fetch();
                  const distRaws = getAllDists.map(item => item._raw)
                  dispatch(loadUserDistricts({districts:distRaws}))   
              }
          }

          const getLocalitiesByIds=async (userDetails)=>{
              var a = userDetails?.localities
              if(a!==''){
                var b = a?.split(',').map(Number);                
                const localitiesQ = await database.get('localities').query(Q.where('online_id', Q.oneOf(b))).fetch();
                const localRaws = localitiesQ.map(item=>item._raw)
                dispatch(loadUserLocalities({localities:localRaws}))
              }else{
                  const getAllLocalits = await database.get('localities').query().fetch();
                  const localRaws = getAllLocalits.map(item => item._raw)
                  dispatch(loadUserLocalities({localities:localRaws})) 
              }
          }

          const getUssByIds=async (userDetails)=>{
                var a = userDetails?.uss
                if(a!==''){
                  var b = a?.split(',').map(Number);                
                  const ussQ = await database.get('us').query(Q.where('online_id', Q.oneOf(b))).fetch();
                  const usRaws = ussQ.map(item=>item._raw)
                  dispatch(loadUserUss({uss:usRaws})) 
                }else{
                  const getAllUss = await database.get('us').query().fetch();
                  const usRaws = getAllUss.map(item => item._raw)
                  dispatch(loadUserUss({uss:usRaws})) 
                }
          }

  const onLogout = (e?: any) => {
    navigate({
      name: "Login"
    });
  };

  return (
    <Context.Provider value={loggedUser}>
      <Drawer.Navigator 
        screenOptions={{
            headerStyle: {
                backgroundColor:'#17a2b8', //'#0c4a6e',
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
        <Drawer.Screen name="Beneficiaries" 
            component={BeneficiariesNavigator}
            options={{                     
                title: 'Beneficiárias',
                headerTitle: '',
            }}
            
        />        
        <Drawer.Screen name="References" 
            component={RefencesNavigator}
            options={{                     
                title: 'Referências',
                headerTitle: '',
            }}
            
        />
        {/* <Drawer.Screen name="Users" 
            component={UsersNavigator}  
            options={{                     
                title: 'Utilizadores', 
                headerTitle: '',
            }}
            
        />
       */}
      </Drawer.Navigator>
    </Context.Provider>
  );
}

export default DrawerNavigation;