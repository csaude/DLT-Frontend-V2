import React, { useEffect, useState } from "react";
import { View, KeyboardAvoidingView, ScrollView, Text } from "react-native";
import { Button, Divider, Flex, FormControl, Radio, Stack } from "native-base";
import styles from "./styles";
import { Formik } from "formik";

const DatacleanScreen: React.FC = () => {
  
  // function handleSubmit() => {
  //   throw new Error("Function not implemented.");
  // }

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
                      alignItems={{
                        base: "flex-start",
                        md: "center",
                      }}
                      space={1}
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

                <Button
                  // isLoading={loading}
                  isLoadingText="Cadastrando"
                  // onPress={handleSubmit}
                  my="10"
                  colorScheme="primary"
                >
                  Salvar
                </Button>

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
            </Flex>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DatacleanScreen;
