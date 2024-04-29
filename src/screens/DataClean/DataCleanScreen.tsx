import React, { useEffect, useState } from "react";
import { View, KeyboardAvoidingView, ScrollView, Text } from "react-native";
import { Divider, Flex } from "native-base";
import styles from "./styles";
import { pendingSyncBeneficiaries } from "../../services/beneficiaryService";
import { pendingSyncBeneficiariesInterventions } from "../../services/beneficiaryInterventionService";
import { pendingSyncReferences } from "../../services/referenceService";

import { useDispatch, useSelector } from "react-redux";
import {
  loadPendingsBeneficiariesInterventionsTotals,
  loadPendingsBeneficiariesTotals,
  loadPendingsReferencesTotals,
} from "../../store/syncSlice";

const DatacleanScreen: React.FC = () => {
  const beneficiariesNotSynced = useSelector(
    (state: any) => state.sync.pendingSyncBeneficiaries
  );
  const beneficiariesInterventionsNotSynced = useSelector(
    (state: any) => state.sync.pendingSyncBeneficiariesInterventions
  );
  const referencesNotSynced = useSelector(
    (state: any) => state.sync.pendingSyncReferences
  );
  const dispatch = useDispatch();

  const fetchCounts = async () => {
    const benefNotSynced = await pendingSyncBeneficiaries();
    dispatch(
      loadPendingsBeneficiariesTotals({
        pendingSyncBeneficiaries: benefNotSynced,
      })
    );

    const benefIntervNotSynced = await pendingSyncBeneficiariesInterventions();
    dispatch(
      loadPendingsBeneficiariesInterventionsTotals({
        pendingSyncBeneficiariesInterventions: benefIntervNotSynced,
      })
    );

    const refNotSynced = await pendingSyncReferences();
    dispatch(
      loadPendingsReferencesTotals({ pendingSyncReferences: refNotSynced })
    );
  };
  useEffect(() => {
    fetchCounts();
  }, [dispatch]);
  return (
    <KeyboardAvoidingView style={styles.background}>
      <ScrollView>
        <View>
          <View style={styles.containerForm}>
            <Text style={styles.txtLabel}>
              Limpeza de Dados{"                                                        "}
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
                  Seleccione a opçao
                </Text>
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

export default DatacleanScreen;
