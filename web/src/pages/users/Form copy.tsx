import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {ContentHeader} from '@components';
import { NativeBaseProvider, Center, Box, Text, Heading, VStack, FormControl, 
        Input,  Button, Select, WarningOutlineIcon, HStack, Stack, 
        Alert, Flex, Icon, View, Radio}
     from 'native-base';

import styles from './styles'; 

import { UserModel } from '../../models/User';
import { Accordion } from 'react-bootstrap';

const UserForm = () => {
    
    const {state}:any = useLocation();
    const paramUser:any = state ? state.user: null;

    const account = paramUser ? paramUser : {
                                    partners: {},
                                    profiles:{},
                                    locality:{},
                                    us:{}
                                  }

  return (
    <NativeBaseProvider>
        <View style={styles.webStyle}>                     
            <Center w="100%" bgColor="white">
                <Box safeArea p="2" w="90%" py="8">
                    <Heading size="lg" color="coolGray.800" 
                                       _dark={{ color: "warmGray.50"}} 
                                       fontWeight="semibold"
                                       marginBottom={5}
                                       marginTop={0} >
                        Registo do Utilizador
                    </Heading>
                    <Alert  status="info" colorSchem>
                        <HStack flexShrink={1} space={2} alignItems="center">
                            <Alert.Icon />
                            <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
                                Preencha os campos abaixo para registar novo utilizador!
                            </Text>
                        </HStack>
                    </Alert>                               
                    <VStack space={3} mt="5">
                        <FormControl isRequired >
                            <FormControl.Label>Apelido</FormControl.Label>
                            <Input variant="filled" 
                                     placeholder="Insira o seu Apelido" 
                                    value={ account.surname }
                                    onChangeText={value=> {}}/>
                        </FormControl>
                        <FormControl isRequired>
                            <FormControl.Label>Nome</FormControl.Label>
                            <Input variant="filled" 
                                    placeholder="Insira o seu Nome"
                                    value={ account.name }
                                    onChangeText={(value : string)=> {  }}/>

                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Email</FormControl.Label>
                            <Input variant="filled" 
                                    placeholder="Insira o seu Email"
                                    value={ account.email }
                                    onChangeText={(value : string)=> { }}/>

                        </FormControl>
                        <FormControl isRequired >
                                <FormControl.Label>Username</FormControl.Label>
                                <Input variant="filled" placeholder="Insira o seu Username"
                                        value={ account.username }
                                        onChangeText={value => {  }}/>
                            </FormControl>
                        <FormControl>
                            <FormControl.Label>Telemóvel</FormControl.Label>
                            <Input variant="filled" 
                                    placeholder="Insira o seu Telemóvel"
                                    value={ account.phoneNumber }
                                    onChangeText={(value : string)=> { }}/>

                        </FormControl>
                        <FormControl isRequired >
                            <FormControl.Label>Ponto de Entrada</FormControl.Label>
                            <Select selectedValue={account.entryPoint} accessibilityLabel="Selecione o Ponto de Entrada" placeholder="Selecione o Ponto de Entrada" >
                                <Select.Item label="UX Research" value="ux" />
                                <Select.Item label="Web Development" value="web" />
                                <Select.Item label="Cross Platform Development" value="cross" />
                            </Select>
                        </FormControl>
                        <FormControl isRequired >
                            <FormControl.Label>Parceiro</FormControl.Label>
                            <Select selectedValue={account.partners.id || "0"} accessibilityLabel="Selecione o Parceiro" placeholder="Selecione o Parceiro" >
                                <Select.Item label="UX Research" value="ux" />
                                <Select.Item label="Web Development" value="web" />
                                <Select.Item label="Cross Platform Development" value="cross" />
                            </Select>
                        </FormControl>
                        <FormControl isRequired>
                            <FormControl.Label>Perfil</FormControl.Label>
                            <Select selectedValue={account.profiles.id || "0"} accessibilityLabel="Selecione o Perfil" placeholder="Selecione o Perfil" >
                                <Select.Item label="UX Research" value="ux" />
                                <Select.Item label="Web Development" value="web" />
                                <Select.Item label="Cross Platform Development" value="cross" />
                            </Select>
                        </FormControl>
                        <FormControl isRequired >
                            <FormControl.Label>Localidade</FormControl.Label>
                            <Select selectedValue={account.locality.id || "0"} accessibilityLabel="Selecione a Localidade" placeholder="Selecione a Localidade" >
                                <Select.Item label="UX Research" value="ux" />
                                <Select.Item label="Web Development" value="web" />
                                <Select.Item label="Cross Platform Development" value="cross" />
                            </Select>
                        </FormControl>
                        <FormControl isRequired >
                            <FormControl.Label>US</FormControl.Label>
                            <Select selectedValue={account.us.id || "0"} accessibilityLabel="Selecione a US" placeholder="Selecione a US" >
                                <Select.Item label="UX Research" value="ux" />
                                <Select.Item label="Web Development" value="web" />
                                <Select.Item label="Cross Platform Development" value="cross" />
                            </Select>                                   
                        </FormControl>
                        <FormControl isRequired>
                            <FormControl.Label>Estado:</FormControl.Label>
                            <Radio.Group defaultValue="1" name="rbEstado" accessibilityLabel="Estado" value={String(account.status) || ""}>
                                <Stack direction={{
                                    base: "column",
                                    md: "row"
                                    }} alignItems={{
                                    base: "flex-start",
                                    md: "center"
                                    }} space={4} w="75%" maxW="300px">
                                    <Radio value="1" my={1}>
                                        Activo
                                    </Radio>
                                    <Radio value="0" my={1}>
                                        Inactivo
                                    </Radio>
                                </Stack>
                            </Radio.Group>
                        </FormControl>
                        <Flex direction="row" mb="2.5" mt="1.5" style={{justifyContent: 'flex-end', }}>
                            
                            <Center>
                                <Button onPress={() => 'navigate({name: "UserList"})'} size={'md'}  bg="warning.400">
                                    {/* <Icon as={<Ionicons name="play-back-sharp" />} color="white" size={25} /> */}
                                    Voltar
                                </Button>
                            </Center>
                            <Center>
                                <Button bg="primary.700" style={{marginLeft:10,}}>
                                    <Text style={styles.txtSubmit}> Gravar</Text>                                                
                                </Button>
                            </Center>                                
                        </Flex>  
                    </VStack>                              
                </Box>  
            </Center>   
        </View>
    </NativeBaseProvider>
  );
};

export default UserForm;
