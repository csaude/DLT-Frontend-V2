import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  NativeBaseProvider,
  Center,
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  Select,
  WarningOutlineIcon,
  Stack,
  Flex,
  CheckIcon,
  View,
  Radio,
} from "native-base";

import { Formik } from "formik";

import { allPartners } from "@app/utils/partners";
import { allProfiles } from "@app/utils/profiles";
import { allLocality } from "@app/utils/locality";
import { allUs } from "@app/utils/uSanitaria";
import { add, edit } from "@app/utils/users";

import styles from "./styles";
import { useSelector } from "react-redux";

interface Profiles {
  id: string;
  name: string;
  description?: string;
}

interface Locality {
  id: string;
  district?: any;
  name: string;
  description?: string;
  status?: boolean;
  createdBy?: string;
  updatedBy?: string;
}

const UserForm: React.FC = () => {
  const { state }: any = useLocation();
  const paramUser: any = state ? state.user : null;

  const navigate = useNavigate();

  const [initialValues] = useState({
    surname: paramUser ? paramUser.surname : "",
    username: paramUser ? paramUser.username : "",
    password: paramUser ? paramUser.password : "",
    name: paramUser ? paramUser.name : "",
    email: paramUser ? paramUser.email : "",
    phoneNumber: paramUser ? paramUser.phoneNumber : "",
    entryPoint: paramUser ? paramUser.entryPoint : "",
    profile_id: paramUser ? String(paramUser.profiles.id) : "",
    partner_id: paramUser ? String(paramUser.partners.id) : "",
    locality_id: paramUser ? String(paramUser.locality.id) : "",
    us_id: paramUser ? String(paramUser.us.id) : "",
    status: paramUser ? paramUser.status : "1",
  });

  const [usList, setUsList] = useState<Locality[]>([]);
  const [partnersList, setPartnersList] = useState<Locality[]>([]);
  const [profilesList, setProfilesList] = useState<Locality[]>([]);
  const [localityList, setlocalityList] = useState<Profiles[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const dataPartners = await allPartners();
      const dataProfiles = await allProfiles();
      const dataLocality = await allLocality();
      const dataUs = await allUs();

      setPartnersList(dataPartners);
      setProfilesList(dataProfiles);
      setlocalityList(dataLocality);
      setUsList(dataUs);
    };

    fetchData().catch((error) => console.log(error));
  }, []);

  const onSubmit = async (values: any) => {
    const user: any = paramUser ? paramUser : {};

    user.id = paramUser ? paramUser.id : values.id;
    user.surname = values.surname;
    user.name = values.name;
    user.phoneNumber = values.phoneNumber;
    user.email = values.email;
    user.username = values.username;
    user.password = values.password;
    user.entryPoint = values.entryPoint;
    user.status = values.status;
    user.locality = { id: values.locality_id };
    user.partners = { id: values.partner_id };
    user.profiles = { id: values.profile_id };
    user.us = { id: values.us_id };

    const account = paramUser ? await edit(user) : await add(user);

    navigate("/usersView", { state: { user: account.data } });
  };

  const role = useSelector((state: any) => state.auth?.currentUser.role);
  const isUsVisible = role !== "MENTORA" ? true : false;

  return (
    <NativeBaseProvider>
      <View style={styles.webStyle}>
        <Center w="100%" bgColor="white">
          <Box safeArea p="2" w="90%" py="8">
            <Heading
              size="lg"
              color="coolGray.800"
              _dark={{ color: "warmGray.50" }}
              fontWeight="semibold"
              marginBottom={5}
              marginTop={0}
            >
              Registo do Utilizador
            </Heading>
            {/* <Alert status="info" colorSchem>
                            <HStack flexShrink={1} space={2} alignItems="center">
                                <Alert.Icon />
                                <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
                                    Preencha os campos abaixo para registar novo utilizador!
                                </Text>
                            </HStack>
                        </Alert> */}

            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              // validate={validate}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                values,
                errors,
              }) => (
                <VStack space={3} mt="5">
                  <FormControl isRequired isInvalid={"surname" in errors}>
                    <FormControl.Label>Apelido</FormControl.Label>
                    <Input
                      variant="filled"
                      onBlur={handleBlur("surname")}
                      onChangeText={handleChange("surname")}
                      placeholder="Insira o seu Apelido"
                      value={values.surname}
                    />
                  </FormControl>
                  <FormControl isRequired isInvalid={"name" in errors}>
                    <FormControl.Label>Nome</FormControl.Label>
                    <Input
                      variant="filled"
                      onBlur={handleBlur("name")}
                      onChangeText={handleChange("name")}
                      placeholder="Insira o seu Nome"
                      value={values.name}
                    />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>Email</FormControl.Label>
                    <Input
                      variant="filled"
                      onBlur={handleBlur("email")}
                      onChangeText={handleChange("email")}
                      // id="email" name="email"
                      placeholder="Insira o seu Email"
                      value={values.email}
                    />
                  </FormControl>
                  <FormControl isRequired isInvalid={"username" in errors}>
                    <FormControl.Label>Username</FormControl.Label>
                    <Input
                      variant="filled"
                      onBlur={handleBlur("username")}
                      onChangeText={handleChange("username")}
                      // id="username" name="username"
                      placeholder="Insira o seu Username"
                      value={values.username}
                    />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>Telemóvel</FormControl.Label>
                    <Input
                      variant="filled"
                      onBlur={handleBlur("phoneNumber")}
                      onChangeText={handleChange("phoneNumber")}
                      // id="phoneNumber" name="phoneNumber"
                      placeholder="Insira o seu Telemóvel"
                      value={values.phoneNumber}
                    />
                  </FormControl>
                  <FormControl isRequired isInvalid={"entryPoint" in errors}>
                    <FormControl.Label>Ponto de Entrada</FormControl.Label>
                    <Select
                      accessibilityLabel="Selecione o Ponto de Entrada"
                      selectedValue={values.entryPoint || "0"}
                      onValueChange={(itemValue) => {
                        if (itemValue != "0") {
                          setFieldValue("entryPoint", itemValue);
                        }
                      }}
                      _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size={5} />,
                      }}
                      mt="1"
                    >
                      <Select.Item
                        label="-- Seleccione o Ponto de Entrada --"
                        value="0"
                      />
                      {isUsVisible && (
                        <Select.Item label="Unidade Sanitaria" value="1" />
                      )}
                      <Select.Item label="Escola" value="2" />
                      <Select.Item label="Comunidade" value="3" />
                    </Select>
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      Selecione o ponto de entrada!
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={"partner_id" in errors}>
                    <FormControl.Label>Parceiro</FormControl.Label>
                    <Select
                      accessibilityLabel="Selecione o Parceiro"
                      selectedValue={values.partner_id || "0"}
                      onValueChange={(itemValue) => {
                        if (itemValue != "0") {
                          setFieldValue("partner_id", itemValue);
                        }
                      }}
                      _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size={5} />,
                      }}
                      mt="1"
                    >
                      <Select.Item
                        label="-- Seleccione o Perfil --"
                        value="0"
                      />
                      {partnersList.map((item) => (
                        <Select.Item
                          key={String(item.id)}
                          label={item.name}
                          value={String(item.id)}
                        />
                      ))}
                    </Select>
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      Selecione um Parceiro!
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={"profile_id" in errors}>
                    <FormControl.Label>Perfil</FormControl.Label>
                    <Select
                      accessibilityLabel="Selecione o Perfil"
                      selectedValue={values.profile_id || "0"}
                      onValueChange={(itemValue) => {
                        if (itemValue != "0") {
                          setFieldValue("profile_id", "" + itemValue);
                        }
                      }}
                      _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size={5} />,
                      }}
                      mt="1"
                    >
                      <Select.Item
                        label="-- Seleccione o Perfil --"
                        value="0"
                      />
                      {profilesList.map((item) => (
                        <Select.Item
                          key={String(item.id)}
                          label={item.name}
                          value={String(item.id)}
                        />
                      ))}
                    </Select>
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      Selecione o Perfil!
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={"locality_id" in errors}>
                    <FormControl.Label>Localidade</FormControl.Label>
                    <Select
                      accessibilityLabel="Selecione a Localidade"
                      selectedValue={values.locality_id || "0"}
                      onValueChange={(itemValue) => {
                        if (itemValue != "0") {
                          setFieldValue("locality_id", "" + itemValue);
                        }
                      }}
                      _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size={5} />,
                      }}
                      mt="1"
                    >
                      <Select.Item
                        label="-- Seleccione a Localidade --"
                        value="0"
                      />
                      {localityList.map((item) => (
                        <Select.Item
                          key={String(item.id)}
                          label={item.name}
                          value={String(item.id)}
                        />
                      ))}
                    </Select>
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      Selecione uma Localidade!
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={"us_id" in errors}>
                    <FormControl.Label>US</FormControl.Label>
                    <Select
                      accessibilityLabel="Selecione a US"
                      selectedValue={values.us_id || "0"}
                      onValueChange={(itemValue) => {
                        if (itemValue != "0") {
                          setFieldValue("us_id", itemValue);
                        }
                      }}
                      _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size={5} />,
                      }}
                      mt="1"
                    >
                      <Select.Item
                        label="-- Seleccione a Unidade Sanitária --"
                        value="0"
                      />
                      {usList.map((item) => (
                        <Select.Item
                          key={String(item.id)}
                          label={item.name}
                          value={String(item.id)}
                        />
                      ))}
                    </Select>
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      Selecione uma Unidade Sanitaria!
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={"status" in errors}>
                    <FormControl.Label>Estado:</FormControl.Label>
                    <Radio.Group
                      defaultValue={String(values.status) || ""}
                      name="status"
                      accessibilityLabel="Estado"
                    >
                      <Stack
                        direction={{
                          base: "column",
                          md: "row",
                        }}
                        alignItems={{
                          base: "flex-start",
                          md: "center",
                        }}
                        space={4}
                        w="75%"
                        maxW="300px"
                      >
                        <Radio value="1" my={1}>
                          Activo
                        </Radio>
                        <Radio value="0" my={1}>
                          Inactivo
                        </Radio>
                      </Stack>
                    </Radio.Group>
                  </FormControl>
                  <Flex
                    direction="row"
                    mb="2.5"
                    mt="1.5"
                    style={{ justifyContent: "flex-end" }}
                  >
                    <Center>
                      <Button
                        onPress={() => navigate("/usersList")}
                        size={"md"}
                        bg="warning.400"
                      >
                        {/* <Icon as={<Ionicons name="play-back-sharp" />} color="white" size={25} /> */}
                        <Text style={styles.txtSubmit}> Voltar </Text>
                      </Button>
                    </Center>
                    <Center>
                      <Button
                        onPress={(values: any) => handleSubmit(values)}
                        bg="primary.700"
                        style={{ marginLeft: 10 }}
                      >
                        <Text style={styles.txtSubmit}> Gravar </Text>
                      </Button>
                    </Center>
                  </Flex>
                </VStack>
              )}
            </Formik>
          </Box>
        </Center>
      </View>
    </NativeBaseProvider>
  );
};

export default UserForm;
