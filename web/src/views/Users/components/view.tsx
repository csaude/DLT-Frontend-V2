
import React, { useState, Component } from "react";
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { View, KeyboardAvoidingView, ScrollView,
        TextInput, TouchableOpacity, Platform,
        Text} 
        from 'react-native';
import { Box, HStack, AspectRatio, Center, 
        Image, Stack, Heading, Divider, Avatar, 
        Icon, Flex, Spacer, VStack, Button} 
        from "native-base";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import {Picker} from '@react-native-picker/picker';
import { navigate } from "../../../routes/RootNavigation";
import { UsersModelState, Users } from '../../../models/Users';  
import { AuthModelState } from "../../../models/Auth";
import { PartnersModelState, Partners } from '../../../models/Partners';
import { ProfilesModelState, Profiles } from '../../../models/Profiles';
import { UsModelState, Us } from '../../../models/Us';
import { LocalityModelState, Locality } from '../../../models/Locality'; 
import Dashboard from "../../../components/Dashboard";     

import styles from './styles';
import { color } from "react-native-reanimated";
import { flexbox } from "native-base/lib/typescript/theme/styled-system";

interface UsersProps {
    dispatch: Dispatch<AnyAction>;
    userLogged: Users;
    partners: PartnersModelState;
    profiles: ProfilesModelState;
    us: UsModelState;
    localities: LocalityModelState;
    route: any;
}

@connect(
    ({
        partners,
        profiles,
        us,
        localities,
    }: {
        partners: PartnersModelState;
        profiles: ProfilesModelState;
        us: UsModelState;
        localities: LocalityModelState;
    }) => ({
        partners,
        profiles,
        us,
        localities,
    }),
  )

export default class UsersView extends Component<UsersProps>{
    user: Users;
    constructor(props: any) {
        super(props);  
        const { route } = this.props;
        this.user = route.params.user;
    }

    render(){
        
        return(

            Platform.OS==="web" ? 
                //  Web view
                <ScrollView>

                    <View style={{ alignItems: 'center', justifyContent: 'center',}}>
                        <View>
                            <Dashboard/>
                        </View>
                        <View style={{marginLeft: "30%", marginRight: "30%", width: 850,}}>
                            <View style={{ marginTop: 85,}}>
                                {/* <View style={{ width: 850,}}></View> */}
                                <View style={styles.containerForm} >
                                    <Box style={styles.userLogo}>
                                        <Avatar color="white" bg={'primary.700'} size={150}>
                                            <Icon as={<Ionicons name="person-outline" />} color="white" size={70} />
                                        </Avatar>
                                        <Box style={styles.userText}>     
                                            <Text>{ this.user.username }</Text> 
                                            <Heading style={styles.username}>{ this.user.name } { this.user.surname }</Heading>    
                                            <Text>{ this.user.email }</Text>                                              
                                        </Box> 
                                    </Box>
                        
                                    <Text style={styles.txtLabel}>Detalhes do Utilizador</Text>
                                    <Divider />

                                    <Flex direction="column" mb="2.5" mt="1.5" _text={{color: "coolGray.800"}}>
                                        
                                        <Text> <Text style={styles.txtLabel}>Parceiro: </Text> {this.user.partners?.name} </Text>

                                        <Text> <Text style={styles.txtLabel}>Telemóvel: </Text> { this.user.phoneNumber }</Text>

                                        <Text> <Text style={styles.txtLabel}>Ponto de Entrada: </Text>
                                            { 
                                                (this.user.entryPoint==="1") ?
                                                    "Unidade Sanitaria"
                                                : 
                                                (this.user.entryPoint==="2") ? 
                                                    "Escola"
                                                : 
                                                    "Comunidade"                                            
                                            }  
                                        </Text>
                                        
                                        <Text> <Text style={styles.txtLabel}>Localidade: </Text> {this.user.locality?.name}</Text>
                                        
                                        <Text> <Text style={styles.txtLabel}>US: </Text> {this.user.us?.name}</Text>
                                        
                                        <Text> <Text style={styles.txtLabel}>Perfil: </Text> {this.user.profiles?.description}</Text>

                                    </Flex>
                                    <Divider />

                                    <Text> <Text style={styles.txtLabel}>Estado: </Text> { (this.user.status===1)  ? "Activo" : "Inactivo" }</Text>
                                    <Flex direction="row" mb="2.5" mt="1.5" style={{justifyContent: 'flex-end', }}>
                                        
                                        <Center>
                                            <Button onPress={() => navigate({name: "UserList"})} style={{marginTop: 35,}} size={'md'}  bg="warning.400">
                                                <Icon as={<Ionicons name="play-back-sharp" />} color="white" size={25} />
                                            </Button>
                                        </Center>
                                        <Center>
                                            <Button onPress={() => navigate({name: "UserForm", params: {user: this.user}})} style={{marginTop: 35, marginLeft: 10,}} size={'md'} bg="primary.700">
                                                <Icon as={<Ionicons name="pencil-sharp" />} color="white" size={25} />
                                            </Button>
                                        </Center>
                                        
                                    </Flex>                           
                                </View>
                            </View>

                        </View>
                    </View>

                </ScrollView>
            
            :
                // Mobile View
            <KeyboardAvoidingView  style={styles.background}>
                <ScrollView>
                    <View style={styles.user}>
                        <View style={styles.containerForm}>
                            <Box style={styles.userLogo}>
                                <Avatar color="white" bg={'primary.700'} size={150}>
                                    <Icon as={<Ionicons name="person-outline" />} color="white" size={70} />
                                </Avatar>
                                <Box style={styles.userText}>     
                                    <Text>{ this.user.username }</Text> 
                                    <Heading style={styles.username}>{ this.user.name } { this.user.surname }</Heading>    
                                    <Text>{ this.user.email }</Text>                                              
                                </Box> 
                            </Box>
                  
                            <Text style={styles.txtLabel}>Detalhes do Utilizador</Text>
                            <Divider />

                            <Flex direction="column" mb="2.5" mt="1.5" _text={{color: "coolGray.800"}}>
                                
                                <Text> <Text style={styles.txtLabel}>Parceiro: </Text> {this.user.partners?.name} </Text>

                                <Text> <Text style={styles.txtLabel}>Telemóvel: </Text> { this.user.phoneNumber }</Text>

                                <Text> <Text style={styles.txtLabel}>Ponto de Entrada: </Text>
                                    { 
                                        (this.user.entryPoint==="1") ?
                                            "Unidade Sanitaria"
                                        : 
                                        (this.user.entryPoint==="2") ? 
                                            "Escola"
                                        : 
                                            "Comunidade"                                            
                                    }  
                                </Text>
                                
                                <Text> <Text style={styles.txtLabel}>Localidade: </Text> {this.user.locality?.name}</Text>
                                
                                <Text> <Text style={styles.txtLabel}>US: </Text> {this.user.us?.name}</Text>
                                
                                <Text> <Text style={styles.txtLabel}>Perfil: </Text> {this.user.profiles?.description}</Text>

                            </Flex>
                            <Divider />

                            <Text> <Text style={styles.txtLabel}>Estado: </Text> { (this.user.status===1)  ? "Activo" : "Inactivo" }</Text>

                        </View>
                    </View>
                </ScrollView>                
                            
                <TouchableOpacity onPress={() => navigate({name: "UserForm", params: {user: this.user}}) } style={styles.fab}>
                    <Icon as={<Ionicons name="pencil" />} color="white" />
                </TouchableOpacity>
            </KeyboardAvoidingView>
        )
    }
}
