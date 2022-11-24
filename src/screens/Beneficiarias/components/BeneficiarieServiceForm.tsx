import React, { useEffect, useState, useContext } from 'react';
import {
    View, KeyboardAvoidingView, ScrollView,
    TextInput, TouchableOpacity, Platform,
}
    from 'react-native';
import {
    Center, Box, Select, Text, Heading, VStack, FormControl,
    Input, Link, Button, CheckIcon, WarningOutlineIcon, HStack, Checkbox,
    Alert, Flex, useToast, Stack, InputGroup, InputLeftAddon, InputRightAddon, Radio
}
    from 'native-base';
import { SuccessHandler, ErrorHandler } from "../../../components/SyncIndicator";

import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker, { getToday, getFormatedDate } from 'react-native-modern-datepicker';
import { stringify } from 'qs';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import { Q } from "@nozbe/watermelondb";
import { navigate } from '../../../routes/NavigationRef';
import withObservables from '@nozbe/with-observables';
import { database } from '../../../database';
import ModalSelector from 'react-native-modal-selector-searchable';
import { MaterialIcons } from "@native-base/icons";
import Beneficiaries_interventions, { BeneficiariesInterventionsModel } from '../../../models/Beneficiaries_interventions';
import { sync } from "../../../database/sync";
import { Context } from '../../../routes/DrawerNavigator';

import styles from './styles';

const BeneficiarieServiceForm: React.FC = ({ route, us, services, subServices }: any) => {
    const { beneficiarie, intervs, intervention } = route.params;

    const areaServicos = [{ "id": '1', "name": "Serviços Clinicos" }, { "id": '2', "name": "Serviços Comunitarios" }];
    const entry_points = [{ "id": '1', "name": "US" }, { "id": '2', "name": "CM" }, { "id": '3', "name": "ES" }];

    const [date, setDate] = useState(new Date());
    const [users, setUsers] = useState<any>([]);
    const [selectedUser, setSelectedUser] = useState<any>("");
    const [checked, setChecked] = useState(false);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [text, setText] = useState('');
    const [uss, setUss] = useState<any>([]);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);

        setText(selectedDate);
    }

    const onChangeEntryPoint = async (value: any) => {

        const uss = await database.get('us').query(
            Q.where('entry_point', parseInt(value)),
            Q.where('locality_id', parseInt(beneficiarie?.locality_id))
        ).fetch();
        const ussSerialied = uss.map(item => item._raw);
        setUss(ussSerialied);
    }

    const onChangeUs = async (value: any) => {

        const getUsersList = await database.get('users').query(
            Q.where('us_ids', Q.like(`%${value}%`))
        ).fetch();
        const usersSerialized = getUsersList.map(item => item._raw);
        setUsers(usersSerialized);
    }

    const onChangeToOutros = (value) => {
        setChecked(value);
    }

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('calendar');
    };
    const [initialValues, setInitialValues] = useState<any>({});
    let mounted = true;
    const [loading, setLoading] = useState(false);
    const loggedUser: any = useContext(Context);
    const toast = useToast();

    useEffect(() => {

        if (mounted) {
            const isEdit = intervention && intervention.id;
            let initValues = {};

            if (isEdit) {

                const selSubService = subServices.filter((e) => {
                    return e._raw.online_id == intervention.sub_service_id
                })[0];

                const selService = services.filter((e) => {
                    return e._raw.online_id == selSubService._raw.service_id
                })[0];

                const selUs = us.filter((e) => {
                    return e._raw.online_id == intervention.us_id
                })[0];

                onChangeEntryPoint(intervention.activist_id);

                initValues = {
                    areaServicos_id: selService._raw.service_type,
                    service_id: selService._raw.online_id,
                    beneficiary_id: beneficiarie.online_id,
                    sub_service_id: intervention.sub_service_id,
                    result: intervention.result,
                    date: intervention.date,
                    us_id: selUs.online_id,
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
                    areaServicos_id: loggedUser.entryPoint != undefined ? loggedUser.entryPoint : "",
                    service_id: '',
                    beneficiary_id: '',
                    sub_service_id: '',
                    result: '',
                    date: '',
                    us_id: '',
                    activist_id: '',
                    entry_point: '',
                    provider: '',
                    remarks: '',
                    status: '1'
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

        return errors;
    }

    const onSubmit = async (values: any) => {
        setLoading(true);

        const isEdit = intervention && intervention.id; // new record if it has id

        const newObject = await database.write(async () => {

            if (isEdit) {
                const interventionToUpdate = await database.get('beneficiaries_interventions').find(intervention.id);
                const updatedIntervention = await interventionToUpdate.update(() => {
                    intervention.sub_service_id = values.sub_service_id
                    intervention.remarks = values.remarks
                    intervention.result = values.result
                    intervention.date = '' + text
                    intervention.us_id = values.us_id
                    intervention.activist_id = loggedUser.id //values.activist_id
                    intervention.entry_point = values.entry_point
                    intervention.provider = values.provider
                    intervention.remarks = values.remarks
                    intervention.status = 1
                    intervention._status = "updated"
                })
                toast.show({ placement: "bottom", title: "Intervention Updated Successfully: " + updatedIntervention._raw.id });

                return updatedIntervention;
            } else {
                const newIntervention = await database.collections.get('beneficiaries_interventions').create((intervention: any) => {
                    intervention.beneficiary_id = beneficiarie.online_id 
                    intervention.beneficiary_offline_id = beneficiarie.id
                    intervention.sub_service_id = values.sub_service_id
                    intervention.result = values.result
                    intervention.date = '' + text
                    intervention.us_id = values.us_id
                    intervention.activist_id = loggedUser.id
                    intervention.entry_point = values.entry_point
                    intervention.provider = values.provider
                    intervention.remarks = values.remarks
                    intervention.status = 1
                });
                toast.show({ placement: "bottom", title: "Intervention Saved Successfully: " + newIntervention._raw.id });
                return newIntervention;
            }

        });

        var newIntr: any = newObject._raw;
        let subserviceObj = subServices.filter((item) => {
            return item._raw.online_id == newIntr.sub_service_id
        })[0];
        const nIobj =  { id: subserviceObj._raw.online_id, name: subserviceObj._raw.name, intervention: newIntr }

        let newIntervMap;
        if(isEdit){
            newIntervMap = intervs.map(item => item.intervention.id === nIobj.intervention.id ? nIobj: item);
        } else {
            newIntervMap = [nIobj, ...intervs];
        }

        navigate({
            name: 'Serviços',
            params: {
                beneficiary: beneficiarie,
                interventions: newIntervMap
            },
            merge: true,
        });

        sync({ username: loggedUser.username })
            .then(() => toast.show({
                placement: "top",
                render: () => {
                    return (<SuccessHandler />);
                }
            }))
            .catch(() => toast.show({
                placement: "top",
                render: () => {
                    return (<ErrorHandler />);
                }
            }));
    }

    return (
        <KeyboardAvoidingView>
            <ScrollView>
                <View style={styles.webStyle}>
                    <Center w="100%" bgColor="white">
                        <Box safeArea p="2" w="90%" py="8">
                            {/* <Heading size="lg" color="coolGray.800"
                                _dark={{ color: "warmGray.50" }}
                                fontWeight="semibold"
                                marginBottom={5}
                                marginTop={0} >
                                Prover Serviço
                            </Heading> */}
                            <Alert status="info" colorScheme="info">
                                <HStack flexShrink={1} space={2} alignItems="center">
                                    <Alert.Icon />
                                    <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
                                        Preencha os campos abaixo para prover um serviço a Beneficiária!
                                    </Text>
                                </HStack>
                            </Alert>

                            <Formik initialValues={initialValues}
                                onSubmit={onSubmit} validate={validate} enableReinitialize={true}>
                                {({
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    setFieldValue,
                                    values,
                                    errors
                                }) => <VStack space={3} mt="5">

                                        <FormControl isRequired isInvalid={'areaServicos_id' in errors}>
                                            <FormControl.Label>Área de Serviços</FormControl.Label>
                                            <Picker
                                                enabled={false}
                                                style={styles.dropDownPickerDisabled}
                                                selectedValue={values.areaServicos_id}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    if (itemIndex !== 0) {
                                                        setFieldValue('areaServicos_id', itemValue);
                                                    }
                                                }
                                                }>

                                                <Picker.Item label="-- Seleccione a Área do Serviço --" value="0" />
                                                {
                                                    areaServicos.map(item => (
                                                        <Picker.Item key={item.id} label={item.name} value={item.id} />
                                                    ))
                                                }
                                            </Picker>
                                            <FormControl.ErrorMessage>
                                                {errors.areaServicos_id}
                                            </FormControl.ErrorMessage>
                                        </FormControl>


                                        <FormControl isRequired isInvalid={'service_id' in errors}>
                                            <FormControl.Label>Serviço</FormControl.Label>
                                            <Picker
                                                style={styles.dropDownPicker}
                                                selectedValue={values.service_id}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    if (itemIndex !== 0) {
                                                        setFieldValue('service_id', itemValue);
                                                    }
                                                }
                                                }>
                                                <Picker.Item label="-- Seleccione o Serviço --" value="0" />
                                                {
                                                    services.filter((e) => {
                                                        return e.service_type == values.areaServicos_id
                                                    }
                                                    ).map(item => (
                                                        <Picker.Item key={item._raw.online_id} label={item._raw.name} value={parseInt(item._raw.online_id)} />
                                                    ))
                                                }
                                            </Picker>
                                            <FormControl.ErrorMessage>
                                                {errors.service_id}
                                            </FormControl.ErrorMessage>
                                        </FormControl>

                                        <FormControl isRequired isInvalid={'sub_service_id' in errors}>
                                            <FormControl.Label>Sub-Serviço/Intervenção</FormControl.Label>
                                            <Picker
                                                style={styles.dropDownPicker}
                                                selectedValue={values.sub_service_id}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    if (itemIndex !== 0) {
                                                        setFieldValue('sub_service_id', itemValue);
                                                    }
                                                }
                                                }>
                                                <Picker.Item label="-- Seleccione o Serviço --" value="0" />
                                                {
                                                    subServices.filter((e) => {
                                                        return e.service_id == values.service_id
                                                    }
                                                    ).map(item => (
                                                        <Picker.Item key={item._raw.online_id} label={item._raw.name} value={parseInt(item._raw.online_id)} />
                                                    ))
                                                }
                                            </Picker>
                                            <FormControl.ErrorMessage>
                                                {errors.sub_service_id}
                                            </FormControl.ErrorMessage>
                                        </FormControl>

                                        <FormControl isRequired isInvalid={'entry_point' in errors}>
                                            <FormControl.Label>Ponto de Entrada</FormControl.Label>
                                            <Picker
                                                style={styles.dropDownPicker}
                                                selectedValue={values.entry_point}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    if (itemIndex !== 0) {
                                                        setFieldValue('entry_point', itemValue);
                                                        onChangeEntryPoint(itemValue);
                                                    }
                                                }
                                                }>

                                                <Picker.Item label="-- Seleccione o ponto de Entrada --" value="" />
                                                {
                                                    entry_points.map(item => (
                                                        <Picker.Item key={item.id} label={item.name} value={item.id} />
                                                    ))
                                                }
                                            </Picker>
                                            <FormControl.ErrorMessage>
                                                {errors.entry_point}
                                            </FormControl.ErrorMessage>
                                        </FormControl>

                                        <FormControl isRequired isInvalid={'us_id' in errors}>
                                            <FormControl.Label>Localização</FormControl.Label>
                                            <Picker
                                                style={styles.dropDownPicker}
                                                selectedValue={values.us_id}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    if (itemIndex !== 0) {
                                                        setFieldValue('us_id', itemValue);
                                                        onChangeUs(itemValue);
                                                    }
                                                }
                                                }>
                                                <Picker.Item label="-- Seleccione a US --" value="0" />
                                                {
                                                    uss.map(item => (
                                                        <Picker.Item key={item.online_id} label={item.name} value={parseInt(item.online_id)} />
                                                    ))
                                                }
                                            </Picker>
                                            <FormControl.ErrorMessage>
                                                {errors.us_id}
                                            </FormControl.ErrorMessage>
                                        </FormControl>

                                        <FormControl isRequired>
                                            <FormControl.Label>Data Benefício</FormControl.Label>

                                            {show && (
                                                <DatePicker
                                                    mode="calendar"
                                                    maximumDate={getToday()}
                                                    onSelectedChange={date => onChange(null, date.replaceAll('/', '-'))}
                                                />
                                            )}

                                            <HStack alignItems="center">
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
                                                        placeholder="yyyy-M-dd" />
                                                </InputGroup>
                                            </HStack>


                                        </FormControl>
                                       
                                        <FormControl isRequired isInvalid={'provider' in errors}>
                                            <FormControl.Label>Provedor do Serviço</FormControl.Label>

                                            {checked === false ?
                                                <ModalSelector
                                                    data={users}
                                                    keyExtractor={item => item.online_id}
                                                    labelExtractor={item => `${item.name} ${item.surname}`}
                                                    renderItem={undefined}
                                                    initValue="Select something yummy!"
                                                    accessible={true}
                                                    cancelButtonAccessibilityLabel={'Cancel Button'}
                                                    onChange={(option) => { setSelectedUser(`${option.name} ${option.surname}`); setFieldValue('provider', option.online_id); }}>
                                                    <Input type='text' onBlur={handleBlur('provider')} placeholder="Selecione o Provedor" onChangeText={handleChange('provider')} value={selectedUser} />
                                                </ModalSelector> :
                                                <Input onBlur={handleBlur('provider')} placeholder="Insira o Nome do Provedor" onChangeText={handleChange('provider')} value={values.provider} />
                                            }
                                            <Checkbox value="one" onChange={onChangeToOutros}>Outro</Checkbox>

                                            <FormControl.ErrorMessage>
                                                {errors.provider}
                                            </FormControl.ErrorMessage>
                                        </FormControl>

                                        <FormControl>
                                            <FormControl.Label>Outras Observações</FormControl.Label>

                                            <Input onBlur={handleBlur('remarks')} placeholder="" onChangeText={handleChange('remarks')} value={values.remarks} />

                                        </FormControl>                                       
                                        <Button isLoading={loading} isLoadingText="Cadastrando" onPress={handleSubmit} my="10" colorScheme="primary">
                                            Cadastrar
                                        </Button>
                                    </VStack>
                                }
                            </Formik>
                        </Box>
                    </Center>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
const enhance = withObservables([], () => ({
    services: database.collections
        .get("services")
        .query(),
    subServices: database.collections
        .get("sub_services")
        .query().observe(),
    us: database.collections
        .get("us")
        .query().observe(),
}));

export default enhance(BeneficiarieServiceForm);
