import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';

import { NativeBaseProvider, ScrollView, Center, Box, Text, Heading, 
    Button, Flex, View, Divider, Avatar}
from 'native-base';
import { faUser} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import styles from './styles';


const userView = () => {

  const navigate = useNavigate();
  const {state} = useLocation();
  const {user}:any = state;

  return (
    <NativeBaseProvider>
    
        <ScrollView>

            <View style={{ alignItems: 'center', justifyContent: 'center',}}>
                <View style={{marginLeft: "30%", marginRight: "30%", width: 850,}}>
                    <View style={{ marginTop: 85,}}>
                        <View style={styles.containerForm} >
                            <Box style={styles.userLogo}>
                                <Avatar color="white" bg={'primary.700'} size={150}>
                                    <FontAwesomeIcon icon={faUser} style={{fontSize: 70}}/>
                                </Avatar>
                                <Box style={styles.userText}>     
                                    <Text>{ user.username }</Text> 
                                    <Heading style={styles.username}>{ user.name } { user.surname }</Heading>    
                                    <Text>{ user.email }</Text>                                              
                                </Box> 
                            </Box>
                
                            <Text style={styles.txtLabel}>Detalhes do Utilizador</Text>
                            <Divider />

                            <Flex direction="column" mb="2.5" mt="1.5" _text={{color: "coolGray.800"}}>
                                
                                <Text> <Text style={styles.txtLabel}>Parceiro: </Text> {user.partners?.name} </Text>

                                <Text> <Text style={styles.txtLabel}>Telemóvel: </Text> { user.phoneNumber }</Text>

                                <Text> <Text style={styles.txtLabel}>Ponto de Entrada: </Text>
                                    { 
                                        (user.entryPoint==="1") ?
                                            "Unidade Sanitaria"
                                        : 
                                        (user.entryPoint==="2") ? 
                                            "Escola"
                                        : 
                                            "Comunidade"                                            
                                    }  
                                </Text>
                                
                                <Text> <Text style={styles.txtLabel}>Localidade: </Text> {user.locality?.name}</Text>
                                
                                <Text> <Text style={styles.txtLabel}>US: </Text> {user.us?.name}</Text>
                                
                                <Text> <Text style={styles.txtLabel}>Perfil: </Text> {user.profiles?.description}</Text>

                            </Flex>
                            <Divider />

                            <Text> <Text style={styles.txtLabel}>Estado: </Text> { (user.status===1)  ? "Activo" : "Inactivo" }</Text>
                            <Flex direction="row" mb="2.5" mt="1.5" style={{justifyContent: 'flex-end', }}>
                                
                                <Center>
                                    <Button onPress={() => navigate("/usersList")} style={{marginTop: 35,}} size={'md'}  bg="warning.400">
                                        Voltar
                                    </Button>
                                </Center>
                                <Center>
                                    <Button onPress={() => navigate("/usersForm", { state: { user: user } } )} style={{marginTop: 35, marginLeft: 10,}} size={'md'} bg="primary.700">
                                       Editar
                                    </Button>
                                </Center>
                                
                            </Flex>                           
                        </View>
                    </View>

                </View>
            </View>

        </ScrollView>
    </NativeBaseProvider>
  )};

export default userView;
