import React, { useState, useEffect, useContext } from "react";
import { View, KeyboardAvoidingView, ScrollView, Text } from 'react-native';
import { Box, Heading, Divider, Avatar, Icon, Flex } from "native-base";
import { Context } from '../../../routes/DrawerNavigator';
import { Ionicons } from "@native-base/icons";
import styles from './styles';

const DadosReferenciaView: React.FC = ({ route }: any) => {

    const loggedUser: any = useContext(Context);

    const {
        reference,
        beneficiary,
        referer,
        notify,
        organization
    } = route.params;

    const maskName = loggedUser?.profile_id === 1 || loggedUser?.profile_id === 2 || loggedUser?.profile_id === 3 ||
                        loggedUser?.profiles?.id === 1 || loggedUser?.profiles?.id === 2 || loggedUser?.profiles?.id === 3 
    ? beneficiary.name + ' ' + beneficiary.surname 
    : 'DREAMS'+beneficiary.nui 

    return (
        <KeyboardAvoidingView style={styles.background}>
            <ScrollView>
                <View style={styles.user}>
                    <View style={styles.containerForm}>
                        <Box style={styles.userLogo}>
                            <Avatar color="white" bg={'primary.500'} size={150}>
                                {
                                    <Icon as={Ionicons} name="exit" color="white" size={70} />
                                }
                            </Avatar>
                            <Box style={styles.userText}>
                                {/* <Text>{reference.username}</Text> */}
                                {/* <Heading style={styles.username}>{beneficiary.name} {beneficiary.surname}</Heading> */}
                                <Text style={styles.nui}>
                                    {reference.reference_note} | {beneficiary.nui}
                                </Text>
                            </Box>
                        </Box>
                        <Flex direction="column" mb="2.5" _text={{ color: "coolGray.800" }}>
                            <Box bg="primary.500" p="2" rounded="lg">

                                <Heading size="md" color="white">Detalhes da Referência</Heading>
                                <Divider />
                                <Text style={styles.txtLabelInfo}> <Text style={styles.txtLabel}> Data: </Text> {reference.date_created} </Text>

                                <Text style={styles.txtLabelInfo}> <Text style={styles.txtLabel}> Referente: </Text> {maskName} </Text>

                                <Text style={styles.txtLabelInfo}> <Text style={styles.txtLabel}> Notificar a(o) : </Text> {notify} </Text>

                                <Text style={styles.txtLabelInfo}> <Text style={styles.txtLabel}> Contacto: </Text> {beneficiary.phone_number} </Text>

                                <Text style={styles.txtLabelInfo}> <Text style={styles.txtLabel}> No do Livro: </Text> {reference.book_number} </Text>

                                <Text style={styles.txtLabelInfo}> <Text style={styles.txtLabel}> Organização: </Text> {organization} </Text>

                                <Text style={styles.txtLabelInfo}> <Text style={styles.txtLabel}> Cod. Referência: </Text> {reference.reference_code} </Text>

                                <Text style={styles.txtLabelInfo}> <Text style={styles.txtLabel}> Tipo Serviço: </Text>
                                    {
                                        (reference.service_type === "1") ?
                                            "Serviços Clínicos"
                                            :
                                            "Serviços Comunitários"
                                    }
                                </Text>

                                <Text style={styles.txtLabelInfo}> <Text style={styles.txtLabel}> Status: </Text>
                                    {
                                        (reference.status === 0) ?
                                            "Pendente"
                                            :
                                            (reference.status === 1) ?
                                                "Atendida Parcialmente"
                                                :
                                                (reference.status === 2) ?
                                                    "Atendida"
                                                    :
                                                    "Cancelada"
                                    }
                                </Text>
                            </Box>
                        </Flex>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default DadosReferenciaView;