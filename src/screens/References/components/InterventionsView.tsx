import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import { View, TouchableHighlight } from "react-native";
import { HStack, Text, VStack } from "native-base";
import { Ionicons } from "@native-base/icons";
import styles from "./styles";
import { SwipeListView } from "react-native-swipe-list-view";
import { Context } from "../../../routes/DrawerNavigator";
import { MENTOR, SUPERVISOR } from "../../../utils/constants";
import { database } from "../../../database";
import { Q } from "@nozbe/watermelondb";

const InterventionsView: React.FC = ({ route }: any) => {
  const [partnerType, setPartnerType] = useState(undefined);
  
  const { interventions } = route.params;
  const loggedUser: any = useContext(Context);
  const profileId = loggedUser.profile_id? loggedUser.profile_id : loggedUser.profiles.id;

  useEffect(() => {
    getPartner();
  }, []);

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

  const renderItem = useCallback(
    (data: any) => (
      <TouchableHighlight style={styles.rowFront} underlayColor={"#AAA"}>
        <HStack width="100%" px={4} flex={1} space={5} alignItems="center">
          <Ionicons name="medkit" size={50} color="#0d9488" />
          <VStack width="200px">
            <Text
              _dark={{
                color: "warmGray.50",
              }}
              color="darkBlue.800"
            >
              {[MENTOR, SUPERVISOR].includes(profileId) && (partnerType == undefined || partnerType == "2") &&
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
                  data.item.intervention.entry_point === "1"
                    ? "US"
                    : data.item.intervention.entry_point === "2"
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
    ),
    []
  );

  return (
    <>
      {interventions.length > 0 ? (
        <View style={styles.containerForm}>
          <SwipeListView
            data={interventions}
            renderItem={renderItem}
            rightOpenValue={-80}
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
    </>
  );
};

export default memo(InterventionsView);
