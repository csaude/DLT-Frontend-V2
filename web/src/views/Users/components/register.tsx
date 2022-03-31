
import React, { useState, Component } from "react";
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import { Center, Box, Select, Text, Heading, VStack, FormControl, 
        Input, Link, Button, CheckIcon, WarningOutlineIcon, HStack, 
        Alert, Flex, Icon, View}
     from 'native-base';      
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import {Picker} from '@react-native-picker/picker';
import { navigate } from '../../../routes/RootNavigation';
import { UsersModelState, Users } from '../../../models/Users';  
import { AuthModelState } from "../../../models/Auth";
import { PartnersModelState, Partners } from '../../../models/Partners';
import { ProfilesModelState, Profiles } from '../../../models/Profiles';
import { UsModelState, Us } from '../../../models/Us';
import { LocalityModelState, Locality } from '../../../models/Locality'; 
import Dashboard from "../../../components/Dashboard";     

import styles from './styles';
import { color } from "native-base/lib/typescript/theme/styled-system";

interface UsersProps {
    dispatch: Dispatch<AnyAction>;
    userLogged: Users;
    partners: PartnersModelState;
    profiles: ProfilesModelState;
    us: UsModelState;
    localities: LocalityModelState;
    route: any;
}

interface UsersState{
    account: Users,
    errors: Users
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
export default class UsersRegistrationForm extends Component<UsersProps, UsersState>{
    user: Users;
    transactionType: string;
    buttonLabel: string;

    constructor(props: any) {
        super(props);
        const { dispatch, route } = this.props;

        this.user = route.params.user;

        if (this.user){
            this.state = {
                account: this.user,
                errors: {}
            }
            this.transactionType = 'users/update';
            this.buttonLabel = 'Actualizar';
        }
        else {
            this.state = {
                account: {
                    partners: {},
                    profiles:{},
                    locality:{},
                    us:{}
                },
                errors:{}
            }
            this.transactionType = 'users/create';
            this.buttonLabel = 'Gravar';
        }
        

        dispatch({
            type: 'partners/fetch',
        });
        dispatch({
            type: 'profiles/fetch',
        });
        dispatch({
            type: 'us/fetch',
        });
        dispatch({
            type: 'localities/fetch',
        });

    } 
    

    validate = () => {
        const { account, errors } = this.state;
        var requiredFieldMessage  = 'Este campo é Obrigatorio';
        var valid = true;

        if (account.surname === undefined || account.surname === '') {
            this.setState({
                errors:{
                    ...errors,
                    surname: requiredFieldMessage
                }
            });
          valid = false;
        } 
        if (account.name === undefined || account.name === '') {
            this.setState({
                errors:{
                      ...errors,
                      name: requiredFieldMessage
                }
            });
            valid = false;
        } 
        if (account.username === undefined || account.username === '') {
            this.setState({
                errors:{
                      ...errors,
                      username: requiredFieldMessage
                }
            });
            valid = false;
        } 
        if (account.password === undefined || account.password === '') {
            this.setState({
                errors:{
                      ...errors,
                      password: requiredFieldMessage
                }
            });
            valid = false;
        } 
        if (account.entryPoint === undefined || account.entryPoint === '') {
            this.setState({
                errors:{
                      ...errors,
                      entryPoint: requiredFieldMessage
                }
            });
            valid = false;
        }
        if (account.partners.id === undefined || account.partners.id === '') {
            this.setState({
                errors:{
                      ...errors,
                      partners: requiredFieldMessage
                }
            });
            valid = false;
        }
        if (account.profiles.id === undefined || account.profiles.id === '') {
            this.setState({
                errors:{
                      ...errors,
                      profiles: requiredFieldMessage
                }
            });
            valid = false;
        }
        if (account.locality.id === undefined || account.locality.id === '') {
            this.setState({
                errors:{
                      ...errors,
                      locality: requiredFieldMessage
                }
            });
            valid = false;
        }
        if (account.us.id === undefined || account.us.id === '') {
            this.setState({
                errors:{
                      ...errors,
                      us: requiredFieldMessage
                }
            });
            valid = false;
        }
        if (account.status === undefined || account.status === '') {
            this.setState({
                errors:{
                      ...errors,
                      status: requiredFieldMessage
                }
            });
            valid = false;
        }
    
        return valid;
    }

    handleSave = () => {
        const { account } = this.state;
        const { dispatch } = this.props;

        if (this.validate() && dispatch) {

            dispatch({
                type: this.transactionType,
                payload: account
            });
            navigate({name: "UserView", params: {user: account}});
        }
    }

    render(){
        const { userLogged, partners: { partners }, profiles: { profiles }, us: { us }, localities: { localities } } = this.props;
        const { errors } = this.state;
        
        
        return(
            <KeyboardAvoidingView>
                <ScrollView>
                   <View style={styles.webStyle}> 
                        
                    <Center w="100%" bgColor="white"
                                    >
                        <Box safeArea p="2" w="90%" py="8">
                            <Heading size="lg" color="coolGray.800" 
                                    _dark={{ color: "warmGray.50"}} 
                                    fontWeight="semibold"
                                    marginBottom={5}
                                    marginTop={0} >
                                Registo do Utilizador
                            </Heading>
                            <Alert  status="info" colorScheme="info">
                                <HStack flexShrink={1} space={2} alignItems="center">
                                    <Alert.Icon />
                                    <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
                                        Preencha os campos abaixo para registar novo utilizador!
                                    </Text>
                                </HStack>
                            </Alert>
                            <VStack space={3} mt="5">
                                <FormControl isRequired isInvalid={errors.surname!==undefined}>
                                    <FormControl.Label>Apelido</FormControl.Label>
                                    <Input variant="filled" 
                                            placeholder="Insira o seu Apelido" 
                                            value={ this.state.account.surname }

                                            onChangeText={value=> {
                                                              
                                                              
                                                                    this.setState({ account:{ ...this.state.account, surname: value },
                                                                        errors: { ...this.state.errors, surname: undefined}})       
                                                               
                                                             }}/>
                                                             
                                            {'surname' in errors ? <FormControl.ErrorMessage>{errors.surname}</FormControl.ErrorMessage> : ''}
                                </FormControl>
                                <FormControl isRequired>
                                    <FormControl.Label>Nome</FormControl.Label>
                                    <Input variant="filled" 
                                            placeholder="Insira o seu Nome"
                                            value={ this.state.account.name }
                                            onChangeText={(value : string)=> { this.setState({ account:{ ...this.state.account, name: value }}) }}/>
                                        
                                </FormControl>
                                <FormControl>
                                    <FormControl.Label>Email</FormControl.Label>
                                    <Input variant="filled" 
                                            placeholder="Insira o seu Email"
                                            value={ this.state.account.email }
                                            onChangeText={(value : string)=> { this.setState({ account:{ ...this.state.account, email: value }}) }}/>
                                        
                                </FormControl>

                                <FormControl isRequired isInvalid={errors.username!==undefined }>
                                        <FormControl.Label>Username</FormControl.Label>
                                        <Input variant="filled" placeholder="Insira o seu Username"
                                                value={ this.state.account.username }
                                                onChangeText={value => { this.setState({ account:{ ...this.state.account, username: value },
                                                                                            errors: { ...this.state.errors, username: undefined}}) }}/>
                                        {'username' in errors ? <FormControl.ErrorMessage>{errors.username}</FormControl.ErrorMessage> : ''}
                                    </FormControl>

                                { this.user ?
                                    <Text /> :
                                    <FormControl isRequired>
                                        <FormControl.Label>Password</FormControl.Label>
                                        <Input variant="filled" 
                                                placeholder="Insira o seu Password"
                                                value={ this.state.account.password }
                                                onChangeText={(value : string)=> { this.setState({ account:{ ...this.state.account, password: value }}) }}/>
                                            
                                    </FormControl>
                                }
                                <FormControl>
                                    <FormControl.Label>Telemóvel</FormControl.Label>
                                    <Input variant="filled" 
                                            placeholder="Insira o seu Telemóvel"
                                            value={ this.state.account.phoneNumber }
                                            onChangeText={(value : string)=> { this.setState({ account:{ ...this.state.account, phoneNumber: value }}) }}/>
                                        
                                </FormControl>
                                <FormControl isRequired isInvalid={errors.entryPoint !== undefined }>
                                    <FormControl.Label>Ponto de Entrada</FormControl.Label>

                                    <Picker 
                                        style={styles.dropDownPicker}
                                        selectedValue={this.state.account.entryPoint}
                                        onValueChange={(itemValue, itemIndex) =>
                                            { 
                                                if (itemIndex !== 0){
                                                    this.setState({ account:{ ...this.state.account, entryPoint: itemValue},
                                                                    errors: { ...this.state.errors, entryPoint: undefined}}) 
                                                }
                                            }
                                        }>
                                        <Picker.Item label="-- Seleccione o Ponto de Entrada --" value="0" />
                                        <Picker.Item label="Unidade Sanitaria" value="1" />
                                        <Picker.Item label="Escola" value="2" />
                                        <Picker.Item label="Comunidade" value="3" />
                                    </Picker>
                                    {'entryPoint' in errors ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.entryPoint}</FormControl.ErrorMessage> : ''}   
                                    
                                </FormControl>
                                <FormControl isRequired isInvalid={errors.partners !== undefined }>
                                    <FormControl.Label>Parceiro</FormControl.Label>
                                    <Picker
                                        style={styles.dropDownPicker}
                                        selectedValue={this.state.account.partners.id || "0"}
                                        onValueChange={(itemValue, itemIndex) =>
                                            { 
                                                if(itemIndex !== 0){
                                                    this.setState({ account:{ ...this.state.account, partners: {"id": itemValue}},
                                                                    errors: { ...this.state.errors, partners: undefined}}) 
                                                }
                                            }
                                        }
                                    >

                                        <Picker.Item label="-- Seleccione o Parceiro --" value="0" />
                                        { 
                                            partners.map(partner => (
                                                <Picker.Item key={partner.id} label={partner.name} value={partner.id} />
                                            ))
                                        }  
                                    </Picker>
                                    {'partners' in errors? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.partners}</FormControl.ErrorMessage> : ''}
                                </FormControl>
                                <FormControl isRequired isInvalid={errors.profiles !== undefined }>
                                    <FormControl.Label>Perfil</FormControl.Label>
                                    <Picker
                                        style={styles.dropDownPicker}
                                        selectedValue={this.state.account.profiles.id || "0"}
                                        onValueChange={(itemValue, itemIndex) =>
                                            { 
                                                if(itemIndex !== 0){
                                                    this.setState({ account:{ ...this.state.account, profiles: {"id": itemValue} },
                                                                    errors: { ...this.state.errors, profiles: undefined}}) 
                                                }
                                            }
                                        }
                                    >
                                        <Picker.Item label="-- Seleccione o Perfil --" value="0" />
                                        { 
                                            profiles.map(item => (
                                                <Select.Item key={item.id} label={item.name} value={item.id} />
                                            ))
                                        }  
                                    </Picker>
                                    {'profiles' in errors ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.profiles}</FormControl.ErrorMessage> : ''}
                                </FormControl>
                                <FormControl isRequired isInvalid={errors.locality !== undefined }>
                                    <FormControl.Label>Localidade</FormControl.Label>
                                    <Picker
                                        style={styles.dropDownPicker}
                                        selectedValue={this.state.account.locality.id || "0"}
                                        onValueChange={(itemValue, itemIndex) =>
                                            { 
                                                if(itemValue !== "0"){
                                                    this.setState({ account:{ ...this.state.account, locality: {"id": itemValue} },
                                                                    errors: { ...this.state.errors, locality: undefined}}) 
                                                }
                                            }
                                        }
                                    >

                                        <Picker.Item label="-- Seleccione a localidade --" value="0" />
                                        { 
                                            localities.map(locality => (
                                                <Picker.Item key={locality.id} label={locality.name} value={locality.id} />
                                            ))
                                        }
                                    </Picker>
                                    {'locality' in errors ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.locality}</FormControl.ErrorMessage> : ''}
                                </FormControl>
                                <FormControl isRequired isInvalid={errors.us !== undefined }>
                                    <FormControl.Label>US</FormControl.Label>
                                    <Picker
                                        style={styles.dropDownPicker}
                                        selectedValue={this.state.account.us.id || "0"}
                                        onValueChange={(itemValue, itemIndex) =>
                                            {
                                                if(itemValue !== "0"){
                                                    this.setState({ account:{ ...this.state.account, us: {"id": itemValue} },
                                                                    errors: { ...this.state.errors, us: undefined}}) 
                                                }
                                            }
                                        }
                                    >
                                        <Picker.Item label="-- Seleccione a US --" value="0" />
                                        { 
                                            us.map(us => (
                                                <Picker.Item key={us.id} label={us.name} value={us.id} />
                                            ))
                                        }
                                    </Picker>
                                    {'us' in errors ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.us}</FormControl.ErrorMessage> : ''}
                                </FormControl>
                                <FormControl isRequired isInvalid={errors.status !== undefined }>
                                    <FormControl.Label>Estado</FormControl.Label>
                                    <Picker 
                                        style={styles.dropDownPicker}
                                        selectedValue={String(this.state.account.status) || ""}
                                        onValueChange={(itemValue, itemIndex) =>
                                            { 
                                                if (itemValue !== ""){
                                                    this.setState({ account:{ ...this.state.account, status: Number(itemValue) },
                                                                    errors: { ...this.state.errors, status: undefined} }) 
                                                }
                                            }
                                        }>
                                        <Picker.Item label="-- Seleccione o Estado --" value="" />
                                        <Picker.Item label="Inactivo" value="0" />
                                        <Picker.Item label="Activo" value="1" />
                                    </Picker>
                                    {'status' in errors ? <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.status}</FormControl.ErrorMessage> : ''}
                                </FormControl>
                                
                            {
                                Platform.OS==="web" ?
                                    <Flex direction="row" mb="2.5" mt="1.5" style={{justifyContent: 'flex-end', }}>
                                        
                                        <Center>
                                            <Button onPress={() => navigate({name: "UserList"})} size={'md'}  bg="warning.400">
                                                <Icon as={<Ionicons name="play-back-sharp" />} color="white" size={25} />
                                            </Button>
                                        </Center>
                                        <Center>
                                            <Button onPress={this.handleSave} bg="primary.700" style={{marginLeft:10,}}>
                                                <Text style={styles.txtSubmit}>{this.buttonLabel}</Text>                                                
                                            </Button>
                                        </Center>
                                        
                                    </Flex>   
                                : 
                                <Button mt="2" colorScheme="lightBlue" bg="lightBlue.900" onPress={this.handleSave}>
                                    {this.buttonLabel}
                                </Button>
                            }
                            </VStack>
                        </Box>
                    </Center>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}
