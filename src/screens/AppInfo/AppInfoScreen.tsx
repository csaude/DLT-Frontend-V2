import React from "react";
import { View, KeyboardAvoidingView, ScrollView, Text } from "react-native";
import { Divider, Flex } from "native-base";
import styles from "./styles";
import data from "./release.json";

const AppInfoScreen: React.FC = () => {
  return (
    <KeyboardAvoidingView style={styles.background}>
      <ScrollView>
        <View>
          <View style={styles.containerForm}>
            <Text style={styles.txtLabel}>Detalhes da Aplicação</Text>
            <Divider />
            <Flex
              direction="column"
              mb="2.5"
              mt="1.5"
              _text={{ color: "coolGray.800" }}
            >
              <Text style={styles.txtGrey}>
                {" "}
                <Text style={styles.txtLabel}>Número da versão : </Text>{" "}
                {data.release?.version}{" "}
              </Text>

              <Text style={styles.txtGrey}>
                {" "}
                <Text style={styles.txtLabel}>Data da versão: </Text>{" "}
                {data.release.date}
              </Text>
            </Flex>
            <Divider />
            <Text style={styles.txtLabel}>Registo de alterações: </Text>
            {data.release.changelogs?.map((item) => (
              <>
                <Text key={item.id} style={styles.txtLabel}>{item.changelog}</Text>
                {item.items?.map((i) => (
                  <>
                    <Text key={i.id} style={{color: "black"}}>{`\u25CF ${i.item}`}</Text>
                      {i.subitems?.map((si) => (
                        <>
                          <Text key={si.id}  style={styles.txtGrey}>{`\u25AA ${si.subitem}`}</Text>
                            {si.subsubitems?.map((ssi) => (
                              <>
                                  <Text key={ssi.id}  style={styles.txtGrey}>{`\u2043 ${ssi.subsubitem}`}</Text>
                              </>
                            ))}
                        </>
                      ))}
                  </>
                ))}
              </>
            ))}
            <Text style={styles.txtGrey}>
              {" "}
            </Text>
            <Text style={styles.txtGrey}>
              *For additional details about the changes made to comply with EO 14168, please refer to the corresponding requirements documentation.
            </Text>
            <Text style={styles.txtGrey}>
              {" "}
            </Text>
            <Text style={styles.txtGrey}>
              *Para mais detalhes sobre as alterações realizadas em conformidade com a Ordem Executiva 14168, consulte a documentação de requisitos correspondente.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AppInfoScreen;
