import React from "react";
import { View, KeyboardAvoidingView, ScrollView, Text } from "react-native";
import { Divider, Flex } from "native-base";
import styles from "./styles";
import data from "./release.json";

const AppInfoScreen: React.FC = () => {
  return (
    <KeyboardAvoidingView style={styles.background}>
      <ScrollView>
        <View style={styles.user}>
          <View style={styles.containerForm}>
            <Text style={styles.txtLabel}>Detalhes da Aplicação</Text>
            <Divider />
            <Flex
              direction="column"
              mb="2.5"
              mt="1.5"
              _text={{ color: "coolGray.800" }}
            >
              <Text>
                {" "}
                <Text style={styles.txtLabel}>Version Number : </Text>{" "}
                {data.release?.version}{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}>Build Date: </Text>{" "}
                {data.release.date}
              </Text>
            </Flex>
            <Divider />
            <Text style={styles.txtLabel}>Changelog: </Text>
            {data.release.changelogs?.map((item) => (
              <Text key={item.id}>
                {"-"} {item.changelog}{" "}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AppInfoScreen;
