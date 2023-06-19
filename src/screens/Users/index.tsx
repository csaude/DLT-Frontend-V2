import React, { useState, useContext, useCallback } from "react";
import { View, TouchableOpacity, TouchableHighlight } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import {
  useToast,
  HStack,
  Text,
  Avatar,
  Pressable,
  Icon,
  Box,
  Alert,
  VStack,
  Input,
} from "native-base";
import { navigate } from "../../routes/NavigationRef";
import withObservables from "@nozbe/with-observables";
import { MaterialIcons } from "@native-base/icons";
import { database } from "../../database";
import { Context } from "../../routes/DrawerNavigator";
import { sync } from "../../database/sync";

import styles from "./styles";

const UsersMain: React.FC = ({
  users,
  localities,
  profiles,
  us,
  partners,
}: any) => {
  const [searchField, setSearchField] = useState("");
  const loggedUser: any = useContext(Context);
  const toast = useToast();

  const viewUser = useCallback((data: any) => {
    const user = data.item._raw;
    const localityName = localities.filter((e) => {
      return e._raw.online_id == user.locality_id;
    })[0]._raw.name;
    const profileName = profiles.filter((e) => {
      return e._raw.online_id == user.profile_id;
    })[0]._raw.name;
    const partnerName = partners.filter((e) => {
      return e._raw.online_id == user.partner_id;
    })[0]._raw.name;
    const usName = us.filter((e) => {
      return e._raw.online_id == user.us_id;
    })[0]._raw.name;

    navigate({
      name: "UserView",
      params: {
        user: data.item._raw,
        locality: localityName,
        profile: profileName,
        partner: partnerName,
        us: usName,
      },
    });
  }, []);

  const syncronize = useCallback(() => {
    sync({ username: loggedUser.username })
      .then(() =>
        toast.show({
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
                      <Text color="coolGray.800">
                        Sincronização efectuada com sucesso!
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>
              </Alert>
            );
          },
        })
      )
      .catch(() =>
        toast.show({
          placement: "top",
          render: () => {
            return (
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
                      <Text color="coolGray.800">Falha na sincronização!</Text>
                    </HStack>
                  </HStack>
                </VStack>
              </Alert>
            );
          },
        })
      );
  }, []);

  const randomHexColor = () => {
    return "#000000".replace(/0/g, () => {
      return (~~(Math.random() * 16)).toString(16);
    });
  };

  const onRowDidOpen = (rowKey: any) => {
    console.log("This row opened", rowKey);
  };

  const renderItem = useCallback(
    (data: any) => (
      <TouchableHighlight
        onPress={() => viewUser(data)}
        style={styles.rowFront}
        underlayColor={"#AAA"}
      >
        <HStack width="100%" px={4} flex={1} space={5} alignItems="center">
          {/* <Avatar color="white" bg={'warning.600'} > */}
          <Avatar color="white" bg={randomHexColor()}>
            {data.item.username.charAt(0).toUpperCase()}
            {/* {"A"} */}
          </Avatar>
          <View>
            <Text color="darkBlue.800">{data.item.username} </Text>
            <Text color="darkBlue.800">
              {data.item.name} {data.item.surname}
            </Text>
            <Text color="darkBlue.800">{data.item.partners?.name}</Text>
          </View>
        </HStack>
      </TouchableHighlight>
    ),
    []
  );

  const renderHiddenItem = useCallback(
    (data: any) => (
      <HStack flex={1} pl={2}>
        <Pressable
          px={4}
          ml="auto"
          bg="lightBlue.700"
          justifyContent="center"
          onPress={() => viewUser(data)}
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
            navigate({ name: "UserForm", params: { user: data.item._raw } })
          }
          _pressed={{ opacity: 0.5 }}
        >
          <Icon as={MaterialIcons} name="mode-edit" size={6} color="gray.200" />
        </Pressable>
      </HStack>
    ),
    []
  );

  const handleChange = (e: any) => {
    setSearchField(e);
  };

  const filteredUsers = users.filter((user) =>
    (user.name + " " + user.surname)
      .toLowerCase()
      .includes(searchField.toLowerCase())
  );

  return (
    <View style={styles.container}>
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
            placeholder="Search"
            style={{ borderRadius: 45 }}
          />
        </Box>
      </View>
      <SwipeListView
        data={filteredUsers}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        //leftOpenValue={75}
        rightOpenValue={-150}
        previewRowKey={"0"}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
      />
      <TouchableOpacity onPress={syncronize} style={styles.fab1}>
        <Icon as={MaterialIcons} name="refresh" size={8} color="#0c4a6e" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigate({ name: "UserForm", params: {} })}
        style={styles.fab}
      >
        <Icon as={MaterialIcons} name="add" size={8} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const enhance = withObservables([], () => ({
  users: database.collections.get("users").query().observe(),
  localities: database.collections.get("localities").query().observe(),
  profiles: database.collections.get("profiles").query().observe(),
  partners: database.collections.get("partners").query().observe(),
  us: database.collections.get("us").query().observe(),
}));
export default enhance(UsersMain);
