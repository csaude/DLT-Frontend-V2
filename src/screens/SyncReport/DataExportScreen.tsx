import React, { useContext, useEffect, useState } from "react";
import { View, KeyboardAvoidingView, ScrollView, Text } from "react-native";
import { Button, Divider, Flex } from "native-base";
import styles from "./styles";
import { getBeneficiariesBy_status } from "../../services/beneficiaryService";
import { getBeneficiariesInterventionsBy_status } from "../../services/beneficiaryInterventionService";
import {
  getReferencesBy_status,
  getReferenceServicesBy_status,
} from "../../services/referenceService";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import { getSequencesBy_status } from "../../services/sequenceService";
const SyncReportScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const now = new Date();

  const handleExportData = async () => {
    try {
      setLoading(true);
      writeFileOnDevice();
      shareFileViaWhatsApp();
      setLoading(false);
    } catch (error) {
      console.error("Error saving file:", error);
    }
  };

  const writeFileOnDevice = async () => {
    const createdBeneficiaries = await getBeneficiariesBy_status("created");
    const createdBeneficiariesInterventions =
      await getBeneficiariesInterventionsBy_status("created");
    const createdReferences = await getReferencesBy_status("created");
    const createdReferenceServices = await getReferenceServicesBy_status(
      "created"
    );
    const createdSequences = await getSequencesBy_status("created");

    const updatedBeneficiaries = await getBeneficiariesBy_status("updated");
    const updatedBeneficiariesInterventions =
      await getBeneficiariesInterventionsBy_status("updated");
    const updatedReferences = await getReferencesBy_status("updated");
    const updatedReferenceServices = await getReferenceServicesBy_status(
      "updated"
    );
    const updatedSequences = await getSequencesBy_status("updated");

    const data = {
      changes: {
        beneficiaries: {
          created: createdBeneficiaries,
          updated: updatedBeneficiaries,
          deleted: [],
        },
        beneficiaries_interventions: {
          created: createdBeneficiariesInterventions,
          updated: updatedBeneficiariesInterventions,
          deleted: [],
        },
        references: {
          created: createdReferences,
          updated: updatedReferences,
          deleted: [],
        },
        references_services: {
          created: createdReferenceServices,
          updated: updatedReferenceServices,
          deleted: [],
        },
        sequences: {
          created: createdSequences,
          updated: updatedSequences,
          deleted: [],
        },
      },
      lastPulledAt: now.getTime(),
    };
    try {
      // console.log("-----------------", data);
      const path = `${RNFS.ExternalDirectoryPath}/dlt2.json`;
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
