import React from "react";
import { View, KeyboardAvoidingView, ScrollView, Text } from "react-native";
import {
  Box,
  Stack,
  Heading,
  Divider,
  Avatar,
  Icon,
  Flex,
  Spacer,
  Button,
} from "native-base";
import { MaterialIcons, Ionicons } from "@native-base/icons";
import { navigate } from "../../../routes/NavigationRef";
import styles from "./styles";

const ViewBeneficiaries: React.FC = ({ route }: any) => {
  /*const { beneficiarie,
        subServices
    } = route.params;*/
  const { beneficiary, interventions } = route.params;

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
              {beneficiary.gender === "1" ? (
                <Avatar color="white" bg="blue.500">
                  <Icon as={Ionicons} name="man" color="white" size={70} />
                </Avatar>
              ) : beneficiary.gender === "2" ? (
                <Avatar color="white" bg="pink.500">
                  <Icon as={Ionicons} name="woman" color="white" size={70} />
                </Avatar>
              ) : (
                <Avatar color="white" bg="amber.500">
                  <Icon as={Ionicons} name="person" color="white" size={70} />
                </Avatar>
              )}
              <Box style={styles.userText}>
                <Text>{beneficiary.username}</Text>
                <Heading style={styles.username}>
                  {beneficiary.name} {beneficiary.surname}
                </Heading>
                <Text style={styles.nui}>{beneficiary.nui}</Text>
              </Box>
            </Box>
            <Flex direction="column" mb="2.5" _text={{ color: "coolGray.800" }}>
              <Box bg="primary.500" p="2" rounded="lg">
                <Heading size="md" color="white">
                  Detalhes da Beneficiaria
                </Heading>
                <Divider />
                <Text style={styles.txtLabelInfo}>
                  <Text style={styles.txtLabel}> Idade: </Text>
                  {age(beneficiary.date_of_birth) + " Anos"}
                </Text>

                <Text style={styles.txtLabelInfo}>
                  <Text style={styles.txtLabel}> Nivel: </Text>
                  {beneficiary.vblt_school_grade + "ª Classe"}
                </Text>

                <Text style={styles.txtLabelInfo}>
                  <Text style={styles.txtLabel}> Escola: </Text>
                  {beneficiary.vblt_school_name}
                </Text>

                <Text style={styles.txtLabelInfo}>
                  {" "}
                  <Text style={styles.txtLabel}>Telemóvel: </Text>{" "}
                  {beneficiary.phone_number}
                </Text>

                <Text style={styles.txtLabelInfo}>
                  {" "}
                  <Text style={styles.txtLabel}>Ponto de Entrada: </Text>
                  {beneficiary.entry_point === "1"
                    ? "Unidade Sanitaria"
                    : beneficiary.entry_point === "2"
                    ? "Escola"
                    : "Comunidade"}
                </Text>
              </Box>
              <Spacer />
              <Box bg="primary.500" p="2" rounded="md" mt="1%" marginTop={4}>
                <Heading size="md" color="white">
                  Serviços
                </Heading>
                <Divider />

                {
                  /*subServices.map((item) =>
                                        <>
                                            <View style={{
                                                paddingVertical: 15,
                                                paddingHorizontal: 10,
                                                flexDirection: "row",
                                                //justifyContent: "space-around",
                                                alignItems: "center"
                                            }}>

                                                <MaterialIcons name="medical-services" size={24} color="white" />
                                                <Text style={{ color: 'white' }} key={item.id.toString()}>
                                                    {item.name}
                                                </Text>
                                            </View>

                                        </>
                                    )*/
                  //return { id: subservice._raw.online_id, name: subservice._raw.name, intervention: e._raw }
                  interventions.map((item) => (
                    <View
                      key={item.id}
                      style={{
                        paddingVertical: 15,
                        paddingHorizontal: 10,
                        flexDirection: "row",
                        //justifyContent: "space-around",
                        alignItems: "center",
                      }}
                    >
                      <MaterialIcons
                        name="medical-services"
                        size={24}
                        color="white"
                      />
                      <Text style={{ color: "white" }} key={item.id.toString()}>
                        {item.name}
                      </Text>
                      <Button
                        onPress={() =>
                          navigate({
                            name: "BeneficiarieServiceForm",
                            params: {
                              beneficiarie: beneficiary,
                              intervention: item.intervention,
                              isNewIntervention: false,
                            },
                          })
                        }
                      >
                        <Icon
                          as={MaterialIcons}
                          name="edit"
                          size={5}
                          color="gray.200"
                        />
                      </Button>
                    </View>
                  ))
                }

                <Stack direction="row" space={3}>
                  <Button
                    mt="3"
                    colorScheme="success"
                    ml="85%"
                    onPress={() =>
                      navigate({
                        name: "BeneficiarieServiceForm",
                        params: {
                          beneficiarie: beneficiary,
                          isNewIntervention: false,
                        },
                      })
                    }
                  >
                    <Icon
                      as={MaterialIcons}
                      name="add"
                      size={5}
                      color="gray.200"
                    />
                  </Button>
                </Stack>
              </Box>
            </Flex>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ViewBeneficiaries;
