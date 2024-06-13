import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Text,
} from "react-native";
import {
  Alert,
  Button,
  Divider,
  Flex,
  FormControl,
  HStack,
  Radio,
  Stack,
  VStack,
  useToast,
  Text as Text1,
} from "native-base";
import { useDispatch } from "react-redux";
import { Context } from "../../routes/DrawerNavigator";
import Spinner from "react-native-loading-spinner-overlay/lib";
import styles from "./styles";
import { useFormik } from "formik";
import withObservables from "@nozbe/with-observables";
import { database } from "../../database";
import { Q } from "@nozbe/watermelondb";
import NetInfo from "@react-native-community/netinfo";
import { SuccessHandler, WithoutNetwork, ErrorHandler as SyncErrorHandler } from "../../components/SyncIndicator";
import { sync } from "../../database/sync";
import { pendingSyncBeneficiaries } from "../../services/beneficiaryService";
import { loadPendingsBeneficiariesInterventionsTotals, loadPendingsBeneficiariesTotals, loadPendingsReferencesTotals } from "../../store/syncSlice";
import { pendingSyncBeneficiariesInterventions } from "../../services/beneficiaryInterventionService";
import { pendingSyncReferences } from "../../services/referenceService";

const DatacleanScreen: React.FC = ({
  references,
  beneficiaries_interventions,
}: any) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const loggedUser: any = useContext(Context);
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [textMessage, setTextMessage] = useState("");

  const todayDate = new Date();
  const sixMonthsAgo = todayDate.setFullYear(
    todayDate.getFullYear(),
    todayDate.getMonth() - 6
  );

  const syncronize = () => {
    setLoading(true);
    if (isOffline) {
      toast.show({
        placement: "top",
        render: () => {
          return <WithoutNetwork />;
        },
      });
      setLoading(false);
    } else {
      sync({ username: loggedUser.username })
        .then(() => {
          setLoading(false);
          toast.show({
            placement: "top",
            render: () => {
              return <SuccessHandler />;
            },
          });
          fetchCounts();
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          toast.show({
            placement: "top",
            render: () => {
              return <SyncErrorHandler />;
            },
          });
          setLoading(false);
        });
      }
    };

    useEffect(() => {      
      const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
        const status = !(state.isConnected && state.isInternetReachable);
        setIsOffline(status);
      });
      return () => removeNetInfoSubscription();
    }, []);

  const destroyBeneficiariesData = async (beneficiaryIds: any) => {
    setLoading(true);
    await database.write(async () => {   
        for (const beneficiaryId of beneficiaryIds) {     
            // console.log(beneficiaryId);
            const recordsInterventions = await database.get('beneficiaries_interventions').query(Q.where('beneficiary_id', beneficiaryId)).fetch();
            for (const record of recordsInterventions) {
                await record.destroyPermanently();
            }
            const recordsReferences = await database.get('references').query(Q.where('beneficiary_id', beneficiaryId)).fetch();
            for (const record of recordsReferences) {
                await record.destroyPermanently();
            }
            const recordsBeneficiaries = await database.get('beneficiaries').query(Q.where('online_id', beneficiaryId)).fetch();
            for (const record of recordsBeneficiaries) {
                await record.destroyPermanently();
            }
        }
    });
  }

  const cleanData = (myDataIDs: any): any => {   
    const flattenedDataIDs = myDataIDs.flat();
    const uniqueArray = Array.from(new Set(flattenedDataIDs));

    return uniqueArray;
  }

  const filterData = (array: any): any => {
    const myArray = [];
    const benfIdsInCOP =[];

    const dataFilter = array.filter(
        (e) => {
          if (new Date(e._raw?.date_created) <= new Date(sixMonthsAgo)) {
            return [...myArray, e._raw];
          }
        }
      );
      const idsFilter = array.filter(
        (e) => {
          if (new Date(e._raw?.date_created) > new Date(sixMonthsAgo)) {
            return [...benfIdsInCOP, e._raw];
          }
        }
      );

    const myDataIDs = dataFilter.map((e: any) => {
      return [...myArray, e._raw?.beneficiary_id];
    });

    const cleanBenfIdsInCOP = idsFilter.map((e: any) => {
        return [...benfIdsInCOP, e._raw?.beneficiary_id];
      });

    const data = cleanData(myDataIDs);
    const bendInCOP = cleanData(cleanBenfIdsInCOP);
    const itemsToRemoveSet = new Set(bendInCOP);

    const commonItems = data.filter((item: any) => itemsToRemoveSet.has(item));
    const resultArray = data.filter((item: any) => !commonItems.includes(item));

    return resultArray;
  }

  const handleSubmit = async () => {
    const errorsList = validate(formik.values);
    const hasErrors = JSON.stringify(errorsList) !== "{}";

    if (hasErrors) {
      setErrors(true);
      formik.setErrors(errorsList);

      toast.show({
        placement: "top",
        render: () => {
          return <ErrorHandler />;
        },
      });
    } else if(formik.values.data_clean === "0"){
      let removeErrorsList = validate(formik.values);
      formik.setErrors(removeErrorsList);
      setErrors(false);
      syncronize();
      
      const referencesCollection = references;
      const interventionsCollection = beneficiaries_interventions;

      const interventionsCollectionIDsList = filterData(interventionsCollection);
      const myIDsList = filterData(referencesCollection);

      const allBenfIds = [...myIDsList, ...interventionsCollectionIDsList];
  
      const uniqueBenfIds = cleanData(allBenfIds);

      destroyBeneficiariesData(uniqueBenfIds).then(() => {
        toast.show({
            placement: "top",
            render: () => {
            return <InfoHandler />;
            },
        });
        console.log('Registros deletados com sucesso'); 
      })
      .catch(error => {
        toast.show({
            placement: "top",
            render: () => {
              return <ErrorCleanHandler />;
            },
          });
          console.error('Erro ao deletar registros:', error);  
          setLoading(false);        
      });

    } else if(formik.values.data_clean === "0"){
        toast.show({
            placement: "top",
            render: () => {
              return <InfoHandlerSave />;
            },
          });
     } else{
        toast.show({
            placement: "top",
            render: () => {
              return <InfoHandlerSave />;
            },
          });
    }
  };

  const formik = useFormik({
    initialValues: {
      data_clean: "",
    },
    onSubmit: (values) => console.log(values),
    validate: (values) => validate(values),
    validateOnBlur: false,
    validateOnChange: false,
  });

  const validate = useCallback((values: any) => {
    const errors: any = {};

    if (!values.data_clean) {
      errors.data_clean = "Obrigatório";
    }
    return errors;
  }, []);

  const fetchCounts = async () => {
    const benefNotSynced = await pendingSyncBeneficiaries();
    dispatch(
      loadPendingsBeneficiariesTotals({
        pendingSyncBeneficiaries: benefNotSynced,
      })
    );

    const benefIntervNotSynced = await pendingSyncBeneficiariesInterventions();
    dispatch(
      loadPendingsBeneficiariesInterventionsTotals({
        pendingSyncBeneficiariesInterventions: benefIntervNotSynced,
      })
    );

    const refNotSynced = await pendingSyncReferences();
    dispatch(
      loadPendingsReferencesTotals({ pendingSyncReferences: refNotSynced })
    );
  };
  useEffect(() => {
    const message = "Limpando dados nao usados nos ultimos 6 meses...";
    setTextMessage(message);
    fetchCounts();
  }, [loading]);

  return (
    <KeyboardAvoidingView style={styles.background}>
      {loading ? (
        <Spinner
          visible={true}
          textContent={textMessage}
          textStyle={styles.spinnerTextStyle}
        />
      ) : undefined}
      <ScrollView>
        <View>
          <View style={styles.containerForm}>
            <Text style={styles.txtLabel}>
              Limpeza de Dados
              {"                                                        "}
            </Text>
            <Divider />
            <Flex
              direction="column"
              mb="2.5"
              mt="1.5"
              _text={{ color: "coolGray.800" }}
            >
              <Text>
                {" "}
                <Text style={styles.txtLabel}>Seleccione a opção</Text>
              </Text>

              <FormControl
                key="data_clean"
                // isRequired
                isInvalid={"data_clean" in formik.errors}
              >
                {/* <FormControl.Label>Seleccione a opção</FormControl.Label> */}
                <Radio.Group
                  value={formik.values.data_clean + ""}
                  onChange={(itemValue) => {
                    formik.setFieldValue("data_clean", itemValue);
                  }}
                  name="rg4"
                  accessibilityLabel="pick a size"
                >
                  <Stack
                    alignItems={{
                      base: "flex-start",
                      md: "center",
                    }}
                    space={1}
                    w="75%"
                    maxW="300px"
                  >
                    <Radio
                      key="defi1"
                      value="0"
                      colorScheme="green"
                      size="md"
                      my={1}
                    >
                      Limpeza Regular
                    </Radio>
                    <Radio
                      key="defi2"
                      value="1"
                      colorScheme="green"
                      size="md"
                      my={1}
                    >
                      Limpeza do Fim do COP
                    </Radio>
                  </Stack>
                </Radio.Group>
                <FormControl.ErrorMessage>
                  {formik.errors.data_clean}
                </FormControl.ErrorMessage>
              </FormControl>

              <Button
                isLoading={loading}
                isLoadingText="Executando"
                onPress={handleSubmit}
                my="10"
                colorScheme="primary"
              >
                Executar
              </Button>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>
            </Flex>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const enhance = withObservables([], () => ({
  references: database.collections.get("references").query(),
  beneficiaries_interventions: database.collections
    .get("beneficiaries_interventions")
    .query(),
}));

const InfoHandler: React.FC = () => {
  return (
    <>
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
              <Text1 color="coolGray.800">
                Limpeza de dados terminada com sucesso!
              </Text1>
            </HStack>
          </HStack>
        </VStack>
      </Alert>
    </>
  );
};

const InfoHandlerSave: React.FC = () => {
    return (
      <>
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
                <Text1 color="coolGray.800">
                  Limpeza de dados programado com sucesso!
                </Text1>
              </HStack>
            </HStack>
          </VStack>
        </Alert>
      </>
    );
  };

const ErrorHandler: React.FC = () => {
  return (
    <>
      <Alert
        w="100%"
        variant="left-accent"
        colorScheme="success"
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
              <Text1 color="coolGray.800">Nenhuma opçao Selecionada!</Text1>
            </HStack>
          </HStack>
        </VStack>
      </Alert>
    </>
  );
};

const ErrorCleanHandler: React.FC = () => {
    return (
      <>
        <Alert
          w="100%"
          variant="left-accent"
          colorScheme="success"
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
                <Text1 color="coolGray.800">Falha no processo de limpeza de dados!</Text1>
              </HStack>
            </HStack>
          </VStack>
        </Alert>
      </>
    );
  };

export default memo(enhance(DatacleanScreen));
