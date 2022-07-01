import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { Center, Box, Text, Heading, VStack, FormControl, Input, Button, Image, useToast } from 'native-base';
import { navigate } from '../../routes/NavigationRef';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { CHANGE_PASSWORD_URL } from '../../services/api';

interface LoginData{
    username?: string | undefined;
    password?: string | undefined; 
    rePassword?: string | undefined; 
}

const ChangePassword: React.FC = ({ route }: any) => {
    const params:any = route.params;
    const loggedUser:any = params.loggedUser;

    const [username, setUsername] = useState(loggedUser.username);

    const toast = useToast();
    
    const validate = (values: any) => {
        const errors: LoginData = {};        

        if (!values.password) {
          errors.password = 'Obrigatório';
        }
      
        if (!values.rePassword) {
            errors.rePassword = 'Obrigatório';
        }

        return errors;
    };
    

    const onSubmit = async (values: any) => {

        console.log("Username:");
        console.log(values.username);
    
    
        try {
            const data = await fetch(`${CHANGE_PASSWORD_URL}`, {
                method: 'PUT',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: loggedUser.username,
                    recoverPassword: values.password
                })
            });
            // toast.success('Senha alterada com sucesso!');
        } catch (error) {
            // toast.error('Failed');
        }

        // console.log(loggedUser);
        navigate({ name: "Main", params: { loggedUser: loggedUser } });

        
    };

    return (
        <KeyboardAvoidingView>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Box safeArea p="2" w="100%"  py="8" bgColor="white" >
            <Image style={{  width: "100%", resizeMode: "contain" }} source={require('../../../assets/dreams.png')} size="100" alt="dreams logo" />
            <VStack space={4} alignItems="center" w="100%" >
                <Center w="90%" >
                    <Heading mt="1" color="coolGray.600"
                                    _dark={{ color: "warmGray.200" }}
                                    fontWeight="medium" size="md"  py="5">
                        <Text color="warmGray.400">Dreams Layering Tool</Text>
                    </Heading>
                    <Heading  color="coolGray.600"
                                _dark={{ color: "warmGray.200" }}
                                fontWeight="thin" size="lg" py="1">
                        <Text color="darkBlue.600">Bem vindo  </Text>
                    </Heading>
                    <Heading  color="coolGray.400"
                                _dark={{ color: "warmGray.200" }}
                                fontWeight="light" size="md" py="2">
                        <Text color="darkBlue.800">Alteração da senha é obrigatório no primeiro login </Text>
                    </Heading>
                </Center>
                <Center w="90%">
                    <Formik initialValues={{
                        username: loggedUser.username,
                        password: '',
                        rePassword: ''
                        }} 
                        onSubmit={onSubmit} 
                        validate={validate}
                        validationSchema={Yup.object({
                            password: Yup.string()
                                .required('Obrigatório')
                                .max(25, 'Deve conter 25 caracteres ou menos')
                                .matches(/(?=.*\d)/, 'Deve conter número')
                                .matches(/(?=.*[a-z])/, 'Deve conter minúscula')
                                .matches(/(?=.*[A-Z])/, 'Deve conter Maiúscula')
                                .matches(/(?=.*[@$!%*#?&])/, 'Deve conter caracter especial')
                                .min(8, 'Deve conter 8 caracter ou mais'),
                            rePassword: Yup.string()
                                .oneOf([Yup.ref('password'), null], 'As senhas devem corresponder')
                                .required('Obrigatório')
                        })}>
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                values,
                                errors
                            }) => <VStack space={3} w="100%">
                                <FormControl isRequired isInvalid={'password' in errors}>
                                    <FormControl.Label>Password</FormControl.Label>
             
                                    <Input type="password" onBlur={handleBlur('password')} placeholder="Password" onChangeText={handleChange('password')} value={values.password} />
                                    <FormControl.ErrorMessage>
                                        {errors.password}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'rePassword' in errors}>
                                    <FormControl.Label>Confirm Password</FormControl.Label>
                                    <Input type="password" onBlur={handleBlur('rePassword')} placeholder="Confirme o Password" onChangeText={handleChange('rePassword')} value={values.rePassword} />
                                    <FormControl.ErrorMessage>
                                        {errors.rePassword}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <Button onPress={handleSubmit} my="10" colorScheme="primary">
                                    Submit
                                </Button>
                            </VStack>
                        }
                    </Formik>
                </Center>
            </VStack>
            </Box>  
            </ScrollView>
        </KeyboardAvoidingView>
        
    );
};

export default ChangePassword;
