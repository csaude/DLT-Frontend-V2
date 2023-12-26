import React, { useEffect, useState } from "react";
import { View, KeyboardAvoidingView, ScrollView, Text } from "react-native";
import { Button, Divider, Flex } from "native-base";
import styles from "./styles";
import { getAllBeneficiaries } from "../../services/beneficiaryService";
import { getAllBeneficiariesInterventions } from "../../services/beneficiaryInterventionService";
import {
  getAllReferenceServices,
  getAllReferences,
} from "../../services/referenceService";
import RNFS from "react-native-fs";
import Share from "react-native-share";

const SyncReportScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [references, setReferences] = useState<any[]>([]);
  const [beneficiariesInterventions, setBeneficiariesInterventions] = useState<
    any[]
  >([]);
  const [referenceServices, setReferenceServices] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const benef = await getAllBeneficiaries();
      const benInterv = await getAllBeneficiariesInterventions();
      const refs = await getAllReferences();
      const refServs = await getAllReferenceServices();

      setBeneficiaries(benef);
      setReferences(refs);
      setBeneficiariesInterventions(benInterv);
      setReferenceServices(refServs);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportData = async () => {
    try {
      setLoading(true);
      fetchData();
      writeFileOnDevice();
      shareFileViaWhatsApp();
      setLoading(false);
    } catch (error) {
      console.error("Error saving file:", error);
    }
  };

  const writeFileOnDevice = async () => {
    // write the file
    const data = {
      beneficiaries: beneficiaries,
      beneficiariesInterventions: beneficiariesInterventions,
      references: references,
      referenceServices: referenceServices,
    };
    const path = `${RNFS.ExternalDirectoryPath}/dlt2.json`;
    try {
      await RNFS.writeFile(path, JSON.stringify(data), "utf8");
    } catch (err) {
      console.error("ERROR IN FILE WRITTEN!", err);
    }
  };

  const shareFileViaWhatsApp = async () => {
    const filePath = `${RNFS.ExternalDirectoryPath}/dlt2.json`;

    const options: any = {
      title: "Share via",
      url: `file://${filePath}`,
      social: Share.Social.WHATSAPP,
    };

    try {
      await Share.shareSingle(options);
    } catch (error) {
      console.error("--Error sharing file via WhatsApp:", error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.background}>
      <ScrollView>
        <View>
          <View>
            <Text style={styles.txtLabel}>
              Exportar toda informação do DLT 2.0, existente neste Dispositivo{" "}
              {"                            "}
            </Text>
            <Divider />
            <Button
              isDisabled={loading}
              isLoading={loading}
              isLoadingText="Autenticando"
              onPress={handleExportData}
              my="10"
              colorScheme="primary"
            >
              Exportar
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SyncReportScreen;
