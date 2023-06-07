import React, { useEffect, useState, useContext } from "react";
import { View, KeyboardAvoidingView, ScrollView } from "react-native";
import {
  Center,
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  HStack,
  Alert,
  useToast,
} from "native-base";
import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import { navigate } from "../../../routes/NavigationRef";
import withObservables from "@nozbe/with-observables";
import { database } from "../../../database";
import { UsersModel } from "../../../models/User";
import { sync } from "../../../database/sync";
import { Context } from "../../../routes/DrawerNavigator";

import styles from "./styles";

const UsersRegistrationForm: React.FC = ({
  route,
  localities,
  profiles,
  us,
  partners,
}: any) => {
  const [loading, setLoading] = useState(false);
  const loggedUser: any = useContext(Context);
  const { user } = route.params;
  let mounted = true; // prevent error:  state update on an unmounted component
  const toast = useToast();
  const [initialValues, setInitialValues] = useState({
    surname: "",
    username: "",
    password: "",
    name: "",
    email: "",
    phone_number: "",
    entry_point: "",
    profile_id: "",
    partner_id: "",
    locality_id: "",
    us_id: "",
  });
  const message = "Este campo é Obrigatório";

  // when editing user
  useEffect(() => {
    if (user && mounted) {
      setInitialValues({
        surname: user.surname,
        username: user.username,
        password: user.password,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        entry_point: user.entry_point,
        profile_id: user.profile_id,
        partner_id: user.partner_id,
        locality_id: user.locality_id,
        us_id: user.us_id,
      });

      return () => {
        // This code runs when component is unmounted
        mounted = false; // set it to false if we leave the page
      };
    }
  }, [user]);

  const validate = (values: any) => {
    const errors: UsersModel = {};

    if (!values.surname) {
      errors.surname = message;
    }

    if (!values.name) {
      errors.name = message;
    }

    if (!values.username) {
      errors.username = message;
    }

    if (!values.password) {
      errors.password = message;
    }

    if (!values.entry_point) {
      errors.entry_point = message;
    }

    if (!values.profile_id) {
      errors.profile_id = message;
    }

    if (!values.localities_ids) {
      errors.localities_ids = message;
    }

    if (!values.partner_id) {
      errors.partner_id = message;
    }

    if (!values.us_ids) {
      errors.us_ids = message;
    }

    return errors;
  };

  const onSubmit = async (values: any) => {
    setLoading(true);

    const localityName = localities.filter((e) => {
      return e._raw.online_id == values.locality_id;
    })[0]._raw.name;
    const profileName = profiles.filter((e) => {
      return e._raw.online_id == values.profile_id;
    })[0]._raw.name;
    const partnerName = partners.filter((e) => {
      return e._raw.online_id == values.partner_id;
    })[0]._raw.name;
    const usName = us.filter((e) => {
      return e._raw.online_id == values.us_id;
    })[0]._raw.name;

    const isEdit = user && user.id; // new record if it has id

    const newObject = await database.write(async () => {
      if (isEdit) {
        const userToUpdate = await database.get("users").find(user.id);
        const updatedUser = await userToUpdate.update(() => {
          user.name = values.name;
          user.surname = values.surname;
          user.username = values.username;
          user.password = values.password;
          user.email = values.email;
          user.phone_number = values.phone_number;
          user.entry_point = values.entry_point;
          user.status = "1";
          user.profile_id = values.profile_id;
          user.locality_id = values.locality_id;
          user.partner_id = values.partner_id;
          user.us_id = values.us_id;
          user.online_id = values?.online_id;
          user._status = "updated";
        });

        toast.show({
          placement: "bottom",
          title: "User Updated Successfully: " + updatedUser._raw.id,
        });

        return updatedUser;
      }
      const newUser = await database.collections
        .get("users")
        .create((user: any) => {
          user.name = values.name;
          user.surname = values.surname;
          user.username = values.username;
          user.password = values.password;
          user.email = values.email;
          user.phone_number = values.phone_number;
          user.entry_point = values.entry_point;
          user.status = "1";
          user.profile_id = values.profile_id;
          user.locality_id = values.locality_id;
          user.partner_id = values.partner_id;
          user.us_id = values.us_id;
          user.online_id = values.online_id;
        });

      toast.show({
        placement: "bottom",
        title: "User Saved Successfully: " + newUser._raw.id,
      });

      return newUser;
    });

    navigate({
      name: "UserView",
      params: {
        user: newObject._raw,
        locality: localityName,
        profile: profileName,
        partner: partnerName,
        us: usName,
      },
    });

    setLoading(false);
    sync({ username: loggedUser.username })
      .then(() =>
        toast.show({
          placement: "top",
          render: () => {
            return (
              <Alert
                w="100%"
                variant="left-accent"
                colorScheme="success"
                status="success"
              >
                <VStack space={2} flexShrink={1} w="100%">
                  <HStack
                    flexShrink={1}
                    space={2}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <HStack space={2} flexShrink={1} alignItems="center">
                      <Alert.Icon />
                      <Text color="coolGray.800">Synced Successfully!</Text>
                    </HStack>
                  </HStack>
                </VStack>
              </Alert>
            );
          },
        })
      )
      .catch(() =>
        toast.show({
          placement: "top",
          render: () => {
            return (
              <Alert
                w="100%"
                variant="left-accent"
                colorScheme="error"
                status="error"
              >
                <VStack space={2} flexShrink={1} w="100%">
                  <HStack
                    flexShrink={1}
                    space={2}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <HStack space={2} flexShrink={1} alignItems="center">
                      <Alert.Icon />
                      <Text color="coolGray.800">Sync Failed!</Text>
                    </HStack>
                  </HStack>
                </VStack>
              </Alert>
            );
          },
        })
      );
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView>
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
              <Alert status="info" colorScheme="info">
                <HStack flexShrink={1} space={2} alignItems="center">
                  <Alert.Icon />
                  <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
                    Preencha os campos abaixo para registar novo utilizador!
                  </Text>
                </HStack>
              </Alert>

              <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validate={validate}
                enableReinitialize={true}
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
                        onBlur={handleBlur("surname")}
                        placeholder="Insira o seu Apelido"
                        onChangeText={handleChange("surname")}
                        value={values.surname}
                      />
                      <FormControl.ErrorMessage>
                        {errors.surname}
                      </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={"name" in errors}>
                      <FormControl.Label>Nome</FormControl.Label>

                      <Input
                        onBlur={handleBlur("name")}
                        placeholder="Insira o seu Nome"
                        onChangeText={handleChange("name")}
                        value={values.name}
                      />
                      <FormControl.ErrorMessage>
                        {errors.name}
                      </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Email</FormControl.Label>
                      <Input
                        onBlur={handleBlur("email")}
                        placeholder="Insira o seu Email"
                        onChangeText={handleChange("email")}
                        value={values.email}
                      />
                    </FormControl>
                    <FormControl isRequired isInvalid={"username" in errors}>
                      <FormControl.Label>Username</FormControl.Label>

                      <Input
                        onBlur={handleBlur("username")}
                        placeholder="Insira o Utilizador"
                        onChangeText={handleChange("username")}
                        value={values.username}
                      />
                      <FormControl.ErrorMessage>
                        {errors.username}
                      </FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={"password" in errors}>
                      <FormControl.Label>Password</FormControl.Label>
                      <Input
                        onBlur={handleBlur("password")}
                        placeholder="Insira o Password"
                        onChangeText={handleChange("password")}
                        value={values.password}
                      />
                      <FormControl.ErrorMessage>
                        {errors.password}
                      </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Telemóvel</FormControl.Label>
                      <Input
                        onBlur={handleBlur("phone_number")}
                        placeholder="Insira o seu Telemóvel"
                        onChangeText={handleChange("phone_number")}
                        value={values.phone_number}
                      />
                    </FormControl>
                    <FormControl isRequired isInvalid={"entry_point" in errors}>
                      <FormControl.Label>Ponto de Entrada</FormControl.Label>
                      <Picker
                        style={styles.dropDownPicker}
                        selectedValue={values.entry_point}
                        onValueChange={(itemValue, itemIndex) => {
                          if (itemIndex !== 0) {
                            setFieldValue("entry_point", itemValue);
                          }
                        }}
                      >
                        <Picker.Item
                          label="-- Seleccione o Ponto de Entrada --"
                          value="0"
                        />
                        <Picker.Item label="Unidade Sanitaria" value="1" />
                        <Picker.Item label="Escola" value="2" />
                        <Picker.Item label="Comunidade" value="3" />
                      </Picker>
                      <FormControl.ErrorMessage>
                        {errors.entry_point}
                      </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={"profile_id" in errors}>
                      <FormControl.Label>Perfil</FormControl.Label>
                      <Picker
                        style={styles.dropDownPicker}
                        selectedValue={values.profile_id}
                        onValueChange={(itemValue, itemIndex) => {
                          if (itemIndex !== 0) {
                            setFieldValue("profile_id", itemValue);
                          }
                        }}
                      >
                        <Picker.Item
                          label="-- Seleccione o Perfil --"
                          value="0"
                        />
                        {profiles.map((item) => (
                          <Picker.Item
                            key={item.online_id}
                            label={item.name}
                            value={parseInt(item.online_id)}
                          />
                        ))}
                      </Picker>
                      <FormControl.ErrorMessage>
                        {errors.profile_id}
                      </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={"partner_id" in errors}>
                      <FormControl.Label>Parceiro</FormControl.Label>
                      <Picker
                        style={styles.dropDownPicker}
                        selectedValue={values.partner_id}
                        onValueChange={(itemValue, itemIndex) => {
                          if (itemIndex !== 0) {
                            setFieldValue("partner_id", itemValue);
                          }
                        }}
                      >
                        <Picker.Item
                          label="-- Seleccione o Parceiro --"
                          value="0"
                        />
                        {partners.map((item) => (
                          <Picker.Item
                            key={item.online_id}
                            label={item.name}
                            value={parseInt(item.online_id)}
                          />
                        ))}
                      </Picker>
                      <FormControl.ErrorMessage>
                        {errors.partner_id}
                      </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={"locality_id" in errors}>
                      <FormControl.Label>Localidade</FormControl.Label>
                      <Picker
                        style={styles.dropDownPicker}
                        selectedValue={values.locality_id}
                        onValueChange={(itemValue, itemIndex) => {
                          if (itemIndex !== 0) {
                            setFieldValue("locality_id", itemValue);
                          }
                        }}
                      >
                        <Picker.Item
                          label="-- Seleccione a localidade --"
                          value="0"
                        />
                        {localities.map((item) => (
                          <Picker.Item
                            key={item.online_id}
                            label={item.name}
                            value={parseInt(item.online_id)}
                          />
                        ))}
                      </Picker>
                      <FormControl.ErrorMessage>
                        {errors.locality_id}
                      </FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={"us_id" in errors}>
                      <FormControl.Label>US</FormControl.Label>
                      <Picker
                        style={styles.dropDownPicker}
                        selectedValue={values.us_id}
                        onValueChange={(itemValue, itemIndex) => {
                          if (itemIndex !== 0) {
                            setFieldValue("us_id", itemValue);
                          }
                        }}
                      >
                        <Picker.Item label="-- Seleccione a US --" value="0" />
                        {us.map((item) => (
                          <Picker.Item
                            key={item.online_id}
                            label={item.name}
                            value={parseInt(item.online_id)}
                          />
                        ))}
                      </Picker>
                      <FormControl.ErrorMessage>
                        {errors.us_id}
                      </FormControl.ErrorMessage>
                    </FormControl>

                    <Button
                      isLoading={loading}
                      isLoadingText="Cadastrando"
                      onPress={handleSubmit}
                      my="10"
                      colorScheme="primary"
                    >
                      Cadastrar
                    </Button>
                  </VStack>
                )}
              </Formik>
            </Box>
          </Center>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const enhance = withObservables([], () => ({
  localities: database.collections.get("localities").query().observe(),
  profiles: database.collections.get("profiles").query().observe(),
  partners: database.collections.get("partners").query().observe(),
  us: database.collections.get("us").query().observe(),
}));
export default enhance(UsersRegistrationForm);
