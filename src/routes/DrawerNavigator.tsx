import React, { createContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "./components/CustomDrawer";
import BeneficiariesNavigator from "./BeneficiariesNavigator";
import RefencesNavigator from "./ReferencesNavigator";
import { navigate } from "./NavigationRef";
import { Q } from "@nozbe/watermelondb";
import { database } from "../database";
import { useDispatch, useSelector } from "react-redux";
import {
  loadUserProvinces,
  loadUserDistricts,
  loadUserLocalities,
  loadUserUss,
} from "../store/authSlice";
import styles from "./components/style";
import styles1 from "../screens/Login/style";
import {
  Alert,
  Badge,
  Box,
  HStack,
  VStack,
  Text as TextNB,
  useToast,
} from "native-base";
import {
  beneficiariesFetchCount,
  pendingSyncBeneficiaries,
  resolveBeneficiaryOfflineIds,
} from "../services/beneficiaryService";
import {
  pendingSyncReferences,
  referencesFetchCount,
} from "../services/referenceService";
import { getBeneficiariesTotal } from "../store/beneficiarySlice";
import { getReferencesTotal } from "../store/referenceSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UsersNavigator from "./UsersNavigator";
import PropTypes from "prop-types";
import Spinner from "react-native-loading-spinner-overlay";
import AppInfoScreen from "../screens/AppInfo/AppInfoScreen";
import SyncReportScreen from "../screens/SyncReport/SyncReportReport";
import DataExportScreen from "../screens/SyncReport/DataExportScreen";
import DatacleanScreen from "../screens/DataClean/DataCleanScreen";
import {
  loadPendingsBeneficiariesInterventionsTotals,
  loadPendingsBeneficiariesTotals,
  loadPendingsReferencesTotals,
} from "../store/syncSlice";
import { pendingSyncBeneficiariesInterventions } from "../services/beneficiaryInterventionService";
import SpinnerModal from "../components/Modal/SpinnerModal";

function HomeScreen() {
  useEffect(() => {
    resolveBeneficiaryOfflineIds();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dreams Layering Tool </Text>
    </View>
  );
}

export const Context = createContext({});
const Drawer = createDrawerNavigator();

const DrawerNavigation: React.FC = ({ route }: any) => {
  // eslint-disable-next-line no-unsafe-optional-chaining
  const { loggedUser, loading } = route?.params;

  const [isLoading, setIsLoading] = useState(loading);

  const userDetailsCollection = database.get("user_details");
  const dispatch = useDispatch();

  const beneficiariesTotal = useSelector(
    (state: any) => state.beneficiary.total
  );
  const referencesTotal = useSelector((state: any) => state.reference.total);
  const syncInProgress = useSelector((state: any) => state.sync.syncInProgress);
  const toasty = useToast();

  useEffect(() => {
    const getUserDetails = async () => {
      if (loggedUser.online_id !== undefined) {
        const userDetailsQ = await userDetailsCollection
          .query(Q.where("user_id", loggedUser.online_id))
          .fetch();
        const userDetailRaw = userDetailsQ[0]?._raw;
        getProvincesByIds(userDetailRaw).catch((err) => console.error(err));
        getDistrictsByIds(userDetailRaw).catch((err) => console.error(err));
        getLocalitiesByIds(userDetailRaw).catch((err) => console.error(err));
        getUssByIds(userDetailRaw).catch((err) => console.error(err));
      }
      if (isLoading) {
        await delay(10000);
        setIsLoading(false);
      }
    };
    getUserDetails().catch((error) => console.log(error));

    getTotals().catch((error) => console.log(error));
  }, []);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const getProvincesByIds = async (userDetails) => {
    const a = userDetails?.provinces;
    if (a !== "") {
      const b = a?.split(",").map(Number);
      const provincesQ = await database
        .get("provinces")
        .query(Q.where("online_id", Q.oneOf(b)))
        .fetch();
      const provRaws = provincesQ.map((item) => item._raw);
      dispatch(loadUserProvinces({ provinces: provRaws }));
    } else {
      const getAllProvs = await database.get("provinces").query().fetch();
      const provRaws = getAllProvs.map((item) => item._raw);
      dispatch(loadUserProvinces({ provinces: provRaws }));
    }
  };

  const getDistrictsByIds = async (userDetails) => {
    const a = userDetails?.districts;
    if (a !== "") {
      const b = a?.split(",").map(Number);
      const districtsQ = await database
        .get("districts")
        .query(Q.where("online_id", Q.oneOf(b)))
        .fetch();
      const districtRaws = districtsQ.map((item) => item._raw);
      dispatch(loadUserDistricts({ districts: districtRaws }));
    } else {
      const getAllDists = await database.get("districts").query().fetch();
      const distRaws = getAllDists.map((item) => item._raw);
      dispatch(loadUserDistricts({ districts: distRaws }));
    }
  };

  const getLocalitiesByIds = async (userDetails) => {
    const a = userDetails?.localities;
    if (a !== "") {
      const b = a?.split(",").map(Number);
      const localitiesQ = await database
        .get("localities")
        .query(Q.where("online_id", Q.oneOf(b)))
        .fetch();
      const localRaws = localitiesQ.map((item) => item._raw);
      dispatch(loadUserLocalities({ localities: localRaws }));
    } else {
      const getAllLocalits = await database.get("localities").query().fetch();
      const localRaws = getAllLocalits.map((item) => item._raw);
      dispatch(loadUserLocalities({ localities: localRaws }));
    }
  };

  const getUssByIds = async (userDetails) => {
    const a = userDetails?.uss;
    if (a !== "") {
      const b = a?.split(",").map(Number);
      const ussQ = await database
        .get("us")
        .query(Q.where("online_id", Q.oneOf(b)))
        .fetch();
      const usRaws = ussQ.map((item) => item._raw);
      dispatch(loadUserUss({ uss: usRaws }));
    } else {
      const getAllUss = await database.get("us").query().fetch();
      const usRaws = getAllUss.map((item) => item._raw);
      dispatch(loadUserUss({ uss: usRaws }));
    }
  };

  const onLogout = () => {
    navigate({
      name: "Login",
    });
  };

  const configPag = (e?: any) => {
    navigate({
      name: "UserProfile",
    });
  };

  useEffect(() => {
    const timer = setTimeout(
      () => {
        navigate({
          name: "Login",
        });
      },
      //  30000 //So para testes
      1800000
    );
    return () => clearTimeout(timer);
  }, [AsyncStorage.getItem("event")]);

  const ItemBadge = ({ label, total }) => {
    return (
      <Box alignItems="center">
        <VStack>
          <Text style={{ fontWeight: "bold", color: "#424345" }}>
            {label}
            {total >= 0 && (
              <Badge // bg="red.400"
                colorScheme={total > 0 ? "info" : "danger"}
                rounded="full"
                variant="solid"
                alignSelf="flex-end"
                _text={{
                  fontSize: 12,
                }}
              >
                {total}
              </Badge>
            )}
          </Text>
        </VStack>
      </Box>
    );
  };
  ItemBadge.propTypes = {
    label: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
  };

  const getTotals = async () => {
    const countBen = await beneficiariesFetchCount();
    dispatch(getBeneficiariesTotal(countBen));

    const countRef = await referencesFetchCount();
    dispatch(getReferencesTotal(countRef));
  };

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
    fetchCounts();
  }, [isLoading]);

  useEffect(() => {
    if (!syncInProgress) {
      toasty.show({
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
                    <TextNB color="coolGray.800">
                      Sincronização efectuada com sucesso!
                    </TextNB>
                  </HStack>
                </HStack>
              </VStack>
            </Alert>
          );
        },
      });
    }
  }, [syncInProgress]);

  return (
    <Context.Provider value={loggedUser}>
      <SpinnerModal
        open={syncInProgress}
        title={"Sincronização em Curso"}
        message={
          "O dispositivo está atualmente em processo de sincronização. Por favor, aguarde até que a sincronização seja concluída para continuar. Agradecemos sua paciência!"
        }
      />
      <Drawer.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#17a2b8", //'#0c4a6e',
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
        drawerContent={(props) => (
          <CustomDrawer
            {...props}
            onLogout={onLogout} /*loggedUser={loggedUser}*/
          />
        )}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Dashboard",
            headerTitle: "",
          }}
        />
        <Drawer.Screen
          name="Beneficiaries"
          component={BeneficiariesNavigator}
          options={{
            title: "",
            headerTitle: "",
            drawerIcon: () => (
              <ItemBadge label="Beneficiárias" total={beneficiariesTotal} />
            ),
          }}
        />
        <Drawer.Screen
          name="References"
          component={RefencesNavigator}
          options={{
            title: "",
            headerTitle: "",
            drawerIcon: () => (
              <ItemBadge label="Referências" total={referencesTotal} />
            ),
          }}
        />
        <Drawer.Screen
          name="Users"
          component={UsersNavigator}
          options={{
            title: "",
            headerTitle: "",
            drawerIcon: () => <ItemBadge label="Perfil" total={-1} />,
          }}
        />
        <Drawer.Screen
          name="SyncReport"
          component={SyncReportScreen}
          options={{
            title: "",
            headerTitle: "",
            drawerIcon: () => (
              <ItemBadge label="Relatório de Sincronização" total={-1} />
            ),
          }}
        />
        {/* <Drawer.Screen
          name="DataExport"
          component={DataExportScreen}
          options={{
            title: "",
            headerTitle: "",
            drawerIcon: () => (
              <ItemBadge label="Exportar Dados do Dispositivo" total={-1} />
            ),
          }}
        /> */}
        <Drawer.Screen
          name="Info"
          component={AppInfoScreen}
          options={{
            title: "",
            headerTitle: "",
            drawerIcon: () => (
              <ItemBadge label="Detalhes da Aplicação" total={-1} />
            ),
          }}
        />
        <Drawer.Screen
          name="CleanData"
          component={DatacleanScreen}
          options={{
            title: "",
            headerTitle: "",
            drawerIcon: () => (
              <ItemBadge label="Limpeza de Dados" total={-1} />
            ),
          }}
        />
      </Drawer.Navigator>
    </Context.Provider>
  );
};

export default DrawerNavigation;
