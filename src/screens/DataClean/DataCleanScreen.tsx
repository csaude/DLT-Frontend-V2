import React, { useEffect, useState } from "react";
import { View, KeyboardAvoidingView, ScrollView, Text } from "react-native";
import { Divider, Flex, FormControl, Radio, Stack } from "native-base";
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
              {/* <Text>
                {" "}
                <Text style={styles.txtLabel}>
                  Seleccione a opçao
                </Text>
              </Text> */}


              <FormControl
                  key="vblt_is_deficient"
                  isRequired
                  // isInvalid={"vblt_is_deficient" in formik.errors}
                >
                  <FormControl.Label>Seleccione a opçao</FormControl.Label>
                  <Radio.Group
                    // value={formik.values.vblt_is_deficient + ""}
                    // onChange={(itemValue) => {
                    //   formik.setFieldValue("vblt_is_deficient", itemValue);
                    //   onIsDeficientChange(itemValue);
                    // }}
                    name="rg4"
                    accessibilityLabel="pick a size"
                  >
                    <Stack
                      direction={{ base: "row", md: "row" }}
                      alignItems={{
                        base: "flex-start",
                        md: "center",
                      }}
                      space={4}
                      w="75%"
                      maxW="300px"
                    >
                      <Radio
                        key="defi1"
                        value="1"
                        colorScheme="green"
                        size="md"
                        my={1}
                      >
                        Limpeza Regular
                      </Radio>                      
                      <Radio
                        key="defi2"
                        value="0"
                        colorScheme="green"
                        size="md"
                        my={1}
                      >
                        Limpeza do Fim do COP
                      </Radio>
                    </Stack>
                  </Radio.Group>
                  <FormControl.ErrorMessage>
                    {/* {formik.errors.vblt_is_deficient} */}
                  </FormControl.ErrorMessage>
                </FormControl>

              <Text>
                {" "}
                <Text style={styles.txtLabel}>
                 {" "}
                </Text>{" "}
                
              </Text>

              <Text>
                {" "}
                <Text style={styles.txtLabel}>
                 {" "}
                </Text>{" "}
                
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
