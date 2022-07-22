import React, { useState, useEffect } from "react";
import { View, KeyboardAvoidingView, ScrollView, Text } from 'react-native';
import { Box, Heading, Divider, Avatar, Icon, Flex } from "native-base";
import { Ionicons } from "@native-base/icons";
import styles from './styles';

const DadosPessoaisView: React.FC = ({ route }: any) => {

    const {
        beneficiary,
        interventions
    } = route.params;

    const age = (data: any) => {
        const now = new Date();
        const birth = new Date(data);
        const m = now.getMonth() - birth.getMonth();
        let age = now.getFullYear() - birth.getFullYear();

        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    };

    return (
        <KeyboardAvoidingView style={styles.background}>
            <ScrollView>
                <View style={styles.user}>
                    <View style={styles.containerForm}>
                        <Box style={styles.userLogo}>
                            <Avatar color="white" bg={'primary.500'} size={150}>
                                {
                                    (beneficiary.gender === "1") ?
                                        <Icon as={Ionicons} name="man" color="white" size={70} />
                                        :
                                        (beneficiary.gender === "2") ?
                                            <Icon as={Ionicons} name="woman" color="white" size={70} />
                                            :
                                            <Icon as={Ionicons} name="person" color="white" size={70} />
                                }
                            </Avatar>
                            <Box style={styles.userText}>
                                <Text>{beneficiary.username}</Text>
                                <Heading style={styles.username}>{beneficiary.name} {beneficiary.surname}</Heading>
                                <Text style={styles.nui}>
                                    {beneficiary.nui}
                                </Text>
                            </Box>
                        </Box>
                        <Flex direction="column" mb="2.5" _text={{ color: "coolGray.800" }}>
                            <Box bg="primary.500" p="2" rounded="lg">



                                <Heading size="md" color="white">Detalhes da Beneficiaria</Heading>
                                <Divider />
                                <Text style={styles.txtLabelInfo}>
                                    <Text style={styles.txtLabel}> Idade: </Text>
                                    {
                                        age(beneficiary.date_of_birth) + " Anos"
                                    }
                                </Text>

                                <Text style={styles.txtLabelInfo}>
                                    <Text style={styles.txtLabel}> Nivel: </Text>
                                    {
                                        beneficiary.vblt_school_grade + "ª Classe"
                                    }
                                </Text>

                                <Text style={styles.txtLabelInfo}>
                                    <Text style={styles.txtLabel}> Escola: </Text>
                                    {
                                        beneficiary.vblt_school_name
                                    }
                                </Text>

                                <Text style={styles.txtLabelInfo}> <Text style={styles.txtLabel}>Telemóvel: </Text> {beneficiary.phone_number}</Text>

                                <Text style={styles.txtLabelInfo}> <Text style={styles.txtLabel}>Ponto de Entrada: </Text>
                                    {
                                        (beneficiary.entry_point === "1") ?
                                            "Unidade Sanitaria"
                                            :
                                            (beneficiary.entry_point === "2") ?
                                                "Escola"
                                                :
                                                "Comunidade"
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

export default DadosPessoaisView;