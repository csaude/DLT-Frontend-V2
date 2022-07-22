import React, { useState, useEffect } from "react";
import { View, TouchableHighlight } from 'react-native';
import { HStack, Text, Icon, VStack, Pressable, Spacer } from "native-base";
import { MaterialIcons, Ionicons } from "@native-base/icons";
import { navigate } from '../../../routes/NavigationRef';
import styles from './styles';
import { SwipeListView } from 'react-native-swipe-list-view';

const ReferenceView: React.FC = ({ route }: any) => {

    const {
        beneficiary,
        references
    } = route.params;

    const renderItem = (data: any) => (
        <TouchableHighlight
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
            <HStack width="100%" px={4} flex={1} space={5} alignItems="center">
                <Ionicons name="exit" size={50} color="#38bdf8" />
                <VStack width='200px' >
                    <HStack>
                        <Text _dark={{
                            color: "warmGray.50"
                        }} color="warmGray.800" >
                            Codigo: 
                        </Text>
                        <Text _dark={{
                            color: "warmGray.50"
                        }} color="darkBlue.800" >
                            {data.item.reference_note}
                        </Text>
                    </HStack>
                    <Text color="darkBlue.300" _dark={{ color: "warmGray.200" }}>
                        Referir a:{data.item.refer_to}
                    </Text>
                </VStack>
                <Text color="coolGray.500" alignSelf="flex-start" marginTop={2}>{data.item.statusRef}</Text>
            </HStack>

        </TouchableHighlight>
    );

    const renderHiddenItem = (data: any, rowMap: any) => (

        <HStack flex={1} pl={2}>
            <Pressable px={4} ml="auto" bg="lightBlue.700" justifyContent="center"
                //onPress={() => navigate({ name: "BeneficiarieServiceForm", params: { beneficiarie: beneficiary, intervention: data.item.intervention } })}
                _pressed={{ opacity: 0.5 }}
            >
                <Icon as={MaterialIcons} name="mode-edit" size={6} color="gray.200" />
            </Pressable>
        </HStack>

    );

    return (
        <>
            {references.length > 0 ?
                <View style={styles.containerForm}>
                    <SwipeListView
                        data={references}
                        renderItem={renderItem}
                        //renderHiddenItem={renderHiddenItem}
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
        </>

    );
}

export default ReferenceView;