import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import {ContentHeader} from '@components';
import { NativeBaseProvider, Center, Box, Text, Heading, VStack, FormControl, 
        Input,  Button, Select, WarningOutlineIcon, HStack, Stack, 
        Alert, Flex, Icon, CheckIcon, View, Radio}
     from 'native-base';

import {Formik} from 'formik';
// import User, { UsersModel } from '../../models/Users';

import styles from './styles'; 


const UserForm: React.FC = ({ user, localities, profiles, us, partners }:any) => {
        
    const [initialValues, setInitialValues] = useState({
        surname: '',
        username: '',
        password: '', 
        name:'', 
        email:'', 
        phone_number:'', 
        entryPoint:'', 
        profile_id:'',
        partner_id: '',
        locality_id: '',
        us_id: ''
    });

    const message = "Este campo é Obrigatório!!!";

    const validate = (values: any) => {
        const errors: any = {};

        if (!values.surname) {
            errors.surname = message;
        }

        if (!values.name) {
            errors.name = message;
        }

        if (!values.username) {
            errors.username = message;
        }

        if (!values.password) {
            errors.password = message;
        }

        if (!values.entryPoint) {
            errors.entryPoint = message;
        }

        if (!values.profile_id) {
            errors.profile_id = message;
        }

        if (!values.locality_id) {
            errors.locality_id = message;
        }

        if (!values.partner_id) {
            errors.partner_id = message;
        }

        if (!values.us_id) {
            errors.us_id = message;
        }
        
        return errors;
    }

    const onSubmit = async (values: any) => {
    
    //     const localityName = localities.filter((e)=>{ return e._raw.online_id == values.locality_id})[0]._raw.name;
    //     const profileName = profiles.filter((e)=>{ return e._raw.online_id == values.profile_id})[0]._raw.name;
    //     const partnerName = partners.filter((e)=>{ return e._raw.online_id == values.partner_id})[0]._raw.description;
    //     const usName = us.filter((e)=>{ return e._raw.online_id == values.us_id})[0]._raw.name;


    //    navigate({name: "UserView", params: {user: values, 
    //                                             locality: localityName, 
    //                                             profile: profileName, 
    //                                             partner: partnerName, 
    //                                             us: usName }});
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

                    <Formik initialValues={initialValues} 
                            onSubmit={onSubmit} validate={validate}>
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            setFieldValue,
                            values,
                            errors
                        }) => <VStack space={3} mt="5">
                                <FormControl isRequired isInvalid={'surname' in errors}>
                                    <FormControl.Label>Apelido</FormControl.Label>
                                    <Input variant="filled" 
                                            onBlur={handleBlur('surname')}
                                            onChangeText={handleChange('surname')} 
                                            placeholder="Insira o seu Apelido" 
                                            value={values.surname}
                                            />
                                </FormControl>
                                <FormControl isRequired isInvalid={'name' in errors}>
                                    <FormControl.Label>Nome</FormControl.Label>
                                    <Input variant="filled" 
                                            onBlur={handleBlur('name')}
                                            onChangeText={handleChange('name')}
                                            placeholder="Insira o seu Nome" 
                                            value={values.name}
                                            />

                                </FormControl>
                                <FormControl >
                                    <FormControl.Label>Email</FormControl.Label>
                                    <Input variant="filled"
                                            onBlur={handleBlur('email')}
                                            onChangeText={handleChange('email')}
                                            id="email" name="email" 
                                            placeholder="Insira o seu Email"
                                            value={values.email}
                                            />

                                </FormControl>
                                <FormControl isRequired isInvalid={'username' in errors}>
                                        <FormControl.Label>Username</FormControl.Label>
                                        <Input variant="filled" 
                                            onBlur={handleBlur('username')}
                                            onChangeText={handleChange('username')}
                                            id="username" name="username" 
                                            placeholder="Insira o seu Username"
                                            value={values.username}
                                            />
                                    </FormControl>
                                <FormControl>
                                    <FormControl.Label>Telemóvel</FormControl.Label>
                                    <Input variant="filled" 
                                            id="telemovel" name="telemovel" 
                                            placeholder="Insira o seu Telemóvel"
                                            />

                                </FormControl>
                                <FormControl isRequired isInvalid={'entryPoint' in errors}>
                                    <FormControl.Label>Ponto de Entrada</FormControl.Label>
                                    <Select accessibilityLabel="Selecione o Ponto de Entrada"
                                            placeholder="Selecione o Ponto de Entrada" 
                                            selectedValue={values.entryPoint} 
                                            onValueChange={(itemValue) => { 
                                                setFieldValue('entryPoint', itemValue);
                                                }
                                            }
                                            _selectedItem={{
                                                bg: "teal.600",
                                                endIcon: <CheckIcon size={5} />
                                              }} mt="1">
                                        <Select.Item label="UX Research" value="ux" />
                                        <Select.Item label="Web Development" value="web" />
                                        <Select.Item label="Cross Platform Development" value="cross" />
                                    </Select>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        Selecione o ponto de entrada!
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'partner_id' in errors}>
                                    <FormControl.Label>Parceiro</FormControl.Label>
                                    <Select accessibilityLabel="Selecione o Parceiro" placeholder="Selecione o Parceiro"  
                                            selectedValue={values.partner_id} 
                                            onValueChange={(itemValue) => { 
                                                setFieldValue('partner_id', itemValue);
                                                }
                                            }
                                            _selectedItem={{
                                                bg: "teal.600",
                                                endIcon: <CheckIcon size={5} />
                                              }} mt="1">
                                        <Select.Item label="UX Research" value="ux" />
                                        <Select.Item label="Web Development" value="web" />
                                        <Select.Item label="Cross Platform Development" value="cross" />
                                    </Select>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        Selecione um Parceiro!
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'profile_id' in errors}>
                                    <FormControl.Label>Perfil</FormControl.Label>
                                    <Select accessibilityLabel="Selecione o Perfil" placeholder="Selecione o Perfil"  
                                            selectedValue={values.profile_id} 
                                            onValueChange={(itemValue) => { 
                                                setFieldValue('profile_id', itemValue);
                                                }
                                            }
                                            _selectedItem={{
                                                bg: "teal.600",
                                                endIcon: <CheckIcon size={5} />
                                              }} mt="1">
                                        <Select.Item label="UX Research" value="ux" />
                                        <Select.Item label="Web Development" value="web" />
                                        <Select.Item label="Cross Platform Development" value="cross" />
                                    </Select>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        Selecione um Perfil!
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'locality_id' in errors}>
                                    <FormControl.Label>Localidade</FormControl.Label>
                                    <Select accessibilityLabel="Selecione a Localidade" placeholder="Selecione a Localidade"   
                                            selectedValue={values.locality_id} 
                                            onValueChange={(itemValue) => { 
                                                setFieldValue('locality_id', itemValue);
                                                }
                                            }
                                            _selectedItem={{
                                                bg: "teal.600",
                                                endIcon: <CheckIcon size={5} />
                                              }} mt="1">
                                        <Select.Item label="UX Research" value="ux" />
                                        <Select.Item label="Web Development" value="web" />
                                        <Select.Item label="Cross Platform Development" value="cross" />
                                    </Select>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        Selecione uma Localidade!
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'us_id' in errors}>
                                    <FormControl.Label>US</FormControl.Label>
                                    <Select accessibilityLabel="Selecione a US" placeholder="Selecione a US"   
                                            selectedValue={values.us_id} 
                                            onValueChange={(itemValue) => { 
                                                setFieldValue('us_id', itemValue);
                                                }
                                            }
                                            _selectedItem={{
                                                bg: "teal.600",
                                                endIcon: <CheckIcon size={5} />
                                              }} mt="1">
                                        <Select.Item label="UX Research" value="ux" />
                                        <Select.Item label="Web Development" value="web" />
                                        <Select.Item label="Cross Platform Development" value="cross" />
                                    </Select>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        Selecione uma Unidade Sanitaria!
                                    </FormControl.ErrorMessage>                                   
                                </FormControl>
                                <FormControl isRequired isInvalid={'status' in errors}>
                                    <FormControl.Label>Estado:</FormControl.Label>
                                    <Radio.Group defaultValue="1" name="status" accessibilityLabel="Estado">
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
                                            <Radio value="2" my={1}>
                                                Inactivo
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                </FormControl>
                                <Flex direction="row" mb="2.5" mt="1.5" style={{justifyContent: 'flex-end', }}>                                    
                                    <Center>
                                        <Button onPress={() => 'navigate({name: "UserList"})'} size={'md'}  bg="warning.400">
                                            {/* <Icon as={<Ionicons name="play-back-sharp" />} color="white" size={25} /> */}
                                            <Text style={styles.txtSubmit}> Voltar </Text>
                                        </Button>
                                    </Center>
                                    <Center>
                                        <Button  onPress={() => handleSubmit} bg="primary.700" style={{marginLeft:10,}}>
                                            <Text style={styles.txtSubmit}> Gravar </Text>
                                        </Button>
                                    </Center>                                
                                </Flex>  
                            </VStack> 
                        }   
                    </Formik>                             
                </Box>  
            </Center>   
        </View>
    </NativeBaseProvider>
  );
};

export default UserForm;
