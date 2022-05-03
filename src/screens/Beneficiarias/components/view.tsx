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

    return (
        <KeyboardAvoidingView  style={styles.background}>
            <ScrollView>
                <View style={styles.user}>
                    <View style={styles.containerForm}>
                        <Box style={styles.userLogo}>
                            <Avatar color="white" bg={'primary.700'} size={150}>
                                <Icon as={Ionicons} name="person-outline" color="white" size={70} />
                            </Avatar>
                            <Box style={styles.userText}>  
                                <Text>{ beneficiarie.username }</Text> 
                                <Heading style={styles.username}>{ beneficiarie.name } { beneficiarie.surname }</Heading>    
                                <Text>{ beneficiarie.phone_number }</Text>                                              
                            </Box> 
                        </Box>
                        <Text style={styles.txtLabel}>Detalhes do Utilizador</Text>
                        <Divider />
                        <Flex direction="column" mb="2.5" mt="1.5" _text={{color: "coolGray.800"}}>

                            <Text> <Text style={styles.txtLabel}>Telemóvel: </Text> { beneficiarie.phone_number }</Text>

                            <Text> <Text style={styles.txtLabel}>Ponto de Entrada: </Text>
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
                                
                            {/* <Text> <Text style={styles.txtLabel}>Localidade: </Text> {locality}</Text>
                                
                            <Text> <Text style={styles.txtLabel}>US: </Text> {us}</Text>
                                
                            <Text> <Text style={styles.txtLabel}>subServices: </Text> {subServices}</Text> */}
                        </Flex>
                        <Divider />
                        <Heading size="md" mb="2%" mt="5%">Servicos</Heading>                       
                        
                        {
                            subServices.map((item)=>
                                    <Text>{ item.name }</Text>
                            )
                        }

                        <Stack direction="row" space={3}>
                            <Button mt="5" colorScheme="primary" onPress={() => navigate({name: "BeneficiarieServiceForm", params: {beneficiarie: beneficiarie}})}>
                                <Icon as={MaterialIcons} name="add" size={5} color="gray.200"/> 
                            </Button>
                        </Stack>
                    </View>
                    
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default ViewBeneficiaries;