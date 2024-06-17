import React, { memo } from "react";
import { View } from "react-native";
import {
  Alert,
  Text,
  HStack,
  VStack,
  CloseIcon,
  Box,
  IconButton,
  useToast,
} from "native-base";
import { database } from "../../database";
import { Q } from "@nozbe/watermelondb";

const todayDate = new Date();
export const sevenDaysLater = todayDate.setFullYear(
  todayDate.getFullYear(),
  todayDate.getMonth(),
  todayDate.getDate() + 7
);
const sixMonthsAgo = todayDate.setFullYear(
  todayDate.getFullYear(),
  todayDate.getMonth() - 6
);

export const cleanData = (myDataIDs: any): any => {
  const flattenedDataIDs = myDataIDs.flat();
  const uniqueArray = Array.from(new Set(flattenedDataIDs));

  return uniqueArray;
};

export const filterData = (array: any): any => {
  const myArray = [];
  const benfIdsInCOP = [];

  const dataFilter = array.filter((e) => {
    if (new Date(e._raw?.date_created) <= new Date(sixMonthsAgo)) {
      return [...myArray, e._raw];
    }
  });
  const idsFilter = array.filter((e) => {
    if (new Date(e._raw?.date_created) > new Date(sixMonthsAgo)) {
      return [...benfIdsInCOP, e._raw];
    }
  });

  const myDataIDs = dataFilter.map((e: any) => {
    return [...myArray, e._raw?.beneficiary_id];
  });

  const cleanBenfIdsInCOP = idsFilter.map((e: any) => {
    return [...benfIdsInCOP, e._raw?.beneficiary_id];
  });

  const data = cleanData(myDataIDs);
  const bendInCOP = cleanData(cleanBenfIdsInCOP);
  const itemsToRemoveSet = new Set(bendInCOP);

  const commonItems = data.filter((item: any) => itemsToRemoveSet.has(item));
  const resultArray = data.filter((item: any) => !commonItems.includes(item));

  return resultArray;
};

export function showToast(status, message, description) {
  const toasty = useToast();

  return toasty.show({
    placement: "top",
    render: () => {
      return (
        <Alert w="100%" status={status}>
          <VStack space={2} flexShrink={1} w="100%">
            <HStack flexShrink={1} space={2} justifyContent="space-between">
              <HStack space={2} flexShrink={1}>
                <Alert.Icon mt="1" />
                <Text fontSize="md" color="coolGray.800">
                  {message}
                </Text>
              </HStack>
              <IconButton
                variant="unstyled"
                _focus={{ borderWidth: 0 }}
                icon={<CloseIcon size="3" color="coolGray.600" />}
              />
            </HStack>
            <Box pl="6" _text={{ color: "coolGray.600" }}>
              {description}
            </Box>
          </VStack>
        </Alert>
      );
    },
  });
}


export const checkPendingSync= async () => {
  try {

    const referenceCollection = database.collections.get('references');
    const beneficiariesInterventionsCollection = database.collections.get('references_services');

    const pendingSyncReferenceItems = await referenceCollection.query(
      Q.where('is_awaiting_sync', true)
    ).fetch();
    const pendingSyncInterventionsItems = await beneficiariesInterventionsCollection.query(
      Q.where('is_awaiting_sync', true)
    ).fetch();

    return pendingSyncReferenceItems.length > 0 && pendingSyncInterventionsItems.length > 0;

  } catch (error){
    console.log(error);
  };
};

export const destroyBeneficiariesData = async (beneficiaryIds: any) => {
  // setLoading(true);
  try {
    await database.write(async () => {
      for (const beneficiaryId of beneficiaryIds) {
        // console.log(beneficiaryId);
        const recordsInterventions = await database
          .get("beneficiaries_interventions")
          .query(Q.where("beneficiary_id", beneficiaryId))
          .fetch();
        for (const record of recordsInterventions) {
          await record.destroyPermanently();
        }
        const recordsReferences = await database
          .get("references")
          .query(Q.where("beneficiary_id", beneficiaryId))
          .fetch();
        for (const record of recordsReferences) {
          await record.destroyPermanently();
        }
        const recordsBeneficiaries = await database
          .get("beneficiaries")
          .query(Q.where("online_id", beneficiaryId))
          .fetch();
        for (const record of recordsBeneficiaries) {
          await record.destroyPermanently();
        }
      }
    });
    console.log("Dados limpados com sucesso!!!")
  } catch (error){
    console.log(error);
  };
};

export const InfoHandler: React.FC = () => {
  return (
    <>
      <Alert
        w="100%"
        variant="left-accent"
        colorScheme="success"
        status="success"
      >
        <VStack space={2} flexShrink={1} w="100%">
          <HStack
            flexShrink={1}
            space={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack space={2} flexShrink={1} alignItems="center">
              <Alert.Icon />
              <Text color="coolGray.800">
                Limpeza de dados terminada com sucesso!
              </Text>
            </HStack>
          </HStack>
        </VStack>
      </Alert>
    </>
  );
};


  export const SyncHandlerError: React.FC = () => {
    return (
      <>
        <Alert
          w="100%"
          variant="left-accent"
          colorScheme="success"
          status="success"
        >
          <VStack space={2} flexShrink={1} w="100%">
            <HStack
              flexShrink={1}
              space={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack space={2} flexShrink={1} alignItems="center">
                <Alert.Icon />
                <Text color="coolGray.800">
                  Para a Limpeza de fim de COP e necessario estar conectado a internet!!!
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </Alert>
      </>
    );
  };

export const InfoHandlerSave: React.FC = () => {
  return (
    <>
      <Alert
        w="100%"
        variant="left-accent"
        colorScheme="success"
        status="success"
      >
        <VStack space={2} flexShrink={1} w="100%">
          <HStack
            flexShrink={1}
            space={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack space={2} flexShrink={1} alignItems="center">
              <Alert.Icon />
              <Text color="coolGray.800">
                Limpeza de fim de COP finalizada com sucesso!!!
              </Text>
            </HStack>
          </HStack>
        </VStack>
      </Alert>
    </>
  );
};

export const ErrorHandler: React.FC = () => {
  return (
    <>
      <Alert
        w="100%"
        variant="left-accent"
        colorScheme="success"
        status="error"
      >
        <VStack space={2} flexShrink={1} w="100%">
          <HStack
            flexShrink={1}
            space={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack space={2} flexShrink={1} alignItems="center">
              <Alert.Icon />
              <Text color="coolGray.800">Nenhuma opção Selecionada!</Text>
            </HStack>
          </HStack>
        </VStack>
      </Alert>
    </>
  );
};

export const ErrorCleanHandler: React.FC = () => {
  return (
    <>
      <Alert
        w="100%"
        variant="left-accent"
        colorScheme="success"
        status="error"
      >
        <VStack space={2} flexShrink={1} w="100%">
          <HStack
            flexShrink={1}
            space={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack space={2} flexShrink={1} alignItems="center">
              <Alert.Icon />
              <Text color="coolGray.800">
                Falha no processo de limpeza de dados!
              </Text>
            </HStack>
          </HStack>
        </VStack>
      </Alert>
    </>
  );
};

const DataCleanComponents = () => {
  return <View></View>;
};

export default memo(DataCleanComponents);
