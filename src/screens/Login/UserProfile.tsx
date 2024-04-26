import React, { memo, useContext } from "react";
import { View, KeyboardAvoidingView, ScrollView, Text } from "react-native";
import { Box, Heading, Divider, Avatar, Icon, Flex } from "native-base";
import { Ionicons } from "@native-base/icons";
import { database } from "../../database";
import styles from "./styles";
import { Context } from "../../routes/DrawerNavigator";
import withObservables from "@nozbe/with-observables";

const UserProfile: React.FC = ({
  profiles,
  users,
  provinces,
  districts,
  localities,
  us,
}: any) => {
  const loggedUser: any = useContext(Context);
  const user = users.filter((e) => {
    return (
      e?._raw.online_id ==
      (loggedUser?.entry_point === undefined
        ? loggedUser?.id
        : loggedUser?.online_id)
    );
  })[0]?._raw;
  const profile = profiles.filter((e) => {
    return e?._raw.online_id == user?.profile_id;
  })[0]?._raw;

  const logguedUserLocalities = loggedUser.localities_ids
    ? loggedUser.localities_ids.replace(/\s/g, "").split(",")
    : loggedUser.localities.map((l) => l.id + "");
  const logguedUserUs = loggedUser.us_ids
    ? loggedUser.us_ids.replace(/\s/g, "").split(",")
    : loggedUser.us.map((u) => u.id + "");

  const userLocalities = localities.filter((e) => {
    return logguedUserLocalities?.includes(e?._raw.online_id.toString());
  });

  const userUs = us.filter((e) => {
    return logguedUserUs.includes(e?._raw.online_id.toString());
  });

  return (
    <KeyboardAvoidingView style={styles.background}>
      <ScrollView>
        <View style={styles.user}>
          <View style={styles.containerForm}>
            <Box style={styles.userLogo}>
              <Avatar color="white" bg={"primary.700"} size={150}>
                <Icon
                  as={Ionicons}
                  name="person-outline"
                  color="white"
                  size={70}
                />
              </Avatar>
              <Box style={styles.userText}>
                <Text>{user?.username}</Text>
                <Heading style={styles.username}>
                  {user?.name} {user?.surname}
                </Heading>
                <Text>{user?.email}</Text>
              </Box>
            </Box>
            <Text style={styles.txtLabel}>Detalhes do Utilizador</Text>
            <Divider />
            <Flex
              direction="column"
              mb="2.5"
              mt="1.5"
              _text={{ color: "coolGray.800" }}
            >
              <Text>
                {" "}
                <Text style={styles.txtLabel}>Perfil: </Text> {profile?.name}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}>Organização: </Text>{" "}
                {user?.organization_name}{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}>Telemóvel: </Text>{" "}
                {user?.phone_number}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}>Ponto de Entrada: </Text>
                {user?.entry_point === "1"
                  ? "Unidade Sanitaria"
                  : user?.entry_point === "2"
                  ? "Comunidade"
                  : "Escola"}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}>Província(s): </Text>{" "}
                {provinces?.map((p) => p.name + ", ")}{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}>Distrito(s): </Text>{" "}
                {districts?.map((d) => d.name + ", ")}{" "}
              </Text>
              <Text>
                {" "}
                <Text style={styles.txtLabel}>
                  Posto(s) Administrativo(s):{" "}
                </Text>{" "}
                {userLocalities?.map((d) => d.name + ", ")}{" "}
              </Text>
              <Text>
                {" "}
                <Text style={styles.txtLabel}>Alocação: </Text> {userUs?.map((u) => u.name + ", ")} 
              </Text>
              
            </Flex>
            <Divider />

            <Text>
              {" "}
              <Text style={styles.txtLabel}>Estado: </Text>{" "}
              {user?.status === 1 ? "Activo" : "Inactivo"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const enhance = withObservables([], () => ({
  users: database.collections.get("users").query(),
  profiles: database.collections.get("profiles").query(),
  provinces: database.collections.get("provinces").query(),
  districts: database.collections.get("districts").query(),
  localities: database.collections.get("localities").query(),
  us: database.collections.get("us").query(),
}));

export default memo(enhance(UserProfile));
