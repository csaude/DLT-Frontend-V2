import React, { useEffect, useState, useContext } from 'react';
import {
    View, KeyboardAvoidingView, ScrollView,
    TextInput, TouchableOpacity, Platform,
}
    from 'react-native';
import {
    Center, Box, Select, Text, Heading, VStack, FormControl,
    Input, Link, Button, CheckIcon, WarningOutlineIcon, HStack,
    Alert, Flex, useToast, Stack, InputGroup, InputLeftAddon, InputRightAddon, Radio
}
    from 'native-base';
    
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';

import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { stringify } from 'qs';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import { Q } from "@nozbe/watermelondb";
import { navigate } from '../../../routes/NavigationRef';
import withObservables from '@nozbe/with-observables';
import { database } from '../../../database';
import { MaterialIcons } from "@native-base/icons";
import Beneficiaries_interventions, { BeneficiariesInterventionsModel } from '../../../models/Beneficiaries_interventions';
import { sync } from "../../../database/sync";
import { Context } from '../../../routes/DrawerNavigator';

import styles from './styles';

const partnerForm: React.FC = ({ route, localities, profiles, us, partners, services, subServices }: any) => {    // console.log(route.params);
    const { beneficiarie, intervention } = route.params;

    const areaServicos = [{ "id": '1', "name": "Serviços Clinicos" }, { "id": '2', "name": "Serviços Comunitarios" }];
    const entry_points = [{ "id": '1', "name": "US" }, { "id": '2', "name": "CM" }, { "id": '3', "name": "ES" }];
    const [areaServicos_id, setAreaServicos_id] = useState('');
    const [service_id, setService_id] = useState('');
    const [entry_point, setEntry_point] = useState('');

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [text, setText] = useState('');

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);

        let tempDate = new Date(currentDate);
        setText(moment(tempDate).format('YYYY-MM-DD'));
    }

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };
    const [initialValues, setInitialValues] = useState<any>({});
    let mounted = true; 
    const [loading, setLoading] = useState(false);
    const [savedIntervention, setSavedIntervention] = useState<any>(null);
    const loggedUser: any = useContext(Context);
    const toast = useToast();

    useEffect(() => {

        if (intervention && mounted) {
            const isEdit = intervention && intervention.id;
            let initValues = {};

            if (isEdit) {
                
                const selSubService = subServices.filter((e) => {
                    return e._raw.online_id == intervention.sub_service_id
                })[0];

                const selService = services.filter((e) => {
                    return e._raw.online_id == selSubService._raw.service_id
                })[0];

                initValues = {
                    areaServicos_id: selService._raw.service_type,
                    service_id: selService._raw.online_id,
                    beneficiary_id: beneficiarie.online_id,
                    sub_service_id: intervention.sub_service_id,
                    result: intervention.result,
                    date: intervention.date,
                    us_id: intervention.us_id,
                    activist_id: intervention.activist_id,
                    entry_point: intervention.entry_point,
                    provider: intervention.provider,
                    remarks: intervention.remarks,
                    status: '1'
                }

                setText(intervention.date);
                setDate(new Date(intervention.date));

            } else {
                initValues = {
                    nui: '',
                    surname: '',
                    name: '',
                    nick_name: '',
                    organization_id: '',
                    date_of_birth: '',
                    gender: '',
                    address: '',
                    phone_number: '',
                    e_mail: '',
                    via: '',
                    partner_id: '',
                    entry_point: '',
                    neighbourhood_id: '',
                    us_id: '',
                    online_id: '',
                    vblt_lives_with: '',
                    vblt_is_orphan: '',
                    vblt_is_student: '',
                    vblt_school_grade: '',
                    vblt_school_name: '',
                    vblt_is_deficient: '',
                    vblt_deficiency_type: '',
                    vblt_married_before: '',
                    vblt_pregnant_before: '',
                    vblt_children: '',
                    vblt_pregnant_or_breastfeeding: '',
                    vblt_is_employed: '',
                    vblt_tested_hiv: '',
                    vblt_sexually_active: '',
                    vblt_multiple_partners: '',
                    vblt_is_migrant: '',
                    vblt_trafficking_victim: '',
                    vblt_sexual_exploitation: '',
                    vblt_sexploitation_time: '',
                    vblt_vbg_victim: '',
                    vblt_vbg_type: '',
                    vblt_vbg_time: '',
                    vblt_alcohol_drugs_use: '',
                    vblt_sti_history: '',
                    vblt_sex_worker: '',
                    vblt_house_sustainer: '',
                    status: '1',

                    areaServicos_id: '',
                    service_id: '',
                    beneficiary_id: '',
                    sub_service_id: '',
                    result: '',
                    date: '',
                    activist_id: '',
                    provider: '',
                    remarks: ''
                }
            }

            setInitialValues(initValues);
            return () => { // This code runs when component is unmounted 
                mounted = false; // set it to false if we leave the page
            }
        }
        
        
    }, [intervention]);

    const message = "Este campo é Obrigatório"

    const validate = (values: any) => {
        const errors: BeneficiariesInterventionsModel = {};


        if (!values.service_id) {
            errors.id = message;
        }

        if (!values.areaServicos_id) {
            errors.id = message;
        }

        if (!values.sub_service_id) {
            errors.sub_service_id = message;
        }

        if (!date) {
            errors.date = message;
        }

        if (!values.us_id) {
            errors.us_id = message;
        }


        if (!values.entry_point) {
            errors.entry_point = message;
        }

        if (!values.status) {
            errors.status = message;
        }

        return errors;
    }

    const onSubmit = async (values: any) => {
        setLoading(true);

        const isEdit = intervention && intervention.id; // new record if it has id
        //console.log(intervention, isEdit);

        const newObject = await database.write(async () => {
        
            if (isEdit) {
                const interventionToUpdate = await database.get('beneficiaries_interventions').find(intervention.id);
                const updatedIntervention = await interventionToUpdate.update(() => {
                    intervention.beneficiary_id = beneficiarie.online_id
                    intervention.sub_service_id = values.sub_service_id
                    intervention.result = values.result
                    intervention.date = '' + text
                    intervention.us_id = values.us_id
                    intervention.activist_id = 1 //values.activist_id
                    intervention.entry_point = values.entry_point
                    intervention.provider = values.provider
                    intervention.remarks = values.remarks
                    intervention.status = values.status
                    intervention.online_id = intervention.online_id
                    intervention._status = "updated"
                })

                return updatedIntervention;
            } 

            const newIntervention = await database.collections.get('beneficiaries_interventions').create((intervention: any) => {

                intervention.beneficiary_id = beneficiarie.online_id
                intervention.sub_service_id = values.sub_service_id
                intervention.result = values.result
                intervention.date = '' + text
                intervention.us_id = values.us_id
                intervention.activist_id = values.activist_id
                intervention.entry_point = values.entry_point
                intervention.provider = values.provider
                intervention.remarks = values.remarks
                intervention.status = values.status
                intervention.online_id = values.online_id

            });

            toast.show({ placement: "bottom", title: "Intervention Saved Successfully: " + newIntervention._raw.id });
            return newIntervention;
        });

        navigate({
            name: "BeneficiariesList", params: {
                intervation: newObject._raw,
                beneficiarie: beneficiarie
            }
        });


        //setLoading(false);
        sync({ username: loggedUser.username })
            .then(() => toast.show({
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
            .catch(() => toast.show({
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

    }

    const buttonTextStyle = {
        color: '#fff',
        backgroundColor: '#0891B2',
        paddingHorizontal: 16,
        paddingVertical: 8,
    };


  const progressStep = {
    nextBtnText: 'Proximo  >',
    previousBtnText: '<  Voltar',
    finishBtnText: 'Gravar',
  };

    return (
        <KeyboardAvoidingView>
            <ScrollView>
                {/* Start Steps */}
                <Center w="100%" bgColor="white" pt="5%">
                    <Heading size="lg" color="coolGray.800"
                                    _dark={{ color: "warmGray.50" }}
                                    fontWeight="semibold"
                                    marginBottom={5}
                                    marginTop={0} >
                                    Registo de Beneficiária
                    </Heading>
                    <Alert status="info" colorScheme="info">
                        <HStack flexShrink={1} space={2} alignItems="center">
                            <Alert.Icon />
                            <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
                                Preencha os campos abaixo para registar uma nova Beneficiaria!
                            </Text>
                        </HStack>
                    </Alert>
                    
                </Center>

                <View style={{flex: 1, backgroundColor: 'white' }}>
                    <ProgressSteps>
                        <ProgressStep label="Dados Pessoais" 
                            nextBtnTextStyle={buttonTextStyle}
                            {...progressStep}>
                            <View style={{ alignItems: 'center'}}>
                                
                                <View style={styles.webStyle}>
                                    <Center w="100%" >
                                        <Box safeArea p="2" w="100%" py="8">
                                            
                                            <Formik initialValues={initialValues}
                                                onSubmit={onSubmit} validate={validate} enableReinitialize={true}>
                                                {({
                                                    handleChange,
                                                    handleBlur,
                                                    handleSubmit,
                                                    setFieldValue,
                                                    values,
                                                    errors
                                                }) => <VStack space={3} >

                                                        
                                                    <FormControl isRequired >
                                                        <FormControl.Label>Apelido</FormControl.Label>

                                                        {/* <Input onBlur={handleBlur('remarks')} placeholder="" onChangeText={handleChange('remarks')} value={values.remarks} /> */}

                                                        <Input placeholder="Apelido" value={""} />

                                                    </FormControl>

                                                    <FormControl isRequired >
                                                        <FormControl.Label>Nome</FormControl.Label>

                                                        {/* <Input onBlur={handleBlur('remarks')} placeholder="" onChangeText={handleChange('remarks')} value={values.remarks} /> */}

                                                        <Input placeholder="Nome" value={""} />

                                                    </FormControl>

                                                        <FormControl isRequired>
                                                            <FormControl.Label>Data Nascimento</FormControl.Label>

                                                            {show && (
                                                                <DateTimePicker
                                                                    testID="dateTimePicker"
                                                                    value={date}
                                                                    // mode={mode}
                                                                    onChange={onChange}
                                                                />
                                                            )}


                                                            <Stack alignItems="center">
                                                                <InputGroup w={{
                                                                    base: "70%",
                                                                    md: "285",
                                                                }}>
                                                                    <InputLeftAddon>
                                                                        <Button style={{ width: 10 }} onPress={() => showDatepicker()}>
                                                                        </Button>
                                                                    </InputLeftAddon>
                                                                    <Input isDisabled
                                                                        w={{
                                                                            base: "70%",
                                                                            md: "100%"
                                                                        }} value={text}
                                                                        placeholder="dd-M-yyyy" />
                                                                </InputGroup>
                                                            </Stack>
                                                        </FormControl>

                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Nacionalidade</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"Mocambicana"} value={1} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>

                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Provincia</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"Zambezia"} value={1} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Distrito</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"Cidade de Quelimane"} value={1} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Posto Administrativo</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"Urbano n: 1"} value={1} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Ponto de Entrada</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"Unidade Sanitaria"} value={1} />
                                                                <Picker.Item key={'2'} label={"Comunitaria"} value={1} />
                                                                <Picker.Item key={'3'} label={"Escola"} value={1} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl >
                                                            <FormControl.Label>Alcunha</FormControl.Label>

                                                            <Input onBlur={handleBlur('provider')} placeholder="" onChangeText={handleChange('provider')} value={values.provider} />
                                                            
                                                        </FormControl>

                                                        <FormControl>
                                                            <FormControl.Label>Endereço (Ponto de Referência)</FormControl.Label>

                                                            <Input onBlur={handleBlur('remarks')} placeholder="" onChangeText={handleChange('remarks')} value={values.remarks} />

                                                        </FormControl>

                                                        <FormControl>
                                                            <FormControl.Label>Telemóvel</FormControl.Label>

                                                            <Input onBlur={handleBlur('remarks')} placeholder="" onChangeText={handleChange('remarks')} value={values.remarks} />

                                                        </FormControl>

                                                        <FormControl>
                                                            <FormControl.Label>E-mail</FormControl.Label>

                                                            <Input onBlur={handleBlur('remarks')} placeholder="" onChangeText={handleChange('remarks')} value={values.remarks} />

                                                        </FormControl>

                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Bairro</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"Bairro 1"} value={1} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
{/* 
                                                        <Button isLoading={loading} isLoadingText="Cadastrando" onPress={handleSubmit} my="10" colorScheme="primary">
                                                            Cadastrar
                                                        </Button> */}
                                                    </VStack>
                                                }
                                            </Formik>
                                        </Box>
                                    </Center>
                                </View>

                            </View>
                        </ProgressStep>
                        <ProgressStep label="Critérios de Eligibilidade Gerais" 
                            nextBtnTextStyle={buttonTextStyle} 
                            previousBtnTextStyle={buttonTextStyle}
                            {...progressStep}>
                            <View style={{ alignItems: 'center'}}>
                                
                                <View style={styles.webStyle}>
                                    <Center w="100%" >
                                        <Box safeArea p="2" w="100%" py="8">
                                            
                                            <Formik initialValues={initialValues}
                                                onSubmit={onSubmit} validate={validate} enableReinitialize={true}>
                                                {({
                                                    handleChange,
                                                    handleBlur,
                                                    handleSubmit,
                                                    setFieldValue,
                                                    values,
                                                    errors
                                                }) => <VStack space={3} >

                                                     
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Com quem mora?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"Pais"} value={1} />
                                                                <Picker.Item key={'2'} label={"Parceiros"} value={1} />
                                                                <Picker.Item key={'3'} label={"Avos"} value={1} />
                                                                <Picker.Item key={'4'} label={"Sozinho"} value={1} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Sustenta a Casa?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={1} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>É Orfã?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={1} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Vai a Escola?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={1} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl>
                                                            <FormControl.Label>Classe</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"1"} value={1} />
                                                                <Picker.Item key={'2'} label={"2"} value={2} />
                                                                <Picker.Item key={'3'} label={"3"} value={3} />
                                                                <Picker.Item key={'4'} label={"4"} value={4} />
                                                                <Picker.Item key={'5'} label={"5"} value={5} />
                                                                <Picker.Item key={'6'} label={"6"} value={6} />
                                                                <Picker.Item key={'7'} label={"7"} value={7} />
                                                                <Picker.Item key={'8'} label={"8"} value={8} />
                                                                <Picker.Item key={'9'} label={"9"} value={9} />
                                                                <Picker.Item key={'10'} label={"10"} value={10} />
                                                                <Picker.Item key={'11'} label={"11"} value={11} />
                                                                <Picker.Item key={'12'} label={"12"} value={12} />
                                                            </Picker>
                                                        </FormControl>
                                                        <FormControl isRequired >
                                                            <FormControl.Label>Nome da Instituição de Ensino</FormControl.Label>

                                                            {/* <Input onBlur={handleBlur('remarks')} placeholder="" onChangeText={handleChange('remarks')} value={values.remarks} /> */}

                                                            <Input placeholder="" value={""} />

                                                        </FormControl>

                                                        

                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Tem Deficiência?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={2} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>

                                                        <FormControl >
                                                            <FormControl.Label>Tipo de Deficiência</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"Pscologico"} value={1} />
                                                                <Picker.Item key={'2'} label={"Fisico"} value={2} />
                                                            </Picker>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Já foi Casada?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={2} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Já esteve Gravida?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={2} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Tem Filhos?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={2} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>

                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Está Grávida ou a amamentar?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={2} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>

                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Trabalha?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"Nao Trabalha"} value={1} />
                                                                <Picker.Item key={'2'} label={"Outros"} value={2} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Já fez Teste de HIV?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"NAO"} value={1} />
                                                                <Picker.Item key={'2'} label={"SIM"} value={2} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                    </VStack>
                                                }
                                            </Formik>
                                        </Box>
                                    </Center>
                                </View>

                            </View>
                        </ProgressStep>
                        <ProgressStep label="Critérios de Eligibilidade Específicos" 
                            nextBtnTextStyle={buttonTextStyle} 
                            previousBtnTextStyle={buttonTextStyle}
                            {...progressStep}
                            >
                           
                           <View style={{ alignItems: 'center'}}>
                                
                                <View style={styles.webStyle}>
                                    <Center w="100%" >
                                        <Box safeArea p="2" w="100%" py="8">
                                            
                                            <Formik initialValues={initialValues}
                                                onSubmit={onSubmit} validate={validate} enableReinitialize={true}>
                                                {({
                                                    handleChange,
                                                    handleBlur,
                                                    handleSubmit,
                                                    setFieldValue,
                                                    values,
                                                    errors
                                                }) => <VStack space={3} >

                                                     
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Sexualmente Activa?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={1} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Relações Múltiplas e Concorrentes?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={1} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Migrante?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={1} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Vítima de Tráfico?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={1} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl isRequired>
                                                            <FormControl.Label>Vítima de Exploração sexual?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={2} />
                                                            </Picker>
                                                        </FormControl>
                                                        <FormControl isRequired >
                                                            <FormControl.Label>Nome da Instituição de Ensino</FormControl.Label>

                                                            {/* <Input onBlur={handleBlur('remarks')} placeholder="" onChangeText={handleChange('remarks')} value={values.remarks} /> */}

                                                            <Input placeholder="" value={""} />

                                                        </FormControl>

                                                        

                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Tempo</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={2} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>

                                                        <FormControl >
                                                            <FormControl.Label>Vítima de Violéncia Baseada no Gênero?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"Pscologico"} value={1} />
                                                                <Picker.Item key={'2'} label={"Fisico"} value={2} />
                                                            </Picker>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Já foi Casada?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={2} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Tipo de Violéncia</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={2} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Tempo</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={2} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>

                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Uso de Álcool e Drogas?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={2} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>

                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Histórico de ITS?</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"SIM"} value={1} />
                                                                <Picker.Item key={'2'} label={"NAO"} value={2} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={'status' in errors}>
                                                            <FormControl.Label>Trabalhadora do Sexo</FormControl.Label>
                                                            <Picker
                                                                style={styles.dropDownPicker}
                                                                selectedValue={values.status}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    if (itemIndex !== 0) {
                                                                        setFieldValue('status', itemValue);
                                                                    }
                                                                }
                                                                }>

                                                                <Picker.Item value="1" />
                                                                <Picker.Item key={'1'} label={"NAO"} value={1} />
                                                                <Picker.Item key={'2'} label={"SIM"} value={2} />
                                                            </Picker>
                                                            <FormControl.ErrorMessage>
                                                                {errors.status}
                                                            </FormControl.ErrorMessage>
                                                        </FormControl>
                                                    </VStack>
                                                }
                                            </Formik>
                                        </Box>
                                    </Center>
                                </View>

                            </View>      

                        </ProgressStep>
                        <ProgressStep label="Confirmar"       
                            previousBtnTextStyle={buttonTextStyle}     
                            finishBtnTextStyle={buttonTextStyle}                    
                            {...progressStep}>
                            <View style={{ alignItems: 'center' }}>
                                {/* <Text>Beneficiaria Registada com Sucesso!</Text> */}
                            </View>
                        </ProgressStep>
                    </ProgressSteps>
                </View>

                {/* End Steps */}
                
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
const enhance = withObservables([], () => ({
    localities: database.collections
        .get("localities")
        .query().observe(),
    profiles: database.collections
        .get("profiles")
        .query().observe(),
    services: database.collections
        .get("services")
        .query(),
    subServices: database.collections
        .get("sub_services")
        .query().observe(),
    partners: database.collections
        .get("partners")
        .query().observe(),
    us: database.collections
        .get("us")
        .query().observe(),


}));
export default enhance(partnerForm);
