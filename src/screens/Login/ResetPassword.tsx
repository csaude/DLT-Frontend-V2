import React, { memo, useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import {
  Center,
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  HStack,
  Alert,
  Button,
  Image,
  useToast,
  IconButton,
  CloseIcon,
  Pressable,
  Icon,
} from "native-base";
import { navigationRef } from "../../routes/NavigationRef";
import { Formik } from "formik";
import * as Yup from "yup";
import NetInfo from "@react-native-community/netinfo";
import styles from "./style";
import { MaterialIcons } from "@native-base/icons";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { UPDATE_PASSWORD_URL } from "../../services/api";
import { database } from "../../database";
import { Q } from "@nozbe/watermelondb";

interface LoginData {
  email?: string | undefined;
  username?: string | undefined;
  password?: string | undefined;
  rePassword?: string | undefined;
}

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [show, setShow] = React.useState(false);
  const [showPass, setShowPass] = React.useState(false);

  const toasty = useToast();

  const users = database.collections.get("users");

  const showToast = useCallback((status, message, description) => {
    return toasty.show({
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
                <IconButton
                  variant="unstyled"
                  _focus={{ borderWidth: 0 }}
                  icon={<CloseIcon size="3" color="coolGray.600" />}
                />
              </HStack>
              <Box pl="6" _text={{ color: "coolGray.600" }}>
                {description}
              </Box>
            </VStack>
          </Alert>
        );
      },
    });
  }, []);

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setIsOffline(offline);
    });
    return () => removeNetInfoSubscription();
  }, []);

  const validate = useCallback((values: any) => {
    const errors: LoginData = {};

    if (!values.username) {
      errors.username = "Obrigatório";
    }

    if (!values.password) {
      errors.password = "Obrigatório";
    }

    if (!values.rePassword) {
      errors.rePassword = "Obrigatório";
    }
    return errors;
  }, []);

  // Inicio Do Reset
  const onSubmit = useCallback(async (values: any) => {
    setLoading(true);
    try {
      if (isOffline) {
        setLoading(false);
        showToast(
          "error",
          "E-mail não enviado!!!",
          "É necessarrio uma conexão a internet!"
        );
      } else {
        
        const logguedUser: any = (
          await users
            .query(
              Q.where(
                "username",
                Q.like(`%${Q.sanitizeLikeString(values.username.trim())}%`)
              )
            )
            .fetch()
        )[0];

        if (logguedUser) {
          await database.write(async () => {
            await logguedUser.update((user: any) => {
              user._raw.is_awaiting_sync = parseInt("1");
            });
          });
        }
          
				await fetch(`${UPDATE_PASSWORD_URL}`, {
					method: "PUT",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						username: values.username,
						recoverPassword: values.password,
					}),
				});

        setLoading(false);
        showToast(
          "success",
          "E-mail enviado!!!",
          "Redefinição de senha submetida com sucesso!"
        );

        navigationRef.reset({
          index: 0,
          routes: [{ name: "Login", params: { resetPassword: "1" } }],
        });
      }
    } catch (error) {
      setLoading(false);
      showToast("error", "Falha!!!", "Erro ao redefinir a senha!");
    }
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <Box safeArea p="2" w="100%" py="8" bgColor="white">
          <Image
            style={{ width: "100%", resizeMode: "contain" }}
            source={require("../../../assets/dreams.png")}
            size="100"
            alt="dreams logo"
          />
          <VStack space={4} alignItems="center" w="100%">
            <Center w="90%">
              <Heading
                mt="1"
                color="coolGray.600"
                _dark={{ color: "warmGray.200" }}
                fontWeight="medium"
                size="md"
                py="5"
              >
                <Text color="warmGray.400">Redefinir a Senha </Text>
              </Heading>
            </Center>
            <Center w="90%">
              <Formik
                initialValues={{
                  username: "",
                  password: "",
                  rePassword: "",
                }}
                onSubmit={onSubmit}
                validate={validate}
                validationSchema={Yup.object({
                  username: Yup.string()
                    .max(45, "Deve conter no máximo 45 caracteres")
                    .required("Obrigatório"),
                  password: Yup.string()
                    .required("Obrigatório")
                    .max(25, "Deve conter 25 caracteres ou menos")
                    .matches(/(?=.*\d)/, "Deve conter número")
                    .matches(/(?=.*[a-z])/, "Deve conter minúscula")
                    .matches(/(?=.*[A-Z])/, "Deve conter Maiúscula")
                    .matches(
                      /(?=.*[@$!%*#?&])/,
                      "Deve conter caracter especial"
                    )
                    .min(8, "Deve conter 8 caracteres ou mais"),
                  rePassword: Yup.string()
                    .oneOf(
                      [Yup.ref("password"), null],
                      "As senhas devem corresponder"
                    )
                    .required("Obrigatório"),
                })}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                }) => (
                  <VStack space={3} w="100%">
                    <FormControl isRequired isInvalid={"username" in errors}>
                      <FormControl.Label>Nome do utilizador</FormControl.Label>
                      <Input
                        onBlur={handleBlur("username")}
                        placeholder="Insira o nome do utilizador"
                        onChangeText={handleChange("username")}
                        value={values.username}
                      />
                      <FormControl.ErrorMessage>
                        {errors.username}
                      </FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={"password" in errors}>
                      <FormControl.Label>Nova Senha</FormControl.Label>
                      <Input
                        type={showPass ? "text" : "password"}
                        onBlur={handleBlur("password")}
                        placeholder="Insira a nova senha"
                        InputRightElement={
                          <Pressable onPress={() => setShowPass(!showPass)}>
                            <Icon
                              as={
                                <MaterialIcons
                                  name={
                                    showPass ? "visibility" : "visibility-off"
                                  }
                                />
                              }
                              size={5}
                              mr="2"
                              color="muted.400"
                            />
                          </Pressable>
                        }
                        onChangeText={handleChange("password")}
                        value={values.password}
                      />
                      <FormControl.ErrorMessage>
                        {errors.password}
                      </FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={"rePassword" in errors}>
                      <FormControl.Label>
                        Repetir a nova Senha
                      </FormControl.Label>
                      <Input
                        type={show ? "text" : "password"}
                        onBlur={handleBlur("rePassword")}
                        placeholder="Repita a nova senha"
                        InputRightElement={
                          <Pressable onPress={() => setShow(!show)}>
                            <Icon
                              as={
                                <MaterialIcons
                                  name={show ? "visibility" : "visibility-off"}
                                />
                              }
                              size={5}
                              mr="2"
                              color="muted.400"
                            />
                          </Pressable>
                        }
                        onChangeText={handleChange("rePassword")}
                        value={values.rePassword}
                      />
                      <FormControl.ErrorMessage>
                        {errors.rePassword}
                      </FormControl.ErrorMessage>
                    </FormControl>
                    {loading ? (
                      <Spinner
                        visible={true}
                        textContent={"Autenticando..."}
                        textStyle={styles.spinnerTextStyle}
                      />
                    ) : undefined}
                    <Button
                      onPress={handleSubmit}
                      // onPress={() => {
                      // 	updatePassword(values.username, values.password);
                      // }}
                    >
                      Solicitar
                    </Button>
                  </VStack>
                )}
              </Formik>
            </Center>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default memo(ResetPassword);
