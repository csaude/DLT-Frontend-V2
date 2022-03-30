import React, { useState } from "react";
import { Platform, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Center, Box, Text, Heading, VStack, FormControl, Input, Link, Button, Image } from 'native-base';
import { navigate } from '../../routes/NavigationRef';
import { Formik } from 'formik';

interface LoginData{
    username?: string | undefined;
    password?: string | undefined;
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState<LoginData>({ username: '', password: ''});
    const [errors, setErrors] = useState<LoginData>({ username: '', password: ''});

    const validate = (values: any) => {
        const errors: LoginData = {};

        if (!values.username) {
          errors.username = 'Required';
        }
      
        if (!values.password) {
            errors.password = 'Required';
        }

        return errors;
    };

    const onSubmit = (values: any) => {
        
        
        // {"password": "asdasd", "username": "asdasd"}
      
        navigate({name: "Main", params: {}}); //TODO: add user loggued as param
        console.log(values, "tets");
        
    };

    return (
        <KeyboardAvoidingView>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <Center w="100%" bgColor="white">
                    <Box safeArea p="2" w="90%"  py="8" >
                        <Center >
                                <Heading mt="1" color="coolGray.600" 
                                                _dark={{ color: "warmGray.200" }} 
                                                fontWeight="medium" size="md"  py="5">
                                    <Text color="warmGray.400">Dreams Layering Tool 1</Text>
                                </Heading>
                                <Heading  color="coolGray.600" 
                                                _dark={{ color: "warmGray.200" }} 
                                                fontWeight="medium" size="lg" px="10">
                                    <Text color="darkBlue.800">Login  </Text>
                                </Heading>
                        </Center>
                        
                        <Formik initialValues={{
                            username: '',
                            password: ''
                            }} onSubmit={onSubmit} validate={validate}>
                                {({
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    values,
                                    errors
                                }) => <VStack space={3} mt="5">
                                    <FormControl isRequired isInvalid={'username' in errors}>
                                        <FormControl.Label>Username</FormControl.Label>
             
                                        <Input onBlur={handleBlur('username')} placeholder="John" onChangeText={handleChange('username')} value={values.username} />
                                        <FormControl.ErrorMessage>
                                        {errors.username}
                                        </FormControl.ErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={'password' in errors}>
                                        <FormControl.Label>Password</FormControl.Label>
                                        <Input onBlur={handleBlur('password')} placeholder="Doe" onChangeText={handleChange('password')} value={values.password} />
                                        <FormControl.ErrorMessage>
                                        {errors.password}
                                        </FormControl.ErrorMessage>
                                    </FormControl>

                                    <Button onPress={handleSubmit} colorScheme="primary">
                                        Login
                                    </Button>
                                </VStack>
                            }
                        </Formik>
                        
                    </Box>
                </Center>
            </ScrollView>
        </KeyboardAvoidingView>
        /*
        <KeyboardAvoidingView>
            <ScrollView>
                <Center w="100%" bgColor="white">
                    <Box safeArea p="2" w="90%"  py="8" >
                        
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
                                                    onChangeText={value => {    setFormData(formData => ({ ...formData, username: value}));
                                                                                setErrors(errors => ({ ...errors, username: undefined}));  
                                                                            }}/>
                                            {'username' in errors ? <FormControl.ErrorMessage>{errors.username}</FormControl.ErrorMessage> : ''}
                                    </FormControl>
                                <FormControl isRequired isInvalid={errors.password!==undefined}>
                                    <FormControl.Label>Password</FormControl.Label>
                                    <Input placeholder="Insira a sua Password" type="password" 
                                                    onChangeText={value => {    setFormData(formData => ({ ...formData, password: value}));
                                                                                setErrors(errors => ({ ...errors, password: undefined}));  
                                                                            }}/>
                                            {'password' in errors ? <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage> : ''}
                                    <Link _text={{
                                                        fontSize: "xs",
                                                        fontWeight: "500",
                                                        color: "indigo.500"}} 
                                                    alignSelf="flex-end" mt="1">
                                                Forget Password?
                                    </Link>
                                </FormControl>
                                <Button colorScheme="primary"  onPress={onSubmit}>Login</Button>
                                        
                        </VStack>
                    </Box>
                </Center>
            </ScrollView>
        </KeyboardAvoidingView>*/
    );
};

export default Login;
