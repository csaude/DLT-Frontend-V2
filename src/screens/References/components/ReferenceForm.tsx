import React, { useEffect, useState, useContext } from 'react';
import { TouchableHighlight, TouchableOpacity } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { View, HStack, Text, VStack, FormControl, Input, TextArea, Center, Icon, Box, IconButton } from 'native-base';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "@native-base/icons";
import { useFormik } from 'formik';
import { database } from '../../../database';
import { Q } from "@nozbe/watermelondb";
import { Picker } from '@react-native-picker/picker';
import { SwipeListView } from 'react-native-swipe-list-view';
import ModalSelector from 'react-native-modal-selector-searchable';
import StepperButton from '../../Beneficiarias/components/StapperButton';
import styles from './styles';

const ReferenceForm: React.FC = ({ }: any) => {
    const [errors, setErrors] = useState(false);
    const [partners, setPartners] = useState<any>([]);
    const [us, setUs] = useState<any>([]);
    const [users, setUsers] = useState<any>([]);
    const [selectedUser, setSelectedUser] = useState<any>("");
    const [services, setServices] = useState<any>([]);
    const [referServices, setReferServices] = useState<any>([]);

    const areaServicos = [{ "id": '1', "name": "Clinico" }, { "id": '2', "name": "Comunitario" }];

    const data = [{ key: 3, label: 'Bloor Apples' }, { key: 4, label: 'Blue Apples' }, { key: 5, label: 'Red Apples' }];


    useEffect(() => {

        const fetchUsData = async () => {
            const getUsList = await database.get('us').query().fetch();
            const usSerialized = getUsList.map(item => item._raw);
            setUs(usSerialized);
        }

        const fetchServices = async () => {
            const getServicesList = await database.get('services').query().fetch();
            const servicesSerialized = getServicesList.map(item => item._raw);
            setServices(servicesSerialized);
        }

        fetchUsData().catch(error => console.log(error));
        fetchServices().catch(error => console.log(error));
    }, []);

    const formik = useFormik({
        initialValues: {
            refer_to: '',
            book_number: '',
            reference_code: '',
            service_type: '',
            partner_id: '',
            us_id: '',
            notify_to: '',
            description: '',
            status: 1
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

        if (!values.book_number) {
            errors.book_number = 'Obrigatório';
        }

        if (!values.reference_code) {
            errors.reference_code = 'Obrigatório';
        }

        if (!values.service_type) {
            errors.service_type = 'Obrigatório';
        }

        if (!values.partner_id) {
            errors.partner_id = 'Obrigatório';
        }

        if (!values.us_id) {
            errors.us_id = 'Obrigatório';
        }

        if (!values.notify_to) {
            errors.notify_to = 'Obrigatório';
        }

        return errors;
    }

    const onChangeServiceType = async (value: any) => {


        const getPartnerList = await database.get('partners').query(
            Q.where('partner_type', value)
        ).fetch();
        const partnersSerialized = getPartnerList.map(item => item._raw);

        setPartners(partnersSerialized);
    }

    const onChangeUs = async (value: any) => {


        const getUsersList = await database.get('users').query(
            Q.where('us_id', value)
        ).fetch();
        const usersSerialized = getUsersList.map(item => item._raw);

        setUsers(usersSerialized);
    }

    const handleSubmit = async (values?: any) => {
        console.log(formik.values);
    }

    const onRemoveService = (value:any) => {

        setReferServices(refserv => refserv.filter(item => item.online_id !== value.online_id));
    }
    
    const onSelectService = (value: any) => {

        const exists = referServices.some(item => {
            return item.online_id === value.online_id;
        });

        if(!exists){
            setReferServices(refserv => [...refserv, value]);
        }
    }

    const renderItem = (data: any) => (
        <TouchableHighlight
            style={styles.rowFront}
            underlayColor={'#AAA'}
            key={data.online_id}
        >
            <HStack w="100%" px={4} flex={1}  space={5} alignItems="center" key={data.online_id}>
                <Ionicons name="medkit" size={35} color="#0d9488" />
                <VStack width='250px' >
                    <Text _dark={{
                        color: "warmGray.50"
                    }} color="darkBlue.800" >
                        {data.name}
                    </Text>
                </VStack>
                <IconButton size="sm" colorScheme="trueGray" onPress={()=>onRemoveService(data)} icon={<Icon as={Ionicons} name="trash" size="lg" color="trueGray.400" />} />
            </HStack>
            
        </TouchableHighlight>
    );

    return (
        <>
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <ProgressSteps >
                    <ProgressStep label="Dados da Referencia" onNext={onNextStep} errors={errors}>
                        <View style={{ alignItems: 'center' }}>
                            <VStack space={3} w="90%" >
                                <FormControl isRequired isInvalid={'refer_to' in formik.errors}>
                                    <FormControl.Label>Referir Para</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.refer_to}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('refer_to', itemValue);
                                            }
                                        }}>
                                        <Picker.Item label="-- Seleccione o PE --" value="0" />
                                        <Picker.Item key="1" label="US" value="1" />
                                        <Picker.Item key="2" label="ES" value="2" />
                                        <Picker.Item key="3" label="CM" value="3" />
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.refer_to}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'book_number' in formik.errors}>
                                    <FormControl.Label>Nº do Livro</FormControl.Label>
                                    <Input onBlur={formik.handleBlur('book_number')} placeholder="Insira o Nº do Livro" onChangeText={formik.handleChange('book_number')} value={formik.values.book_number} />
                                    <FormControl.ErrorMessage>
                                        {formik.errors.book_number}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'reference_code' in formik.errors}>
                                    <FormControl.Label>Códido de Referência no livro</FormControl.Label>
                                    <Input onBlur={formik.handleBlur('reference_code')} placeholder="Insira o Cód Ref. no livro" onChangeText={formik.handleChange('reference_code')} value={formik.values.reference_code} />
                                    <FormControl.ErrorMessage>
                                        {formik.errors.reference_code}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'service_type' in formik.errors}>
                                    <FormControl.Label>Tipo de Serviço</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.service_type}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('service_type', itemValue);
                                                onChangeServiceType(itemValue);
                                            }
                                        }
                                        }>

                                        <Picker.Item label="-- Seleccione o Tipo de Serviço --" value="0" />
                                        {
                                            areaServicos.map(item => (
                                                <Picker.Item key={item.id} label={item.name} value={item.id} />
                                            ))
                                        }
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.service_type}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'partner_id' in formik.errors}>
                                    <FormControl.Label>Organização</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.partner_id}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('partner_id', itemValue);

                                            }
                                        }
                                        }>

                                        <Picker.Item label="-- Seleccione a Organização --" value="0" />
                                        {
                                            partners.map(item => (
                                                <Picker.Item key={item.online_id} label={item.abbreviation} value={item.online_id} />
                                            ))
                                        }
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.partner_id}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'us_id' in formik.errors}>
                                    <FormControl.Label>Local</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.us_id}
                                        onValueChange={(itemValue, itemIndex) => {
                                            if (itemIndex !== 0) {
                                                formik.setFieldValue('us_id', itemValue);
                                                onChangeUs(itemValue);
                                            }
                                        }
                                        }>

                                        <Picker.Item label="-- Seleccione o Local --" value="0" />
                                        {
                                            us.map(item => (
                                                <Picker.Item key={item.online_id} label={item.name} value={item.online_id} />
                                            ))
                                        }
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.us_id}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl isRequired isInvalid={'notify_to' in formik.errors}>
                                    <FormControl.Label>Notificar ao</FormControl.Label>

                                    <ModalSelector
                                        data={users}
                                        keyExtractor={item => item.online_id}
                                        labelExtractor={item => `${item.name} ${item.surname}`}
                                        renderItem={undefined}
                                        initValue="Select something yummy!"
                                        accessible={true}
                                        cancelButtonAccessibilityLabel={'Cancel Button'}
                                        onChange={(option) => { setSelectedUser(`${option.name} ${option.surname}`); formik.setFieldValue('notify_to', '' + option.online_id); }}>
                                        <Input type='text' onBlur={formik.handleBlur('notify_to')} placeholder="Insira as Observações" onChangeText={formik.handleChange('notify_to')} value={selectedUser} />
                                    </ModalSelector>

                                    <FormControl.ErrorMessage>
                                        {formik.errors.notify_to}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl>
                                    <FormControl.Label>Observações</FormControl.Label>
                                    <TextArea onBlur={formik.handleBlur('description')} autoCompleteType={false} value={formik.values.description} onChange={formik.handleChange('description')} w="100%" />

                                </FormControl>
                                <FormControl isRequired isInvalid={'status' in formik.errors}>
                                    <FormControl.Label>Status</FormControl.Label>
                                    <Picker
                                        selectedValue={formik.values.status}
                                        onValueChange={(itemValue, itemIndex) => {
                                            formik.setFieldValue('status', itemValue);
                                        }
                                        }>
                                        <Picker.Item key={'1'} label={"Activo"} value={1} />
                                        <Picker.Item key={'2'} label={"Cancelado"} value={2} />
                                    </Picker>
                                    <FormControl.ErrorMessage>
                                        {formik.errors.status}
                                    </FormControl.ErrorMessage>
                                </FormControl>
                            </VStack>
                        </View>
                    </ProgressStep>
                    <ProgressStep label="Serviços Referidos">
                        <Box minH="300" >

                            <View >
                                <View style={styles.heading}>
                                    <Box alignItems="center" w="95%" bgColor="white" style={{ borderRadius: 5, }}>

                                        <ModalSelector
                                            data={services}
                                            keyExtractor={item => item.online_id}
                                            labelExtractor={item => item.name}
                                            renderItem={undefined}
                                            initValue="Seleccione Serviço a Associar"
                                            accessible={true}
                                            cancelButtonAccessibilityLabel={'Cancel Button'}
                                            onChange={(option) => { onSelectService(option); }}>
                                            <Input minW={390} InputLeftElement={<Icon as={MaterialIcons} name="add-circle" size={5} ml="2" color="muted.700" />}
                                                placeholder="Seleccione Serviço a Associar" style={{ borderRadius: 45 }} />
                                        </ModalSelector>
                                    </Box>

                                </View>
                                {referServices.length > 0 ?
                                    referServices.map((item, itemI) => renderItem(item))
                                    :
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text color="coolGray.500" >Não existem Serviços Associados!</Text>
                                    </View>
                                }
                            </View>




                        </Box>
                    </ProgressStep>
                    <ProgressStep label="Concluir" onSubmit={handleSubmit}>
                        <View style={{ alignItems: 'center' }}>
                            <Text>This is the content within step 3!</Text>
                        </View>
                    </ProgressStep>
                </ProgressSteps>

            </View>
        </>
    );
}
export default ReferenceForm;