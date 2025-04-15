import React, { useContext, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
} from "react-native";
import {
  Alert,
  Box,
  Button,
  CloseIcon,
  Divider,
  FormControl,
  HStack,
  Icon,
  IconButton,
  Input,
  Text,
  useToast,
  VStack,
} from "native-base";
import Spinner from "react-native-loading-spinner-overlay";
import { MaterialIcons } from "@native-base/icons";
import styles from "./styles";
import {
  getBeneficiariesByNot_status,
  getBeneficiariesBy_status,
} from "../../services/beneficiaryService";
import {
  getBeneficiariesInterventionsByNot_status,
  getBeneficiariesInterventionsBy_status,
} from "../../services/beneficiaryInterventionService";
import {
  getReferencesBy_status,
  getReferenceServicesBy_status,
  getReferenceServicesByNot_status,
  getReferencesByNot_status,
} from "../../services/referenceService";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import {
  getSequencesByNot_status,
  getSequencesBy_status,
} from "../../services/sequenceService";
import { getUserDetail, getUsersById } from "../../services/userService";
import axios from "axios";
import {
  MOBILE_DUMPS_GENERATE_UPLOAD_LINK_URL,
  MOBILE_DUMPS_RELATIVE_PATH,
  SEA_FILE_PASSWORD,
  SEA_FILE_USERNAME,
  EXPORT_DUMP_AUTHORIZE_URL,
  LOGIN_API_URL,
} from "../../services/api";
import { Context } from "../../routes/DrawerNavigator";

const SyncReportScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const toasty = useToast();
  const [hasSupervisorAuth, setSupervisorAuth] = useState(false);
  const [show, setShow] = React.useState(false);
  const [values, setValues] = useState({ username: "", password: "" });

  const now = new Date();
  const loggedUser: any = useContext(Context);
  const mobile_user = loggedUser.username;

  const handleChange = (value, name) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  function showToast(status, message, description) {
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
  }

  const handleAuthorization = async () => {
    const userDetail = await getUserDetail();
    const localities = userDetail["localities"];
    setLoading(true);
    const { username, password } = values;

    if (!username || !password) {
      setSupervisorAuth(false);
      showToast(
        "error",
        "Falha!!!",
        "Por favor preencha o username e password do Supervisor!"
      );
      setLoading(false);
      return;
    }

    try {
      const supervisorUrl = `${EXPORT_DUMP_AUTHORIZE_URL}?username=${username.trim()}&localities=${localities}`;
      const response = await fetch(supervisorUrl);
      const isSupervisorAuthorized = await response.json();

      if (!isSupervisorAuthorized) {
        setSupervisorAuth(false);
        showToast(
          "error",
          "Supervisor inválido!",
          "Verifique se o supervisor pertence à mesma localidade!"
        );
        setLoading(false);
        return;
      }

      const loginUrl = `${LOGIN_API_URL}?username=${username.trim()}&password=${encodeURIComponent(
        password
      )}`;
      const loginResp = await fetch(loginUrl);

      if (loginResp.status !== 200) {
        setSupervisorAuth(false);
        showToast(
          "error",
          "Login não autorizado!!!",
          "Verifique se contém credenciais válidas!"
        );
        setLoading(false);
        return;
      }

      setSupervisorAuth(true);
      showToast(
        "success",
        "Autorizado!!!",
        "Envio de Dump Autorizado, já pode exportar dados do dispositivo!"
      );
    } catch (error) {
      console.error("Erro na autorização:", error);
      setSupervisorAuth(false);
      showToast("error", "Falha!!!", "Erro ao autorizar envio de dump!");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      writeFileOnDevice();
      const res = await genarateShareLink({
        username: SEA_FILE_USERNAME,
        password: SEA_FILE_PASSWORD,
      });
      await shareFileViaSeafile(res.uploadLink, res.authToken);
      setLoading(false);

      showToast(
        "success",
        "Exportado!!!",
        "Dump Exportado com sucesso, Obrigado!"
      );
    } catch (error) {
      console.error("Error Exporting file:", error);
    }
  };

  const writeFileOnDevice = async () => {
    const createdBeneficiaries = await getBeneficiariesBy_status("created");
    const createdBeneficiariesInterventions =
      await getBeneficiariesInterventionsBy_status("created");
    const createdReferences = await getReferencesBy_status("created");
    const createdReferenceServices = await getReferenceServicesBy_status(
      "created"
    );
    const createdSequences = await getSequencesBy_status("created");

    const updatedBeneficiaries = await getBeneficiariesByNot_status("created");
    const updatedBeneficiariesInterventions =
      await getBeneficiariesInterventionsByNot_status("created");
    const updatedReferences = await getReferencesByNot_status("created");
    const updatedReferenceServices = await getReferenceServicesByNot_status(
      "created"
    );
    const updatedSequences = await getSequencesByNot_status("created");

    const userDetail = await getUserDetail();
    const updatedUsers = await getUsersById(userDetail["user_id"]);

    const data = {
      changes: {
        beneficiaries: {
          created: createdBeneficiaries,
          updated: updatedBeneficiaries,
          deleted: [],
        },
        beneficiaries_interventions: {
          created: createdBeneficiariesInterventions,
          updated: updatedBeneficiariesInterventions,
          deleted: [],
        },
        references: {
          created: createdReferences,
          updated: updatedReferences,
          deleted: [],
        },
        references_services: {
          created: createdReferenceServices,
          updated: updatedReferenceServices,
          deleted: [],
        },
        sequences: {
          created: createdSequences,
          updated: updatedSequences,
          deleted: [],
        },
        users: {
          created: [],
          updated: updatedUsers,
          deleted: [],
        },
      },
      lastPulledAt: now.getTime(),
    };
    try {
      const path = `${RNFS.ExternalDirectoryPath}/dlt2.json`;
      await RNFS.writeFile(path, JSON.stringify(data), "utf8");
    } catch (err) {
      console.error("ERROR IN FILE WRITTEN!", err);
    }
  };

  const shareFileViaWhatsApp = async () => {
    const filePath = `${RNFS.ExternalDirectoryPath}/dlt2.json`;

    const options: any = {
      title: "Share via",
      url: `file://${filePath}`,
      social: Share.Social.WHATSAPP,
    };

    try {
      await Share.shareSingle(options);
    } catch (error) {
      console.error("--Error sharing file via WhatsApp:", error);
    }
  };

  const genarateShareLink = async (data) => {
    const response = await axios.get(
      `${MOBILE_DUMPS_GENERATE_UPLOAD_LINK_URL}?username=${data.username.trim()}&password=${encodeURIComponent(
        data.password
      )}`
    );
    return response.data;
  };

  const shareFileViaSeafile = async (upload_link, auth_token) => {
    try {
      const filePath = `${RNFS.ExternalDirectoryPath}/dlt2.json`;

      const formData = new FormData();
      formData.append("file", {
        uri: `file://${filePath}`,
        name: `${mobile_user}.json`,
        type: "application/json",
      });

      formData.append("parent_dir", "/");
      formData.append("relative_path", MOBILE_DUMPS_RELATIVE_PATH);
      formData.append("replace", "1");

      const uploadUrl = `${upload_link}?ret-json=1&token=${auth_token}`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const resJson = await response.json();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.background}>
      <ScrollView>
        <View>
          <View>
            <Text style={styles.txtLabel}>
              Exportar toda informação do DLT 2.0, existente neste Dispositivo{" "}
              {"                            "}
            </Text>

            {hasSupervisorAuth ? (
              <>
                <Divider />
                <Button
                  isDisabled={loading}
                  isLoading={loading}
                  isLoadingText="Autorizando..."
                  onPress={handleExportData}
                  my="10"
                  colorScheme="primary"
                >
                  Exportar
                </Button>
              </>
            ) : (
              <VStack space={3} w="100%">
                <FormControl isRequired>
                  <FormControl.Label>Supervisor</FormControl.Label>
                  <Input
                    placeholder="Insira o Utilizador"
                    onChangeText={(e) => handleChange(e, "username")}
                    value={values.username}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormControl.Label>Senha</FormControl.Label>
                  <Input
                    type={show ? "text" : "password"}
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
                    placeholder="Insira a Senha"
                    name="password"
                    onChangeText={(e) => handleChange(e, "password")}
                    value={values.password}
                  />
                </FormControl>
                {loading && (
                  <Spinner
                    visible={true}
                    textContent={"Autorizando..."}
                    textStyle={styles.spinnerTextStyle}
                  />
                )}
                <Button
                  isLoading={loading}
                  isLoadingText="Autorizando"
                  onPress={handleAuthorization}
                  my="10"
                  colorScheme="primary"
                >
                  Autorizar como Supervisor
                </Button>
              </VStack>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SyncReportScreen;