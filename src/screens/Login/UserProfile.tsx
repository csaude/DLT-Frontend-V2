import React, { useState, useEffect, useContext } from "react";
import { View, KeyboardAvoidingView, ScrollView,
    TextInput, TouchableOpacity, Platform,
    Text} 
    from 'react-native';
import { Box, HStack, AspectRatio, Center, 
    Image, Stack, Heading, Divider, Avatar, 
    Icon, Flex, Spacer, VStack, Button} 
    from "native-base";
import { parse } from 'qs';
import { Ionicons } from "@native-base/icons";
import { navigate } from "../../routes/NavigationRef";
import { database } from '../../database';
import { Q } from "@nozbe/watermelondb";
import styles from "./styles";
import { Context } from "../../routes/DrawerNavigator";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import withObservables from "@nozbe/with-observables";

const UserProfile: React.FC = ({ route , users}:any) => {
    // const {user, profile, locality, partner, us} = route.params;

    const loggedUser: any = useContext(Context);
    // const user = loggedUser;
    // const userDetails = useSelector((state: RootState) => state.auth.userDetails);
    // const userDetailsCollection = database.get('users');
    // const [user, setUser] = useState<any>([]);

    const firstLogin = loggedUser?.entry_point === undefined ? "1" : "2";
    const user = users.filter((e) => {
        return e?._raw.online_id == (firstLogin === '1'? loggedUser?.id : loggedUser?.online_id)
    })[0]?._raw;
    // const userDetail = userDetailsCollection.query(
    //     Q.where('online_id', parseInt(firstLogin === '1'? userOn?.id : userOn?.online_id))
    // ).fetch();
    // const getUser = (user_id: any) => {
    //     const localUser = users.filter((e) => {
    //         return e?._raw.online_id == user_id
    //     })[0]?._raw;
    //     // setUser(localUser);
    // }
     
    // const getUser = async (currentUserId) =>{
        
    //     const userDetailsCollection = database.get('users')
    //     // const beneficiariesCollection = database.get("beneficiaries")

    //     const userDetailsQ = await userDetailsCollection.query(
    //             Q.where('online_id', parseInt(currentUserId))
    //         ).fetch();
    //     const userDetailsRaw = userDetailsQ[0]?._raw
   
    //     // const oneUser = await beneficiariesCollection.query(Q.where('bar', 1)).fetch()
    //             // setUserBeneficiaries(beneficiaries)
    // }

    // console.log(getUser(firstLogin === '1'? loggedUser?.id : loggedUser?.online_id));
    // console.log(users.__changes);
    // setUser(getUser(firstLogin === '1'? user?.id : user?.online_id));
    console.log("==================================================================");
    console.log(user);
    console.log("==================================================================");
    // console.log(userDetails);
    // console.log("==================================================================");
   

    return (
        <KeyboardAvoidingView  style={styles.background}>
            <ScrollView>
                <View style={styles.user}>
                    <View style={styles.containerForm}>
                        <Box style={styles.userLogo}>
                            <Avatar color="white" bg={'primary.700'} size={150}>
                                <Icon as={Ionicons} name="person-outline" color="white" size={70} />
                            </Avatar>
                            <Box style={styles.userText}>     
                                <Text>{ user?.username }</Text> 
                                <Heading style={styles.username}>{ user?.name } { user?.surname }</Heading>  
                                <Text>{ user?.email }</Text>     
                                <Text>{ firstLogin === '1'? user?.id : user?.online_id }</Text>                                                                                                                                  
                            </Box> 
                        </Box>
                        <Text style={styles.txtLabel}>Detalhes do Utilizador</Text>
                        <Divider />
                        <Flex direction="column" mb="2.5" mt="1.5" _text={{color: "coolGray.800"}}>
                                
                            <Text> <Text style={styles.txtLabel}>Parceiro: </Text> {user?.organization_name} </Text>

                            <Text> <Text style={styles.txtLabel}>Telemóvel: </Text> { user?.phone_number }</Text>

                            <Text> <Text style={styles.txtLabel}>Ponto de Entrada: </Text>
                            { 
                                (user?.entry_point==="1") ?
                                    "Unidade Sanitaria"
                                    : 
                                (user?.entry_point==="2") ? 
                                    "Comunidade"
                                    : 
                                    "Escola"                                            
                                }  
                            </Text>
                                
                            {/* <Text> <Text style={styles.txtLabel}>Localidade: </Text> {locality}</Text>
                                
                            <Text> <Text style={styles.txtLabel}>US: </Text> {us}</Text>
                                
                            <Text> <Text style={styles.txtLabel}>Perfil: </Text> {profile}</Text> */}

                        </Flex>
                        <Divider />

                        <Text> <Text style={styles.txtLabel}>Estado: </Text> { (user?.status===1)  ? "Activo" : "Inactivo" }</Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const enhance = withObservables([], () => ({
    users: database.collections
      .get("users")
      .query().observe(),
}));

export default enhance(UserProfile);