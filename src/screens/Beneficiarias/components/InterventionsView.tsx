import React, { useState, useEffect, useContext, memo } from "react";
import { View, TouchableHighlight } from "react-native";
import {
  useToast,
  HStack,
  Text,
  Icon,
  VStack,
  Pressable,
  Center,
} from "native-base";
import { MaterialIcons, Ionicons } from "@native-base/icons";
import { navigate } from "../../../routes/NavigationRef";
import styles from "./styles";
import { SwipeListView } from "react-native-swipe-list-view";
import StepperButton from "./StapperButton";
import {
  SuccessHandler,
  ErrorHandler,
  WithoutNetwork,
} from "../../../components/SyncIndicator";
import { Context } from "../../../routes/DrawerNavigator";
import { sync } from "../../../database/sync";
import NetInfo from "@react-native-community/netinfo";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { MENTOR, SUPERVISOR } from "../../../utils/constants";
import { database } from "../../../database";
import { Q } from "@nozbe/watermelondb";

const InterventionsView: React.FC = ({ route }: any) => {
  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [partnerType, setPartnerType] = useState(undefined);

  const { beneficiary, interventions } = route.params;
  const loggedUser: any = useContext(Context);
  const profileId = loggedUser.profile_id? loggedUser.profile_id : loggedUser.profiles.id;
  const toast = useToast();

  const getPartner = async () => {
    const partner_id =
      loggedUser.partner_id ? loggedUser.partner_id : loggedUser.partners.id;
    const partners = await database
      .get("partners")
      .query(Q.where("online_id", parseInt(partner_id)))
      .fetch();
    const partnerSerialied: any = partners.map((item) => item._raw)[0];
    setPartnerType(partnerSerialied.partner_type);
  };

  useEffect(() => {
    getPartner();
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const status = !(state.isConnected && state.isInternetReachable);
      setIsOffline(status);
    });
    return () => removeNetInfoSubscription();
  }, []);

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

  const renderItem = (data: any) => (
    <TouchableHighlight
      onPress={() =>
        navigate({
          name: "BeneficiarieServiceForm",
          params: {
            beneficiarie: beneficiary,
            intervs: interventions,
            intervention: data.item.intervention,
            isNewIntervention: false,
          },
        })
      }
      style={styles.rowFront}
      underlayColor={"#AAA"}
    >
      <HStack width="100%" px={4} flex={1} space={5} alignItems="center">
        <Ionicons name="medkit" size={50} color="#0d9488" />
        <VStack width="200px">
          <Text
            _dark={{
              color: "warmGray.50",
            }}
            color="darkBlue.800"
          >
            {[MENTOR, SUPERVISOR].includes(profileId) && partnerType == "2" &&
            [26, 67, 68].includes(data.item.intervention.sub_service_id)
              ? "Aconselhamento e Testagem em Saúde"
              : data.item.name}
          </Text>
          <HStack>
            <Text color="warmGray.400" _dark={{ color: "warmGray.200" }}>
              Ponto de Entrada:
            </Text>
            <Text color="darkBlue.300" _dark={{ color: "warmGray.200" }}>
              {` ${
                data.item.intervention?.entry_point === "1"
                  ? "US"
                  : data.item.intervention?.entry_point === "2"
                  ? "CM"
                  : "ES"
              }`}
            </Text>
          </HStack>
        </VStack>
        <Text color="coolGray.500" alignSelf="flex-start" marginTop={2}>
          {data.item.intervention.date}
        </Text>
      </HStack>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data: any) => (
    <HStack flex={1} pl={2}>
      <Pressable
        px={4}
        ml="auto"
        bg="lightBlue.700"
        justifyContent="center"
        onPress={() =>
          navigate({
            name: "BeneficiarieServiceForm",
            params: {
              beneficiarie: beneficiary,
              intervs: interventions,
              intervention: data.item.intervention,
              isNewIntervention: false,
            },
          })
        }
        _pressed={{ opacity: 0.5 }}
      >
        <Icon as={MaterialIcons} name="mode-edit" size={6} color="gray.200" />
      </Pressable>
    </HStack>
  );

  return (
    <>
      {interventions.length > 0 ? (
        <View style={styles.containerForm}>
          <SwipeListView
            data={interventions}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-56}
            previewRowKey={"0"}
            previewOpenValue={-40}
            previewOpenDelay={3000}
          />
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text color="coolGray.500">Não existem Intervenções Registadas!</Text>
        </View>
      )}
      {loading ? (
        <Spinner
          visible={true}
          textContent={"Sincronizando..."}
          textStyle={styles.spinnerTextStyle}
        />
      ) : undefined}
      <Center flex={1} px="3">
        <StepperButton
          onAdd={() =>
            navigate({
              name: "BeneficiarieServiceForm",
              params: {
                beneficiarie: beneficiary,
                intervs: interventions,
                isNewIntervention: true,
              },
            })
          }
          onRefresh={syncronize}
        />
      </Center>
    </>
  );
};

export default memo(InterventionsView);
