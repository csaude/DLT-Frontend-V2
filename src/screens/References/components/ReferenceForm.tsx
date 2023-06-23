import React, {
  useEffect,
  useState,
  useContext,
  memo,
  useCallback,
} from "react";
import { TouchableHighlight } from "react-native";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import {
  View,
  HStack,
  Text,
  VStack,
  FormControl,
  Input,
  TextArea,
  Icon,
  Box,
  IconButton,
  Flex,
  Heading,
  Divider,
  useToast,
  Alert,
  InputGroup,
  InputLeftAddon,
} from "native-base";
import { MaterialIcons, Ionicons } from "@native-base/icons";
import { useFormik } from "formik";
import { database } from "../../../database";
import { Q } from "@nozbe/watermelondb";
import { navigate } from "../../../routes/NavigationRef";
import { Picker } from "@react-native-picker/picker";
import ModalSelector from "react-native-modal-selector-searchable";
import styles from "./styles1";
import moment from "moment";
import { sync } from "../../../database/sync";
import { SuccessHandler } from "../../../components/SyncIndicator";
import { Context } from "../../../routes/DrawerNavigator";
import MyDatePicker from "../../../components/DatePicker";
import { calculateAge } from "../../../models/Utils";
import { COMMUNITY, SCHOOL, US } from "../../../utils/constants";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { useDispatch } from "react-redux";
import { beneficiariesFetchCount } from "../../../services/beneficiaryService";
import { getBeneficiariesTotal } from "../../../store/beneficiarySlice";
import { referencesFetchCount } from "../../../services/referenceService";
import { getReferencesTotal } from "../../../store/referenceSlice";
import NetInfo from "@react-native-community/netinfo";

const ReferenceForm: React.FC = ({ route }: any) => {
  const { beneficiary, userId, refs } = route.params;

  const toast = useToast();
  const dispatch = useDispatch();

  const [errors, setErrors] = useState(false);
  const [partners, setPartners] = useState<any>([]);
  const [us, setUs] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<any>("");
  const [services, setServices] = useState<any>([]);
  const [referServices, setReferServices] = useState<any>([]);
  const [entryPoint, setEntryPoint] = useState<any>(undefined);
  const [entryPoints, setEntryPoints] = useState<any>([]);
  const [entryPointEnabled] = useState(true);
  const [serviceTypes, setServiceTypes] = useState<any>([]);
  const [isSync, setIsSync] = useState(false);
  const [loading, setLoading] = useState(false);
  const loggedUser: any = useContext(Context);
  const [isOffline, setIsOffline] = useState(false);
  const [refNote, setRefNote] = useState("");

  const fetchEntryPoints = useCallback(async () => {
    const user = await database
      .get("users")
      .query(Q.where("online_id", userId))
      .fetch();
    const userSerialized = user.map((item) => item._raw);

    const partner = await database
      .get("partners")
      .query(Q.where("online_id", (userSerialized[0] as any).partner_id))
      .fetch();
    const partnerSerialized = partner.map((item) => item._raw);

    const partnerType = (partnerSerialized[0] as any).partner_type;

    if ((userSerialized[0] as any).entry_point === "3") {
      setEntryPoints([US, COMMUNITY, SCHOOL]);
    } else if (partnerType === "1") {
      setEntryPoints([COMMUNITY, SCHOOL]);
    } else if (partnerType === "2") {
      setEntryPoints([US, SCHOOL]);
    } else {
      setEntryPoints([US, COMMUNITY, SCHOOL]);
    }

    setEntryPoint(
      (userSerialized[0] as any).entry_point == "1"
        ? "US"
        : (userSerialized[0] as any).entry_point == "2"
        ? "CM"
        : "ES"
    );
  }, []);

  const getRefNote = useCallback(async () => {
    const prefix: any = (await database.get("sequences").query().fetch())[0]
      ?._raw;
    setRefNote(
      "REFDR" + prefix.prefix + "0" + String(refs + 1).padStart(3, "0")
    );
  }, []);

  useEffect(() => {
    fetchEntryPoints().catch((error) => console.log(error));
    getRefNote().catch((error) => console.log(error));

    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const status = !(state.isConnected && state.isInternetReachable);
      setIsOffline(status);
    });
    return () => removeNetInfoSubscription();
  }, []);

  const formik = useFormik({
    initialValues: {
      refer_to: "",
      book_number: "",
      reference_code: "",
      service_type: "",
      partner_id: "",
      us_id: "",
      notify_to: "",
      date: "",
      description: "",
      status: 1,
    },
    onSubmit: (values) => console.log(values),
    validate: (values) => validate(values),
    validateOnBlur: false,
    validateOnChange: false,
  });

  const onNextStep = () => {
    const errorsList = validate(formik.values);
    const hasErrors = JSON.stringify(errorsList) !== "{}";

    if (hasErrors) {
      setErrors(true);
      formik.setErrors(errorsList);
    } else {
      setErrors(false);
    }
  };

  const onNextStep2 = () => {
    if (referServices.length == 0) {
      setErrors(true);
      toast.show({
        placement: "top",
        render: () => {
          return <ErrorHandler />;
        },
      });
    } else {
      setErrors(false);
    }
  };

  const validate = useCallback((values: any) => {
    const errors: any = {};

    if (!values.refer_to) {
      errors.refer_to = "Obrigatório";
    }

    if (!values.book_number) {
      errors.book_number = "Obrigatório";
    }

    if (!values.reference_code) {
      errors.reference_code = "Obrigatório";
    }

    if (!values.service_type) {
      errors.service_type = "Obrigatório";
    }

    if (!values.partner_id) {
      errors.partner_id = "Obrigatório";
    }

    if (!values.us_id) {
      errors.us_id = "Obrigatório";
    }

    if (!values.notify_to) {
      errors.notify_to = "Obrigatório";
    }

    if (!values.date) {
      errors.date = "Obrigatório";
    }

    return errors;
  }, []);

  const onChangePE = (value: any) => {
    if (value === "1") {
      setServiceTypes([{ id: "1", name: "Clínico" }]);
      formik.setFieldValue("service_type", "1");
      onChangeServiceType("1");
    } else if (value === "2") {
      setServiceTypes([{ id: "2", name: "Comunitário" }]);
      formik.setFieldValue("service_type", "2");
      onChangeServiceType("2");
    } else {
      setServiceTypes([
        { id: "1", name: "Clínico" },
        { id: "2", name: "Comunitário" },
      ]);
      formik.setFieldValue("service_type", "0");
      onChangeServiceType("0");
    }
    fetchUsData(Number(value));
  };

  const onChangeServiceType = async (value: any) => {
    const getPartnerList = await database
      .get("partners")
      .query(
        Q.where("partner_type", value),
        Q.where("district_id", Number(beneficiary?.district_id))
      )
      .fetch();
    const partnersSerialized = getPartnerList.map((item) => item._raw);

    setPartners(partnersSerialized);

    fetchServices(value);
  };

  const fetchUsData = async (value: any) => {
    const getUsList = await database
      .get("us")
      .query(
        Q.where("entry_point", value),
        Q.where("locality_id", Number(beneficiary?.locality_id))
      )
      .fetch();
    const usSerialized = getUsList.map((item) => item._raw);
    setUs(usSerialized);
  };

  const fetchServices = async (value: any) => {
    const getServicesList = await database
      .get("services")
      .query(Q.where("service_type", value))
      .fetch();
    let servicesSerialized = getServicesList.map((item) => item._raw);
    const age = calculateAge(beneficiary.date_of_birth);

    if (age < 15) {
      if (age < 14 && value == 2) {
        // Retirar Guião de facilitação e AFLATEEN
        servicesSerialized = servicesSerialized.filter(
          (s) => ![46, 49, 52, 57].includes(s["online_id"])
        );
      }
      if (
        beneficiary.vblt_sexually_active != null &&
        beneficiary.vblt_sexually_active == 0 &&
        value == 1
      ) {
        // Retirar Promoção e Provisão de Preservativos e Aconselhamento e testagem em saúde
        servicesSerialized = servicesSerialized.filter(
          (s) => ![1, 9].includes(s["online_id"])
        );
      }
      if (beneficiary.vblt_is_student == 0) {
        if (value == 2) {
          // Retirar AVANTE ESTUDANTE
          servicesSerialized = servicesSerialized.filter(
            (s) => ![45, 48, 51].includes(s["online_id"])
          );
        }
      } else {
        if (value == 2) {
          // Retirar AVANTE RAPARIGA
          servicesSerialized = servicesSerialized.filter(
            (s) => ![44, 47, 50].includes(s["online_id"])
          );
        }
      }
    } else if (value == 2) {
      // Retirar AVANTE RAPARIGA e AVANTE ESTUDANTE e AFLATOUN
      servicesSerialized = servicesSerialized.filter(
        (s) => ![44, 45, 47, 48, 50, 51, 56].includes(s["online_id"])
      );
    }
    setServices(servicesSerialized);
  };

  const onChangeUs = async (value: any) => {
    const getUsersList = await database
      .get("users")
      .query(
        Q.where("us_ids", Q.like(`%${value}%`)),
        Q.where("partner_id", formik.values.partner_id),
        Q.where("status", 1)
      )
      .fetch();
    const usersSerialized = getUsersList.map((item) => item._raw);
    setUsers(usersSerialized);
  };

  const onChangePartner = async (value: any) => {
    const getUsersList = await database
      .get("users")
      .query(
        Q.where("us_ids", Q.like(`%${formik.values.us_id}%`)),
        Q.where("partner_id", value)
      )
      .fetch();
    const usersSerialized = getUsersList.map((item) => item._raw);
    setUsers(usersSerialized);
  };
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

  const handleSubmit = async () => {
    setLoading(true);

    const savedR = await database.write(async () => {
      const newReference = await database
        .get("references")
        .create((ref: any) => {
          ref.beneficiary_id = beneficiary.online_id;
          ref.beneficiary_nui = beneficiary.nui;
          ref.beneficiary_offline_id = beneficiary.id;
          ref.refer_to = formik.values.refer_to;
          (ref.referred_by = userId), (ref.notify_to = formik.values.notify_to);
          ref.reference_note = refNote;
          ref.description = formik.values.description;
          ref.book_number = formik.values.book_number;
          ref.reference_code = formik.values.reference_code;
          ref.service_type = formik.values.service_type;
          ref.date = formik.values.date;
          ref.remarks = formik.values.description;
          ref.status = 0;
          ref.us_id = formik.values.us_id;
          ref.user_created = "" + userId;
          ref.date_created = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        });

      return newReference;
    });

    await database.write(async () => {
      referServices.forEach(async (element) => {
        await database.get("references_services").create((refServ: any) => {
          refServ.reference_id = savedR._raw.id;
          refServ.service_id = element.online_id;
          refServ.status = 0;
          refServ.date_created = moment(new Date()).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
      });
    });

    syncronize();
    await delay(5000);
    syncronize();
    await delay(1000);

    const syncedReferences = await database
      .get("references")
      .query(
        Q.or(
          Q.where("beneficiary_offline_id", beneficiary.id),
          Q.where("beneficiary_id", beneficiary.online_id)
        )
      )
      .fetch();

    const serializedReferences = syncedReferences.map((item) => item._raw);

    navigate({
      name: "Referencias",
      params: {
        beneficiary: beneficiary,
        references: serializedReferences,
      },
      merge: true,
    });

    setLoading(false);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const syncronize = () => {
    setLoading(true);
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
    setLoading(false);

    getTotals().catch((err) => console.error(err));
  };

  const getTotals = async () => {
    const countBen = await beneficiariesFetchCount();
    dispatch(getBeneficiariesTotal(countBen));

    const countRef = await referencesFetchCount();
    dispatch(getReferencesTotal(countRef));
  };

  const handleDataFromDatePickerComponent = useCallback((selectedDate) => {
    const tempDate = new Date(selectedDate);
    formik.setFieldValue("date", moment(tempDate).format("YYYY-MM-DD"));
  }, []);

  const onRemoveService = (value: any) => {
    setReferServices((refserv) =>
      refserv.filter((item) => item.online_id !== value.online_id)
    );
  };

  const onSelectService = (value: any) => {
    const exists = referServices.some((item) => {
      return item.online_id === value.online_id;
    });

    if (!exists) {
      setReferServices((refserv) => [...refserv, value]);
    }
  };

  const getUsName = (usId: any) => {
    const us_a = us.filter((item) => item.online_id === usId);
    return us_a[0]?.name;
  };

  const getPartnersName = (id: any) => {
    const partners_a = partners.filter((item) => item.online_id === id);
    return partners_a[0]?.name;
  };

  const renderItem = useCallback(
    (data: any) => (
      <TouchableHighlight
        style={styles.rowFront}
        underlayColor={"#AAA"}
        key={data.online_id}
      >
        <HStack
          w="100%"
          px={4}
          flex={1}
          space={5}
          alignItems="center"
          key={data.online_id}
        >
          <Ionicons name="medkit" size={35} color="#0d9488" />
          <VStack width="250px">
            <Text
              _dark={{
                color: "warmGray.50",
              }}
              color="darkBlue.800"
            >
              {data.name}
            </Text>
          </VStack>
          <IconButton
            size="sm"
            colorScheme="trueGray"
            onPress={() => onRemoveService(data)}
            icon={
              <Icon as={Ionicons} name="trash" size="lg" color="trueGray.400" />
            }
          />
        </HStack>
      </TouchableHighlight>
    ),
    []
  );

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {loading ? (
          <Spinner
            visible={true}
            textContent={"Registando a referência..."}
            textStyle={styles.spinnerTextStyle}
          />
        ) : undefined}
        <ProgressSteps>
          <ProgressStep
            label="Dados da Referencia"
            onNext={onNextStep}
            errors={errors}
            nextBtnText="Próximo >>"
          >
            <View style={{ alignItems: "center" }}>
              <VStack space={3} w="90%">
                <FormControl isRequired isInvalid={"refer_to" in formik.errors}>
                  <FormControl.Label>Referir Para</FormControl.Label>
                  <Picker
                    style={styles.textBlack}
                    selectedValue={formik.values.refer_to}
                    enabled={entryPointEnabled}
                    onValueChange={(itemValue, itemIndex) => {
                      if (itemIndex !== 0) {
                        formik.setFieldValue("refer_to", itemValue);
                        onChangePE(itemValue);
                      }
                    }}
                  >
                    <Picker.Item label="-- Seleccione o PE --" value="0" />
                    {entryPoints.map((item) => (
                      <Picker.Item
                        key={item.id}
                        label={item.name}
                        value={item.id}
                      />
                    ))}
                  </Picker>
                  <FormControl.ErrorMessage>
                    {formik.errors.refer_to}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={"book_number" in formik.errors}
                >
                  <FormControl.Label>Nº do Livro</FormControl.Label>
                  <Input
                    onBlur={formik.handleBlur("book_number")}
                    placeholder="Insira o Nº do Livro"
                    onChangeText={formik.handleChange("book_number")}
                    value={formik.values.book_number}
                  />
                  <FormControl.ErrorMessage>
                    {formik.errors.book_number}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={"reference_code" in formik.errors}
                >
                  <FormControl.Label>
                    {"Cód. Ref. Livro (PE:" +
                      entryPoint +
                      "; Pág.; Mês:1-12; Ano:23-99)"}
                  </FormControl.Label>
                  <Input
                    onBlur={formik.handleBlur("reference_code")}
                    placeholder="Ex: PE-NºPag-Mês-Ano"
                    onChangeText={formik.handleChange("reference_code")}
                    value={formik.values.reference_code}
                  />
                  <FormControl.ErrorMessage>
                    {formik.errors.reference_code}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={"service_type" in formik.errors}
                >
                  <FormControl.Label>Tipo de Serviço</FormControl.Label>
                  <Picker
                    style={styles.textBlack}
                    selectedValue={formik.values.service_type}
                    enabled={serviceTypes.length > 1}
                    onValueChange={(itemValue, itemIndex) => {
                      if (itemIndex !== 0) {
                        formik.setFieldValue("service_type", itemValue);
                        onChangeServiceType(itemValue);
                      }
                    }}
                  >
                    <Picker.Item
                      label="-- Seleccione o Tipo de Serviço --"
                      value="0"
                    />
                    {serviceTypes.map((item) => (
                      <Picker.Item
                        key={item.id}
                        label={item.name}
                        value={item.id}
                      />
                    ))}
                  </Picker>
                  <FormControl.ErrorMessage>
                    {formik.errors.service_type}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={"partner_id" in formik.errors}
                >
                  <FormControl.Label>Organização</FormControl.Label>
                  <Picker
                    style={styles.textBlack}
                    selectedValue={formik.values.partner_id}
                    onValueChange={(itemValue, itemIndex) => {
                      if (itemIndex !== 0) {
                        formik.setFieldValue("partner_id", itemValue);
                        onChangePartner(itemValue);
                      }
                    }}
                  >
                    <Picker.Item
                      label="-- Seleccione a Organização --"
                      value="0"
                    />
                    {partners.map((item) => (
                      <Picker.Item
                        key={item.online_id}
                        label={item.name}
                        value={item.online_id}
                      />
                    ))}
                  </Picker>
                  <FormControl.ErrorMessage>
                    {formik.errors.partner_id}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={"us_id" in formik.errors}>
                  <FormControl.Label>Local</FormControl.Label>
                  <Picker
                    style={styles.textBlack}
                    selectedValue={formik.values.us_id}
                    onValueChange={(itemValue, itemIndex) => {
                      if (itemIndex !== 0) {
                        formik.setFieldValue("us_id", itemValue);
                        onChangeUs(itemValue);
                      }
                    }}
                  >
                    <Picker.Item label="-- Seleccione o Local --" value="0" />
                    {us.map((item) => (
                      <Picker.Item
                        key={item.online_id}
                        label={item.name}
                        value={item.online_id}
                      />
                    ))}
                  </Picker>
                  <FormControl.ErrorMessage>
                    {formik.errors.us_id}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={"notify_to" in formik.errors}
                >
                  <FormControl.Label>Notificar ao</FormControl.Label>

                  <ModalSelector
                    data={users}
                    keyExtractor={(item) => item.online_id}
                    labelExtractor={(item) => `${item.name} ${item.surname}`}
                    renderItem={undefined}
                    initValue="Select something yummy!"
                    accessible={true}
                    cancelText={"Cancelar"}
                    searchText={"Pesquisar"}
                    cancelButtonAccessibilityLabel={"Cancel Button"}
                    onChange={(option) => {
                      setSelectedUser(`${option.name} ${option.surname}`);
                      formik.setFieldValue("notify_to", option.online_id);
                    }}
                  >
                    <Input
                      type="text"
                      onBlur={formik.handleBlur("notify_to")}
                      placeholder="Seleccione o provedor a notificar"
                      onChangeText={formik.handleChange("notify_to")}
                      value={selectedUser}
                    />
                  </ModalSelector>

                  <FormControl.ErrorMessage>
                    {formik.errors.notify_to}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={"date" in formik.errors}>
                  <FormControl.Label>Data Emissão</FormControl.Label>
                  <HStack w="100%" flex={1} space={5} alignItems="center">
                    <InputGroup w={{ base: "70%", md: "285" }}>
                      <InputLeftAddon>
                        <MyDatePicker
                          onDateSelection={(e) =>
                            handleDataFromDatePickerComponent(e)
                          }
                          minDate={new Date("2017-01-01")}
                          maxDate={new Date()}
                          currentDate={new Date()}
                        />
                      </InputLeftAddon>
                      <Input
                        isDisabled
                        w={{ base: "70%", md: "100%" }}
                        onPressIn={() => {
                          /**NONE */
                        }}
                        onBlur={formik.handleBlur("name")}
                        value={formik.values.date}
                        onChangeText={formik.handleChange("date")}
                        placeholder="yyyy-MM-dd"
                      />
                    </InputGroup>
                  </HStack>

                  <FormControl.ErrorMessage>
                    {formik.errors.date}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Observações</FormControl.Label>
                  <TextArea
                    onBlur={formik.handleBlur("description")}
                    autoCompleteType={false}
                    value={formik.values.description}
                    onChange={formik.handleChange("description")}
                    w="100%"
                  />
                </FormControl>
              </VStack>
            </View>
          </ProgressStep>
          <ProgressStep
            label="Serviços Referidos"
            onNext={onNextStep2}
            previousBtnText="<< Anterior"
            nextBtnText="Próximo >>"
            errors={errors}
          >
            <Box minH="300">
              <View>
                <View style={styles.heading}>
                  <Box
                    alignItems="center"
                    w="95%"
                    bgColor="white"
                    style={{ borderRadius: 5 }}
                  >
                    <ModalSelector
                      data={services}
                      keyExtractor={(item) => item.online_id}
                      labelExtractor={(item) => item.name}
                      renderItem={undefined}
                      initValue="Seleccione Serviço a Associar"
                      accessible={true}
                      cancelText={"Cancelar"}
                      searchText={"Pesquisar"}
                      cancelButtonAccessibilityLabel={"Cancel Button"}
                      onChange={(option) => {
                        onSelectService(option);
                      }}
                    >
                      <Input
                        minW={390}
                        InputLeftElement={
                          <Icon
                            as={MaterialIcons}
                            name="add-circle"
                            size={5}
                            ml="2"
                            color="muted.700"
                          />
                        }
                        placeholder="Seleccione Serviço a Associar"
                        style={{ borderRadius: 45 }}
                      />
                    </ModalSelector>
                  </Box>
                </View>
                {referServices.length > 0 ? (
                  referServices.map((item) => renderItem(item))
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text color="coolGray.500">
                      Não existem Serviços Associados!
                    </Text>
                  </View>
                )}
              </View>
            </Box>
          </ProgressStep>
          <ProgressStep
            label="Concluir"
            onSubmit={handleSubmit}
            previousBtnText="<< Anterior"
            finishBtnText="Salvar"
          >
            <View style={styles.containerForm}>
              <Flex
                direction="column"
                mb="2.5"
                _text={{ color: "coolGray.800" }}
              >
                <Box p="2" rounded="lg">
                  <Heading size="md" color="coolGray.800">
                    Detalhes da Referência
                  </Heading>
                  <Divider />
                  <Text style={styles.txtLabelInfo}>
                    <Text style={styles.txtLabel}> NUI da Beneficiária : </Text>
                    {beneficiary?.nui}
                  </Text>
                  <Text style={styles.txtLabelInfo}>
                    <Text style={styles.txtLabel}> Nota da Referência: </Text>
                    {refNote}
                  </Text>
                  <Text style={styles.txtLabelInfo}>
                    <Text style={styles.txtLabel}>
                      {" "}
                      Código da Referência do Livro:{" "}
                    </Text>
                    {formik.values.reference_code}
                  </Text>
                  <Text style={styles.txtLabelInfo}>
                    <Text style={styles.txtLabel}> Referência para: </Text>
                    {formik.values.refer_to === "1"
                      ? "Unidade Sanitaria"
                      : formik.values.refer_to === "2"
                      ? "Comunidade"
                      : "Escola"}
                  </Text>
                  <Text style={styles.txtLabelInfo}>
                    <Text style={styles.txtLabel}> Local: </Text>
                    {getUsName(formik.values.us_id)}
                  </Text>
                  <Text style={styles.txtLabelInfo}>
                    <Text style={styles.txtLabel}> Organização: </Text>
                    {getPartnersName(formik.values.partner_id)}
                  </Text>
                  <Text style={styles.txtLabelInfo}>
                    <Text style={styles.txtLabel}> Notificar a(o): </Text>
                    {selectedUser}
                  </Text>
                  <Text style={styles.txtLabelInfo}>
                    <Text style={styles.txtLabel}> Serviços: </Text>
                    {referServices.length}
                  </Text>
                </Box>
              </Flex>
            </View>
          </ProgressStep>
        </ProgressSteps>
      </View>
    </>
  );
};

const ErrorHandler: React.FC = () => {
  return (
    <>
      <Alert w="100%" variant="left-accent" colorScheme="error" status="error">
        <VStack space={2} flexShrink={1} w="100%">
          <HStack
            flexShrink={1}
            space={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack space={2} flexShrink={1} alignItems="center">
              <Alert.Icon />
              <Text color="coolGray.800">Nenhum Serviço Solicitado!</Text>
            </HStack>
          </HStack>
        </VStack>
      </Alert>
    </>
  );
};

export default memo(ReferenceForm);
