import React, { useEffect, useState, useContext } from 'react';
import {
    View, KeyboardAvoidingView, ScrollView
} from 'react-native';
import {
    Center, Box, Select, Text, Heading, VStack, FormControl,
    Input, Link, Button, CheckIcon, WarningOutlineIcon, HStack,
    Alert, Flex, useToast, Stack, InputGroup, InputLeftAddon, InputRightAddon, Radio, Checkbox
} from 'native-base';
import DatePicker, { getToday, getFormatedDate } from 'react-native-modern-datepicker';
import { Picker } from '@react-native-picker/picker';
import withObservables from '@nozbe/with-observables';
import { database } from '../../../database';
import { navigate } from '../../../routes/NavigationRef';
import ModalSelector from 'react-native-modal-selector-searchable';
import { Q } from "@nozbe/watermelondb";
import { useFormik } from 'formik';
import { Context } from '../../../routes/DrawerNavigator';
import Beneficiaries_interventions, { BeneficiariesInterventionsModel } from '../../../models/Beneficiaries_interventions';

import styles from './styles';

const ServicesForm: React.FC = ({ route, services, subServices }: any) => {
    const { beneficiarie, intervention } = route.params;
    //console.log(intervention);

    const loggedUser: any = useContext(Context);
    const toast = useToast();

    const [initialValues, setInitialValues] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [text, setText] = useState('');
    const [date, setDate] = useState(new Date());
    const [users, setUsers] = useState<any>([]);
    const [us, setUs] = useState<any>([]);
    const [checked, setChecked] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>("");
    const service = services.filter(item => item._raw.online_id === intervention?.service.service_id)[0]?._raw;

    const areaServicos = [{ "id": '1', "name": "Serviços Clinicos" }, { "id": '2', "name": "Serviços Comunitarios" }];
    const entry_points = [{ "id": '1', "name": "US" }, { "id": '3', "name": "CM" }, { "id": '2', "name": "ES" }];
    const message = "Este campo é Obrigatório";

    const formik = useFormik({
        initialValues: {
            areaServicos_id: service?.service_type,
            service_id: service?.online_id,
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

        },
        onSubmit: values => onSubmit(values),
        validate: values => validate(values)
    });

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);

        // let tempDate = new Date(currentDate);
        // setText(moment(tempDate).format('YYYY-MM-DD'));
        setText(selectedDate);
    }

    const onChangeToOutros = (value) => {
        setChecked(value);
    }

    const onChangeEntryPoint = async (value: any) => {

        const uss = await database.get('us').query(
            Q.where('entry_point', parseInt(value)),
            Q.where('locality_id', parseInt(beneficiarie?.locality_id))
        ).fetch();
        const ussSerialied = uss.map(item => item._raw);
        setUs(ussSerialied);
    }

    const onChangeUs = async (value: any) => {

        const getUsersList = await database.get('users').query(
            Q.where('us_ids', Q.like(`%${value}%`))
        ).fetch();
        const usersSerialized = getUsersList.map(item => item._raw);
        setUsers(usersSerialized);
    }

    const showDatepicker = () => {
        setShow(true);
    };

    const validate = (values: any) => {
        const errors: any = {};


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

        if (!values.provider) {
            errors.provider = message;
        }

        if (!values.status) {
            errors.status = message;
        }

        return errors;
    }

    const onSubmit = async (values: any) => {
        //console.log(values);


        const newObject = await database.write(async () => {
            
            const newIntervention = await database.collections.get('beneficiaries_interventions').create((intervention: any) => {

                intervention.beneficiary_id = beneficiarie.online_id
                intervention.sub_service_id = values.sub_service_id
                intervention.result = values.result
                intervention.date = '' + text
                intervention.us_id = values.us_id
                intervention.activist_id = loggedUser.id
                intervention.entry_point = values.entry_point
                intervention.provider = values.provider
                intervention.remarks = values.remarks
                intervention.status = values.status

            });
            return newIntervention;
        });

        await database.write(async () => {
                const referenceSToUpdate = await database.get('references_services').query(
                    Q.where('reference_id', intervention?.service?.reference_id + ""),
                    Q.where('service_id', parseInt(intervention?.service?.service_id))
                ).fetch();

                const referenceToUpdate = await database.get('references').query(
                    Q.where('online_id', parseInt(intervention?.service?.reference_id))
                ).fetch();

                const refService = referenceSToUpdate[0];
                const ref = referenceToUpdate[0];

                //console.log(referenceToUpdate);
                //console.log(referenceToUpdate[0]);
                const updatedreferenceS = await refService.update((interventionS: any) => {
                    interventionS._raw.is_awaiting_sync = parseInt("1")
                    interventionS._raw._status = "updated"
                });

                const updatedreference = await ref.update((reference: any) => {
                    reference._raw.is_awaiting_sync = parseInt("1")
                    reference._raw._status = "updated"
                });
                //console.log("T: ",updatedreference);
              
        });
        toast.show({ placement: "bottom", title: "Service Provided Successfully! " });

        navigate({ name: "ReferencesList", params: { } });
        /*navigate({    
            name: 'Serviços',
            params: {
                beneficiary: beneficiarie,
                interventions: newIntervMap
            },
            merge: true,
        });*/

    }

    return (
        <KeyboardAvoidingView>
            <ScrollView>
                <View style={styles.webStyle}>
                    <Center w="100%" bgColor="white">
                        <Box safeArea p="2" w="90%" py="8">

                            <Alert status="info" colorScheme="info">
                                <HStack flexShrink={1} space={2} alignItems="center">
                                    <Alert.Icon />
                                    <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
                                        Preencha os campos abaixo para prover o serviço a Beneficiaria!
                                    </Text>
                                </HStack>
                            </Alert>
                            <VStack space={3} mt="5">

                                <FormControl isRequired >
                                    <FormControl.Label>Área de Serviços</FormControl.Label>
                                    <Picker
                                        enabled={false}
                                        style={styles.dropDownPickerDisabled}
                                        selectedValue={formik.values.areaServicos_id}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('areaServicos_id', itemValue);
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
                                        {formik.errors.areaServicos_id}
                                    </FormControl.ErrorMessage>
                                </FormControl>


                                <FormControl isRequired isInvalid={'service_id' in formik.errors}>
                                    <FormControl.Label>Serviço</FormControl.Label>
                                    <Picker
                                        enabled={false}
                                        style={styles.dropDownPickerDisabled}
                                        selectedValue={formik.values.service_id}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('service_id', itemValue);
                                            }
                                        }
                                        }>
                                        <Picker.Item label="-- Seleccione o Serviço --" value="0" />
                                        {
                                            services.filter((e) => {
                                                return e.service_type == formik.values.areaServicos_id
                                            }
                                            ).map(item => (
                                                <Picker.Item key={item._raw.online_id} label={item._raw.name} value={parseInt(item._raw.online_id)} />
                                            ))
                                        }
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.service_id}
                                    </FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={'sub_service_id' in formik.errors}>
                                    <FormControl.Label>Sub-Serviço/Intervenção</FormControl.Label>
                                    <Picker
                                        style={styles.dropDownPicker}
                                        selectedValue={formik.values.sub_service_id}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('sub_service_id', itemValue);
                                            }
                                        }
                                        }>
                                        <Picker.Item label="-- Seleccione o SubServiço --" value="0" />
                                        {
                                            subServices.filter((e) => {
                                                return e.service_id == formik.values.service_id
                                            }
                                            ).map(item => (
                                                <Picker.Item key={item._raw.online_id} label={item._raw.name} value={parseInt(item._raw.online_id)} />
                                            ))
                                        }
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.sub_service_id}
                                    </FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={'entry_point' in formik.errors}>
                                    <FormControl.Label>Ponto de Entrada</FormControl.Label>
                                    <Picker
                                        style={styles.dropDownPicker}
                                        selectedValue={formik.values.entry_point}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('entry_point', itemValue);
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
                                        {formik.errors.entry_point}
                                    </FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={'us_id' in formik.errors}>
                                    <FormControl.Label>Localização</FormControl.Label>
                                    <Picker
                                        style={styles.dropDownPicker}
                                        selectedValue={formik.values.us_id}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('us_id', itemValue);
                                                onChangeUs(itemValue);
                                            }
                                        }
                                        }>
                                        <Picker.Item label="-- Seleccione a US --" value="0" />
                                        {
                                            us.map(item => (
                                                <Picker.Item key={item.online_id} label={item.name} value={parseInt(item.online_id)} />
                                            ))
                                        }
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.us_id}
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
                                <FormControl isRequired isInvalid={'provider' in formik.errors}>
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
                                            onChange={(option) => { setSelectedUser(`${option.name} ${option.surname}`); formik.setFieldValue('provider', option.online_id); }}>
                                            <Input type='text' onBlur={formik.handleBlur('provider')} placeholder="Selecione o Provedor" onChangeText={formik.handleChange('provider')} value={selectedUser} />
                                        </ModalSelector> :
                                        <Input onBlur={formik.handleBlur('provider')} placeholder="Insira o Nome do Provedor" onChangeText={formik.handleChange('provider')} value={formik.values.provider} />
                                    }
                                    <Checkbox value="one" onChange={onChangeToOutros}>Outro</Checkbox>

                                    <FormControl.ErrorMessage>
                                        {formik.errors.provider}
                                    </FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl>
                                    <FormControl.Label>Outras Observações</FormControl.Label>

                                    <Input onBlur={formik.handleBlur('remarks')} placeholder="" onChangeText={formik.handleChange('remarks')} value={formik.values.remarks} />

                                </FormControl>

                                <FormControl isRequired isInvalid={'status' in formik.errors}>
                                    <FormControl.Label>Status</FormControl.Label>
                                    <Picker
                                        style={styles.dropDownPicker}
                                        selectedValue={formik.values.status}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('status', itemValue);
                                            }
                                        }
                                        }>

                                        <Picker.Item key={'1'} label={"Activo"} value={1} />
                                        <Picker.Item key={'2'} label={"Cancelado"} value={2} />
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.status}
                                    </FormControl.ErrorMessage>
                                </FormControl>

                                <Button isLoading={loading} isLoadingText="Cadastrando" onPress={formik.handleSubmit} my="10" colorScheme="primary">
                                    Cadastrar
                                </Button>
                            </VStack>

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
}));

export default enhance(ServicesForm);