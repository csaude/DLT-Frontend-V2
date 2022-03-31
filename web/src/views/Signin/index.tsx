import React, { Component } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { Platform, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Center, Box, Text, Heading, VStack, FormControl, Input, Link, Button, Image } from 'native-base';
import { connect } from 'dva';
//import firstImage from "./../../assets/dreams";
//const firstImage = require('./../../assets/dreams.png'); 

interface LoginProps {
    dispatch: Dispatch<AnyAction>;

}

interface LoginData{
    username?: string;
    password?: string;
}

interface LoginState {
    formData: LoginData;
    errors: LoginData;
}

@connect()
export default class Login extends Component<LoginProps, LoginState>{
    constructor(props: any){
        super(props); 
    }

    state: LoginState = {
        formData: {},
        errors: {}
    }

    validate = () => {
        const { formData, errors } = this.state;

        if (formData.username === undefined || formData.username === '') {
          this.setState({
              errors:{
                    ...errors,
                    username: 'Username Obrigatorio'
              }
          });
          return false;
        } else if (formData.password === undefined || formData.password === '') {
            this.setState({
                errors:{
                      ...errors,
                      password: 'Password Obrigatorio'
                }
            });
          return false;
        }
    
        return true;
    }

    onSubmit = () => {
        const { formData: { password, username } } = this.state;
        const { dispatch } = this.props;
        
        if(this.validate() && dispatch) {
            dispatch({
                type: 'auth/login',
                payload: {
                    username,
                    password
                },
            });
        }
    }
    
    render(){
        const { errors } = this.state;
        return(
            <View style={{backgroundColor:"white", height: "100%", justifyContent:"center"}}>
                { 
                
                    Platform.OS == 'web' ? 
                        // IF WEB BUILD
                        <View style={{ alignItems: "center",}}>
                            <Center w="35%" style={{padding: "7%",}}>
                                <Box safeArea p="2" w="90%"  py="8" >
                                    <Image style={{  width: "100%", resizeMode: "contain" }} source={require('../../../assets/dreams.png')} size="100"  />
                                    <Center >
                                        <Heading mt="1" color="coolGray.600" 
                                                _dark={{ color: "warmGray.200" }} 
                                                fontWeight="medium" size="md"  py="5">
                                                <Text color="warmGray.400">Dreams Layering Tool</Text>
                                        </Heading>
                                        <Heading  color="coolGray.600" 
                                                _dark={{ color: "warmGray.200" }} 
                                                fontWeight="medium" size="lg" px="10">
                                                <Text color="darkBlue.800">Login  </Text>
                                        </Heading>
                                    </Center>
                                    <VStack space={3} mt="5">
                                        <FormControl isRequired isInvalid={errors.username!==undefined }>
                                            <FormControl.Label>Username</FormControl.Label>
                                            <Input placeholder="Insira o seu Username"
                                                    onChangeText={value => { this.setState({ formData:{ ...this.state.formData, username: value },
                                                                                                errors: { ...this.state.errors, username: undefined}}) }}/>
                                            {'username' in errors ? <FormControl.ErrorMessage>{errors.username}</FormControl.ErrorMessage> : ''}
                                        </FormControl>
                                        <FormControl isRequired isInvalid={errors.password!==undefined}>
                                            <FormControl.Label>Password</FormControl.Label>
                                            <Input placeholder="Insira a sua Password" type="password" 
                                                    onChangeText={value => { this.setState({ formData:{ ...this.state.formData, password: value },
                                                                                                errors: { ...this.state.errors, password: undefined}}) }}/>
                                            {'password' in errors ? <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage> : ''}
                                            <Link _text={{
                                                        fontSize: "xs",
                                                        fontWeight: "500",
                                                        color: "indigo.500"}} 
                                                    alignSelf="flex-end" mt="1">
                                                Forget Password?
                                            </Link>
                                        </FormControl>
                                        <Button colorScheme="primary"  onPress={() => this.onSubmit()}>Login</Button>
                                        
                                    </VStack>
                                </Box>
                            </Center>
                        </View>
                    :   // IF MOBILE BUILD
                    
                    <KeyboardAvoidingView>
                        <ScrollView>
                            <Center w="100%" bgColor="white">
                                <Box safeArea p="2" w="90%"  py="8" >
                                    <Image style={{  width: "100%", resizeMode: "contain" }} source={require('../../../assets/dreams.png')} size="100"  />
                                    <Center >
                                        <Heading mt="1" color="coolGray.600" 
                                                _dark={{ color: "warmGray.200" }} 
                                                fontWeight="medium" size="md"  py="5">
                                                <Text color="warmGray.400">Dreams Layering Tool</Text>
                                        </Heading>
                                        <Heading  color="coolGray.600" 
                                                _dark={{ color: "warmGray.200" }} 
                                                fontWeight="medium" size="lg" px="10">
                                                <Text color="darkBlue.800">Login  </Text>
                                        </Heading>
                                    </Center>
                                    <VStack space={3} mt="5">
                                        <FormControl isRequired isInvalid={errors.username!==undefined }>
                                            <FormControl.Label>Username</FormControl.Label>
                                            <Input placeholder="Insira o seu Username"
                                                    onChangeText={value => { this.setState({ formData:{ ...this.state.formData, username: value },
                                                                                                errors: { ...this.state.errors, username: undefined}}) }}/>
                                            {'username' in errors ? <FormControl.ErrorMessage>{errors.username}</FormControl.ErrorMessage> : ''}
                                        </FormControl>
                                        <FormControl isRequired isInvalid={errors.password!==undefined}>
                                            <FormControl.Label>Password</FormControl.Label>
                                            <Input placeholder="Insira a sua Password" type="password" 
                                                    onChangeText={value => { this.setState({ formData:{ ...this.state.formData, password: value },
                                                                                                errors: { ...this.state.errors, password: undefined}}) }}/>
                                            {'password' in errors ? <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage> : ''}
                                            <Link _text={{
                                                        fontSize: "xs",
                                                        fontWeight: "500",
                                                        color: "indigo.500"}} 
                                                    alignSelf="flex-end" mt="1">
                                                Forget Password?
                                            </Link>
                                        </FormControl>
                                        <Button colorScheme="primary"  onPress={() => this.onSubmit()}>Login</Button>
                                        
                                    </VStack>
                                </Box>
                            </Center>
                        </ScrollView> 
                    </KeyboardAvoidingView>
                                        }
            </View>
            
        );
    }
}