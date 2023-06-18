import React, { memo } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { Box, Heading, Divider, Avatar, Icon, Flex } from "native-base";
import { Ionicons } from "@native-base/icons";
import { navigate } from "../../../routes/NavigationRef";
import styles from "./styles";

const ViewUsers: React.FC = ({ route }: any) => {
  const { user, profile, locality, partner, us } = route.params;

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
                <Text>{user.username}</Text>
                <Heading style={styles.username}>
                  {user.name} {user.surname}
                </Heading>
                <Text>{user.phone_number}</Text>
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
                <Text style={styles.txtLabel}>Parceiro: </Text> {partner}{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}>Telemóvel: </Text>{" "}
                {user.phone_number}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}>Ponto de Entrada: </Text>
                {user.entry_point === "1"
                  ? "Unidade Sanitaria"
                  : user.entry_point === "2"
                  ? "Escola"
                  : "Comunidade"}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}>Localidade: </Text> {locality}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}>US: </Text> {us}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}>Perfil: </Text> {profile}
              </Text>
            </Flex>
            <Divider />

            <Text>
              {" "}
              <Text style={styles.txtLabel}>Estado: </Text>{" "}
              {"Activo" /*(user.status===1)  ? "Activo" : "Inactivo" */}
            </Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigate({ name: "UserForm", params: { user: user } })}
        style={styles.fab}
      >
        <Icon as={Ionicons} name="pencil" size={7} color="white" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default memo(ViewUsers);
