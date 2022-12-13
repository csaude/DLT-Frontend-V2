import React, { useEffect, useState } from "react";
import { Platform, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Center, Box, Text, Heading, VStack, FormControl, Input, HStack, InfoIcon, Alert, Button, Image, useToast, IconButton, CloseIcon, Link, Modal, InputGroup } from 'native-base';
import { navigate } from '../../routes/NavigationRef';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { Q } from '@nozbe/watermelondb'
import NetInfo from "@react-native-community/netinfo";
import { database } from '../../database';
import { LOGIN_API_URL, SYNC_API_URL_PREFIX, UPDATE_PASSWORD_URL } from '../../services/api';
import { sync } from "../../database/sync";
import { toast } from 'react-toastify';
import bcrypt from 'bcryptjs';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from './style'

interface LoginData {
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
    const [spinner, setSpinner] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [passwordType, setPasswordType] = useState("password");
    const [token, setToken] = useState();

    const toasty = useToast();

    const users = database.collections.get('users');
    const sequences = database.collections.get('sequences');

    // Inicio Do Reset

    const updatePassword = async (username: string, password: string) => {
        try {
            const data = await fetch(`${UPDATE_PASSWORD_URL}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    recoverPassword: password
                })
            });
            toast.success('Redefinição de senha submetida com sucesso!');
        } catch (error) {
            toast.error('Failed');
        }
    };

    const fetchPrefix = async (username: string): Promise<any> => {
        // fetch the prefix 
        await fetch(`${SYNC_API_URL_PREFIX}?username=${username}`)
            .then(response => response.json())
            .then(async (response) => {
                if (response.status && response.status !== 200) { // unauthorized

                    setIsInvalidCredentials(true);
                } else {

                    await database.write(async () => {
                        await sequences.create((sequence: any) => {
                            sequence.prefix = response.sequence
                            sequence.last_nui = '11111'
                        });
                    });
                }
            })
            .catch(error => {
                showToast('Falha de Conexão', 'Por favor contacte o suporte!');
                return undefined;
            });
    }


    const togglePassword = () => {

        if (passwordType === "password") {
            setPasswordType("")
            return;
        }
        setPasswordType("password")
    };

    const showToast = (message, description) => {
        return toasty.show({
            placement: "top",
            render: () => {
                return (
                    <Alert w="100%" status="error">
                        <VStack space={2} flexShrink={1} w="100%">
                            <HStack flexShrink={1} space={2} justifyContent="space-between">
                                <HStack space={2} flexShrink={1}>
                                    <Alert.Icon mt="1" />
                                    <Text fontSize="md" color="coolGray.800">
                                        {message}
                                    </Text>
                                </HStack>
                                <IconButton variant="unstyled" _focus={{ borderWidth: 0 }} icon={<CloseIcon size="3" color="coolGray.600" />} />
                            </HStack>
                            <Box pl="6" _text={{ color: "coolGray.600" }}>
                                {description}
                            </Box>
                        </VStack>
                    </Alert>
                );
            }
        });
    }

    useEffect(() => {
        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setIsOffline(offline);
        });
        return () => removeNetInfoSubscription();
    }, []);

    // watch changes to loggedUser, sync 
    useEffect(() => {

        if (loggedUser) {

            sync({ username: loggedUser.username })
                .then(() => toasty.show({
                    placement: "top",
                    render: () => {
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
                .catch(() => toasty.show({
                    placement: "top",
                    render: () => {
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

            if (loggedUser.newPassword == '1') {
                navigate({ name: "ChangePassword", params: { loggedUser: loggedUser, token: token } });
            } else {
                navigate({ name: "Main", params: { loggedUser: loggedUser } });
            }
        }
        
    }, [loggedUser]);

    const validate = (values: any) => {
        const errors: LoginData = {};

        if (!values.username) {
            errors.username = 'Obrigatório';
        }

        if (!values.password) {
            errors.password = 'Obrigatório';
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
        if (checkSynced == 0) { // checkSynced=0 when db have not synced yet

            if (isOffline) {
                setLoading(false);
                return showToast('Sem Conexão a Internet', 'Conecte-se a Internet para o primeiro Login!');
            }

            await fetch(`${LOGIN_API_URL}?username=${values.username}&password=${encodeURIComponent(values.password)}`)
                .then(response => response.json())
                .then(async (response) => {

                    if (response.status && response.status !== 200) { // unauthorized

                        setIsInvalidCredentials(true);
                    } else {

                        await fetchPrefix(values.username);

                        setIsInvalidCredentials(false);

                        setToken(response.token);
                        setLoggedUser(response.account);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    showToast('Falha de Conexão', 'Por favor contacte o suporte!');
                    setLoading(false);
                });



        } else {
            try {           
                var logguedUser: any = (await users.query(Q.where('username', values.username)).fetch())[0];

                var authenticated = bcrypt.compareSync(values.password, logguedUser?._raw?.password);

                if (!authenticated) {
                    setIsInvalidCredentials(true);

                } else {
                    setIsInvalidCredentials(false);
                    setLoggedUser(logguedUser._raw);
                    navigate({ name: "Main", params: { loggedUser: logguedUser._raw } });
                }
                setLoading(false);
             } catch (error) {
                 setIsInvalidCredentials(true);
                 setLoading(false);
            }
        }
    };

    return (


        <KeyboardAvoidingView style={styles.container}>
            <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps='handled'>

                <Box safeArea p="2" w="100%" py="8" bgColor="white" >

                    <Image style={{ width: "100%", resizeMode: "contain" }} source={require('../../../assets/dreams.png')} size="100" alt="dreams logo" />
                    <VStack space={4} alignItems="center" w="100%" >
                        <Center w="90%" >
                            <Heading mt="1" color="coolGray.600"
                                _dark={{ color: "warmGray.200" }}
                                fontWeight="medium" size="md" py="5">
                                <Text color="warmGray.400">Dreams Layering Tool</Text>
                            </Heading>
                            <Heading color="coolGray.600"
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
                            }}
                                onSubmit={onSubmit}
                                validate={validate}

                            >
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
                                            <Input type="password" onBlur={handleBlur('password')} placeholder="Insira a Password" onChangeText={handleChange('password')} value={values.password} />
                                            <FormControl.ErrorMessage>
                                                {errors.password}
                                            </FormControl.ErrorMessage>
                                        </FormControl>
                                        {loading ?
                                            <Spinner
                                                visible={true}
                                                textContent={'Autenticando...'}
                                                textStyle={styles.spinnerTextStyle}
                                            /> : undefined

                                        }
                                        <Button isLoading={loading} isLoadingText="Autenticando" onPress={handleSubmit} my="10" colorScheme="primary">
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
                                            Esqueceu a password?
                                        </Link>
                                    </VStack>
                                }
                            </Formik>
                        </Center>
                    </VStack>

                </Box>

                <Center>
                    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                        <Modal.Content width="100%" style={{ marginBottom: 0, marginTop: "auto" }}>

                            <Formik initialValues={{
                                username: '',
                                password: '',
                                rePassword: ''
                            }}
                                onSubmit={onSubmit}
                                validate={validate}
                                validationSchema={Yup.object({
                                    email: Yup.string().email('Endereço de email inválido').required('Obrigatório'),
                                    password: Yup.string()
                                        .required('Obrigatório')
                                        .max(25, 'Deve conter 25 caracteres ou menos')
                                        .matches(/(?=.*\d)/, 'Deve conter número')
                                        .matches(/(?=.*[a-z])/, 'Deve conter minúscula')
                                        .matches(/(?=.*[A-Z])/, 'Deve conter Maiúscula')
                                        .matches(/(?=.*[@$!%*#?&])/, 'Deve conter caracter especial')
                                        .min(8, 'Deve conter 8 caracteres ou mais'),
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
                                        <Modal.CloseButton />
                                        <Modal.Header>Redefinir a Senha</Modal.Header>
                                        <Modal.Body>



                                            <FormControl isRequired isInvalid={'username' in errors}>
                                                <FormControl.Label>Username</FormControl.Label>
                                                <Input onBlur={handleBlur('username')} placeholder="Insira o Username" onChangeText={handleChange('username')} value={values.username} />
                                                <FormControl.ErrorMessage>
                                                    {errors.username}
                                                </FormControl.ErrorMessage>
                                            </FormControl>

                                            <FormControl isRequired isInvalid={'password' in errors}>
                                                <FormControl.Label>Nova Password</FormControl.Label>
                                                <Input type="password" onBlur={handleBlur('password')} placeholder="Insira a nova password" onChangeText={handleChange('password')} value={values.password} />
                                                <FormControl.ErrorMessage>
                                                    {errors.password}
                                                </FormControl.ErrorMessage>
                                            </FormControl>

                                            <FormControl isRequired isInvalid={'rePassword' in errors}>
                                                <FormControl.Label>Repetir a nova Password</FormControl.Label>
                                                <Input type="password" onBlur={handleBlur('rePassword')} placeholder="Repita a nova password" onChangeText={handleChange('rePassword')} value={values.rePassword} />
                                                <FormControl.ErrorMessage>
                                                    {errors.rePassword}
                                                </FormControl.ErrorMessage>
                                            </FormControl>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button.Group space={2}>

                                                <Button onPress={() => {
                                                    updatePassword(values.username, values.password);
                                                    toast.success('Um email de confirmação foi enviado!');
                                                    setShowModal(false);
                                                }}>
                                                    Solicitar
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
