import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
} from "react";
import {
  View,
  TouchableHighlight,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import {
  useToast,
  Alert,
  HStack,
  Text,
  Avatar,
  Pressable,
  Icon,
  Box,
  VStack,
  FormControl,
  Input,
  Button,
  Center,
  Badge,
  Modal,
  InfoIcon,
  IconButton,
  CloseIcon,
  Spinner as SpinnerBase,
} from "native-base";
import { navigate } from "../../routes/NavigationRef";
import withObservables from "@nozbe/with-observables";
import { MaterialIcons, Ionicons } from "@native-base/icons";
import { Q } from "@nozbe/watermelondb";
import { database } from "../../database";
import { Context } from "../../routes/DrawerNavigator";
import StepperButton from "./components/StapperButton";
import styles from "./styles";
import { sync, customSyncBeneficiary } from "../../database/sync";
import {
  SuccessHandler,
  ErrorHandler,
  WithoutNetwork,
} from "../../components/SyncIndicator";
import { BENEFICIARY_TO_SYNC_URL } from "../../services/api";
import { Formik } from "formik";
import { LOGIN_API_URL } from "../../services/api";
import { ADMIN, MNE, SUPERVISOR } from "../../utils/constants";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import Spinner from "react-native-loading-spinner-overlay/lib";
import {
  beneficiariesFetchCount,
  resolveBeneficiaryOfflineIds,
} from "../../services/beneficiaryService";
import { getBeneficiariesTotal } from "../../store/beneficiarySlice";
import { loadBeneficiariesInterventionsCounts } from "../../store/beneficiaryInterventionSlice";
import { referencesFetchCount } from "../../services/referenceService";
import { getReferencesTotal } from "../../store/referenceSlice";
import { beneficiariesInterventionsFetchCount } from "../../services/beneficiaryInterventionService";

const BeneficiariesMain: React.FC = ({
  beneficiaries,
  subServices,
  beneficiaries_interventions,
}: any) => {
  const [showModal, setShowModal] = useState(false);
  const [searchField, setSearchField] = useState("");
  const [userBeneficiaries, setUserBeneficiaries] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [maskName, setMaskName] = useState(false);
  const loggedUser: any = useContext(Context);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [show, setShow] = React.useState(false);
  const [isInvalidCredentials, setIsInvalidCredentials] = useState(false);
  const [serverBeneficiaries, setServerBeneficiaries] = useState<any>([]);
  const [token, setToken] = useState("");
  const [beneficiariesResultLoaded, setBeneficiariesResultLoaded] =
    useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const toast = useToast();
  const inputRef: any = useRef(null);

  const [isLoadingRequest, setLoadingRequest] = useState(false);
  const dispatch = useDispatch();

  const getTotals = useCallback(async () => {
    const countBen = await beneficiariesFetchCount();
    dispatch(getBeneficiariesTotal(countBen));

    const countRef = await referencesFetchCount();
    dispatch(getReferencesTotal(countRef));

    const beneficiaryIntervsCont = await beneficiariesInterventionsFetchCount();
    dispatch(loadBeneficiariesInterventionsCounts(beneficiaryIntervsCont));
  }, []);

  const totals = useSelector(
    (state: any) => state.beneficiaryIntervention.totals
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
        .then(() =>
          toast.show({
            placement: "top",
            render: () => {
              return <SuccessHandler />;
            },
          })
        )
        .catch(() =>
          toast.show({
            placement: "top",
            render: () => {
              return <ErrorHandler />;
            },
          })
        );
      setLoading(false);
    }
  };

  useEffect(() => {
    resolveBeneficiaryOfflineIds();
    getTotals();
  }, []);

  const viewBeneficiaries = async (data: any) => {
    const beneficiarie = data.item?._raw;

    //let items = beneficiarie.references_a.split(/[\[(, )\]]/); //split string into an array of elements
    //let referenceIdArray = items.filter(item => item.trim().length > 0); // remove white space elements

    /*const beneficiaryReferences = references.filter((e) => {
            return referenceIdArray.includes("" + e._raw.online_id);
        });*/

    const beneficiaryId = beneficiarie.online_id
      ? beneficiarie.online_id
      : beneficiarie.id;

    const references = await database
      .get("references")
      .query(Q.where("beneficiary_id", beneficiaryId))
      .fetch();

    const beneficiaryReferencesSerializable = references.map((e) => {
      return e._raw;
    });

    const interventions = beneficiaries_interventions.filter((e) => {
      return e._raw.beneficiary_id == beneficiarie.online_id;
    });

    const interventionObjects = interventions.map((e) => {
      const subservice = subServices.filter((item) => {
        return item._raw.online_id == e._raw.sub_service_id;
      })[0];
      return {
        id: subservice._raw.online_id + e?._raw.date,
        name: subservice._raw.name,
        intervention: e._raw,
      };
    });

    navigate({
      name: "BeneficiariesView",
      params: {
        beneficiary: beneficiarie,
        interventions: interventionObjects,
        references: beneficiaryReferencesSerializable,
      },
    });
  };

  const randomHexColor = () => {
    return "#000000".replace(/0/g, () => {
      return (~~(Math.random() * 16)).toString(16);
    });
  };

  const onRowDidOpen = (rowKey: any) => {
    console.log("This row opened", rowKey);
  };

  const age = (data: any) => {
    const now = new Date();
    const birth = new Date(data);
    const m = now.getMonth() - birth.getMonth();
    let age = now.getFullYear() - birth.getFullYear();

    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    if (
      [ADMIN, MNE, SUPERVISOR].includes(loggedUser?.profile_id) ||
      [ADMIN, MNE, SUPERVISOR].includes(loggedUser?.profiles?.id)
    ) {
      setMaskName(false);
    } else {
      setMaskName(true);
    }
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const status = !(state.isConnected && state.isInternetReachable);
      setIsOffline(status);
    });
    return () => removeNetInfoSubscription();
  }, []);

  // eslint-disable-next-line react/prop-types
  const ItemBadge = ({ label, beneficiary_id }) => {
    const getCountByBeneficiary = () => {
      const result = totals?.filter(
        (item) => item.beneficiary_id === beneficiary_id
      );
      return result[0]?.total;
    };

    return (
      <HStack>
        <Text>{label} : </Text>
        <Badge // bg="red.400"
          colorScheme={getCountByBeneficiary() > 0 ? "info" : "danger"}
          alignSelf="flex-end"
          _text={{
            fontSize: 12,
          }}
        >
          {getCountByBeneficiary()}
        </Badge>
      </HStack>
    );
  };

  const renderItem = (data: any) => (
    <TouchableHighlight
      onPress={() => viewBeneficiaries(data)}
      style={styles.rowFront}
      underlayColor={"#AAA"}
    >
      <HStack width="100%" px={4} flex={1} space={5} alignItems="center">
        {data.item.gender === "1" ? (
          <Avatar color="white" bg="primary.500">
            <Icon as={Ionicons} name="man" color="white" size={35} />
          </Avatar>
        ) : data.item.gender === "2" ? (
          <Avatar color="white" bg="pink.500">
            <Icon as={Ionicons} name="woman" color="white" size={35} />
          </Avatar>
        ) : (
          <Avatar color="white" bg="amber.500">
            <Icon as={Ionicons} name="person" color="white" size={35} />
          </Avatar>
        )}

        <View style={{ width: "50%" }}>
          <HStack>
            <Text color="warmGray.400" _dark={{ color: "warmGray.200" }}>
              NUI:
            </Text>
            <Text color="darkBlue.800" _dark={{ color: "warmGray.200" }}>
              {` ${data.item._raw.district_code}/${data.item.nui}`}
            </Text>
          </HStack>
          <HStack>
            <View style={{ paddingTop: 5 }}>
              <Ionicons name="navigate" size={11} color="#17a2b8" />
            </View>
            <Text color="darkBlue.800" _dark={{ color: "warmGray.200" }}>
              {` ${data.item.locality_name}`}
            </Text>
          </HStack>
          <HStack>
            <View style={{ paddingTop: 5 }}>
              <Ionicons name="cog" size={11} color="#17a2b8" />
            </View>
            <ItemBadge
              label={"Serviços"}
              beneficiary_id={data.item.online_id}
            />
          </HStack>
        </View>
        <View>
          <Text color="darkBlue.800"></Text>
          <HStack>
            <View style={{ paddingTop: 5 }}>
              <Ionicons name="calendar" size={11} color="#17a2b8" />
            </View>
            <Text color="darkBlue.800" _dark={{ color: "warmGray.200" }}>
              {` ${age(data.item.date_of_birth)} Anos`}
            </Text>
          </HStack>
          <HStack>
            <Text color="darkBlue.800">
              {moment(new Date(data.item.date_created)).format("DD-MM-YYYY")}
            </Text>
          </HStack>
          <HStack>
            <Badge colorScheme="info">
              {data.item.entry_point === "1"
                ? "US"
                : data.item.entry_point === "2"
                ? "CM"
                : "ES"}
            </Badge>
          </HStack>
        </View>
      </HStack>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data: any, rowMap: any) => (
    <HStack flex={1} pl={2}>
      <Pressable
        px={4}
        ml="auto"
        bg="lightBlue.700"
        justifyContent="center"
        onPress={() => viewBeneficiaries(data)}
        _pressed={{ opacity: 0.5 }}
      >
        <Icon
          as={MaterialIcons}
          name="remove-red-eye"
          size={6}
          color="gray.200"
        />
      </Pressable>
      <Pressable
        px={4}
        bg="lightBlue.800"
        justifyContent="center"
        onPress={() =>
          navigate({
            name:
              data.item._raw.gender == 1
                ? "BeneficiaryPartnerForm"
                : "BeneficiaryForm",
            params: { beneficiary: data.item._raw },
          })
        }
        _pressed={{ opacity: 0.5 }}
      >
        <Icon as={MaterialIcons} name="mode-edit" size={6} color="gray.200" />
      </Pressable>
    </HStack>
  );

  const handleChange = (e: any) => {
    setSearchField(e);
  };

  const getUserBeneficiaries = async (currentUserId) => {
    const districtCollection = database.get("districts");
    const localityCollection = database.get("localities");
    const neighborhoodCollection = database.get("neighborhoods");
    const userDetailsCollection = database.get("user_details");
    const beneficiariesCollection = database.get("beneficiaries");

    const userDetailsQ = await userDetailsCollection
      .query(Q.where("user_id", parseInt(currentUserId)))
      .fetch();
    const userDetailsRaw = userDetailsQ[0]?._raw;

    //     if (userDetailsRaw?.['provinces']?.length === 0) {
    //             //"CENTRAL"
    //             setUserBeneficiaries(beneficiaries)
    //         } else if (userDetailsRaw?.['districts']?.length === 0) {
    //             //"PROVINCIAL";
    //             var a = userDetailsRaw?.['provinces']
    //             var b = a.split(',').map(Number);

    //             const districtsQ = await districtCollection.query(Q.where('province_id', Q.oneOf(b))).fetch();
    //             const districtsByProv = districtsQ.map((e) => {return e._raw['online_id'];});

    //             const localitiesQ = await localityCollection.query(Q.where('district_id', Q.oneOf(districtsByProv))).fetch();
    //             const localitiesByDist = localitiesQ.map((e) => { return e._raw['online_id'];});

    //             const neighborhoodsQ = await neighborhoodCollection.query(
    //                 Q.where('locality_id', Q.oneOf(localitiesByDist))
    //                 ).fetch();
    //             const neighborhoodsByLoc = neighborhoodsQ.map((e) => { return e._raw['online_id']; });

    //             const beneficiariesByNeighb = await beneficiariesCollection.query(
    //                 Q.where('neighborhood_id',Q.oneOf(neighborhoodsByLoc))
    //             ).fetch()
    //             setUserBeneficiaries(beneficiariesByNeighb)
    //         } else if (userDetailsRaw?.['localities']?.length === 0) {
    //             //"DISTRITAL";
    //             var a = userDetailsRaw?.['districts']
    //             var b = a.split(',').map(Number);

    //             const localitiesQ = await localityCollection.query(Q.where('district_id', Q.oneOf(b))).fetch();
    //             const localitiesByDist = localitiesQ.map((e) => { return e._raw['online_id'];});

    //             const neighborhoodsQ = await neighborhoodCollection.query(
    //                 Q.where('locality_id', Q.oneOf(localitiesByDist))
    //                 ).fetch();
    //             const neighborhoodsByLoc = neighborhoodsQ.map((e) => { return e._raw['online_id']; });

    //             const beneficiariesByNeighb = await beneficiariesCollection.query(
    //                 Q.where('neighborhood_id',Q.oneOf(neighborhoodsByLoc))
    //             ).fetch()
    //             setUserBeneficiaries(beneficiariesByNeighb)
    //         } else {
    //             //"LOCAL";
    //             var a = userDetailsRaw?.['localities'];
    //             var b = a.split(',').map(Number);

    //             const neighborhoodsQ = await neighborhoodCollection.query(
    //                 Q.where('locality_id', Q.oneOf(b))
    //                 ).fetch();
    //             const neighborhoodsRaws = neighborhoodsQ.map((e) => { return e._raw['online_id']; });

    //             const neiBeneficiaries = await beneficiariesCollection.query(
    //                 Q.where('neighborhood_id',Q.oneOf(neighborhoodsRaws))
    //             ).fetch()
    //             setUserBeneficiaries(neiBeneficiaries)
    //         }
    //         setRefreshData(false)
    const beneficiaries = await beneficiariesCollection.query().fetch();
    setUserBeneficiaries(beneficiaries);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshData(false);
      getUserBeneficiaries(
        loggedUser?.online_id ? loggedUser?.online_id : loggedUser?.id
      );
      setRefreshing(false);
      setRefreshData(true);
    });
  }, []);

  useEffect(() => {
    if (loggedUser?.online_id !== undefined) {
      /** the user logged at least one time***/
      getUserBeneficiaries(loggedUser?.online_id);
    } else {
      /** is first time the user logs, is using API* */
      getUserBeneficiaries(loggedUser?.id);
    }
  }, [loggedUser, refreshData, inputRef]);

  const filteredBeneficiaries = userBeneficiaries?.filter((beneficiarie) =>
    beneficiarie._raw.nui.toLowerCase().includes(searchField.toLowerCase())
  );
  // const sortedBeneficiaries = filteredBeneficiaries.sort((benf1, benf2) => benf2._raw.nui.localeCompare(benf1._raw.nui));
  const sortedBeneficiaries = filteredBeneficiaries.sort((ben1, ben2) =>
    ben2._raw.date_created.localeCompare(ben1._raw.date_created)
  );

  const userId =
    loggedUser?.online_id !== undefined
      ? loggedUser?.online_id
      : loggedUser?.id;
  const toasty = useToast();

  const showToast = (message, description) => {
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

  const handleAuthorization = async (values) => {
    await fetch(
      `${LOGIN_API_URL}?username=${
        values.username
      }&password=${encodeURIComponent(values.password)}`
    )
      .then((response) => response.json())
      .then(async (response) => {
        if (response.status && response.status !== 200) {
          // unauthorized
          setIsInvalidCredentials(true);
          setShowAuthModal(true);
        } else {
          setToken(response.token);
          getServerBeneficiaries(searchField, response.token);
          setShowAuthModal(false);
        }
      })
      .catch((error) => {
        showToast("Falha de Conexão", "Por favor contacte o suporte!");
        console.log(error);
      });
  };

  const ErrorNoDataFound: React.FC = () => {
    return (
      <>
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
                <Text color="coolGray.800">
                  Nenhuma Beneficiaria foi encontrada com este NUI!
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </Alert>
      </>
    );
  };

  const getServerBeneficiaries = async (nui, token) => {
    setShowAuthModal(true);
    setLoadingRequest(true);
    await fetch(`${BENEFICIARY_TO_SYNC_URL}?nui=${nui}&userId=${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length < 1) {
          setSearchField("");
          if (inputRef.current) {
            inputRef.current.clear();
          }

          toast.show({
            placement: "top",
            render: () => {
              return <ErrorNoDataFound />;
            },
          });
        }
        setServerBeneficiaries(data);
        setBeneficiariesResultLoaded(true);
      });
    setLoadingRequest(false);
  };

  const ErrorInvalidPasswordHandler: React.FC = () => {
    return (
      <>
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
                <Text color="coolGray.800">Invalid Password!</Text>
              </HStack>
            </HStack>
          </VStack>
        </Alert>
      </>
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInvalidCredentials(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isInvalidCredentials]);

  useEffect(() => {
    setBeneficiariesResultLoaded(false);
  }, [searchField]);

  const renderServerItem = (data: any) => (
    <TouchableHighlight
      onPress={() => console.log(data)}
      style={styles.rowFront}
      underlayColor={"#AAA"}
      disabled
    >
      <HStack width="100%" px={4} flex={1} space={5} alignItems="center">
        <Avatar color="white" bg={randomHexColor()}>
          {maskName
            ? "D"
            : data.item.name.charAt(0).toUpperCase() +
              data.item.surname.charAt(0).toUpperCase()}
        </Avatar>

        <View style={{ width: "50%" }}>
          <HStack>
            <Text color="warmGray.400" _dark={{ color: "warmGray.200" }}>
              NUI:
            </Text>
            <Text color="darkBlue.800" _dark={{ color: "warmGray.200" }}>
              {` ${data.item.district.code}/${data.item.nui}`}
            </Text>
          </HStack>
          <HStack style={{ alignContent: "center" }}>
            <View style={{ paddingTop: 5 }}>
              <Ionicons name="person" size={11} color="#17a2b8" />
            </View>

            <Text color="darkBlue.800" _dark={{ color: "warmGray.200" }}>
              {maskName
                ? "DREAMS" + data.item.nui
                : ` ${data.item.name} ${data.item.surname}`}
            </Text>
          </HStack>
          <HStack>
            <View style={{ paddingTop: 5 }}>
              <Ionicons name="navigate" size={11} color="#17a2b8" />
            </View>
            <Text color="darkBlue.800" _dark={{ color: "warmGray.200" }}>
              {` ${data.item.locality.name}`}
            </Text>
          </HStack>
        </View>
        <View>
          <Text color="darkBlue.800">{data.item.entryPoint}</Text>
          <HStack>
            <View style={{ paddingTop: 5 }}>
              <Ionicons name="calendar" size={11} color="#17a2b8" />
            </View>
            <Text color="darkBlue.800" _dark={{ color: "warmGray.200" }}>
              {` ${age(data.item.dateOfBirth)} Anos`}
            </Text>
          </HStack>
          <HStack>
            <Text color="darkBlue.800">
              {moment(new Date(data.item.dateCreated)).format("DD-MM-YYYY")}
            </Text>
          </HStack>
          <HStack>
            <Badge colorScheme="info">
              {data.item.entryPoint === "1"
                ? "US"
                : data.item.entryPoint === "2"
                ? "CM"
                : "ES"}
            </Badge>
          </HStack>
        </View>
      </HStack>
    </TouchableHighlight>
  );

  const getAuth = () => {
    if (token === "") {
      setShowAuthModal(true);
    } else {
      getServerBeneficiaries(searchField, token);
    }
  };

  const handleSyncCustomBeneficiary = () => {
    const userId =
      loggedUser.online_id !== undefined ? loggedUser.online_id : loggedUser.id;
    customSyncBeneficiary({ nui: searchField, userId })
      .then(() => {
        setRefreshData(true);
        setServerBeneficiaries([]);
        setSearchField("");
        if (inputRef.current) {
          inputRef.current.clear();
        }
        toast.show({
          placement: "top",
          render: () => {
            return <SuccessHandler />;
          },
        });
      })
      .catch((error) => {
        showToast("Falha de Conexão", "Por favor contacte o suporte!");
        console.log(error);
      });
  };

  const MySpinner = () => {
    return (
      <HStack space={8} justifyContent="center" alignItems="center">
        <SpinnerBase size="lg" />
      </HStack>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.heading}>
          {loading ? (
            <Spinner
              visible={true}
              textContent={"Sincronizando..."}
              textStyle={styles.spinnerTextStyle}
            />
          ) : undefined}
          <Box
            alignItems="center"
            w="80%"
            bgColor="white"
            style={{ borderRadius: 5 }}
          >
            <Input
              ref={inputRef}
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
              placeholder="Pesquisar"
              style={{ borderRadius: 45 }}
            />
          </Box>
        </View>
        {(searchField == "" || filteredBeneficiaries.length > 0) && (
          <SwipeListView
            data={sortedBeneficiaries}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-112}
            previewRowKey={"0"}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            onRowDidOpen={onRowDidOpen}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
        {filteredBeneficiaries.length < 1 &&
          searchField !== "" &&
          serverBeneficiaries.length < 1 &&
          !beneficiariesResultLoaded && (
            <Center flex={1} px="3">
              {isLoadingRequest && (
                <View>
                  <MySpinner />
                </View>
              )}
              <VStack space={2} flexShrink={1}>
                <HStack>
                  <InfoIcon mt="1" />
                  <Text fontSize="sm" color="coolGray.800">
                    Buscar do servidor ?
                  </Text>
                </HStack>
                <Button onPress={() => getAuth()}>Sim</Button>
                <Button onPress={() => setSearchField("")}>Não</Button>
              </VStack>
            </Center>
          )}
        {filteredBeneficiaries.length < 1 && (
          <>
            {serverBeneficiaries.length > 0 && (
              <>
                <SwipeListView
                  data={serverBeneficiaries}
                  renderItem={renderServerItem}
                  //renderHiddenItem={renderHiddenItem}
                  rightOpenValue={-112}
                  previewRowKey={"0"}
                  previewOpenValue={-40}
                  previewOpenDelay={3000}
                  onRowDidOpen={onRowDidOpen}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                />
                <Button
                  onPress={() => handleSyncCustomBeneficiary()}
                  colorScheme="primary"
                >
                  Sincronizar Beneficiária(o)
                </Button>
              </>
            )}
          </>
        )}

        <Center>
          <Modal
            isOpen={showAuthModal && token === ""}
            onClose={() => setShowAuthModal(false)}
          >
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>Sincronizar Beneficiária(o)</Modal.Header>
              <Modal.Body>
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={true}
                      onRefresh={() => {
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
                              <HStack
                                space={2}
                                flexShrink={1}
                                alignItems="center"
                              >
                                <Alert.Icon />
                                <Text color="coolGray.800">refresh</Text>
                              </HStack>
                            </HStack>
                          </VStack>
                        </Alert>;
                      }}
                    />
                  }
                >
                  <Box alignItems="center">
                    {/* <Ionicons name="md-checkmark-circle" size={100} color="#0d9488" /> */}
                    <Alert w="100%" status="success">
                      <VStack space={2} flexShrink={1}>
                        <HStack>
                          <InfoIcon mt="1" />
                          <Text fontSize="sm" color="coolGray.800">
                            Confirme as credenciais para sincronizar um(a)
                            Beneficiario(a)!
                          </Text>
                        </HStack>
                        <Formik
                          initialValues={{
                            username: loggedUser.username,
                            password: "",
                          }}
                          onSubmit={(values) => {
                            handleAuthorization(values);
                          }}
                        >
                          {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                          }) => (
                            <View>
                              <FormControl isRequired>
                                <FormControl.Label>Password</FormControl.Label>
                                <Input
                                  type={show ? "text" : "password"}
                                  onBlur={handleBlur("password")}
                                  InputRightElement={
                                    <Pressable onPress={() => setShow(!show)}>
                                      <Icon
                                        as={
                                          <MaterialIcons
                                            name={
                                              show
                                                ? "visibility"
                                                : "visibility-off"
                                            }
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
                              </FormControl>
                              {isInvalidCredentials && (
                                <ErrorInvalidPasswordHandler />
                              )}
                              <Button
                                isLoadingText="Autenticando"
                                onPress={handleSubmit}
                                my="10"
                                colorScheme="primary"
                              >
                                Autorizar
                              </Button>
                            </View>
                          )}
                        </Formik>
                      </VStack>
                    </Alert>
                    <Text></Text>
                  </Box>
                </ScrollView>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </Center>

        <Center flex={1} px="3">
          <StepperButton
            onAdd={() => setShowModal(true)}
            onRefresh={syncronize}
            isPrincipal={1}
          />
        </Center>
      </View>
      <Center>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Registo de Beneficiária(o)</Modal.Header>
            <Modal.Body>
              <ScrollView>
                <Box alignItems="center">
                  {/* <Ionicons name="md-checkmark-circle" size={100} color="#0d9488" /> */}
                  <Alert w="100%" status="success">
                    <VStack space={2} flexShrink={1}>
                      <HStack>
                        <InfoIcon mt="1" />
                        <Text fontSize="sm" color="coolGray.800">
                          Escolha Registar Beneficiária ou Parceiro!
                        </Text>
                      </HStack>
                      <Button
                        onPress={() => {
                          setShowModal(false);
                          navigate({ name: "BeneficiaryForm", params: {} });
                        }}
                      >
                        Registar Beneficiária
                      </Button>
                      <Button
                        onPress={() => {
                          setShowModal(false);
                          navigate({
                            name: "BeneficiaryPartnerForm",
                            params: {},
                          });
                        }}
                      >
                        Registar Parceiro
                      </Button>
                    </VStack>
                  </Alert>
                  <Text></Text>
                </Box>
              </ScrollView>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Center>
    </>
  );
};

const enhance = withObservables([], () => ({
  beneficiaries: database.collections.get("beneficiaries").query().observe(),
  localities: database.collections.get("localities").query().observe(),
  profiles: database.collections.get("profiles").query().observe(),
  beneficiaries_interventions: database.collections
    .get("beneficiaries_interventions")
    .query()
    .observe(),
  subServices: database.collections.get("sub_services").query().observe(),
  us: database.collections.get("us").query().observe(),
}));
export default enhance(BeneficiariesMain);
