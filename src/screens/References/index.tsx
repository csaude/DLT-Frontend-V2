import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  RefreshControl,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import {
  useToast,
  HStack,
  Text,
  Pressable,
  Icon,
  Box,
  VStack,
  Input,
} from "native-base";
import { navigate } from "../../routes/NavigationRef";
import withObservables from "@nozbe/with-observables";
import { MaterialIcons, Ionicons } from "@native-base/icons";
import { Q } from "@nozbe/watermelondb";
import { database } from "../../database";
import { Context } from "../../routes/DrawerNavigator";
import { sync } from "../../database/sync";
import {
  SuccessHandler,
  ErrorHandler,
  WithoutNetwork,
} from "../../components/SyncIndicator";
import NetInfo from "@react-native-community/netinfo";

import styles from "./styles";
import moment from "moment";
import {
  beneficiariesFetchCount,
  pendingSyncBeneficiaries,
  resolveBeneficiaryOfflineIds,
} from "../../services/beneficiaryService";
import { getBeneficiariesTotal } from "../../store/beneficiarySlice";
import { beneficiariesInterventionsFetchCount, pendingSyncBeneficiariesInterventions } from "../../services/beneficiaryInterventionService";
import { pendingSyncReferences, referencesFetchCount } from "../../services/referenceService";
import { loadBeneficiariesInterventionsCounts } from "../../store/beneficiaryInterventionSlice";
import { getReferencesTotal } from "../../store/referenceSlice";
import { useDispatch } from "react-redux";
import SpinnerModal from "../../components/Modal/SpinnerModal";
import { loadPendingsBeneficiariesInterventionsTotals, loadPendingsBeneficiariesTotals, loadPendingsReferencesTotals } from "../../store/syncSlice";

const ReferencesMain: React.FC = ({
  beneficiaries,
  users,
  services,
  subServices,
}: any) => {
  const [searchField, setSearchField] = useState("");
  const [userReferences, setUserReferences] = useState<any>([]);
  const [refreshData, setRefreshData] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const loggedUser: any = useContext(Context);
  const [isOffline, setIsOffline] = useState(false);
  const [isLoadingRequest, setLoadingRequest] = useState(false);
  const loggedUserPartner = loggedUser?.partners
    ? loggedUser?.partners.id
    : loggedUser?.partner_id;
  const toast = useToast();
  const dispatch = useDispatch();

  const getTotals = useCallback(async () => {
    const countBen = await beneficiariesFetchCount();
    dispatch(getBeneficiariesTotal(countBen));

    const countRef = await referencesFetchCount();
    dispatch(getReferencesTotal(countRef));

    const beneficiaryIntervsCont = await beneficiariesInterventionsFetchCount();
    dispatch(loadBeneficiariesInterventionsCounts(beneficiaryIntervsCont));
  }, []);

  const getBeneficiary = useCallback(
    (beneficiary_id: any) => {
      return beneficiaries.filter((e) => {
        return e?._raw.online_id == beneficiary_id;
      })[0];
    },
    [beneficiaries]
  );

  const getUser = useCallback(
    (user_id: any) => {
      return users.filter((e) => {
        getBeneficiary;
        return e?._raw.online_id == user_id;
      })[0];
    },
    [getBeneficiary, users]
  );

  const getStatus = (status: any) => {
    if (status === 0) {
      return "Pendente";
    } else if (status === 1) {
      return "Atendida Parcialmente";
    } else if (status === 2) {
      return "Atendida";
    } else if (status === 4) {
      return "Sync";
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshData(false);
      setRefreshing(false);
      setRefreshData(true);
    });
  }, []);

  const viewReference = useCallback(
    async (data: any) => {
      const reference = data.item?._raw;
      const beneficiary = getBeneficiary(reference.beneficiary_id)?._raw;
      const notifyTo = `${
        getUser(data.item?._raw.notify_to)?.name +
        " " +
        getUser(data.item?._raw.notify_to)?.surname
      }`;
      const organization = getUser(
        data.item?._raw.notify_to
      )?.organization_name;
      const attendDisabled =
        loggedUserPartner ===
          getUser(data.item?._raw.referred_by)?.partner_id ||
        reference.status == 2;

      const beneficiaryId = beneficiary?.online_id
        ? beneficiary?.online_id
        : beneficiary?.id;

      const interventions = await database
        .get("beneficiaries_interventions")
        .query(Q.where("beneficiary_id", beneficiaryId))
        .fetch();

      const interventionObjects = interventions.map((e: any) => {
        const subservice = subServices.filter((item) => {
          return item?._raw.online_id == e?._raw.sub_service_id;
        })[0];
        return {
          id: subservice?._raw.online_id + e?._raw.date,
          name: subservice?._raw.name,
          intervention: e?._raw,
        };
      });

      const referenceId = reference?.online_id
        ? reference?.online_id
        : reference?.id;

      const referenceServices = await database
        .get("references_services")
        .query(Q.where("reference_id", referenceId + ""))
        .fetch();

      const servicesObjects = referenceServices.map((e: any) => {
        const service: any = services.filter((item: any) => {
          return item?._raw.online_id == e?._raw.service_id;
        })[0];
        return {
          id: service?._raw.online_id,
          name: service?._raw.name,
          service: e?._raw,
        };
      });

      navigate({
        name: "ReferenceView",
        params: {
          reference: reference,
          beneficiary: beneficiary,
          notify: notifyTo,
          organization: organization,
          services: servicesObjects,
          interventions: interventionObjects,
          attendDisabled: attendDisabled,
        },
      });
    },
    [getBeneficiary, getUser, loggedUserPartner, services, subServices]
  );

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

  const syncronize = useCallback(() => {
    if (isOffline) {
      toast.show({
        placement: "top",
        render: () => {
          return <WithoutNetwork />;
        },
      });
    } else {
      sync({ username: loggedUser.username })
        .then(() =>
          {toast.show({
            placement: "top",
            render: () => {
              return <SuccessHandler />;
            },
          })
          fetchCounts();
        }
        )
        .catch(() =>
          toast.show({
            placement: "top",
            render: () => {
              return <ErrorHandler />;
            },
          })
        );
    }
  }, [isOffline, loggedUser.username, toast]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleOnPress = useCallback(async () => {
    syncronize();
    await delay(5000);
    const userId =
      loggedUser?.online_id !== undefined
        ? loggedUser?.online_id
        : loggedUser?.id;
    getUserReferences(userId);
  }, []);

  const onRowDidOpen = () => {
    /**Its OK */
  };

  const renderItem = useCallback(
    (data: any) => (
      <TouchableHighlight
        onPress={() => viewReference(data)}
        style={styles.rowFront}
        underlayColor={"#AAA"}
      >
        <HStack width="100%" px={4} flex={1} space={5} alignItems="center">
          {loggedUserPartner ===
          getUser(data.item?._raw.referred_by)?.partner_id ? (
            <Ionicons name="exit" size={40} color="#0d9488" />
          ) : (
            <Ionicons name="enter" size={40} color="#e63939" />
          )}
          <VStack width="200px">
            <HStack>
              <Text color="warmGray.400" _dark={{ color: "warmGray.200" }}>
                NUI:
              </Text>
              <Text color="darkBlue.800" _dark={{ color: "warmGray.200" }}>
                {` ${data.item.beneficiary_nui}`}
              </Text>
            </HStack>
            <HStack>
              <View style={{ paddingTop: 5 }}>
                <Ionicons name="notifications" size={11} color="#17a2b8" />
              </View>
              <View style={{ paddingTop: 5 }}>
                <Ionicons name="person" size={11} color="#17a2b8" />
              </View>
              <Text color="darkBlue.800" _dark={{ color: "warmGray.200" }}>
                {` ${
                  getUser(data.item?._raw.notify_to)?.name +
                  " " +
                  getUser(data.item?._raw.notify_to)?.surname
                }`}
              </Text>
            </HStack>

            <HStack>
              <View style={{ paddingTop: 5 }}>
                <Ionicons name="notifications" size={11} color="#17a2b8" />
              </View>
              <View style={{ paddingTop: 5 }}>
                <Ionicons name="md-home" size={11} color="#17a2b8" />
              </View>
              {getUser(data.item?._raw.user_created) && (
                <Text color="darkBlue.800" _dark={{ color: "warmGray.200" }}>
                  {` ${getUser(data.item?._raw.notify_to)?.organization_name}`}
                </Text>
              )}
            </HStack>
          </VStack>
          <VStack alignSelf="flex-start" marginTop={2} width="100px">
            {data.item?._raw.is_awaiting_sync === 1 &&
            data.item?._raw._status === "updated" ? (
              <>
                <Text color="coolGray.500">
                  {moment(new Date(data.item.date)).format("DD-MM-YYYY")}
                </Text>

                <HStack>
                  <View style={{ paddingTop: 10 }}>
                    <Ionicons
                      name="information-circle"
                      size={15}
                      color="#fb923c"
                    />
                  </View>
                  <Ionicons name="md-refresh" size={30} color="#a8a29e" />
                </HStack>
              </>
            ) : (
              <>
                <Text color="coolGray.500">
                  {moment(new Date(data.item.date)).format("DD-MM-YYYY")}
                </Text>
                <HStack>
                  <View style={{ paddingTop: 5 }}>
                    <Ionicons
                      name="checkmark-circle"
                      size={11}
                      color="#17a2b8"
                    />
                  </View>

                  <Text
                    color={
                      data.item?._raw.status == 0
                        ? "danger.700"
                        : data.item?._raw.status == 1
                        ? "warning.700"
                        : "success.700"
                    }
                    _dark={{ color: "warmGray.200" }}
                  >
                    {` ${getStatus(data.item?._raw.status)}`}
                  </Text>
                </HStack>
              </>
            )}
          </VStack>
        </HStack>
      </TouchableHighlight>
    ),
    [getUser, loggedUserPartner, viewReference]
  );

  const renderHiddenItem = useCallback(
    (data: any) => (
      <HStack flex={1} pl={2}>
        <Pressable
          px={4}
          ml="auto"
          bg="lightBlue.700"
          justifyContent="center"
          onPress={() => viewReference(data)}
          _pressed={{ opacity: 0.5 }}
        >
          <Icon
            as={MaterialIcons}
            name="remove-red-eye"
            size={6}
            color="gray.200"
          />
        </Pressable>
      </HStack>
    ),
    [viewReference]
  );

  const handleChange = (e: any) => {
    setSearchField(e);
  };

  const filteredReferences = userReferences?.filter((reference) =>
    reference.beneficiary_nui.toLowerCase().includes(searchField.toLowerCase())
  );

  const sortedReferences = useMemo(
    () =>
      filteredReferences.sort(
        (ref1, ref2) =>
          ref1._raw.status - ref2._raw.status ||
          moment(ref2._raw.date_created)
            .format("YYYY-MM-DD HH:mm:ss")
            .localeCompare(
              moment(ref1._raw.date_created).format("YYYY-MM-DD HH:mm:ss")
            )
      ),
    [filteredReferences]
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getUserReferences = useCallback(async (currentUserId) => {
    setLoadingRequest(true);
    const referencesCollection = database.get("references");

    // if(loggedUser?.profile_id == ADMIN || loggedUser?.profiles == ADMIN){
    //         setUserReferences(references)
    // }else{
    const beneficiariesByUserId = await referencesCollection
      .query
      // Q.or(
      //     Q.where('user_created',currentUserId.toString()),
      //     Q.where('referred_by',currentUserId),
      //     Q.where('notify_to' ,currentUserId)
      // ),
      // Q.where('status',Q.notEq(3))
      ()
      .fetch();
    setUserReferences(beneficiariesByUserId);
    // }
    setLoadingRequest(false);
  }, []);
  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const status = !(state.isConnected && state.isInternetReachable);
      setIsOffline(status);
    });
    return () => removeNetInfoSubscription();
  }, []);

  useEffect(() => {
    if (loggedUser?.online_id !== undefined) {
      /** the user logged at least one time***/
      getUserReferences(loggedUser?.online_id);
    } else {
      /** is first time the user logs, is using API* */
      getUserReferences(loggedUser?.id);
    }
  }, [getUserReferences, loggedUser, refreshData]);

  useEffect(() => {
    resolveBeneficiaryOfflineIds();
    getTotals();
  }, []);

  return (
    <View style={styles.container}>
      <SpinnerModal
        open={isLoadingRequest}
        title={"Carregando Referências"}
        message={
          "Os Dados das Referências estão sendo carregados, por favor aguarde..."
        }
      />
      <View style={styles.heading}>
        <Box
          alignItems="center"
          w="80%"
          bgColor="white"
          style={{ borderRadius: 5 }}
        >
          <Input
            w={{ base: "100%", md: "25%" }}
            onChangeText={handleChange}
            InputLeftElement={
              <Icon
                as={MaterialIcons}
                name="search"
                size={5}
                ml="2"
                color="muted.700"
              />
            }
            placeholder="Pesquisar NUI "
            style={{ borderRadius: 45 }}
          />
        </Box>
      </View>
      <SwipeListView
        data={sortedReferences}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-56}
        previewRowKey={"0"}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity onPress={handleOnPress} style={styles.fab1}>
        <Icon as={MaterialIcons} name="refresh" size={8} color="#0c4a6e" />
      </TouchableOpacity>
    </View>
  );
};

const enhance = withObservables([], () => ({
  references: database.collections.get("references").query(),
  beneficiaries: database.collections.get("beneficiaries").query(),
  users: database.collections.get("users").query(),
  partners: database.collections.get("partners").query(),
  services: database.collections.get("services").query(),
  subServices: database.collections.get("sub_services").query(),
}));

export default memo(enhance(ReferencesMain));
