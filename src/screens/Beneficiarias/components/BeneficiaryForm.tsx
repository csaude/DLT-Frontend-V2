import React, { useEffect, useState, useContext } from 'react';
import { TouchableHighlight, TouchableOpacity } from 'react-native';
import { View, HStack, Text, VStack, FormControl, Input, Stack, InputGroup, InputLeftAddon, TextArea, Center, Icon, Box, IconButton, Flex, Heading, Divider, Button } from 'native-base';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "@native-base/icons";
import { useFormik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import { SwipeListView } from 'react-native-swipe-list-view';
import ModalSelector from 'react-native-modal-selector-searchable';
import StepperButton from '../../Beneficiarias/components/StapperButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import styles from './styles';

const BeneficiaryForm: React.FC = ({ route }: any) => {

    const [provinces, setProvinces] = useState<any>([]);
    const [districts, setDistricts] = useState<any>(undefined);
    const [localities, setLocalities] = useState<any>(undefined);
    const [neighborhoods, setNeighborhoods] = useState<any>(undefined);
    const [isDatePickerVisible2, setIsDatePickerVisible2] = useState(false);
    const [datePickerValue2, setDatePickerValue2] = useState<any>(new Date());
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [datePickerValue, setDatePickerValue] = useState<any>(new Date());

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
            partner_nui: ''
        },
        onSubmit: values => console.log(values),
        validate: values => validate(values)
    });

    const validate = (values: any) => {

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

    return (
        <>
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <ProgressSteps >
                    <ProgressStep label="Dados Pessoais" /*onNext={onNextStep} errors={errors}*/ >
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
                                    {isDatePickerVisible && (
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={datePickerValue}
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
                            </VStack>
                        </View>
                    </ProgressStep>
                    <ProgressStep label="Critérios de Eligibilidade Gerais">
                        <Text color="coolGray.500" >Não existe!</Text>
                    </ProgressStep>
                    <ProgressStep label="Critérios de Eligibilidade Específicos" /*onSubmit={handleSubmit}*/ >
                        <Text color="coolGray.500" >Não existe!</Text>
                    </ProgressStep>
                </ProgressSteps>
            </View>
        </>
    );
}
export default BeneficiaryForm;