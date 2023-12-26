import React, { useEffect, useState } from "react";
import { View, KeyboardAvoidingView, ScrollView, Text } from "react-native";
import { Divider, Flex } from "native-base";
import styles from "./styles";
import { pendingSyncBeneficiaries } from "../../services/beneficiaryService";
import { pendingSyncBeneficiariesInterventions } from "../../services/beneficiaryInterventionService";
import { pendingSyncReferences } from "../../services/referenceService";

const SyncReportScreen: React.FC = () => {
  const [beneficiariesNotSynced, setBeneficiariesNotSynced] = useState<any>();
  const [referencesNotSynced, setReferencesNotSynced] = useState<any>();
  const [
    beneficiariesInterventionsNotSynced,
    setBeneficiariesInterventionsNotSynced,
  ] = useState<any>();

  const fetchCounts = async () => {
    const benNotSynced = await pendingSyncBeneficiaries();
    const benIntervNotSynced = await pendingSyncBeneficiariesInterventions();
    const refNotSynced = await pendingSyncReferences();

    setBeneficiariesNotSynced(benNotSynced);
    setReferencesNotSynced(refNotSynced);
    setBeneficiariesInterventionsNotSynced(benIntervNotSynced);
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.background}>
      <ScrollView>
        <View>
          <View style={styles.containerForm}>
            <Text style={styles.txtLabel}>
              Itens Pendentes de Sincronização {"                            "}
            </Text>
            <Divider />
            <Flex
              direction="column"
              mb="2.5"
              mt="1.5"
              _text={{ color: "coolGray.800" }}
            >
              <Text>
                {" "}
                <Text style={styles.txtLabel}>
                  Beneficiárias por sincronizar :{" "}
                </Text>{" "}
                {beneficiariesNotSynced}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}>
                  Intervenções por sincronizar:{" "}
                </Text>{" "}
                {beneficiariesInterventionsNotSynced}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}>
                  Referências por sincronizar:{" "}
                </Text>{" "}
                {referencesNotSynced}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}> </Text>{" "}
              </Text>
            </Flex>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SyncReportScreen;
