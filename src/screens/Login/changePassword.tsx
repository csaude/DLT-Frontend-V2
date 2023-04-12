import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { Center, Box, Text, Heading, VStack, FormControl, Input, Button, Image, useToast, Pressable, Icon } from 'native-base';
import { navigate } from '../../routes/NavigationRef';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { CHANGE_PASSWORD_URL } from '../../services/api';
import UserDetails from "../../models/UserDetails";
import { Q } from "@nozbe/watermelondb";
import { database } from "../../database";
import { useSelector } from 'react-redux'
import { RootState } from "../../store";
import { MaterialIcons } from "@native-base/icons";

interface LoginData{
    username?: string | undefined;
    password?: string | undefined; 
    rePassword?: string | undefined; 
}

const ChangePassword: React.FC = ({ route }: any) => {
    const params:any = route.params;
    const loggedUser:any = params.loggedUser;
	const [show, setShow] = React.useState(false);
	const [showPass, setShowPass] = React.useState(false);

    const [username, setUsername] = useState(loggedUser.username);

    const toast = useToast();

    const userDetails = database.collections.get('user_details');

     const users = database.collections.get('users');

    const errorMessage = params.passwordExpired ? 'Alteração da senha é obrigatório a cada 6 meses ' : 'Alteração da senha é obrigatório no primeiro login '
    
    const userDetail = useSelector((state: RootState) => state.auth.userDetails);

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
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${params.token}`
                },
                
                body: JSON.stringify({
                    username: values.username,
                    recoverPassword: values.password
                })
            });

            console.log("Alterado com sucesso");

            const userDetailsQ = await userDetails.query(Q.where('user_id', parseInt(userDetail.user_id))).fetch();
            const usersQ = await users.query(Q.where('online_id', parseInt(userDetail.user_id))).fetch();

            const date = new Date();
            const formattedDate = date.toISOString().slice(0, 10);

            await database.write(async () => {
                const uDetail = await database.get('user_details').find(userDetailsQ[0]._raw.id)
                await uDetail.update(() => {
                    uDetail['password_last_change_date'] = formattedDate
                })
            })
            
            await database.write(async () => {
                const users = await database.get('users').find(usersQ[0]._raw.id)
                await users.update(() => {
                    users['password_last_change_date'] = formattedDate
                })
            })

            navigate({ name: "Main", params: { loggedUser: loggedUser } });        

        } catch (error) {
            console.log(error);
            console.log("Erro a alterar a senha.");
        }
        
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
                        <Text color="darkBlue.800"> {errorMessage} </Text>
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
             
                                    <Input 
                                        type={showPass ? "text" : "password"} 
                                        onBlur={handleBlur('password')} 
                                        placeholder="Password" 
                                        InputRightElement={<Pressable onPress={() => setShowPass(!showPass)}>
													<Icon as={<MaterialIcons name={showPass ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
												</Pressable>}
                                        onChangeText={handleChange('password')} 
                                        value={values.password} />
                                    <FormControl.ErrorMessage>
                                        {errors.password}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'rePassword' in errors}>
                                    <FormControl.Label>Confirm Password</FormControl.Label>
                                    <Input 
                                        type={show ? "text" : "password"}
                                        onBlur={handleBlur('rePassword')} 
                                        placeholder="Confirme o Password" 
                                        InputRightElement={<Pressable onPress={() => setShow(!show)}>
                                                <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                                            </Pressable>}
                                        onChangeText={handleChange('rePassword')} 
                                        value={values.rePassword} />
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
