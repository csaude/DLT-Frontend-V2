import React, { memo, useCallback } from "react";
import { View, TouchableHighlight } from "react-native";
import { HStack, Text, Icon, VStack, Pressable } from "native-base";
import { Ionicons } from "@native-base/icons";
import { navigate } from "../../../routes/NavigationRef";
import styles from "./styles";
import { SwipeListView } from "react-native-swipe-list-view";

const ServicesView: React.FC = ({ route }: any) => {
  const { reference, beneficiary, services, attendDisabled } = route.params;

  const renderItem = useCallback((data: any) => {
    return (
      <TouchableHighlight
        onPress={() =>
          navigate({
            name: "ServicesForm",
            params: {
              reference: reference,
              beneficiarie: beneficiary,
              intervention: data.item,
            },
          })
        }
        style={styles.rowFront}
        underlayColor={"#AAA"}
        disabled={attendDisabled}
      >
        <HStack width="100%" px={4} flex={1} space={5} alignItems="center">
          <Ionicons name="medkit" size={50} color="#0d9488" />
          <VStack width="200px">
            <Text _dark={{ color: "warmGray.50" }} color="darkBlue.800">
              {data.item.name}
            </Text>
          </VStack>
          <VStack width="200px">
            <HStack>
              <Text color="warmGray.400" _dark={{ color: "warmGray.200" }}>
                Estado:
              </Text>
            </HStack>
            <HStack>
              <Text color="darkBlue.300" _dark={{ color: "warmGray.200" }}>
                {` ${
                  data.item.service.status === 0
                    ? "Pendente"
                    : data.item.service.status === 1
                    ? "Em Curso"
                    : "Atendido"
                }`}
              </Text>
            </HStack>
          </VStack>
          <Text color="coolGray.500" alignSelf="flex-start" marginTop={2}>
            {data.item.date_created}
          </Text>
        </HStack>
      </TouchableHighlight>
    );
  }, []);

  const renderHiddenItem = useCallback(
    (data: any) => (
      <HStack flex={1} pl={2}>
        <Pressable
          px={4}
          ml="auto"
          bg="lightBlue.700"
          justifyContent="center"
          disabled={attendDisabled}
          onPress={() =>
            navigate({
              name: "ServicesForm",
              params: {
                reference: reference,
                beneficiarie: beneficiary,
                intervention: data.item,
              },
            })
          }
          _pressed={{ opacity: 0.5 }}
        >
          <Icon as={Ionicons} name="create" size={6} color="gray.200" />
        </Pressable>
      </HStack>
    ),
    []
  );

  return (
    <>
      {services?.length > 0 ? (
        <View style={styles.containerForm}>
          <SwipeListView
            data={services}
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
          <Text color="coolGray.500">Não existem Serviços Registados!</Text>
        </View>
      )}
    </>
  );
};

export default memo(ServicesView);
