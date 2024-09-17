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
  InfoIcon,
  Alert,
  Button,
  Image,
  useToast,
  IconButton,
  CloseIcon,
  Link,
  Modal,
  Pressable,
  Icon,
} from "native-base";
import { navigate } from "../../routes/NavigationRef";
import { Formik } from "formik";
import { Q } from "@nozbe/watermelondb";
import NetInfo from "@react-native-community/netinfo";
import { database } from "../../database";
import {
  LOGIN_API_URL,
  PING_URL,
  SYNC_API_URL_PREFIX,
  VERIFY_USER_API_URL,
} from "../../services/api";
import { MaterialIcons } from "@native-base/icons";
import { sync } from "../../database/sync";
import { useDispatch, useSelector } from "react-redux";
import bcrypt from "bcryptjs";
import Spinner from "react-native-loading-spinner-overlay";
import styles from "./style";
import { loadUser } from "../../store/authSlice";
import moment from "moment";
import { COUNSELOR, MENTOR, NURSE, SUPERVISOR } from "../../utils/constants";
import axios from "axios";
import { beneficiariesFetchCount } from "../../services/beneficiaryService";
import { getBeneficiariesTotal } from "../../store/beneficiarySlice";
import { referencesFetchCount } from "../../services/referenceService";
import { getReferencesTotal } from "../../store/referenceSlice";
import { loadBeneficiariesInterventionsCounts } from "../../store/beneficiaryInterventionSlice";
import { beneficiariesInterventionsFetchCount } from "../../services/beneficiaryInterventionService";
import { updateSyncInProgress } from "../../store/syncSlice";
import { ErrorHandler, SuccessHandler } from "../../components/SyncIndicator";
import { benfList, cleanData, destroyBeneficiariesData, ErrorCleanHandler, filterData, InfoHandler } from "../../components/DataClean";

interface LoginData {
  email?: string | undefined;
  username?: string | undefined;
  password?: string | undefined;
  rePassword?: string | undefined;
}

const Login: React.FC = ({ route }: any) => {
  const params: any = route?.params;
  const resetPassword: any = params?.resetPassword;
  const [loggedUser, setLoggedUser] = useState<any>(undefined);
  const [localLoggedUser, setLocalLoggedUser] = useState<any>(undefined);
  const [isInvalidCredentials, setIsInvalidCredentials] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [show, setShow] = React.useState(false);
  const [showCleanModal, setShowCleanModal] = useState(false);

  const [token, setToken] = useState();

  const toasty = useToast();

  const users = database.collections.get("users");
  const sequences = database.collections.get("sequences");
  const userDetails = database.collections.get("user_details");
  const references = database.collections.get("references");
  const beneficiaries_interventions = database.collections.get("beneficiaries_interventions");

  const dispatch = useDispatch();
  const [passwordExpired, setPasswordExpired] = useState(false);
  const [
    isLoggedUserDifferentFromSyncedUser,
    setLoggedUserDifferentFromSyncedUser,
  ] = useState(false);
  const syncInProgress = useSelector((state: any) => state.sync.syncInProgress);

  const showToast = (message: {} | null | undefined, description: string | undefined) => {
    return toasty.show({
      placement: "top",
      render: () => {
        return (
          <Alert w="100%" status="error">
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
  };

  const fetchPrefix = async (username: string): Promise<any> => {
    // fetch the prefix
    await fetch(`${SYNC_API_URL_PREFIX}?username=${username}`)
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status && response.status !== 200) {
          // unauthorized
          return showToast("Ocorreu um Erro!", getMessage(response.status));
        } else {
          await database.write(async () => {
            await sequences.create((sequence: any) => {
              sequence.prefix = response.sequence;
              sequence.last_nui = "11111";
            });
          });
        }
      })
      .catch((error) => {
        showToast("Por favor contacte o suporte!", error);
        return undefined;
      });
  };

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setIsOffline(offline);
    });
    return () => removeNetInfoSubscription();
  }, []);

  // watch changes to loggedUser, sync
  useEffect(() => {
    if (loggedUser) {
      dispatch(updateSyncInProgress(true));
      sync({ username: loggedUser.username })
        .then(() => {
          toasty.show({
            placement: "top",
            render: () => {
              return <SuccessHandler />;
            },
          });
          getTotals().catch((err) => console.log(err));
          isDateToCleanData().catch((err) => console.log(err));
        })
        .catch(() => {
          dispatch(updateSyncInProgress(false));
          toasty.show({
            placement: "top",
            render: () => {
              return <ErrorHandler />;
            },
          });
        });
      if (loggedUser.newPassword == "1") {
        navigate({
          name: "ChangePassword",
          params: { loggedUser: loggedUser, token: token },
        });
      } else if (loggedUser.isEnabled == "1") {
        navigate({
          name: "Main",
          params: {
            loggedUser: loggedUser,
            token: token,
            passwordExpired: true,
            loading: true,
          },
        });
      }
      setLoggedUser(undefined);
    }
  }, [loggedUser]);

  const getTotals = useCallback(async () => {
    const countBen = await beneficiariesFetchCount();
    dispatch(getBeneficiariesTotal(countBen));

    const countRef = await referencesFetchCount();
    dispatch(getReferencesTotal(countRef));

    const beneficiaryIntervsCont = await beneficiariesInterventionsFetchCount();
    dispatch(loadBeneficiariesInterventionsCounts(beneficiaryIntervsCont));

    dispatch(updateSyncInProgress(false));
  }, []);

  const validate = useCallback((values: any) => {
    const errors: LoginData = {};

    if (!values.username) {
      errors.username = "Obrigatório";
    }

    if (!values.password) {
      errors.password = "Obrigatório";
    }

    return errors;
  }, []);

  const getMessage = useCallback((status) => {
    setLoading(false);
    if (status == 404) {
      return "O utilizador informado não está cadastrado no sistema, para autenticar precisa estar cadastrado no sistema";
    } else if (status == 423) {
      return "O utilizador informado encontra-se inactivo, por favor contacte a equipe de suporte para activação do utilizador";
    } else if (status == 401) {
      return "A password informada não está correcta, por favor corrija a password e tente novamente";
    } else if (status == 500) {
      return "Ocorreu um Erro na autenticação do seu utilizador, por favor contacte a equipe de suporte para mais detalhes!";
    } else if (status == undefined) {
      return "Do momento o sistema encontra-se em manutenção, por favor aguarde a disponibilidade do sistema e tente novamente";
    }
  }, []);

  const onSubmit = useCallback(async (values: any) => {
    setLoading(true);

    // check if users table is synced
    const checkSynced = await users
      .query(Q.where("_status", "synced"))
      .fetchCount();

    const logguedUser: any = (
      await users
        .query(
          Q.where(
            "username",
            Q.like(`${Q.sanitizeLikeString(values.username.trim())}`)
          )
        )
        .fetch()
    )[0];

    if (
      checkSynced == 0 ||
      resetPassword === "1" ||
      logguedUser?._raw.is_awaiting_sync == 1
    ) {
      // checkSynced=0 when db have not synced yet

      if (isOffline) {
        setLoading(false);
        return showToast(
          "Sem Conexão a Internet",
          "Conecte-se a Internet para o primeiro Login!"
        );
      }

      try {
        await fetch(`${PING_URL}`);
      } catch (error) {
        setLoading(false);
        return showToast(
          "Sistema em Manutenção",
          "Do momento o sistema encontra-se em manutenção, por favor aguarde a disponibilidade do sistema e tente novamente!"
        );
      }

      try {
        const response = await axios.get(
          `${VERIFY_USER_API_URL}/${values.username.trim()}`
        );
        if (response.data) {
          const profileId = response.data?.profiles.id;

          if (![MENTOR, NURSE, COUNSELOR, SUPERVISOR].includes(profileId)) {
            setLoading(false);
            return showToast(
              "Restrição de Acesso",
              "Apenas Enfermeiras, Conselheiras, Mentoras e Supervisores Podem Aceder ao Aplicativo Móvel!"
            );
          }
        }
      } catch (error: any) {
        return showToast("Ocorreu um Erro!", getMessage(error.response.status));
      }

      try {
        const loginResponse = await fetch(
          `${LOGIN_API_URL}?username=${values.username.trim()}&password=${encodeURIComponent(
            values.password
          )}`
        );
        const loginJson = await loginResponse.json();
        const status = loginJson.status;
        const account = loginJson.account;

        if (status && status !== 200) {
          if (
            resetPassword === "1" ||
            logguedUser?._raw.is_awaiting_sync == 1
          ) {
            setLoading(false);
            return showToast(
              "Conta bloqueada",
              "Contacte o seu supervisor ou vesite seu e-mail!!!"
            );
          } else {
            return showToast("Ocorreu um Erro!", getMessage(status));
          }
        } else {
          await fetchPrefix(values.username.trim());
          setToken(loginJson.token);
          setLoggedUser(account);
          setLocalLoggedUser(account);
          dispatch(loadUser(account));
          saveUserDatails(account);
          isVeryOldPassword(account);
        }
      } catch (error: any) {
        return showToast("Ocorreu um Erro!", getMessage(error?.status));
      }
      setLoading(false);
    } else {
      try {
        const authenticated = bcrypt.compareSync(
          values.password,
          logguedUser?._raw?.password
        );
        const userDetailsQ = await userDetails.query().fetch();

        if (!authenticated) {
          setIsInvalidCredentials(true);
        } else if (
          logguedUser?._raw.online_id !== userDetailsQ[0]?._raw?.["user_id"]
        ) {
          setLoggedUserDifferentFromSyncedUser(true);
        } else {
          if (logguedUser?._raw._status != "updated") {
            await database.write(async () => {
              const now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
              await logguedUser.update(
                (record: any) => {
                  (record.last_login_date = now),
                  (record.date_updated = now),
                  record._status = "updated";
                }
              );
              const userDetailss = await userDetails
                .query(Q.where("user_id", parseInt(logguedUser.online_id)))
                .fetch();
              await userDetailss[0].update(
                (record: any) => {
                  (record.last_login_date = now)
                }
              );
              
            });
          }
          setIsInvalidCredentials(false);
          setLoggedUser(logguedUser?._raw);
          setLocalLoggedUser(logguedUser?._raw);
          dispatch(loadUser(logguedUser?._raw));
          isVeryOldPassword(logguedUser?._raw);
          navigate({
            name: "Main",
            params: {
              loggedUser: logguedUser?._raw,
              loading: loggedUser === undefined,
            },
          });
        }
      } catch (error) {
        console.log(error);
        setIsInvalidCredentials(true);
      }
      setLoading(false);
    }
  }, []);

  const isVeryOldPassword = useCallback(async (user) => {
    let passwordLastChangeDate: moment.MomentInput;
    const today = moment(new Date());

    if (user.online_id) {
      const userDetailss = await userDetails
        .query(Q.where("user_id", parseInt(user.online_id)))
        .fetch();
      passwordLastChangeDate = userDetailss[0]["password_last_change_date"];
    } else {
      passwordLastChangeDate =
        user.passwordLastChangeDate !== null
          ? user.passwordLastChangeDate
          : user.dateCreated;
    }

    const lastChangeDate = moment(passwordLastChangeDate);
    const diff = moment.duration(today.diff(lastChangeDate));
    return diff.asDays() > 182
      ? setPasswordExpired(true)
      : setPasswordExpired(false);
  }, []);

  const isDateToCleanData = useCallback(async () => {
    let next_clean_date: moment.MomentInput;
    let userID: string;
    let wasCleaned: null;
    const today = moment(new Date());
    const now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    const userDetailss = await userDetails.query().fetch();
    next_clean_date = userDetailss[0]["next_clean_date"];
    userID = userDetailss[0]["user_id"];
    wasCleaned = userDetailss[0]["was_cleaned"];
    let newDate = new Date(now);
    newDate.setDate(newDate.getDate() + 7);

    const diff = moment.duration(today.diff(next_clean_date));

    if (diff.asDays() >= 7) {
       // setShowCleanModal(true);

       const referencesCollection = await references.query().fetch();
       const interventionsCollection = await beneficiaries_interventions.query().fetch();
 
       const interventionsCollectionIDsList = await filterData(
         interventionsCollection
       );
       const myIDsList = await filterData(referencesCollection);
 
       const allBenfIds = [...myIDsList, ...interventionsCollectionIDsList];
       const uniqueBenfIds = await cleanData(allBenfIds);
       const benfsList = await benfList(uniqueBenfIds); 
 
       await destroyBeneficiariesData(benfsList)
         .then(() => {
           toasty.show({
             placement: "top",
             render: () => {
               setLoading(false);
               return <InfoHandler />;
             },
           });
         })
         .catch((error) => {
           toasty.show({
             placement: "top",
             render: () => {
               setLoading(false);
               return <ErrorCleanHandler />;
             },
           });
 
           console.error("Erro ao deletar registros:", error);
            setLoading(false);
         });
 
     } else if(wasCleaned == null && next_clean_date == null) {
 
       // setShowCleanModal(true);
 
     }else{
 
       await database.write(async () => {
         const findUser = await userDetails
         .query(Q.where("user_id", parseInt(userID)))
         .fetch();
         await findUser[0].update(
           (record: any) => {
             (record.next_clean_date = newDate.toISOString().replace('T', ' ').substring(0, 19)),
             (record.was_cleaned = 0)
           }
         );
       });
    }
  }, []);

  useEffect(() => {
    if (passwordExpired) {
      navigate({
        name: "ChangePassword",
        params: {
          loggedUser: localLoggedUser,
          token: token,
          passwordExpired: passwordExpired,
        },
      });
    }
  }, [passwordExpired, setPasswordExpired]);

  const saveUserDatails = useCallback(async (user) => {
    const provinces_ids = user.provinces.map((province: { id: any; }) => {
      return province.id;
    });
    const district_ids = user.districts.map((district: { id: any; }) => {
      return district.id;
    });
    const localities_ids = user.localities.map((locality: { id: any; }) => {
      return locality.id;
    });
    const uss_ids = user.us.map((us: { id: any; }) => {
      return us.id;
    });
    const timestamp =
      user.passwordLastChangeDate !== null
        ? user.passwordLastChangeDate
        : user.dateCreated;
    const date = new Date(timestamp);
    const formattedDate = date.toISOString().slice(0, 10) + " " + date.toISOString().slice(11, 19);;
    
    const lastLoginDate = new Date();
    const lastLoginFormatted = lastLoginDate.toISOString().slice(0, 10) + " " + lastLoginDate.toISOString().slice(11, 19);;

    await database.write(async () => {
      await userDetails.create((userDetail: any) => {
        userDetail.user_id = user.id;
        userDetail.provinces = provinces_ids.toString();
        userDetail.districts = district_ids.toString();
        userDetail.localities = localities_ids.toString();
        userDetail.uss = uss_ids.toString();
        userDetail.last_login_date = lastLoginFormatted;
        userDetail.password_last_change_date = formattedDate;
        userDetail.profile_id = user.profiles.id;
        userDetail.entry_point = user.entryPoint;
        userDetail.partner_id = user.partners.id;
      });
    });
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
                <Text color="warmGray.400">Dreams Layering Tool</Text>
              </Heading>
              <Heading
                color="coolGray.600"
                _dark={{ color: "warmGray.200" }}
                fontWeight="medium"
                size="lg"
                py="2"
              >
                <Text color="darkBlue.800">Autenticação </Text>
              </Heading>
            </Center>
            <Center w="90%">
              {isInvalidCredentials ? (
                <Alert w="100%" status="error">
                  <HStack space={4} flexShrink={1}>
                    <Alert.Icon mt="1" />
                    <Text fontSize="sm" color="coolGray.800">
                      Utilizador ou Senha Inválidos!
                    </Text>
                  </HStack>
                </Alert>
              ) : (
                <></>
              )}
            </Center>
            <Center w="90%">
              <Formik
                initialValues={{
                  username: "",
                  password: "",
                }}
                onSubmit={onSubmit}
                validate={validate}
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
                        placeholder="Insira o Utilizador"
                        onChangeText={handleChange("username")}
                        value={values.username}
                      />
                      <FormControl.ErrorMessage>
                        {errors.username}
                      </FormControl.ErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={"password" in errors}>
                      <FormControl.Label>Senha</FormControl.Label>
                      <Input
                        type={show ? "text" : "password"}
                        onBlur={handleBlur("password")}
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
                        onChangeText={handleChange("password")}
                        value={values.password}
                      />
                      <FormControl.ErrorMessage>
                        {errors.password}
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
                      isLoading={loading}
                      isLoadingText="Autenticando"
                      onPress={handleSubmit}
                      my="10"
                      colorScheme="primary"
                    >
                      Autenticar
                    </Button>
                    <Link
                      // href="https://nativebase.io"
                      onPress={() => navigate({ name: "ResetPassword" })}
                      isExternal
                      _text={{
                        color: "blue.400",
                      }}
                      mt={-0.5}
                      _web={{
                        mb: -1,
                      }}
                    >
                      Esqueceu a senha?
                    </Link>
                  </VStack>
                )}
              </Formik>
            </Center>
          </VStack>
        </Box>

        <Center>
          <Modal
            isOpen={isLoggedUserDifferentFromSyncedUser}
            onClose={() => {
              setLoggedUserDifferentFromSyncedUser(false);
            }}
          >
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>
                Utilizador Logado Diferente do Sincronizado
              </Modal.Header>
              <Modal.Body>
                <Box alignItems="center">
                  {/* <Ionicons name="md-checkmark-circle" size={100} color="#0d9488" /> */}
                  <Alert w="100%" status="warning">
                    <VStack space={2} flexShrink={1}>
                      <HStack>
                        <InfoIcon mt="1" />
                        <Text fontSize="sm" color="coolGray.800">
                          O usuário logado não é o usuário sincronizado com este
                          dispositivo. Caso queira usar outro usuário, por favor
                          reinstale o aplicativo!{" "}
                        </Text>
                      </HStack>
                    </VStack>
                  </Alert>
                  <Text></Text>
                </Box>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </Center>

        <Center>
          <Modal
            isOpen={showCleanModal}
            onClose={() => setShowCleanModal(false)}
          >
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>Limpeza regular de dados</Modal.Header>
              <Modal.Body>
                <ScrollView>
                  <Box alignItems="center">
                    {/* <Ionicons name="md-checkmark-circle" size={100} color="#0d9488" /> */}
                    <Alert w="100%" status="success">
                      <VStack space={2} flexShrink={1}>
                        <HStack>
                          <InfoIcon mt="1" />
                          <Text fontSize="sm" color="coolGray.800">
                            Faca a limpeza regular de dados o mais breve
                            possivel de modo a melhorar a performace.
                          </Text>
                        </HStack>
                      </VStack>
                    </Alert>
                    <Text></Text>
                  </Box>
                </ScrollView>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </Center>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default memo(Login);
