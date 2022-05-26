import React, { useState, useEffect } from "react";
import { View, KeyboardAvoidingView, ScrollView,
    TouchableOpacity, Text, TouchableHighlight} 
    from 'react-native';
import { Box, HStack, AspectRatio, Center, 
    Image, Stack, Heading, Divider, Avatar, 
    Icon, Flex, Spacer, VStack, Button, Pressable} 
    from "native-base";
import { parse } from 'qs';
import withObservables from '@nozbe/with-observables';
import { MaterialIcons, Ionicons } from "@native-base/icons";
import { navigate } from '../../../routes/NavigationRef';
import { database } from '../../../database';
import { Q } from "@nozbe/watermelondb";
import styles from './styles';

const ViewBeneficiaries: React.FC = ({ route }:any) => {
    const {beneficiarie,
        subServices
        } = route.params;

    const age = (data : any) => {
        const now = new Date();
        const birth = new Date(data);
        const m = now.getMonth() - birth.getMonth();
        let age = now.getFullYear() - birth.getFullYear();
    
        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) 
        {
            age--;
        }

        return age;
    };

    return (
        <KeyboardAvoidingView  style={styles.background}>
            <ScrollView>
                <View style={styles.user}>
                    <View style={styles.containerForm}>
                        <Box style={styles.userLogo}>
                            <Avatar color="white" bg={'primary.500'} size={150}>
                                {
                                    (beneficiarie.gender==="1") ?
                                        <Icon as={Ionicons} name="man" color="white" size={70} />                        
                                    : 
                                    (beneficiarie.gender==="2") ? 
                                        <Icon as={Ionicons} name="woman" color="white" size={70} />                            
                                    : 
                                        <Icon as={Ionicons} name="person" color="white" size={70} />                                                                   
                                }    
                            </Avatar>
                            <Box style={styles.userText}>  
                                <Text>{ beneficiarie.username }</Text> 
                                <Heading style={styles.username}>{ beneficiarie.name } { beneficiarie.surname }</Heading>    
                                <Text style={styles.nui}>
                                    { beneficiarie.nui }  
                                </Text>                                              
                            </Box> 
                        </Box>
                        <Flex direction="column" mb="2.5" _text={{color: "coolGray.800"}}>
                        
                        <Box bg="primary.500" p="2" rounded="lg">
                        <Heading size="md" color="white">Detalhes da Beneficiaria</Heading> 
                        <Divider />
                            <Text style={styles.txtLabelInfo}> 
                                <Text style={styles.txtLabel}> Idade: </Text> 
                                {
                                    age(beneficiarie.date_of_birth)+" Anos"
                                }
                            </Text>

                            <Text style={styles.txtLabelInfo}> 
                                <Text style={styles.txtLabel}> Nivel: </Text> 
                                {
                                    beneficiarie.grade+"ª Classe"
                                }
                            </Text>

                            <Text style={styles.txtLabelInfo}> 
                                <Text style={styles.txtLabel}> Escola: </Text> 
                                {
                                    beneficiarie.school_name
                                }
                            </Text>

                            <Text style={styles.txtLabelInfo}> <Text style={styles.txtLabel}>Telemóvel: </Text> { beneficiarie.phone_number }</Text>
                            
                            <Text style={styles.txtLabelInfo}> <Text style={styles.txtLabel}>Ponto de Entrada: </Text>
                            { 
                                (beneficiarie.entry_point==="1") ?
                                    "Unidade Sanitaria"
                                    : 
                                (beneficiarie.entry_point==="2") ? 
                                    "Escola"
                                    : 
                                    "Comunidade"                                            
                                }  
                            </Text>
                            </Box>
                        </Flex>

                        <Box bg="primary.500" p="2" rounded="md" mt="1%">
                        <Heading size="md" color="white">Servicos</Heading> 
                        <Divider />   
                                
                            {                                
                                subServices.map((item)=>
                                    <Text style={styles.subServices} key={item.id.toString()}>
                                        { item.name } 
                                        <Pressable px={4} ml="auto" bg="lightBlue.700" justifyContent="center" 
                                                        onPress={()=> "viewUser(data)"} 
                                                        _pressed={{opacity: 0.5}}
                                        >
                                            <Icon as={MaterialIcons} name="remove-red-eye" size={6} color="gray.200" />
                                        </Pressable> 
                                    </Text>
                                )
                            }

                            <Stack direction="row" space={3}>
                                <Button mt="3" colorScheme="success" ml="85%" onPress={() => navigate({name: "BeneficiarieServiceForm", params: {beneficiarie: beneficiarie}})}>
                                    <Icon as={MaterialIcons} name="add" size={5} color="gray.200"/>
                                </Button>
                            </Stack>
                        </Box>   

                    </View>
                    
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default ViewBeneficiaries;