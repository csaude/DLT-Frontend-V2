import React, { useState, useEffect, useContext } from "react";
import { View, TouchableHighlight } from 'react-native';
import { useToast, HStack, Text, Icon, VStack, Pressable, Spacer, Stagger, IconButton, Center } from "native-base";
import { MaterialIcons, Ionicons } from "@native-base/icons";
import { navigate } from '../../../routes/NavigationRef';
import styles from './styles';
import { SwipeListView } from 'react-native-swipe-list-view';
import StepperButton from './StapperButton';
import { SuccessHandler, ErrorHandler} from "../../../components/SyncIndicator";
import { Context } from '../../../routes/DrawerNavigator';
import { sync } from '../../../database/sync';

const ReferenceView: React.FC = ({ route }: any) => {

    const {
        beneficiary,
        references,
    } = route.params;
    const loggedUser:any = useContext(Context);
    const toast = useToast();

    const syncronize = () => {
        sync({username: loggedUser.username})
                .then(() => toast.show({
                                placement: "top",
                                render:() => {
                                    return (<SuccessHandler />);
                                }
                            }))
                .catch(() => toast.show({
                                placement: "top",
                                render:() => {
                                    return (<ErrorHandler />);
                                }
                            }))
    }


    const renderItem = (data: any) => (
        <TouchableHighlight
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
            <HStack width="100%" px={4} flex={1} space={5} alignItems="center">
                <Ionicons name="exit" size={50} color="#0d9488" />
                <VStack width='200px' >
                    <Text _dark={{color: "warmGray.50"}} color="darkBlue.800" >
                        {data.item.reference_code}
                    </Text>
                    <HStack>
                        <Text color="warmGray.400" _dark={{ color: "warmGray.200" }}>
                            Referir para:
                        </Text>
                        <Text color="darkBlue.300" _dark={{ color: "warmGray.200" }}>
                            {` ${data.item.refer_to}`}
                        </Text>
                    </HStack>
                    <HStack>
                        <Text color="warmGray.400" _dark={{ color: "warmGray.200" }}>
                            Estado:
                        </Text>
                        <Text color="darkBlue.300" _dark={{ color: "warmGray.200" }}>
                            {` ${ data.item.status_ref === 1? 'Atendido' : 'Pendente'}`}
                        </Text>
                    </HStack>
                </VStack>
                <Text color="coolGray.500" alignSelf="flex-start" marginTop={2}>{data.item.date_created}</Text>
            </HStack>

        </TouchableHighlight>
    );

    return (
        <>
            {references.length > 0 ?
                <View style={styles.containerForm}>
                    <SwipeListView
                        data={references}
                        renderItem={renderItem}
                        rightOpenValue={-80}
                        previewRowKey={'0'}
                        previewOpenValue={-40}
                        previewOpenDelay={3000}
                    />
                </View> :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text color="coolGray.500" >Não existem Referencias Registadas!</Text>
                </View>
            }
            <Center flex={1} px="3" >
                <StepperButton onAdd={() => navigate({ name: "ReferenceForm", params: { } })}
                                onRefresh={syncronize} />
            </Center>
        </>

    );
}

export default ReferenceView;