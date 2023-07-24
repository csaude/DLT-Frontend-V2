import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, KeyboardAvoidingView, ScrollView } from "react-native";
import {
  Center,
  Box,
  Text,
  VStack,
  FormControl,
  Input,
  Button,
  HStack,
  Alert,
  useToast,
  InputGroup,
  InputLeftAddon,
  Checkbox,
} from "native-base";
import { Picker } from "@react-native-picker/picker";
import withObservables from "@nozbe/with-observables";
import { database } from "../../../database";
import { navigationRef } from "../../../routes/NavigationRef";
import ModalSelector from "react-native-modal-selector-searchable";
import { Q } from "@nozbe/watermelondb";
import { Formik } from "formik";
import { Context } from "../../../routes/DrawerNavigator";

import styles from "./styles";
import { sync } from "../../../database/sync";
import {
  ErrorHandler,
  SuccessHandler,
} from "../../../components/SyncIndicator";
import moment from "moment";
import { MENTOR } from "../../../utils/constants";
import Spinner from "react-native-loading-spinner-overlay/lib";
import MyDatePicker from "../../../components/DatePicker";
import NetInfo from "@react-native-community/netinfo";

const ServicesForm: React.FC = ({ route, services, subServices }: any) => {
  const { reference, beneficiarie, intervention } = route.params;

  const loggedUser: any = useContext(Context);
  const toast = useToast();

  const userDetailsCollection = database.get("user_details");

  const [initialValues, setInitialValues] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isSync, setIsSync] = useState(false);
  const [text, setText] = useState("");
  const [date, setDate] = useState();
  const [users, setUsers] = useState<any>([]);
  const [notifyTo, setNotifyTo] = useState<any>(undefined);
  const [us, setUs] = useState<any>([]);
  const [checked, setChecked] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>("");
  const [organization, setOrganization] = useState<any>();
  const [isClinicalOrCommunityPartner, setClinicalOrCommunityPartner] =
    useState(false);
  const [currentInformedProvider, setCurrentInformedProvider] = useState("");
  const service = services.filter(
    (item) => item._raw.online_id === intervention?.service.service_id
  )[0]?._raw;

  const areaServicos = [
    { id: "1", name: "Serviços Clinicos" },
    { id: "2", name: "Serviços Comunitarios" },
  ];
  const [entryPoints, setEntryPoints] = useState([
    { id: "1", name: "US" },
    { id: "2", name: "CM" },
    { id: "3", name: "ES" },
  ]);
  const message = "Este campo é Obrigatório";

  const initialVal = {
    areaServicos_id: service?.service_type,
    service_id: service?.online_id,
    beneficiary_id: beneficiarie?.online_id,
    sub_service_id: "",
    result: "",
    date: "",
    us_id: reference.us_id,
    activist_id:
      loggedUser?.online_id !== undefined
        ? loggedUser.online_id
        : loggedUser.id,
    entry_point: reference?.refer_to,
    provider: notifyTo?.name + "" + notifyTo?.surname,
    remarks: "",
    status: 1,
  };

  const handleDataFromDatePickerComponent = useCallback((selectedDate) => {
    selectedDate.replaceAll("/", "-");
    const currentDate = selectedDate || date;
    // setShow(false);
    setDate(currentDate);

    setText(selectedDate);
  }, []);

  const onChangeToOutros = (value) => {
    setChecked(value);
  };

  const onChangeEntryPoint = async (value: any) => {
    const uss = await database
      .get("us")
      .query(
        Q.where("entry_point", parseInt(value)),
        Q.where("locality_id", parseInt(notifyTo?.localities_ids))
      )
      .fetch();
    const ussSerialied = uss.map((item) => item._raw);
    setUs(ussSerialied);
  };

  const onChangeUs = async (value: any) => {
    const getUsersList = await database
      .get("users")
      .query(Q.where("us_ids", Q.like(`%${value}%`)))
      .fetch();
    const usersSerialized = getUsersList.map((item) => item._raw);
    setUsers(usersSerialized);
  };

  const validate = (values: any) => {
    const errors: any = {};

    if (!values.service_id) {
      errors.id = message;
    }

    if (!values.areaServicos_id) {
      errors.id = message;
    }

    if (!values.sub_service_id) {
      errors.sub_service_id = message;
    }

    if (!date) {
      errors.date = message;
    }

    if (!values.us_id) {
      errors.us_id = message;
    }

    if (!values.entry_point) {
      errors.entry_point = message;
    }

    if (!values.provider) {
      errors.provider = message;
    }

    if (!values.status) {
      errors.status = message;
    }

    return errors;
  };

  const validateBeneficiaryIntervention = async (values: any) => {
    const benefInterv = await database
      .get("beneficiaries_interventions")
      .query(
        Q.where("beneficiary_id", parseInt(initialVal.beneficiary_id)),
        Q.where("sub_service_id", parseInt(values.sub_service_id)),
        Q.where("date", "" + text)
      )
      .fetch();

    const benefIntervSerialied = benefInterv.map((item) => item._raw);

    if (benefIntervSerialied.length > 0) {
      toast.show({
        placement: "top",
        title: "Beneficiário já tem esta intervenção para esta data ! ",
      });
    } else {
      onSubmit(values);
    }
  };

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const status = !(state.isConnected && state.isInternetReachable);
      setIsOffline(status);
    });
    return () => removeNetInfoSubscription();
  }, []);

  useEffect(() => {
    isSync
      ? toast.show({
          placement: "top",
          render: () => {
            return <SuccessHandler />;
          },
        })
      : "";
  }, [isSync]);

  const onSubmit = async (values: any) => {
    setLoading(true);

    await database.write(async () => {
      const newIntervention = await database.collections
        .get("beneficiaries_interventions")
        .create((intervention: any) => {
          intervention.beneficiary_id = initialVal.beneficiary_id;
          intervention.beneficiary_offline_id = beneficiarie.id;
          intervention.sub_service_id = values.sub_service_id;
          intervention.result = values.result;
          intervention.date = "" + text;
          intervention.us_id = values.us_id;
          intervention.activist_id = initialVal.activist_id;
          intervention.entry_point = values.entry_point;
          intervention.provider = "" + values.provider;
          intervention.remarks = values.remarks;
          intervention.date_created = moment(new Date()).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          intervention.status = initialVal.status;
        });
      return newIntervention;
    });

    await database.write(async () => {
      const referenceSToUpdate = await database
        .get("references_services")
        .query(
          Q.where("reference_id", intervention?.service?.reference_id + ""),
          Q.where("service_id", parseInt(intervention?.service?.service_id))
        )
        .fetch();

      const referenceToUpdate = await database
        .get("references")
        .query(
          Q.where("online_id", parseInt(intervention?.service?.reference_id))
        )
        .fetch();

      const refService = referenceSToUpdate[0];
      const ref = referenceToUpdate[0];

      await refService.update((interventionS: any) => {
        interventionS._raw.is_awaiting_sync = parseInt("1");
        interventionS._raw._status = "updated";
      });

      await ref.update((reference: any) => {
        reference._raw.is_awaiting_sync = parseInt("1");
        reference._raw._status = "updated";
      });
    });

    syncronize();
    await delay(5000);
    syncronize();

    navigationRef.reset({
      index: 0,
      routes: [{ name: "ReferencesList", params: {} }],
    });

    setLoading(false);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const syncronize = () => {
    if (!isOffline) {
      sync({ username: loggedUser.username })
        .then(() => setIsSync(true))
        .catch(() =>
          toast.show({
            placement: "top",
            render: () => {
              return <ErrorHandler />;
            },
          })
        );
    }
  };

  const getPartner = async () => {
    const partner_id =
      loggedUser.partner_id !== undefined
        ? loggedUser.partner_id
        : loggedUser.partners.id;
    const partners = await database
      .get("partners")
      .query(Q.where("online_id", parseInt(partner_id)))
      .fetch();
    const partnerSerialied = partners.map((item) => item._raw)[0];
    setOrganization(partnerSerialied);
  };

  const getUserToNotify = async () => {
    const userToNotify = await database
      .get("users")
      .query(Q.where("online_id", parseInt(reference.notify_to)))
      .fetch();
    const userSerialied = userToNotify.map((item) => item._raw)[0];
    setNotifyTo(userSerialied);
  };

  useEffect(() => {
    getUserToNotify();
    setInitialValues(initialVal);

    getPartner();

    if (
      reference?.refer_to !== undefined &&
      (organization?.partner_type == 1 || organization?.partner_type == 2) &&
      notifyTo !== undefined
    ) {
      setCurrentInformedProvider(notifyTo?.name + " " + notifyTo?.surname);
      setClinicalOrCommunityPartner(true);
      onChangeEntryPoint(reference?.refer_to);
    }
  }, [reference, intervention, organization]);

  useEffect(() => {
    if (intervention?.provider === "") {
      setCurrentInformedProvider("Selecione o Provedor");
    } else {
      const user = users.filter((user) => {
        return user.online_id == intervention?.provider;
      })[0];
      if (user) {
        setCurrentInformedProvider(user?.name + " " + user?.surname);
      } else {
        setCurrentInformedProvider(intervention?.provider + "");
      }
    }
  }, [users, intervention]);

  useEffect(() => {
    if (isClinicalOrCommunityPartner) {
      setCurrentInformedProvider(loggedUser?.name + " " + loggedUser?.surname);
    }
  }, [onChangeUs, beneficiarie]);

  useEffect(() => {
    const validateLoggedUser = async () => {
      const userDetailsQ = await userDetailsCollection
        .query(Q.where("user_id", loggedUser.online_id))
        .fetch();
      const userDetailRaw = userDetailsQ[0]?._raw;
      const isMentora = userDetailRaw?.["profile_id"] == MENTOR ? true : false;

      if (isMentora) {
        setEntryPoints([
          { id: "2", name: "CM" },
          { id: "3", name: "ES" },
        ]);
      }
    };
    validateLoggedUser().catch((err) => console.error(err));
  }, []);

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <View style={styles.webStyle}>
          {loading ? (
            <Spinner
              visible={true}
              textContent={"Provendo o serviço..."}
              textStyle={styles.spinnerTextStyle}
            />
          ) : undefined}
          <Center w="100%" bgColor="white">
            <Box safeArea p="2" w="90%" py="8">
              <Alert status="info" colorScheme="info">
                <HStack flexShrink={1} space={2} alignItems="center">
                  <Alert.Icon />
                  <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
                    Preencha os campos abaixo para prover o serviço a
                    Beneficiaria!
                  </Text>
                </HStack>
              </Alert>
              <Formik
                initialValues={initialValues}
                onSubmit={validateBeneficiaryIntervention}
                validate={validate}
                enableReinitialize={true}
                validateOnChange={false}
                validateOnBlur={false}
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
                    <FormControl isRequired>
                      <FormControl.Label>Área de Serviços</FormControl.Label>
                      <Picker
                        enabled={false}
                        style={styles.dropDownPickerDisabled}
                        selectedValue={values.areaServicos_id}
                        onValueChange={(itemValue, itemIndex) => {
                          if (itemIndex !== 0) {
                            setFieldValue("areaServicos_id", itemValue);
                          }
                        }}
                      >
                        <Picker.Item
                          label="-- Seleccione a Área do Serviço --"
                          value="0"
                        />
                        {areaServicos.map((item) => (
                          <Picker.Item
                            key={item.id}
                            label={item.name}
                            value={item.id}
                          />
                        ))}
                      </Picker>
                      <FormControl.ErrorMessage>
                        {errors.areaServicos_id}
                      </FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={"service_id" in errors}>
                      <FormControl.Label>Serviço</FormControl.Label>
                      <Picker
                        enabled={false}
                        style={styles.dropDownPickerDisabled}
                        selectedValue={values.service_id}
                        onValueChange={(itemValue, itemIndex) => {
                          if (itemIndex !== 0) {
                            setFieldValue("service_id", itemValue);
                          }
                        }}
                      >
                        <Picker.Item
                          label="-- Seleccione o Serviço --"
                          value="0"
                        />
                        {services
                          .filter((e) => {
                            return e.service_type == values.areaServicos_id;
                          })
                          .map((item) => (
                            <Picker.Item
                              key={item._raw.online_id}
                              label={item._raw.name}
                              value={parseInt(item._raw.online_id)}
                            />
                          ))}
                      </Picker>
                      <FormControl.ErrorMessage>
                        {errors.service_id}
                      </FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl
                      isRequired
                      isInvalid={"sub_service_id" in errors}
                    >
                      <FormControl.Label>
                        Sub-Serviço/Intervenção
                      </FormControl.Label>
                      <Picker
                        style={styles.dropDownPicker}
                        selectedValue={values.sub_service_id}
                        onValueChange={(itemValue, itemIndex) => {
                          if (itemIndex !== 0) {
                            setFieldValue("sub_service_id", itemValue);
                          }
                        }}
                      >
                        <Picker.Item
                          label="-- Seleccione o SubServiço --"
                          value="0"
                        />
                        {subServices
                          .filter((e) => {
                            return e.service_id == values.service_id;
                          })
                          .map((item) => (
                            <Picker.Item
                              key={item._raw.online_id}
                              label={item._raw.name}
                              value={parseInt(item._raw.online_id)}
                            />
                          ))}
                      </Picker>
                      <FormControl.ErrorMessage>
                        {errors.sub_service_id}
                      </FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={"entry_point" in errors}>
                      <FormControl.Label>Ponto de Entrada</FormControl.Label>
                      <Picker
                        style={styles.dropDownPicker}
                        selectedValue={values.entry_point}
                        onValueChange={(itemValue, itemIndex) => {
                          if (itemIndex !== 0) {
                            setFieldValue("entry_point", itemValue);
                            onChangeEntryPoint(itemValue);
                          }
                        }}
                      >
                        <Picker.Item
                          label="-- Seleccione o ponto de Entrada --"
                          value=""
                        />
                        {entryPoints.map((item) => (
                          <Picker.Item
                            key={item.id}
                            label={item.name}
                            value={item.id}
                          />
                        ))}
                      </Picker>
                      <FormControl.ErrorMessage>
                        {errors.entry_point}
                      </FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={"us_id" in errors}>
                      <FormControl.Label>Localização</FormControl.Label>
                      <Picker
                        style={styles.dropDownPicker}
                        selectedValue={values.us_id}
                        onValueChange={(itemValue, itemIndex) => {
                          if (itemIndex !== 0) {
                            setFieldValue("us_id", itemValue);
                            onChangeUs(itemValue);
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

                    <FormControl isRequired isInvalid={"date" in errors}>
                      <FormControl.Label>Data Benefício</FormControl.Label>
                      <HStack alignItems="center">
                        <InputGroup
                          w={{
                            base: "70%",
                            md: "285",
                          }}
                        >
                          <InputLeftAddon>
                            <MyDatePicker
                              onDateSelection={(e) =>
                                handleDataFromDatePickerComponent(e)
                              }
                              minDate={new Date("2017-01-01")}
                              maxDate={new Date()}
                              currentDate={
                                intervention?.date
                                  ? new Date(intervention?.date)
                                  : new Date()
                              }
                            />
                          </InputLeftAddon>
                          <Input
                            isDisabled
                            w={{
                              base: "70%",
                              md: "100%",
                            }}
                            value={text}
                            placeholder="yyyy-MM-dd"
                          />
                        </InputGroup>
                      </HStack>
                      <FormControl.ErrorMessage>
                        {errors.date}
                      </FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={"provider" in errors}>
                      <FormControl.Label>Provedor do Serviço</FormControl.Label>

                      {checked === false ? (
                        <ModalSelector
                          data={users}
                          keyExtractor={(item) => item.online_id}
                          labelExtractor={(item) =>
                            `${item.name} ${item.surname}`
                          }
                          renderItem={undefined}
                          initValue="Select something yummy!"
                          accessible={true}
                          cancelText={"Cancelar"}
                          searchText={"Pesquisar"}
                          cancelButtonAccessibilityLabel={"Cancel Button"}
                          onChange={(option) => {
                            setSelectedUser(`${option.name} ${option.surname}`);
                            setFieldValue(
                              "provider",
                              `${option.name} ${option.surname}`
                            );
                          }}
                        >
                          <Input
                            type="text"
                            onBlur={handleBlur("provider")}
                            placeholder={currentInformedProvider}
                            onChangeText={handleChange("provider")}
                            value={selectedUser}
                          />
                        </ModalSelector>
                      ) : (
                        <Input
                          onBlur={handleBlur("provider")}
                          placeholder="Insira o Nome do Provedor"
                          onChangeText={handleChange("provider")}
                          value={values.provider}
                        />
                      )}
                      <Checkbox value="one" onChange={onChangeToOutros}>
                        Outro
                      </Checkbox>

                      <FormControl.ErrorMessage>
                        {errors.provider}
                      </FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl>
                      <FormControl.Label>Outras Observações</FormControl.Label>

                      <Input
                        onBlur={handleBlur("remarks")}
                        placeholder=""
                        onChangeText={handleChange("remarks")}
                        value={values.remarks}
                      />
                    </FormControl>
                    <Button
                      isLoading={loading}
                      isLoadingText="Cadastrando"
                      onPress={handleSubmit}
                      my="10"
                      colorScheme="primary"
                    >
                      Atender
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
  services: database.collections.get("services").query(),
  subServices: database.collections.get("sub_services").query().observe(),
}));

export default enhance(ServicesForm);
