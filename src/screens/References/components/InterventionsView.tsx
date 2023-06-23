import React, { useState, useEffect, useContext } from "react";
import { View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { useToast, Alert, HStack, Text, Icon, VStack, Pressable, useDisclose, Center, Box, Stagger, IconButton } from "native-base";
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "@native-base/icons";
import { navigate } from '../../../routes/NavigationRef';
import styles from './styles';
import { SwipeListView } from 'react-native-swipe-list-view';
import { SuccessHandler, ErrorHandler} from "../../../components/SyncIndicator";
import { Context } from '../../../routes/DrawerNavigator';
import { sync } from '../../../database/sync';



const InterventionsView: React.FC = ({ route }: any) => {

    const {
        beneficiary,
        interventions
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
                <Ionicons name="medkit" size={50} color="#0d9488" />
                <VStack width='200px' >
                    <Text _dark={{
                        color: "warmGray.50"
                    }} color="darkBlue.800" >
                        {loggedUser.profile_id == 4 && [26,67,68].includes(data.item.intervention.sub_service_id) ? 'Aconselhamento e Testagem em Saúde' : data.item.name}
                    </Text>
                    <HStack>
                        <Text color="warmGray.400" _dark={{ color: "warmGray.200" }}>
                            Ponto de Entrada:
                        </Text>
                        <Text color="darkBlue.300" _dark={{ color: "warmGray.200" }}>
                            {` ${
                                    (data.item.intervention.entry_point === "1") ?
                                        "US"
                                        :
                                    (data.item.intervention.entry_point === "2") ?
                                        "CM"
                                        :
                                        "ES"
                                }`
                            }
                        </Text>
                    </HStack>
                    
                </VStack>
                <Text color="coolGray.500" alignSelf="flex-start" marginTop={2}>{data.item.intervention.date}</Text>
            </HStack>

        </TouchableHighlight>
    );

    return (
        <>
            {interventions.length > 0 ?
                <View style={styles.containerForm}>
                    <SwipeListView
                        data={interventions}
                        renderItem={renderItem}
                        rightOpenValue={-80}
                        previewRowKey={'0'}
                        previewOpenValue={-40}
                        previewOpenDelay={3000}
                    />

                </View> :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text color="coolGray.500" >Não existem Intervenções Registadas!</Text>
                </View>
            }

        </>

    );
}

export default InterventionsView;