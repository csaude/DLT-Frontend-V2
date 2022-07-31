import React, { useEffect, useState, useContext } from 'react';
import { TouchableHighlight, TouchableOpacity } from 'react-native';
import { View, HStack, Text, VStack, FormControl, Input, Stack, InputGroup, InputLeftAddon, TextArea, Center, Icon, Box, IconButton, Flex, Heading, Divider, Button } from 'native-base';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "@native-base/icons";
import { useFormik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import { Q } from "@nozbe/watermelondb";
import ModalSelector from 'react-native-modal-selector-searchable';
import StepperButton from '../../Beneficiarias/components/StapperButton';
import { database } from '../../../database';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import styles from './styles';

const BeneficiaryForm: React.FC = ({ route }: any) => {
    const [errors, setErrors] = useState(false);
    const [provinces, setProvinces] = useState<any>([]);
    const [districts, setDistricts] = useState<any>([]);
    const [localities, setLocalities] = useState<any>([]);
    const [neighborhoods, setNeighborhoods] = useState<any>([]);
    const [isDatePickerVisible2, setIsDatePickerVisible2] = useState(false);
    const [datePickerValue2, setDatePickerValue2] = useState<any>(new Date());
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [datePickerValue, setDatePickerValue] = useState<any>(new Date());


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
        /*const errorsList = validate(formik.values);
        const hasErrors = JSON.stringify(errorsList) !== '{}';

        if (hasErrors) {
            setErrors(true);
        } else {
            setErrors(false);
        }*/
    };

    const validate = (values: any) => {
        const errors: any = {};
        let errorMessage = 'Obrigatório';

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
        return errors;
    }

    const validate2 = (values: any) => {
        const errors: any = {};
        let errorMessage = 'Obrigatório';

        if (!values.surname) {
            errors.surname = errorMessage;
        }

        return errors;
    }

    const handleSubmit = async (values?: any) => {
        console.log(formik.values);
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
            Q.where('locality_id', locId)
        ).fetch();
        const neiSerialized = getNeiList.map(item => item._raw);
        setNeighborhoods(neiSerialized);
    }

    return (
        <>
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <ProgressSteps >
                    <ProgressStep label="Dados Pessoais" onNext={onNextStep} errors={errors} >
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
                                    <HStack w="100%"  flex={1} space={5} alignItems="center"  >
                                    <InputGroup  w={{ base: "70%", md: "285" }}>
                                    <InputLeftAddon>
                                        <Button style={{ width: 10 }} onPress={() => showDatepicker()}> </Button>
                                        </InputLeftAddon>
                                    <Input isDisabled w={{ base: "70%", md: "100%"}} 
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
                                    <HStack w="100%"  flex={1} space={5} alignItems="center"  >
                                    <InputGroup  w={{ base: "70%", md: "285" }}>
                                    <InputLeftAddon>
                                        <Button style={{ width: 10 }} onPress={() => showDatepicker2()}> </Button>
                                        </InputLeftAddon>
                                    <Input isDisabled w={{ base: "70%", md: "100%"}} 
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
                                        selectedValue={formik.values.locality}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('locality', itemValue);
                                                onChangeLocalities(itemValue);
                                            }
                                        }
                                        }>

                                        <Picker.Item label="-- Seleccione o Posto Administrativo --" value="0" />
                                        {
                                            localities.map(item => (
                                                <Picker.Item key={item.online_id} label={item.name} value={item.online_id} />
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
                    <ProgressStep label="Critérios de Eligibilidade Gerais">
                        <Text color="coolGray.500" >Não existe!</Text>
                    </ProgressStep>
                    <ProgressStep label="Critérios de Eligibilidade Específicos" onSubmit={handleSubmit} >
                        <Text color="coolGray.500" >Não existe!</Text>
                    </ProgressStep>
                </ProgressSteps>
            </View>
        </>
    );
}
export default BeneficiaryForm;