import React, { useEffect, useState } from "react";
import { Platform, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Center, Box, Text, Heading, VStack, FormControl, Input, HStack, InfoIcon, Alert, Button, Image, useToast, IconButton, CloseIcon, Link, Modal, InputGroup } from 'native-base';
import { navigate } from '../../routes/NavigationRef';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { Q } from '@nozbe/watermelondb'
import NetInfo from "@react-native-community/netinfo";
import { database } from '../../database';
import { LOGIN_API_URL } from '../../services/api';
import { sync } from "../../database/sync";

interface LoginData{
    email?: string | undefined;
    username?: string | undefined;
    password?: string | undefined; 
    rePassword?: string | undefined; 
}

const Login: React.FC = () => {
    const [loggedUser, setLoggedUser] = useState<any>(undefined);
    const [isInvalidCredentials, setIsInvalidCredentials] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isOffline, setIsOffline] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [passwordType, setPasswordType] = useState("password");

    const toast = useToast();

    const users = database.collections.get('users');

    // Inicio Do Reset

  const {handleChange, values, handleSubmit, touched, errors} = useFormik({
    initialValues: {
      email: '',
      password: '',
      rePassword: ''
    },    
    validationSchema: Yup.object({
      email: Yup.string().email('Endereço de email inválido').required('Obrigatório'),
      password: Yup.string()
        .required('Obrigatório')
        .max(25, 'Deve conter 25 caracteres ou menos')
        .matches(/(?=.*\d)/,'Deve conter número')
        .matches(/(?=.*[a-z])/,'Deve conter minúscula')
        .matches(/(?=.*[A-Z])/, 'Deve conter Maiúscula')
        .matches(/(?=.*[@$!%*#?&])/,'Deve conter caracter especial')
        .min(8, 'Deve conter 8 caracter ou mais'),
      rePassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'As senhas devem corresponder')
        .required('Obrigatório')
    }),
    onSubmit: (values) => {

      console.log(values);
    }
  });

    const togglePassword =()=>{

        if(passwordType==="password")
        {
         setPasswordType("")
         return;
        }
        setPasswordType("password")
      };


    useEffect(() => {
        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
          const offline = !(state.isConnected && state.isInternetReachable);
          setIsOffline(offline);
        });
        return () => removeNetInfoSubscription();
    }, []);

    // watch changes to loggedUser, sync 
    useEffect(() => {

        if(loggedUser){
            
            sync({username: loggedUser.username})
                .then(() => toast.show({
                                placement: "top",
                                render:() => {
                                    return (
                                        <Alert w="100%" variant="left-accent" colorScheme="success" status="success">
                                            <VStack space={2} flexShrink={1} w="100%">
                                                <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                                                    <HStack space={2} flexShrink={1} alignItems="center">
                                                        <Alert.Icon />
                                                        <Text color="coolGray.800">
                                                            Synced Successfully!
                                                        </Text>
                                                    </HStack>
                                                </HStack>
                                            </VStack>
                                        </Alert> 
                                    );
                                }
                            }))
                .catch(() => toast.show({
                                placement: "top",
                                render:() => {
                                    return (
                                        <Alert w="100%" variant="left-accent" colorScheme="error" status="error">
                                            <VStack space={2} flexShrink={1} w="100%">
                                                <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                                                    <HStack space={2} flexShrink={1} alignItems="center">
                                                        <Alert.Icon />
                                                        <Text color="coolGray.800">
                                                            Sync Failed!
                                                        </Text>
                                                    </HStack>
                                                </HStack>
                                            </VStack>
                                        </Alert> 
                                    );
                                }
                            }))
            
            navigate({name: "Main", params: {loggedUser: loggedUser}});
        }
      
    }, [loggedUser]);

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

    const onSubmit = async (values: any) => {
        setLoading(true);

        // check if users table is synced
        var checkSynced = await users.query(
            Q.where('_status', 'synced'),
        ).fetchCount(); 
       console.log(checkSynced);
        if(checkSynced == 0){ // checkSynced=0 when db have not synced yet
        
            if(isOffline){
                
                return toast.show({
                    placement: "top",
                    render:() => {
                        return (
                            <Alert w="100%" status="warning">
                                <VStack space={2} flexShrink={1} w="100%">
                                    <HStack flexShrink={1} space={2} justifyContent="space-between">
                                        <HStack space={2} flexShrink={1}>
                                            <Alert.Icon mt="1" />
                                            <Text fontSize="md" color="coolGray.800">
                                                Sem Conexão a Internet
                                            </Text>
                                        </HStack>
                                        <IconButton variant="unstyled" _focus={{borderWidth: 0}} icon={<CloseIcon size="3" color="coolGray.600" />} />
                                    </HStack>
                                    <Box pl="6" _text={{color: "coolGray.600"}}>
                                        Conecte-se a Internet para o primeiro Login!
                                    </Box>
                                </VStack>
                            </Alert> 
                        );
                    }
                });
            }
            
            await fetch(`${LOGIN_API_URL}?username=${values.username}&password=${values.password}`)
                    .then(response => response.json())
                    .then(response => {
    
                        if(response.status && response.status !== 200){ // unauthorized
       
                            setIsInvalidCredentials(true); 
                        }else{
           
                            setIsInvalidCredentials(false);   
                            setLoggedUser(response.account);   
                        }
                    })
                    .catch(error =>{
       
                        return toast.show({
                            placement: "top",
                            render:() => {
                                return (
                                    <Alert w="100%" status="error">
                                        <VStack space={2} flexShrink={1} w="100%">
                                            <HStack flexShrink={1} space={2} justifyContent="space-between">
                                                <HStack space={2} flexShrink={1}>
                                                    <Alert.Icon mt="1" />
                                                    <Text fontSize="md" color="coolGray.800">
                                                        Falha de Conexão
                                                    </Text>
                                                </HStack>
                                                <IconButton variant="unstyled" _focus={{borderWidth: 0}} icon={<CloseIcon size="3" color="coolGray.600" />} />
                                            </HStack>
                                            <Box pl="6" _text={{color: "coolGray.600"}}>
                                                Por favor contacte o suporte!
                                            </Box>
                                        </VStack>
                                    </Alert> 
                                );
                            }
                        });
                    });
       
        } else {
            var logguedUser = await users.query( Q.where('username', values.username), 
                                                    Q.where('password', values.password)).fetch();
            
            if(!logguedUser.length){
 
                setIsInvalidCredentials(true); 
            }else{

                setIsInvalidCredentials(false);   
                //console.log(logguedUser[0]._raw);
                
                setLoggedUser(logguedUser[0]._raw);
                navigate({name: "Main", params: {loggedUser: logguedUser[0]._raw}}); 
            }
            
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
                                fontWeight="medium" size="lg" py="2">
                        <Text color="darkBlue.800">Login  </Text>
                    </Heading>
                </Center>
                <Center w="90%" >
                    {isInvalidCredentials ?
                        <Alert w="100%" status='error'>
                            <HStack space={4} flexShrink={1}>
                                <Alert.Icon mt="1" />
                                <Text fontSize="sm" color="coolGray.800">
                                    Utilizador ou Senha Invalidos!
                                </Text>
                            </HStack>
                    
                        </Alert> : <></>
                    }
                </Center>
                <Center w="90%">
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
                            }) => <VStack space={3} w="100%">
                                <FormControl isRequired isInvalid={'username' in errors}>
                                    <FormControl.Label>Username</FormControl.Label>
             
                                    <Input onBlur={handleBlur('username')} placeholder="Insira o Username" onChangeText={handleChange('username')} value={values.username} />
                                    <FormControl.ErrorMessage>
                                        {errors.username}
                                    </FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={'password' in errors}>
                                    <FormControl.Label>Password</FormControl.Label>
                                    <Input type="password" onBlur={handleBlur('password')} placeholder="Insira o Password" onChangeText={handleChange('password')} value={values.password} />
                                    <FormControl.ErrorMessage>
                                        {errors.password}
                                    </FormControl.ErrorMessage>
                                </FormControl>

                                <Button onPress={handleSubmit} my="10" colorScheme="primary">
                                    Login
                                </Button>
                                <Link 
                                // href="https://nativebase.io" 
                                onPress={() => setShowModal(true)}  
                                isExternal _text={{
                                        color: "blue.400"
                                    }} mt={-0.5} _web={{
                                        mb: -1
                                    }}>
                                    I forgot my password
                                </Link>
                            </VStack>
                        }
                    </Formik>
                </Center>
            </VStack>
            </Box>  

            <Center>
            {/* <Button onPress={() => setShowModal(true)}>Button</Button> */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content width="100%"  style={{ marginBottom: 0,marginTop: "auto"}}>

                    <Formik initialValues={{
                        email: '',
                        password: '',
                        rePassword: ''
                        }} onSubmit={onSubmit} validate={validate}>
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors
                        }) =>  <VStack space={3} w="100%">
                        <Modal.CloseButton />
                        <Modal.Header>Reset Password</Modal.Header>
                        <Modal.Body>



                            <FormControl isRequired isInvalid={'email' in errors}>
                                <FormControl.Label>Email</FormControl.Label>
                                <Input placeholder="Email" onChangeText={handleChange} value={values.email} />
                                <FormControl.ErrorMessage>
                                    {errors.email}
                                </FormControl.ErrorMessage>
                            </FormControl> 

                            {/* <div className="mb-3">
                                <InputGroup>
                                <Form.Control
                                    id="password"
                                    name="password"
                                    type={passwordType}
                                    placeholder="New Password"
                                    onChange={handleChange}
                                    value={values.password}
                                    isValid={touched.password && !errors.password}
                                    isInvalid={touched.password && !!errors.password}
                                />
                                {touched.password && errors.password ? (
                                    <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                    </Form.Control.Feedback>
                                ) : (
                                    <InputGroup.Append>
                                    <InputGroup.Text>
                                        { 
                                        passwordType==="password"? 
                                            // <FontAwesomeIcon icon={faEyeSlash} onClick={togglePassword} />
                                        :
                                            // <FontAwesomeIcon icon={faEye} onClick={togglePassword} />
                                        }
                                    </InputGroup.Text>
                                    </InputGroup.Append>
                                )}
                                </InputGroup>
                            </div>

                            <div className="mb-3">
                                <InputGroup className="mb-3">
                                <Form.Control
                                    id="rePassword"
                                    name="rePassword"
                                    type={passwordType}
                                    placeholder="Confirm Password"
                                    onChange={handleChange}
                                    value={values.rePassword}
                                    isValid={touched.rePassword && !errors.rePassword}
                                    isInvalid={touched.rePassword && !!errors.rePassword}
                                />
                                {touched.rePassword && errors.rePassword ? (
                                    <Form.Control.Feedback type="invalid">
                                    {errors.rePassword}
                                    </Form.Control.Feedback>
                                ) : (
                                    <InputGroup.Append>
                                    <InputGroup.Text>{ 
                                        passwordType==="password"? 
                                            <FontAwesomeIcon icon={faEyeSlash} onClick={togglePassword} />
                                        :
                                            <FontAwesomeIcon icon={faEye} onClick={togglePassword} />
                                        }
                                    </InputGroup.Text>
                                    </InputGroup.Append>
                                )}
                                </InputGroup>
                            </div> */}
                            {/* <div className="row">
                                <div className="col-12">
                                <Button type="submit" block > 
                                    solicitar
                                </Button>
                                </div>
                            </div> */}
                            {/* </Form> */}



                            <FormControl>
                                <FormControl.Label>Name</FormControl.Label>
                                    <Input />
                                </FormControl>
                                <FormControl mt="3">
                                    <FormControl.Label>Email</FormControl.Label>
                                <Input />
                            </FormControl>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setShowModal(false);
                                }}>
                                    Cancel
                                </Button>
                                <Button onPress={() => {
                                setShowModal(false);
                                }}>
                                    Save
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                        </VStack>
                        }
                    </Formik>
                </Modal.Content>
            </Modal>
            </Center>

            </ScrollView>
        </KeyboardAvoidingView>

        
    );
};

export default Login;
