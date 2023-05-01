import React, { useEffect, useState, useContext } from 'react';
import {
    View, KeyboardAvoidingView, ScrollView,
    TextInput, TouchableOpacity, Platform,
}
    from 'react-native';
import {
    Center, Box, Select, Text, Heading, VStack, FormControl,
    Input, Link, Button, CheckIcon, WarningOutlineIcon, HStack, Checkbox,
    Alert, Flex, useToast, Stack, InputGroup, InputLeftAddon, InputRightAddon, Radio, IconButton, CloseIcon
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
import { MENTOR } from '../../../utils/constants';
import MyDatePicker from '../../../components/DatePicker';

const BeneficiarieServiceForm: React.FC = ({ route, us, services, subServices }: any) => {
    const { beneficiarie, intervs, intervention, isNewIntervention } = route.params;

    const areaServicos = [{ "id": '1', "name": "Serviços Clinicos" }, { "id": '2', "name": "Serviços Comunitarios" }];
    const [entryPoints, setEntryPoints]  = useState([{ "id": '1', "name": "US" }, { "id": '2', "name": "CM" }, { "id": '3', "name": "ES" }]);

    const userDetailsCollection = database.get('user_details')

    const [date, setDate] = useState(new Date());
    const [users, setUsers] = useState<any>([]);
    const [selectedUser, setSelectedUser] = useState<any>("");
    const [checked, setChecked] = useState(false);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [text, setText] = useState('');
    const [uss, setUss] = useState<any>([]);
    const [isClinicalOrCommunityPartner, setClinicalOrCommunityPartner]= useState(false);
    const [organization, setOrganization] = useState<any>([]);
    const [currentInformedProvider, setCurrentInformedProvider] = useState('') ;
    const [servicesState,setServicesState] = useState<any>([]);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);

        setText(selectedDate);
    }

    const handleDataFromDatePickerComponent=(selectedDate) =>{

        selectedDate.replaceAll('/', '-')
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

    const getPartner = async() => {
        const partners = await database.get('partners').query(
            Q.where('online_id', parseInt(loggedUser.partner_id))
        ).fetch();
        const partnerSerialied = partners.map(item => item._raw)[0];
        setOrganization(partnerSerialied);
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

    const avanteEstudanteOnlineIds = [45,48,51];
    const avanteRaparigaOnlineIds = [44,47,50];
    const guiaFacilitacaoOnlineIds = [46,49,52];

    useEffect(() => {
     
        if (mounted) {
            setServicesState(services)
            getPartner()  
            
            const disableRapariga =(hasFacilitacao)=> services.filter(service=>{  
                if(hasFacilitacao)            
                    return !avanteRaparigaOnlineIds.includes(service._raw.online_id) ;
                else    
                    return !avanteRaparigaOnlineIds.includes(service._raw.online_id )&& !guiaFacilitacaoOnlineIds.includes(service._raw.online_id);
            });

            const disableEstudante =(hasFacilitacao) =>  services.filter(service=>{              
                if(hasFacilitacao)     
                    return !avanteEstudanteOnlineIds.includes(service._raw.online_id) ;
                else    
                    return !avanteEstudanteOnlineIds.includes(service._raw.online_id) && !guiaFacilitacaoOnlineIds.includes(service._raw.online_id);
            })

            const disableEstudanteAndRapariga =   services.filter(service=>{              
                    return !avanteRaparigaOnlineIds.includes(service._raw.online_id) && !avanteEstudanteOnlineIds.includes(service._raw.online_id) ;
            })

            if(beneficiarie.vblt_is_student==1 && getBeneficiarieAge() < 15){                    
                if(getBeneficiarieAge()>= 14 && getBeneficiarieAge() < 15 ){      
                    const foundServices = disableRapariga(true); 
                    setServicesState(foundServices)
                }else{
                    const foundServices = disableRapariga(false)    
                    setServicesState(foundServices)       
                }
            }
            else if(beneficiarie.vblt_is_student == 0 && getBeneficiarieAge() < 15){               
                if(getBeneficiarieAge() >= 14 && getBeneficiarieAge() < 15 ){
                    const foundServices = disableEstudante(true);    
                    setServicesState(foundServices)
                }else{
                    const foundServices = disableEstudante(false)   
                    setServicesState(foundServices)
                }                     
            }
            else if(getBeneficiarieAge() > 15){
                const foundServices = disableEstudanteAndRapariga
                setServicesState(foundServices)
            }
            
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

                onChangeEntryPoint(intervention.entry_point);
                onChangeUs(intervention.us_id)

                initValues = {
                    areaServicos_id: selService._raw.service_type,
                    service_id: selService._raw.online_id,
                    beneficiary_id: beneficiarie.online_id,
                    sub_service_id: intervention.sub_service_id,
                    result: intervention.result,
                    date: intervention.date,
                    us_id: selUs.online_id,
                    activist_id: loggedUser.online_id,
                    entry_point: intervention.entry_point,
                    provider: intervention.provider,
                    remarks: intervention.remarks,
                    status: '1'
                }

                setText(intervention.date);
                setDate(new Date(intervention.date));

            } else {
                initValues = {
                    areaServicos_id: '',
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

    const getBeneficiarieAge = ()=>{
        return new Date().getFullYear() - new Date(beneficiarie.date_of_birth).getFullYear();;
    }

    const message = "Este campo é Obrigatório";


    const showToast = (status, message, description) => {
        return toast.show({
            placement: "top",
            render: () => {
                return (
                    <Alert w="100%" status={status}>
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
                    intervention.activist_id = loggedUser.online_id
                    intervention.entry_point = values.entry_point
                    intervention.provider = values.provider
                    intervention.remarks = values.remarks
                    intervention.status = 1
                    intervention._status = "updated"
                })
                showToast('success','Actualizado', 'Serviço actualizado com sucesso!');
                return updatedIntervention;
            } else {
                const newIntervention = await database.collections.get('beneficiaries_interventions').create((intervention: any) => {
                    intervention.beneficiary_id = beneficiarie.online_id 
                    intervention.beneficiary_offline_id = beneficiarie.id
                    intervention.sub_service_id = values.sub_service_id
                    intervention.result = values.result
                    intervention.date = '' + text
                    intervention.us_id = values.us_id
                    intervention.activist_id = loggedUser.online_id
                    intervention.entry_point = values.entry_point
                    intervention.provider = values.provider
                    intervention.remarks = values.remarks
                    intervention.status = 1
                });
                showToast('success','Provido', 'Serviço provido com sucesso!');
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

    useEffect(()=>{
        if(organization?.partner_type !==undefined  && (organization?.partner_type==1 || organization?.partner_type==2))
            {    
                setClinicalOrCommunityPartner(true);                       

                if(isNewIntervention){
                    setCurrentInformedProvider(loggedUser?.name+' '+loggedUser?.surname)   
                    if(loggedUser?.entry_point !== undefined){
                        onChangeEntryPoint(loggedUser?.entry_point);
                    }
                    if(organization?.partner_type==1){
                        setInitialValues({
                            areaServicos_id: '1',
                            entry_point: loggedUser?.entry_point,
                            provider: loggedUser?.online_id,
                        })
                    }
                    else if(organization?.partner_type==2){
                        setInitialValues({
                            areaServicos_id: '2',
                            entry_point: loggedUser?.entry_point ,
                            provider: loggedUser?.online_id,
                        })
                    }
                }
            }else{
                setClinicalOrCommunityPartner(false);
            }       
    },[ users, organization, loggedUser] )

    useEffect(()=>{        
        if(isNewIntervention || intervention?.provider===''|| intervention?.provider===undefined || intervention?.provider===null) {
            setCurrentInformedProvider("Selecione o Provedor" )
        }
        else {
            const user = users.filter(user=>{
                return user.online_id == intervention?.provider
            })[0]
            if(user)
            {
                setCurrentInformedProvider(user?.name+' '+user?.surname)
            }
            else
            {
                setCurrentInformedProvider(intervention?.provider+'')
            }
        }        
        
    },[users, intervention]) 

    useEffect(()=>{
        if(isNewIntervention && isClinicalOrCommunityPartner){
            setCurrentInformedProvider(loggedUser?.name+' '+loggedUser?.surname) 
        }
    },[onChangeUs,beneficiarie])

    useEffect(()=>{
        const validateLoggedUser =async ()=>{
            const userDetailsQ = await userDetailsCollection.query(
                                Q.where('user_id', loggedUser.online_id)
                            ).fetch();
            const userDetailRaw = userDetailsQ[0]?._raw            
            const isMentora = userDetailRaw?.profile_id == MENTOR ? true : false;
            
            if(isMentora){
                setEntryPoints([{ "id": '2', "name": "CM" }, { "id": '3', "name": "ES" }]);
            }
        }
        validateLoggedUser().catch(err=>console.error(err))
    },[])

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
                                onSubmit={onSubmit} 
                                validate={validate} 
                                enableReinitialize={true}
                                validateOnChange={false}
                                validateOnBlur={false}
                            >
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
                                                enabled={isNewIntervention && !isClinicalOrCommunityPartner}
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
                                                    servicesState.filter((e) => {
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
                                                    entryPoints.map(item => (
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
                                            <HStack alignItems="center">
                                                <InputGroup w={{
                                                    base: "70%",
                                                    md: "285",
                                                }}>
                                                    <InputLeftAddon>
                                                        <MyDatePicker onDateSelection={e=>handleDataFromDatePickerComponent(e)} minDate={new Date('2017-01-01')} maxDate={new Date()}/>
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
                                                    <Input type='text' onBlur={handleBlur('provider')} placeholder={currentInformedProvider}  onChangeText={handleChange('provider')} value={selectedUser} />
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
