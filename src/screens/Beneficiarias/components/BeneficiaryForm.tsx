import React, { useEffect, useState, useContext } from 'react';
import { TouchableHighlight, TouchableOpacity } from 'react-native';
import { View, HStack, Text, VStack, FormControl, Input, Stack, InputGroup, InputLeftAddon, TextArea, Center, Icon, Box, IconButton, Flex, Heading, Divider, Button, Radio, WarningOutlineIcon, Modal, ScrollView, Alert } from 'native-base';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "@native-base/icons";
import { useFormik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import { Q } from "@nozbe/watermelondb";
import ModalSelector from 'react-native-modal-selector-searchable';
import StepperButton from '../../Beneficiarias/components/StapperButton';
import { database } from '../../../database';
import DateTimePicker from '@react-native-community/datetimepicker';
import Spinner from 'react-native-loading-spinner-overlay';
import { navigate, navigationRef } from '../../../routes/NavigationRef';
import moment from 'moment';
import styles from './styles';

const BeneficiaryForm: React.FC = ({ route }: any) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(false);
    const [provinces, setProvinces] = useState<any>([]);
    const [districts, setDistricts] = useState<any>([]);
    const [localities, setLocalities] = useState<any>([]);
    const [neighborhoods, setNeighborhoods] = useState<any>([]);
    const [isDatePickerVisible2, setIsDatePickerVisible2] = useState(false);
    const [datePickerValue2, setDatePickerValue2] = useState<any>(new Date());
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [datePickerValue, setDatePickerValue] = useState<any>(new Date());
    const [step, setStep] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [newNui, setNewNui] = useState();

    useEffect(() => {
        const fetchProvincesData = async () => {
            const getProvsList = await database.get('provinces').query().fetch();
            const provSerialized = getProvsList.map(item => item._raw);
            setProvinces(provSerialized);
        }

        fetchProvincesData().catch(error => console.log(error));
    }, []);

    useEffect(() => {
        const fetchProvincesData = async () => {
            const getProvsList = await database.get('provinces').query().fetch();
            const provSerialized = getProvsList.map(item => item._raw);
            setProvinces(provSerialized);
        }

        fetchProvincesData().catch(error => console.log(error));
    }, []);

    const formik = useFormik({
        initialValues: {
            surname: '',
            name: '',
            date_of_birth: '',
            age: '',
            nationality: '',
            enrollment_date: '',
            province: '',
            district: '',
            locality: '',
            locality_name: '',
            entry_point: '',
            nick_name: '',
            address: '',
            phone_number: '',
            e_mail: '',
            neighbourhood_id: '',
            partner_nui: '',
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
            references_a: ''
        },
        onSubmit: values => console.log(values),
        validate: values => validate(values)
    });

    const onNextStep = () => {

        const errorsList = validate(formik.values);
        const hasErrors = JSON.stringify(errorsList) !== '{}';

        if (hasErrors) {
            setErrors(true);
        } else {
            setErrors(false);
            setStep(2);
        }
    };

    const onNextStep2 = async () => {

        const errorsList = validate(formik.values);
        const hasErrors = JSON.stringify(errorsList) !== '{}';

        if (hasErrors) {
            setErrors(true);
        } else {

            // save the Beneficiary locally
            setLoading(true);
            const ben:any = await handleSaveBeneficiary();
   
            setNewNui(ben?._raw.nui);
            setLoading(false);
            setShowModal(true);

            setErrors(false);
            setStep(3);
  
        }
    };

    const onPreviousStep = () => {
        setStep(1);
    };

    const onPreviousStep2 = () => {
        setStep(2);
    };

    const validate = (values: any) => {
        const errors: any = {};
        let errorMessage = 'Obrigatório';

        if (step == 1) {
            if (!values.surname) {
                errors.surname = errorMessage;
            }
            if (!values.name) {
                errors.name = errorMessage;
            }
            if (!values.date_of_birth) {
                errors.date_of_birth = errorMessage;
            }
            if (!values.nationality) {
                errors.nationality = errorMessage;
            }
            if (!values.enrollment_date) {
                errors.enrollment_date = errorMessage;
            }
            if (!values.province) {
                errors.province = errorMessage;
            }
            if (!values.district) {
                errors.district = errorMessage;
            }
            if (!values.locality) {
                errors.locality = errorMessage;
            }
            if (!values.entry_point) {
                errors.entry_point = errorMessage;
            }
            if (!values.neighbourhood_id) {
                errors.neighbourhood_id = errorMessage;
            }
        } else if (step == 2) {
            if (!values.vblt_lives_with) {
                errors.vblt_lives_with = errorMessage;
            }
            if (!values.vblt_house_sustainer) {
                errors.vblt_house_sustainer = errorMessage;
            }
            if (!values.vblt_is_orphan) {
                errors.vblt_is_orphan = errorMessage;
            }
            if (!values.vblt_is_student) {
                errors.vblt_is_student = errorMessage;
            }
            if (!values.vblt_is_deficient) {
                errors.vblt_is_deficient = errorMessage;
            }
            if (!values.vblt_married_before) {
                errors.vblt_married_before = errorMessage;
            }
            if (!values.vblt_pregnant_before) {
                errors.vblt_pregnant_before = errorMessage;
            }
            if (!values.vblt_children) {
                errors.vblt_children = errorMessage;
            }
            if (!values.vblt_pregnant_or_breastfeeding) {
                errors.vblt_pregnant_or_breastfeeding = errorMessage;
            }
            if (!values.vblt_is_employed) {
                errors.vblt_is_employed = errorMessage;
            }
            if (!values.vblt_tested_hiv) {
                errors.vblt_tested_hiv = errorMessage;
            }

        } else if (step == 3) {
            if (!values.vblt_sexually_active) {
                errors.vblt_sexually_active = errorMessage;
            }
            if (!values.vblt_multiple_partners) {
                errors.vblt_multiple_partners = errorMessage;
            }
            if (!values.vblt_is_migrant) {
                errors.vblt_is_migrant = errorMessage;
            }
            if (!values.vblt_trafficking_victim) {
                errors.vblt_trafficking_victim = errorMessage;
            }
            if (!values.vblt_sexual_exploitation) {
                errors.vblt_sexual_exploitation = errorMessage;
            }
            if (!values.vblt_vbg_victim) {
                errors.vblt_vbg_victim = errorMessage;
            }
            if (!values.vblt_alcohol_drugs_use) {
                errors.vblt_alcohol_drugs_use = errorMessage;
            }
            if (!values.vblt_sti_history) {
                errors.vblt_sti_history = errorMessage;
            }
            if (!values.vblt_sex_worker) {
                errors.vblt_sex_worker = errorMessage;
            }
        }

        return errors;
    }


    const handleSaveBeneficiary = async () => {

        // get prefix and nui
        const getPrefix:any = (await database.get('sequences').query().fetch())[0]?._raw;
        const newNui = Number(getPrefix.last_nui)+1;
        const fullNUI = `${getPrefix.prefix}${String(newNui).padStart(7, '0')}`
        //console.log(Number(formik.values.nationality));
        const newObject = await database.write(async () => {
            const newBeneficiary = await database.collections.get('beneficiaries').create((beneficiary: any) => {
                beneficiary.nui = fullNUI,
                beneficiary.surname = formik.values.surname, 
                beneficiary.name = formik.values.name, 
                beneficiary.nick_name = formik.values.nick_name, 
                beneficiary.date_of_birth = formik.values.date_of_birth, 
                beneficiary.gender = '1', 
                beneficiary.address = formik.values.address, 
                beneficiary.phone_number = formik.values.phone_number, 
                beneficiary.e_mail = formik.values.e_mail, 
                beneficiary.via = 1, 
                beneficiary.partner_id = 1,  //FIXME: define correctly
                beneficiary.entry_point = formik.values.entry_point, 
                beneficiary.neighbourhood_id = formik.values.neighbourhood_id, 
                beneficiary.us_id = 1, 
                beneficiary.status = 1, 
                beneficiary.locality_name = formik.values.locality_name, 
                beneficiary.nationality = 1,
                beneficiary.vblt_lives_with = formik.values.vblt_lives_with, 
                beneficiary.vblt_house_sustainer = Number(formik.values.vblt_house_sustainer),
                beneficiary.vblt_is_orphan = Number(formik.values.vblt_is_orphan),
                beneficiary.vblt_is_student = Number(formik.values.vblt_is_student),
                beneficiary.vblt_is_deficient = Number(formik.values.vblt_is_deficient),
                beneficiary.vblt_deficiency_type = formik.values.vblt_deficiency_type,
                beneficiary.vblt_married_before = Number(formik.values.vblt_married_before),
                beneficiary.vblt_pregnant_before = Number(formik.values.vblt_pregnant_before),
                beneficiary.vblt_children = Number(formik.values.vblt_children),
                beneficiary.vblt_pregnant_or_breastfeeding = Number(formik.values.vblt_pregnant_or_breastfeeding),
                beneficiary.vblt_is_employed = formik.values.vblt_is_employed,
                beneficiary.vblt_tested_hiv = formik.values.vblt_tested_hiv
            });

            const sequenceToUpdate = await database.get('sequences').find(getPrefix.id);
            await sequenceToUpdate.update((sequence:any) => {
                sequence.last_nui = String(newNui)
            });
            return newBeneficiary;
        });

        return newObject;
    }

    const handleSubmit = async (values?: any) => {
        //console.log(formik.values);
        navigationRef.goBack();
    }

    const showDatepicker = () => {
        setIsDatePickerVisible(true);
    };

    const onChangeDatePicker = (event, selectedDate) => {

        setIsDatePickerVisible(false);
        setDatePickerValue(selectedDate);

        let tempDate = new Date(selectedDate);
        formik.setFieldValue('date_of_birth', moment(tempDate).format('YYYY-MM-DD'));
    }

    const showDatepicker2 = () => {
        setIsDatePickerVisible2(true);
    };

    const onChangeDatePicker2 = (event, selectedDate) => {

        setIsDatePickerVisible2(false);
        setDatePickerValue2(selectedDate);

        let tempDate = new Date(selectedDate);
        formik.setFieldValue('enrollment_date', moment(tempDate).format('YYYY-MM-DD'));
    }

    const onChangeProvinces = async (provId: any) => {

        const getDistList = await database.get('districts').query(
            Q.where('province_id', provId)
        ).fetch();
        const distsSerialized = getDistList.map(item => item._raw);
        setDistricts(distsSerialized);
    }

    const onChangeDistricts = async (distId: any) => {

        const getLocList = await database.get('localities').query(
            Q.where('district_id', distId)
        ).fetch();
        const locsSerialized = getLocList.map(item => item._raw);
        setLocalities(locsSerialized);
    }

    const onChangeLocalities = async (locId: any) => {
        const getNeiList = await database.get('neighborhoods').query(
            Q.where('locality_id', Number(locId))
        ).fetch();
        const neiSerialized = getNeiList.map(item => item._raw);
        setNeighborhoods(neiSerialized);
    }

    return (
        <>
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <ProgressSteps >
                    <ProgressStep label="Dados Pessoais" onNext={onNextStep} errors={errors}
                        nextBtnStyle={styles.buttonStyle}
                        nextBtnTextStyle={styles.buttonTextStyle}
                        nextBtnText='Proximo >>'
                    >
                        <View style={{ alignItems: 'center' }}>
                            <VStack space={3} w="90%" >
                                <FormControl isRequired isInvalid={'surname' in formik.errors}>
                                    <FormControl.Label>Apelido</FormControl.Label>
                                    <Input onBlur={formik.handleBlur('surname')} placeholder="Insira o Apelido" onChangeText={formik.handleChange('surname')} value={formik.values.surname} />
                                    <FormControl.ErrorMessage>
                                        {formik.errors.surname}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'name' in formik.errors}>
                                    <FormControl.Label>Nome</FormControl.Label>
                                    <Input onBlur={formik.handleBlur('name')} placeholder="Insira o Nome" onChangeText={formik.handleChange('name')} value={formik.values.name} />
                                    <FormControl.ErrorMessage>
                                        {formik.errors.name}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'date_of_birth' in formik.errors}>
                                    <FormControl.Label>Data Nascimento</FormControl.Label>
                                    {isDatePickerVisible && (
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={datePickerValue}
                                            // mode={mode}
                                            onChange={onChangeDatePicker}
                                        />
                                    )}
                                    <HStack w="100%" flex={1} space={5} alignItems="center"  >
                                        <InputGroup w={{ base: "70%", md: "285" }}>
                                            <InputLeftAddon>
                                                <Button style={{ width: 10 }} onPress={() => showDatepicker()}> </Button>
                                            </InputLeftAddon>
                                            <Input isDisabled w={{ base: "70%", md: "100%" }}
                                                onPressIn={() => showDatepicker()}
                                                onBlur={formik.handleBlur('name')}
                                                value={formik.values.date_of_birth}
                                                onChangeText={formik.handleChange('date_of_birth')}
                                                //value={moment(new Date(datePickerValue)).format('YYYY-MM-DD')}
                                                placeholder="dd-M-yyyy" />
                                        </InputGroup>
                                    </HStack>

                                    <FormControl.ErrorMessage>
                                        {formik.errors.date_of_birth}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'nationality' in formik.errors}>
                                    <FormControl.Label>Nacionalidade</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.nationality}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('nationality', itemValue);
                                            }
                                        }}>
                                        <Picker.Item label="-- Seleccione a nacionalidade --" value="0" />
                                        <Picker.Item key="1" label="Moçambicana" value="1" />
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.nationality}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'enrollment_date' in formik.errors}>
                                    <FormControl.Label>Data Inscrição</FormControl.Label>
                                    {isDatePickerVisible2 && (
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={datePickerValue2}
                                            // mode={mode}
                                            onChange={onChangeDatePicker2}
                                        />
                                    )}
                                    <HStack w="100%" flex={1} space={5} alignItems="center"  >
                                        <InputGroup w={{ base: "70%", md: "285" }}>
                                            <InputLeftAddon>
                                                <Button style={{ width: 10 }} onPress={() => showDatepicker2()}> </Button>
                                            </InputLeftAddon>
                                            <Input isDisabled w={{ base: "70%", md: "100%" }}
                                                onPressIn={() => showDatepicker2()}
                                                onBlur={formik.handleBlur('name')}
                                                value={formik.values.enrollment_date}
                                                onChangeText={formik.handleChange('enrollment_date')}
                                                //value={moment(new Date(datePickerValue)).format('YYYY-MM-DD')}
                                                placeholder="dd-M-yyyy" />
                                        </InputGroup>
                                    </HStack>

                                    <FormControl.ErrorMessage>
                                        {formik.errors.enrollment_date}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'province' in formik.errors}>
                                    <FormControl.Label>Provincia</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.province}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('province', itemValue);
                                                onChangeProvinces(itemValue);
                                            }
                                        }
                                        }>

                                        <Picker.Item label="-- Seleccione a Provincia --" value="0" />
                                        {
                                            provinces.map(item => (
                                                <Picker.Item key={item.online_id} label={item.name} value={item.online_id} />
                                            ))
                                        }
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.province}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'district' in formik.errors}>
                                    <FormControl.Label>Distrito</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.district}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('district', itemValue);
                                                onChangeDistricts(itemValue);
                                            }
                                        }
                                        }>

                                        <Picker.Item label="-- Seleccione o Distrito --" value="0" />
                                        {
                                            districts.map(item => (
                                                <Picker.Item key={item.online_id} label={item.name} value={item.online_id} />
                                            ))
                                        }
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.district}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'locality' in formik.errors}>
                                    <FormControl.Label>Posto Administrativo</FormControl.Label>
                                    <Picker
                                        selectedValue={`${formik.values.locality},${formik.values.locality_name}`}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('locality', itemValue.split(",")[0]);
                                                formik.setFieldValue('locality_name', itemValue.split(",")[1]);
                                                onChangeLocalities(itemValue.split(",")[0]);
                                            }
                                        }
                                        }>

                                        <Picker.Item label="-- Seleccione o Posto Administrativo --" value="0" />
                                        {
                                            localities.map(item => (
                                                <Picker.Item key={`${item.online_id},${item.name}`} label={item.name} value={`${item.online_id},${item.name}`} />
                                            ))
                                        }
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.locality}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'entry_point' in formik.errors}>
                                    <FormControl.Label>Ponto de Entrada</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.entry_point}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('entry_point', itemValue);
                                            }
                                        }}>
                                        <Picker.Item label="-- Seleccione o PE --" value="0" />
                                        <Picker.Item key="1" label="US" value="1" />
                                        <Picker.Item key="2" label="ES" value="2" />
                                        <Picker.Item key="3" label="CM" value="3" />
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.entry_point}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl >
                                    <FormControl.Label>Alcunha</FormControl.Label>
                                    <Input onBlur={formik.handleBlur('nick_name')} placeholder="Insira a Alcunha" onChangeText={formik.handleChange('nick_name')} value={formik.values.nick_name} />
                                </FormControl>
                                <FormControl >
                                    <FormControl.Label>Endereço (Ponto de Referência)</FormControl.Label>
                                    <Input onBlur={formik.handleBlur('address')} placeholder="Insira o Endereço" onChangeText={formik.handleChange('address')} value={formik.values.address} />
                                </FormControl>
                                <FormControl >
                                    <FormControl.Label>Telemóvel</FormControl.Label>
                                    <Input onBlur={formik.handleBlur('phone_number')} placeholder="Insira o Telemóvel" onChangeText={formik.handleChange('phone_number')} value={formik.values.phone_number} />
                                </FormControl>
                                <FormControl >
                                    <FormControl.Label>E-mail</FormControl.Label>
                                    <Input onBlur={formik.handleBlur('e_mail')} placeholder="Insira o E_mail" onChangeText={formik.handleChange('e_mail')} value={formik.values.e_mail} />
                                </FormControl>
                                <FormControl isRequired isInvalid={'neighbourhood_id' in formik.errors}>
                                    <FormControl.Label>Bairro</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.neighbourhood_id}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('neighbourhood_id', itemValue);
                                            }
                                        }
                                        }>

                                        <Picker.Item label="-- Seleccione o Bairro --" value="0" />
                                        {
                                            neighborhoods.map(item => (
                                                <Picker.Item key={item.online_id} label={item.name} value={item.online_id} />
                                            ))
                                        }
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.neighbourhood_id}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl >
                                    <FormControl.Label>NUI do Parceiro</FormControl.Label>
                                    <Input onBlur={formik.handleBlur('partner_nui')} placeholder="Insira o NUI do Parceiro" onChangeText={formik.handleChange('partner_nui')} value={formik.values.partner_nui} />
                                </FormControl>

                            </VStack>
                        </View>
                    </ProgressStep>
                    <ProgressStep label="Critérios de Eligibilidade Gerais" onPrevious={onPreviousStep} onNext={onNextStep2} errors={errors}
                        previousBtnStyle={styles.buttonStyle}
                        previousBtnTextStyle={styles.buttonTextStyle}
                        nextBtnTextStyle={styles.buttonTextSaveStyle}
                        nextBtnStyle={styles.buttonSaveStyle}
                        nextBtnText='Salvar'
                        previousBtnText='<< Anterior'
                    >
                        <View style={{ alignItems: 'center' }}>
                            <VStack space={3} w="90%" >
                                <FormControl isRequired isInvalid={'vblt_lives_with' in formik.errors}>
                                    <FormControl.Label>Com quem mora?</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.vblt_lives_with}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('vblt_lives_with', itemValue);
                                            }
                                        }}>
                                        <Picker.Item label="-- Seleccione --" value="0" />
                                        <Picker.Item key="1" label="Pais" value="Pais" />
                                        <Picker.Item key="2" label="Avos" value="Avos" />
                                        <Picker.Item key="3" label="Parceiro" value="Parceiro" />
                                        <Picker.Item key="3" label="Sozinho" value="Sozinho" />
                                        <Picker.Item key="3" label="Outros familiares" value="Outros familiares" />
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_lives_with}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'vblt_house_sustainer' in formik.errors}>
                                    <FormControl.Label>Sustenta a Casa?</FormControl.Label>
                                    <Radio.Group defaultValue='-1' onChange={(itemValue) => {
                                        formik.setFieldValue('vblt_house_sustainer', itemValue);

                                    }} name="rg1" accessibilityLabel="pick a size">
                                        <Stack direction={{ base: "row", md: "row" }} alignItems={{
                                            base: "flex-start", md: "center"
                                        }} space={4} w="75%" maxW="300px">
                                            <Radio key='rd1' value='1' colorScheme="green" size="lg" my={1}>
                                                Sim
                                            </Radio>
                                            <Radio key='rd2' value='0' colorScheme="green" size="lg" my={1}>
                                                Nao
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_house_sustainer}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'vblt_is_orphan' in formik.errors}>
                                    <FormControl.Label>É Orfã?</FormControl.Label>
                                    <Radio.Group onChange={(itemValue) => {
                                        formik.setFieldValue('vblt_is_orphan', itemValue);

                                    }} name="rg2" accessibilityLabel="pick a size">
                                        <Stack direction={{ base: "row", md: "row" }} alignItems={{
                                            base: "flex-start", md: "center"
                                        }} space={4} w="75%" maxW="300px">
                                            <Radio value='1' colorScheme="green" size="lg" my={1}>
                                                Sim
                                            </Radio>
                                            <Radio value='0' colorScheme="green" size="lg" my={1}>
                                                Nao
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_is_orphan}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'vblt_is_student' in formik.errors}>
                                    <FormControl.Label>Vai a Escola?</FormControl.Label>
                                    <Radio.Group onChange={(itemValue) => {
                                        formik.setFieldValue('vblt_is_student', itemValue);

                                    }} name="rg3" accessibilityLabel="pick a size">
                                        <Stack direction={{ base: "row", md: "row" }} alignItems={{
                                            base: "flex-start", md: "center"
                                        }} space={4} w="75%" maxW="300px">
                                            <Radio value='1' colorScheme="green" size="lg" my={1}>
                                                Sim
                                            </Radio>
                                            <Radio value='0' colorScheme="green" size="lg" my={1}>
                                                Nao
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_is_student}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl >
                                    <FormControl.Label>Classe</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.vblt_school_grade}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('vblt_school_grade', itemValue);
                                            }
                                        }}>
                                        <Picker.Item label="-- Seleccione --" value="0" />
                                        {
                                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(item => (
                                                <Picker.Item key={item} label={'' + item} value={item} />
                                            ))
                                        }
                                    </Picker>
                                </FormControl>
                                <FormControl >
                                    <FormControl.Label>Nome da Instituição de Ensino</FormControl.Label>
                                    <Input onBlur={formik.handleBlur('vblt_school_name')} placeholder="Insira o nome da Instituição" onChangeText={formik.handleChange('vblt_school_name')} value={formik.values.vblt_school_name} />
                                </FormControl>
                                <FormControl isRequired isInvalid={'vblt_is_deficient' in formik.errors}>
                                    <FormControl.Label>Tem Deficiência?</FormControl.Label>
                                    <Radio.Group onChange={(itemValue) => {
                                        formik.setFieldValue('vblt_is_deficient', itemValue);

                                    }} name="rg4" accessibilityLabel="pick a size">
                                        <Stack direction={{ base: "row", md: "row" }} alignItems={{
                                            base: "flex-start", md: "center"
                                        }} space={4} w="75%" maxW="300px">
                                            <Radio value='1' colorScheme="green" size="lg" my={1}>
                                                Sim
                                            </Radio>
                                            <Radio value='0' colorScheme="green" size="lg" my={1}>
                                                Nao
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_is_deficient}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl >
                                    <FormControl.Label>Tipo de Deficiência</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.vblt_deficiency_type}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('vblt_deficiency_type', itemValue);
                                            }
                                        }}>
                                        <Picker.Item label="-- Seleccione --" value="0" />
                                        {
                                            ['Não Anda', 'Não Fala', 'Não Vê', 'Não Ouve', 'Membro Amputado ou Deformado'].map(item => (
                                                <Picker.Item key={item} label={'' + item} value={item} />
                                            ))
                                        }
                                    </Picker>
                                </FormControl>
                                <FormControl isRequired isInvalid={'vblt_married_before' in formik.errors}>
                                    <FormControl.Label>Já foi Casada?</FormControl.Label>
                                    <Radio.Group onChange={(itemValue) => {
                                        formik.setFieldValue('vblt_married_before', itemValue);

                                    }} name="rg5" accessibilityLabel="pick a size">
                                        <Stack direction={{ base: "row", md: "row" }} alignItems={{
                                            base: "flex-start", md: "center"
                                        }} space={4} w="75%" maxW="300px">
                                            <Radio value='1' colorScheme="green" size="lg" my={1}>
                                                Sim
                                            </Radio>
                                            <Radio value='0' colorScheme="green" size="lg" my={1}>
                                                Nao
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_married_before}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'vblt_pregnant_before' in formik.errors}>
                                    <FormControl.Label>Já esteve Gravida?</FormControl.Label>
                                    <Radio.Group onChange={(itemValue) => {
                                        formik.setFieldValue('vblt_pregnant_before', itemValue);

                                    }} name="rg6" accessibilityLabel="pick a size">
                                        <Stack direction={{ base: "row", md: "row" }} alignItems={{
                                            base: "flex-start", md: "center"
                                        }} space={4} w="75%" maxW="300px">
                                            <Radio value='1' colorScheme="green" size="lg" my={1}>
                                                Sim
                                            </Radio>
                                            <Radio value='0' colorScheme="green" size="lg" my={1}>
                                                Nao
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_pregnant_before}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl >
                                    <FormControl.Label>Tem Filhos?</FormControl.Label>
                                    <Radio.Group onChange={(itemValue) => {
                                        formik.setFieldValue('vblt_children', itemValue);

                                    }} name="rg7" accessibilityLabel="pick a size">
                                        <Stack direction={{ base: "row", md: "row" }} alignItems={{
                                            base: "flex-start", md: "center"
                                        }} space={4} w="75%" maxW="300px">
                                            <Radio value='1' colorScheme="green" size="lg" my={1}>
                                                Sim
                                            </Radio>
                                            <Radio value='0' colorScheme="green" size="lg" my={1}>
                                                Nao
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                </FormControl>
                                <FormControl isRequired isInvalid={'vblt_pregnant_or_breastfeeding' in formik.errors}>
                                    <FormControl.Label>Está Grávida ou a amamentar?</FormControl.Label>
                                    <Radio.Group onChange={(itemValue) => {
                                        formik.setFieldValue('vblt_pregnant_or_breastfeeding', itemValue);

                                    }} name="rg8" accessibilityLabel="pick a size">
                                        <Stack direction={{ base: "row", md: "row" }} alignItems={{
                                            base: "flex-start", md: "center"
                                        }} space={4} w="75%" maxW="300px">
                                            <Radio value='1' colorScheme="green" size="lg" my={1}>
                                                Sim
                                            </Radio>
                                            <Radio value='0' colorScheme="green" size="lg" my={1}>
                                                Nao
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_pregnant_or_breastfeeding}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'vblt_is_employed' in formik.errors}>
                                    <FormControl.Label>Trabalha?</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.vblt_is_employed}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('vblt_is_employed', itemValue);
                                            }
                                        }}>
                                        <Picker.Item label="-- Seleccione --" value="0" />
                                        {
                                            ['Não Trabalha', 'Empregada Doméstica', 'Babá (Cuida das Crianças)', 'Outros'].map(item => (
                                                <Picker.Item key={item} label={'' + item} value={item} />
                                            ))
                                        }
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_is_employed}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'vblt_tested_hiv' in formik.errors}>
                                    <FormControl.Label>Já fez Teste de HIV?</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.vblt_tested_hiv}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('vblt_tested_hiv', itemValue);
                                            }
                                        }}>
                                        <Picker.Item label="-- Seleccione --" value="0" />
                                        {
                                            ['Não', 'SIM ( + 3 meses)', 'SIM ( - 3 meses)'].map(item => (
                                                <Picker.Item key={item} label={'' + item} value={item} />
                                            ))
                                        }
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_tested_hiv}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                            </VStack>
                        </View>
                    </ProgressStep>
                    <ProgressStep label="Critérios de Eligibilidade Específicos" onPrevious={onPreviousStep2} onSubmit={handleSubmit} errors={errors}
                        previousBtnStyle={styles.buttonStyle}
                        previousBtnTextStyle={styles.buttonTextStyle}
                        nextBtnTextStyle={styles.buttonTextSaveStyle}
                        nextBtnStyle={styles.buttonSaveStyle}
                        finishBtnText='Actualizar'
                        previousBtnText='<< Anterior'
                    >
                        <View style={{ alignItems: 'center' }}>
                            <VStack space={3} w="90%" >
                                <FormControl isRequired isInvalid={'vblt_sexually_active' in formik.errors}>
                                    <FormControl.Label>Sexualmente Activa?</FormControl.Label>
                                    <Radio.Group onChange={(itemValue) => {
                                        formik.setFieldValue('vblt_sexually_active', itemValue);

                                    }} name="ex1" accessibilityLabel="pick a size">
                                        <Stack direction={{ base: "row", md: "row" }} alignItems={{
                                            base: "flex-start", md: "center"
                                        }} space={4} w="75%" maxW="300px">
                                            <Radio value='1' colorScheme="green" size="lg" my={1}>
                                                Sim
                                            </Radio>
                                            <Radio value='0' colorScheme="green" size="lg" my={1}>
                                                Nao
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_sexually_active}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'vblt_multiple_partners' in formik.errors}>
                                    <FormControl.Label>Relações Múltiplas e Concorrentes?</FormControl.Label>
                                    <Radio.Group onChange={(itemValue) => {
                                        formik.setFieldValue('vblt_multiple_partners', itemValue);

                                    }} name="ex2" accessibilityLabel="pick a size" defaultValue={formik.values.vblt_multiple_partners}>
                                        <Stack direction={{ base: "row", md: "row" }} alignItems={{
                                            base: "flex-start", md: "center"
                                        }} space={4} w="75%" maxW="300px">
                                            <Radio key='r1' value='1' colorScheme="green" size="lg">
                                                Sim
                                            </Radio>
                                            <Radio key='r2' value='0' colorScheme="green" size="lg">
                                                Nao
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_multiple_partners}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'vblt_is_migrant' in formik.errors}>
                                    <FormControl.Label>Migrante?</FormControl.Label>
                                    <Radio.Group onChange={(itemValue) => {
                                        formik.setFieldValue('vblt_is_migrant', itemValue);

                                    }} name="ex3" accessibilityLabel="pick a size">
                                        <Stack direction={{ base: "row", md: "row" }} alignItems={{
                                            base: "flex-start", md: "center"
                                        }} space={4} w="75%" maxW="300px">
                                            <Radio value='1' colorScheme="green" size="lg" my={1}>
                                                Sim
                                            </Radio>
                                            <Radio value='0' colorScheme="green" size="lg" my={1}>
                                                Nao
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_is_migrant}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'vblt_trafficking_victim' in formik.errors}>
                                    <FormControl.Label>Vítima de Tráfico?</FormControl.Label>
                                    <Radio.Group onChange={(itemValue) => {
                                        formik.setFieldValue('vblt_trafficking_victim', itemValue);

                                    }} name="ex4" accessibilityLabel="pick a size">
                                        <Stack direction={{ base: "row", md: "row" }} alignItems={{
                                            base: "flex-start", md: "center"
                                        }} space={4} w="75%" maxW="300px">
                                            <Radio value='1' colorScheme="green" size="lg" my={1}>
                                                Sim
                                            </Radio>
                                            <Radio value='0' colorScheme="green" size="lg" my={1}>
                                                Nao
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_trafficking_victim}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'vblt_sexual_exploitation' in formik.errors}>
                                    <FormControl.Label>Vítima de Exploração sexual?</FormControl.Label>
                                    <Radio.Group onChange={(itemValue) => {
                                        formik.setFieldValue('vblt_sexual_exploitation', itemValue);

                                    }} name="ex5" accessibilityLabel="pick a size">
                                        <Stack direction={{ base: "row", md: "row" }} alignItems={{
                                            base: "flex-start", md: "center"
                                        }} space={4} w="75%" maxW="300px">
                                            <Radio value='1' colorScheme="green" size="lg" my={1}>
                                                Sim
                                            </Radio>
                                            <Radio value='0' colorScheme="green" size="lg" my={1}>
                                                Nao
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_sexual_exploitation}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl >
                                    <FormControl.Label>Tempo</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.vblt_sexploitation_time}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('vblt_sexploitation_time', itemValue);
                                            }
                                        }}>
                                        <Picker.Item label="-- Seleccione --" value="0" />
                                        {
                                            ['Não', 'SIM ( + 3 meses)', 'SIM ( - 3 meses)'].map(item => (
                                                <Picker.Item key={item} label={'' + item} value={item} />
                                            ))
                                        }
                                    </Picker>
                                </FormControl>
                                <FormControl isRequired isInvalid={'vblt_vbg_victim' in formik.errors}>
                                    <FormControl.Label>Vítima de Violéncia Baseada no Gênero?</FormControl.Label>
                                    <Radio.Group onChange={(itemValue) => {
                                        formik.setFieldValue('vblt_vbg_victim', itemValue);

                                    }} name="ex6" accessibilityLabel="pick a size">
                                        <Stack direction={{ base: "row", md: "row" }} alignItems={{
                                            base: "flex-start", md: "center"
                                        }} space={4} w="75%" maxW="300px">
                                            <Radio value='1' colorScheme="green" size="lg" my={1}>
                                                Sim
                                            </Radio>
                                            <Radio value='0' colorScheme="green" size="lg" my={1}>
                                                Nao
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_vbg_victim}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl >
                                    <FormControl.Label>Tipo de Violéncia</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.vblt_vbg_type}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('vblt_vbg_type', itemValue);
                                            }
                                        }}>
                                        <Picker.Item label="-- Seleccione --" value="0" />
                                        {
                                            ['Física', 'Sexual', 'Psicológica'].map(item => (
                                                <Picker.Item key={item} label={'' + item} value={item} />
                                            ))
                                        }
                                    </Picker>
                                </FormControl>
                                <FormControl >
                                    <FormControl.Label>Tempo</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.vblt_vbg_time}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('vblt_vbg_time', itemValue);
                                            }
                                        }}>
                                        <Picker.Item label="-- Seleccione --" value="0" />
                                        {
                                            ['+3 Dias', '-3 Dias'].map(item => (
                                                <Picker.Item key={item} label={'' + item} value={item} />
                                            ))
                                        }
                                    </Picker>
                                </FormControl>
                                <FormControl isRequired isInvalid={'vblt_alcohol_drugs_use' in formik.errors}>
                                    <FormControl.Label>Uso de Álcool e Drogas?</FormControl.Label>
                                    <Radio.Group onChange={(itemValue) => {
                                        formik.setFieldValue('vblt_alcohol_drugs_use', itemValue);

                                    }} name="ex6" accessibilityLabel="pick a size">
                                        <Stack direction={{ base: "row", md: "row" }} alignItems={{
                                            base: "flex-start", md: "center"
                                        }} space={4} w="75%" maxW="300px">
                                            <Radio value='1' colorScheme="green" size="lg" my={1}>
                                                Sim
                                            </Radio>
                                            <Radio value='0' colorScheme="green" size="lg" my={1}>
                                                Nao
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_alcohol_drugs_use}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'vblt_sti_history' in formik.errors}>
                                    <FormControl.Label>Histórico de ITS?</FormControl.Label>
                                    <Radio.Group onChange={(itemValue) => {
                                        formik.setFieldValue('vblt_sti_history', itemValue);
                                    }} name="ex7" accessibilityLabel="pick a size">
                                        <Stack direction={{ base: "row", md: "row" }} alignItems={{
                                            base: "flex-start", md: "center"
                                        }} space={4} w="75%" maxW="300px">
                                            <Radio key='sti1' value='1' colorScheme="green" size="lg">
                                                Sim
                                            </Radio>
                                            <Radio key='sti2' value='0' colorScheme="green" size="lg" >
                                                Nao
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_sti_history}
                                    </FormControl.ErrorMessage>
                                </FormControl>

                                <FormControl isRequired isInvalid={'vblt_sex_worker' in formik.errors}>
                                    <FormControl.Label>Trabalhadora do Sexo?</FormControl.Label>
                                    <Radio.Group onChange={(itemValue) => {
                                        formik.setFieldValue('vblt_sex_worker', itemValue);

                                    }} name="ex8" accessibilityLabel="pick a size">
                                        <Stack direction={{ base: "row", md: "row" }} alignItems={{
                                            base: "flex-start", md: "center"
                                        }} space={4} w="75%" maxW="300px">
                                            <Radio value='1' colorScheme="green" size="lg" my={1}>
                                                Sim
                                            </Radio>
                                            <Radio value='0' colorScheme="green" size="lg" my={1}>
                                                Nao
                                            </Radio>
                                        </Stack>
                                    </Radio.Group>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.vblt_sex_worker}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                            </VStack>
                        </View>
                    </ProgressStep>
                </ProgressSteps>
            </View>
            {loading ?
                <Spinner
                    visible={true}
                    textContent={'Registando Beneficiario...'}
                    textStyle={styles.spinnerTextStyle}
                /> : undefined

            }
            <Center>
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>Contact Us</Modal.Header>
                        <Modal.Body>
                            <ScrollView>
                                <Box alignItems='center'>

                                <Ionicons name="md-checkmark-circle" size={100} color="#0d9488" />
                                <Alert w="100%" status="success">
                                <HStack space={2} flexShrink={1}>
                                    <Alert.Icon mt="1"  />
                                    <Text fontSize="sm" color="coolGray.800">
                                        Beneficiaria Registada com Sucesso!
                                    </Text>
                                </HStack>
                                </Alert>
                               
                                    
                                    <Text marginTop={3} marginBottom={3}>
                                        NID da Beneficiaria:
                                        <Text fontWeight='bold' color='#008D4C' >  
                                        {
                                            ` ${newNui}`
                                        }
                                        </Text>
                                    </Text>
                                    <Divider />
                                    <Text >
                                        Pretende Registar os Critérios de Eligibilidade Específicos agora?
                                    </Text>            
                                </Box>
                                
                            </ScrollView>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                    setShowModal(false);
                                    navigationRef.goBack();
                                }}>
                                    Não
                                </Button>
                                <Button onPress={() => {
                                    setShowModal(false);
                                }}>
                                    Sim 
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </Center>
        </>
    );
}
export default BeneficiaryForm;