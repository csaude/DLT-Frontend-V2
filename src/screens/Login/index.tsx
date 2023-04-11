import React, { useEffect, useState } from "react";
import { Platform, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Center, Box, Text, Heading, VStack, FormControl, Input, HStack, InfoIcon, Alert, Button, Image, useToast, IconButton, CloseIcon, Link, Modal, InputGroup, Pressable, Icon } from 'native-base';
import { navigate } from '../../routes/NavigationRef';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { Q } from '@nozbe/watermelondb'
import NetInfo from "@react-native-community/netinfo";
import { database } from '../../database';
import { LOGIN_API_URL, SYNC_API_URL_PREFIX, UPDATE_PASSWORD_URL } from '../../services/api';
import { MaterialIcons } from "@native-base/icons";
import { sync } from "../../database/sync";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import bcrypt from 'bcryptjs';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from './style'
import { loadUser } from "../../store/authSlice";
import moment from 'moment';

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
    const [show, setShow] = React.useState(false);

    const [token, setToken] = useState();

    const toasty = useToast();

    const users = database.collections.get('users');
    const sequences = database.collections.get('sequences');
    const userDetails = database.collections.get('user_details');
    const dispatch = useDispatch()
    const [passwordExpired, setPasswordExpired] = useState(false);
    const [isLoggedUserDifferentFromSyncedUser, setLoggedUserDifferentFromSyncedUser] = useState(false)

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
                                                Sincronização efectuada com sucesso!
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
                                                Falha na sincronização!
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
                navigate({ name: "Main", params: { loggedUser: loggedUser, token: token, passwordExpired: true } });
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

                        dispatch(loadUser(response.account));

                        saveUserDatails(response.account)

                        isVeryOldPassword(response.account)
                    }
                    setLoading(false);
                })
                .catch(error => {
                    showToast('Falha de Conexão', 'Por favor contacte o suporte!');
                    console.log(error);
                    setLoading(false);
                });

        } else {
            try {
                var logguedUser: any = (await users.query(Q.where('username', Q.like(`%${Q.sanitizeLikeString(values.username)}%`))).fetch())[0];

                var authenticated = bcrypt.compareSync(values.password, logguedUser?._raw?.password);
                const userDetailsQ = await userDetails.query().fetch();

                if (!authenticated) {
                    setIsInvalidCredentials(true);

                } 
                else if(logguedUser._raw.online_id !== userDetailsQ[0]._raw?.user_id){
                    setLoggedUserDifferentFromSyncedUser(true)
                }                
                else {
                    setIsInvalidCredentials(false);
                    setLoggedUser(logguedUser._raw);

                    dispatch(loadUser(logguedUser._raw));
                    isVeryOldPassword(logguedUser._raw)
                 
                    navigate({ name: "Main", params: { loggedUser: logguedUser._raw } });
                }
                setLoading(false);
            } catch (error) {
                setIsInvalidCredentials(true);
                setLoading(false);
            }
        }

    };

    const isVeryOldPassword = async (user) => {
        let passwordLastChangeDate;
        const today = moment(new Date());

        if (user.online_id) {
            const userDetailss = await userDetails.query(Q.where('user_id', parseInt(user.online_id))).fetch();
            passwordLastChangeDate = userDetailss[0]['password_last_change_date']
        } else {
            passwordLastChangeDate = user.passwordLastChangeDate !== null ? user.passwordLastChangeDate : user.dateCreated
    }

        const lastChangeDate = moment(passwordLastChangeDate);
        const diff = moment.duration(today.diff(lastChangeDate));
        return diff.asDays() > 182 ? setPasswordExpired(true) : setPasswordExpired(false)
    }

    useEffect(() => {
        if (passwordExpired) {
            navigate({ name: "ChangePassword", params: { loggedUser: loggedUser, token: token, passwordExpired: passwordExpired } })
        }
    }, [passwordExpired, setPasswordExpired])

    const saveUserDatails = async (user) => {
        const provinces_ids = user.provinces.map(province => { return province.id })
        const district_ids = user.districts.map(district => { return district.id })
        const localities_ids = user.localities.map(locality => { return locality.id })
        const uss_ids = user.us.map(us => { return us.id })
        const timestamp = user.passwordLastChangeDate !== null ? user.passwordLastChangeDate : user.dateCreated
        const date = new Date(timestamp);
        const formattedDate = date.toISOString().slice(0, 10);

        await database.write(async () => {
            await userDetails.create((userDetail: any) => {
                userDetail.user_id = user.id
                userDetail.provinces = provinces_ids.toString();
                userDetail.districts = district_ids.toString();
                userDetail.localities = localities_ids.toString();
                userDetail.uss = uss_ids.toString();
                userDetail.password_last_change_date = formattedDate
            });
        })
    }

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
                                            <Input type={show ? "text" : "password"} onBlur={handleBlur('password')}
                                                InputRightElement={
                                                    <Pressable onPress={() => setShow(!show)}>
                                                        <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                                                    </Pressable>}
                                                placeholder="Insira a Password" onChangeText={handleChange('password')}
                                                value={values.password} />
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
                                            onPress={() => navigate({ name: 'ResetPassword' })}
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
                    <Modal isOpen={isLoggedUserDifferentFromSyncedUser} onClose={()=>{setLoggedUserDifferentFromSyncedUser(false)}}>
                        <Modal.Content maxWidth="400px">
                            <Modal.CloseButton />
                            <Modal.Header>Utilizador Logado Diferente do Sincronizado</Modal.Header>
                            <Modal.Body>
                              
                                    <Box alignItems='center'>
                                        {/* <Ionicons name="md-checkmark-circle" size={100} color="#0d9488" /> */}
                                        <Alert w="100%" status="warning">
                                            <VStack space={2} flexShrink={1}>
                                                <HStack>
                                                    <InfoIcon mt="1"  />
                                                    <Text fontSize="sm" color="coolGray.800">
                                                       O usuário logado não é o usuário sincronizado com este dispositivo. Caso queira usar outro usuário, por favor reinstale o aplicativo!     </Text>
                                                </HStack>                                             
                                                                                               
                                            </VStack>
                                        </Alert>
                                        <Text >
                                        </Text>
                                    </Box>
                            </Modal.Body>
                        </Modal.Content>
                    </Modal>
                </Center>

            </ScrollView>
        </KeyboardAvoidingView>


    );
};

export default Login;
