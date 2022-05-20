import React, { useEffect, useState, useContext } from 'react';
import { View, KeyboardAvoidingView, ScrollView,
    TextInput, TouchableOpacity, Platform,
    } 
    from 'react-native';
import { Center, Box, Select, Text, Heading, VStack, FormControl, 
        Input, Link, Button, CheckIcon, WarningOutlineIcon, HStack, 
        Alert, Flex, useToast, Stack, InputGroup, InputLeftAddon, InputRightAddon}
    from 'native-base';  

import DateTimePicker from '@react-native-community/datetimepicker';
import { stringify } from 'qs';
import {Picker} from '@react-native-picker/picker';
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

const beneficiarieServiceForm: React.FC = ({ route, localities, profiles, us, partners, services, subServices }:any) => {    // console.log(route.params);
    const {beneficiarie} = route.params;

    const areaServicos = [{"id":'1',"name": "Serviços Clinicos"},{"id":'2',"name": "Serviços Comunitarios"}];
    const [areaServicos_id, setAreaServicos_id] = useState('');
    const [service_id, setService_id] = useState('');

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [text, setText]= useState('');

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);

        let tempDate = new Date(currentDate);
        let fDate = tempDate.getDate() + '/' + (tempDate.getMonth()+1) + '/' + tempDate.getFullYear();
        setText(fDate);

        console.log(fDate);
    }

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    
    const showDatepicker = () => {
        showMode('date');
      };

    const [loading, setLoading] = useState(false);
    const [savedIntervention, setSavedIntervention] = useState<any>(null);
    const [savedUser, setSavedUser] = useState<any>(null);
    const loggedUser:any = useContext(Context);
    const intervention = new Beneficiaries_interventions;
    let mounted = true; // prevent error:  state update on an unmounted component
    const toast = useToast();
    const [initialValues, setInitialValues] = useState({
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
                                                        status: ''
                                                    });
    const message = "Este campo é Obrigatório"

      
    const validate = (values: any) => {
        const errors: BeneficiariesInterventionsModel = {};

        if (!values.beneficiary_id) {
            errors.beneficiary_id = message;
        }

        if (!values.service_id) {
            errors.id = message;                    // Por revisar (Temporario)
        }

        if (!values.areaServicos_id) {
            errors.id = message;                   // Por revisar
        }

        if (!values.sub_service_id) {
            errors.sub_service_id = message;
        }

        if (!values.date) {
            errors.date = message;
        }

        if (!values.us_id) {
            errors.us_id = message;
        }
        
        if (!values.activist_id) {
            errors.activist_id = message;
        }

        if (!values.entry_point) {
            errors.entry_point = message;
        }

        return errors;
    }

    const onSubmit = async (values: any) => {
        setLoading(true);
        
        const localityName = localities.filter((e)=>{ return e._raw.online_id == values.locality_id})[0]._raw.name;
        const profileName = profiles.filter((e)=>{ return e._raw.online_id == values.profile_id})[0]._raw.name;
        const partnerName = partners.filter((e)=>{ return e._raw.online_id == values.partner_id})[0]._raw.name;
        const usName = us.filter((e)=>{ return e._raw.online_id == values.us_id})[0]._raw.name;

        const newObject = await database.write(async () => {
            
            const newIntervention = await database.collections.get('beneficiaries_interventions').create((intervention:any) => {
                
                intervention.beneficiary_id = values.beneficiary_id
                intervention.sub_service_id = values.sub_service_id
                intervention.result = values.result
                intervention.date = values.date
                intervention.us_id = values.us_id
                intervention.activist_id = values.activist_id
                intervention.entry_point = values.entry_point
                intervention.provider = values.provider
                intervention.remarks = values.remarks
                intervention.status = "1"
                intervention.online_id = values.online_id

            });

            toast.show({placement:"bottom", title:"Intervention Saved Successfully: "+newIntervention._raw.id});

            return newIntervention;
        });
    
        navigate({name: "BeneficiariesView", params: {intervation: newObject._raw,
            beneficiarie: beneficiarie,
            locality: localityName,
            profile: profileName,
            partner: partnerName,
            us: usName }
        });
        
                                        
        setLoading(false);
        sync({username: loggedUser.username})
                .then(() => toast.show({
                                placement: "top", 
                                render:() => {
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
                .catch(() => toast.show({
                                placement: "top",
                                render:() => {
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
    }



    return (
        <KeyboardAvoidingView>
            <ScrollView>
                <View style={styles.webStyle}>
                    <Center w="100%" bgColor="white">
                        <Box safeArea p="2" w="90%" py="8">
                            <Heading size="lg" color="coolGray.800" 
                                    _dark={{ color: "warmGray.50"}} 
                                    fontWeight="semibold"
                                    marginBottom={5}
                                    marginTop={0} >
                                Prover Servico
                            </Heading>
                            <Alert  status="info" colorScheme="info">
                                <HStack flexShrink={1} space={2} alignItems="center">
                                    <Alert.Icon />
                                    <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
                                        Preencha os campos abaixo para prover um servico a Beneficiaria!
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
                                        
                                        <FormControl>
                                            <FormControl.Label>Área de Serviços</FormControl.Label>
                                            <Picker 
                                                style={styles.dropDownPicker}
                                                selectedValue={values.areaServicos_id}
                                                onValueChange={(itemValue, itemIndex) => { 
                                                        if (itemIndex !== 0){
                                                            setFieldValue('areaServicos_id', itemValue);
                                                        }
                                                    }
                                                }>

                                                <Picker.Item label="-- Seleccione a Área do Serviço --" value="0" />
                                                { 
                                                    areaServicos.map(item => (
                                                        <Picker.Item key={item.id} label={item.name} value={parseInt(item.id)} />
                                                    ))
                                                }  
                                            </Picker>
                                        </FormControl>
                                        <FormControl isRequired isInvalid={'service_id' in errors}>
                                            <FormControl.Label>Serviços</FormControl.Label>
                                            <Picker 
                                                style={styles.dropDownPicker}
                                                selectedValue={values.service_id}
                                                onValueChange={(itemValue, itemIndex) => { 
                                                        if (itemIndex !== 0){
                                                            console.log(itemValue);
                                                            setFieldValue('service_id',''+itemIndex);
                                                        }
                                                    }
                                                }>

                                                <Picker.Item label="-- Seleccione o Servico --" value="0" />
                                                {                                                     
                                                    services.filter((e)=>{
                                                        return e.service_type == values.areaServicos_id}
                                                    ).map(item => (
                                                        <Picker.Item key={item.online_id} label={item.name} value={''+item.online_id} />
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
                                                selectedValue={values.us_id}
                                                onValueChange={(itemValue, itemIndex) => { 
                                                        if (itemIndex !== 0){
                                                            setFieldValue('sub_service_id', itemValue);
                                                        }
                                                    }
                                                }>
                                                <Picker.Item label="-- Seleccione o Serviço --" value="0" />
                                                { 
                                                    subServices.filter((e)=>{
                                                        return e.service_id == values.service_id}
                                                    ).map(item => (
                                                        <Picker.Item key={item.online_id} label={item.name} value={parseInt(item.online_id)} />
                                                    ))
                                                }  
                                            </Picker>
                                            <FormControl.ErrorMessage>
                                                {errors.sub_service_id}
                                            </FormControl.ErrorMessage>
                                        </FormControl>
                                        <FormControl isRequired isInvalid={'date' in errors}>
                                            <FormControl.Label>Data</FormControl.Label>
                                                
                                                {/* <Text>{text}</Text> */}
                                                {/* <View style={{margin:50, width:10}}>
                                                    <Button style={{width:10}} title="DataPicker" onPress={() => showDatepicker()}/>
                                                </View> */}
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
                                                                <Button style={{width:10}} onPress={() => showDatepicker()}>
                                                                </Button>
                                                            </InputLeftAddon> 
                                                            <Input isDisabled
                                                            w={{
                                                                base: "70%",
                                                                md: "100%"
                                                            }} value={text}
                                                            placeholder="dd/M/yyyy" />
                                                        </InputGroup>
                                                        </Stack>





                                            {/* <DatePicker modal date={date} onDateChange={setDate} /> */}
                                            {/* <Input onClick={() => setOpen(true)}  value={values.name} />
                                                <DatePicker
                                                    modal
                                                    open={open}
                                                    date={date}
                                                    onConfirm={(date) => {
                                                    setOpen(false)
                                                    setDate(date)
                                                    }}
                                                    onCancel={() => {
                                                    setOpen(false)
                                                    }}
                                                /> */}

                                                {/* <Input onBlur={handleBlur('phone_number')} placeholder="Insira o seu Telemóvel" onChangeText={handleChange('phone_number')} value={values.phone_number} /> */}
                                         
                                            <FormControl.ErrorMessage>
                                                {errors.date}
                                            </FormControl.ErrorMessage>
                                        </FormControl>
                                        <FormControl isRequired isInvalid={'us_id' in errors}>
                                            <FormControl.Label>US</FormControl.Label>
                                            <Picker 
                                                style={styles.dropDownPicker}
                                                selectedValue={values.us_id}
                                                onValueChange={(itemValue, itemIndex) => { 
                                                        if (itemIndex !== 0){
                                                            setFieldValue('us_id', itemValue);
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
                                                { errors.us_id }
                                            </FormControl.ErrorMessage>
                                        </FormControl>
                                        <FormControl isRequired isInvalid={'activist_id' in errors}>
                                            <FormControl.Label>Activist_id</FormControl.Label>
                    
                                            <Input onBlur={handleBlur('activist_id')} placeholder="Insira o seu Nome" onChangeText={handleChange('name')} value={values.activist_id} />
                                            <FormControl.ErrorMessage>
                                                { errors.activist_id }
                                            </FormControl.ErrorMessage>
                                        </FormControl>
                                        
                                        <FormControl isRequired isInvalid={'entry_point' in errors}>
                                            <FormControl.Label>Ponto de Entrada</FormControl.Label>
                                            <Picker 
                                                style={styles.dropDownPicker}
                                                selectedValue={values.entry_point}
                                                onValueChange={(itemValue, itemIndex) => { 
                                                        if (itemIndex !== 0){
                                                            setFieldValue('entry_point', itemValue);
                                                        }
                                                    }
                                                }>
                                                <Picker.Item label="-- Seleccione o Ponto de Entrada --" value="0" />
                                                <Picker.Item label="Unidade Sanitaria" value="1" />
                                                <Picker.Item label="Escola" value="2" />
                                                <Picker.Item label="Comunidade" value="3" />
                                            </Picker>
                                            <FormControl.ErrorMessage>
                                                {errors.entry_point}
                                            </FormControl.ErrorMessage>
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
export default enhance(beneficiarieServiceForm);
