import React, { createContext, useEffect } from 'react';
import { View , Text} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './components/CustomDrawer';
import BeneficiariesNavigator from './BeneficiariesNavigator';
import RefencesNavigator from './ReferencesNavigator'
import { navigate } from './NavigationRef';
import { Q } from "@nozbe/watermelondb";
import { database } from '../database';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserProvinces, loadUserDistricts, loadUserLocalities, loadUserUss } from '../store/authSlice';
import styles from './components/style';
import { Badge, Box, VStack } from 'native-base';
import { beneficiariesFetchCount } from '../services/beneficiaryService';
import { referencesFetchCount } from '../services/referenceService';
import { getBeneficiariesTotal } from '../store/beneficiarySlice';
import { getReferencesTotal } from '../store/referenceSlice';

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dreams Layering Tool </Text>
    </View>
  );
}

export const Context = createContext({});
const Drawer = createDrawerNavigator();

const DrawerNavigation: React.FC = ({ route }: any) => {
  const { loggedUser } = route?.params;

  const userDetailsCollection = database.get('user_details')
  const dispatch = useDispatch()

  const beneficiariesTotal = useSelector((state:any)=>state.beneficiary.total)
  const referencesTotal = useSelector((state:any)=>state.reference.total)

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
      
      getTotals().catch(error=>console.log(error));  
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

   useEffect(() => {
    const timer = setTimeout(() => {   
        navigate({
          name: "Login"
        });
    },  
     1800000
    );
    return () => clearTimeout(timer);
  }, []);

  const ItemBadge = ({ label, total }) => {
    return <Box alignItems="center">
        <VStack>
          <Text  style={{ fontWeight: 'bold', color: '#424345'}}>{label}
          <Badge // bg="red.400"
            colorScheme={total>0?"info" : "danger"} rounded="full"   variant="solid" alignSelf="flex-end" _text={{
              fontSize: 12
            }}>
          {total}
          </Badge>   
          </Text> 
        </VStack>
      </Box>;
  }

  const getTotals = async () =>{
      const countBen = await beneficiariesFetchCount();
      dispatch(getBeneficiariesTotal(countBen));
      
      const countRef = await referencesFetchCount();
      dispatch(getReferencesTotal(countRef));
  }


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
                title: '',
                headerTitle: '',
                drawerIcon: () => <ItemBadge label="Beneficiárias" total={beneficiariesTotal}/>,
            }}
            
        />        
        <Drawer.Screen name="References" 
            component={RefencesNavigator}
            options={{                     
                title: '',
                headerTitle: '',
                drawerIcon: () => <ItemBadge label="Referências" total={referencesTotal} />,
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