import React, { useEffect, useState, useContext } from 'react';
import { View, TouchableOpacity, TouchableHighlight } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useToast, HStack, Text, Avatar, Pressable, Icon, Box, Alert, VStack, Input } from 'native-base';
import { navigate } from '../../routes/NavigationRef';
import withObservables from '@nozbe/with-observables';
import { MaterialIcons, Ionicons } from '@native-base/icons';
import { Q } from "@nozbe/watermelondb";
import { database } from '../../database';
import { Context } from '../../routes/DrawerNavigator';
import { sync } from '../../database/sync';

import styles from './styles';


const ReferencesMain: React.FC = ({ references, beneficiaries, users, partners, services, subServices }:any) => {
    const [searchField, setSearchField] = useState('');
    const loggedUser:any = useContext(Context);
    const toast = useToast();

    const getBeneficiary = (beneficiary_id: any) => {
        return beneficiaries.filter((e) => {
            return e._raw.online_id == beneficiary_id
        })[0];
    }

    const getUser = (user_id: any) => {
        return users.filter((e) => {
            return e._raw.online_id == user_id
        })[0];
    }

    const getOrganization = (partner_id: any) => {
        return partners.filter((e) => {
            return e._raw.online_id == partner_id
        })[0];
    }

    const getStatus = (status:any) => {
        if (status === 0) {
            return "Pendente";
        } else if (status === 1) {
            return "Atendida Parcialmente"
        } else if (status === 2) {
            return "Atendida"
        } else if (status === 3) {
            return "Cancelada"
        }
    }

    const viewReference = async (data:any) => {
        const reference = data.item?._raw;
        const beneficiary = getBeneficiary(reference.beneficiary_id)._raw;
        const referer = getUser(reference.created_by)._raw;
        const organization = getOrganization(referer.partner_id)._raw.name

        const beneficiaryId = beneficiary.online_id ? beneficiary.online_id : beneficiary.id;

        const interventions = await database.get('beneficiaries_interventions').query(
            Q.where('beneficiary_id', beneficiaryId),   
        ).fetch();

        const interventionObjects = interventions.map((e:any) => {
            let subservice = subServices.filter((item) => {
                return item._raw.online_id == e._raw.sub_service_id
            })[0];
            return { id: subservice._raw.online_id, name: subservice._raw.name, intervention: e._raw }
        });

        const referenceId = reference.online_id ? reference.online_id : reference.id;

        const referenceServices = await database.get('references_services').query(
            Q.where('reference_id', referenceId+""),   
        ).fetch();

        const servicesObjects = referenceServices.map((e:any) => {
            let service:any = services.filter((item:any) => {
                return item._raw.online_id == e._raw.service_id
            })[0];
            return { id: service._raw.online_id, name: service._raw.name, service: e._raw }
        });

        navigate({
            name:"ReferenceView", params: {
                reference: reference, 
                beneficiary: beneficiary,
                referer: referer,
                organization: organization,
                services: servicesObjects,
                interventions: interventionObjects
            }
        });
    }

    const syncronize = () => {
        sync({username: loggedUser.username})
                .then(() => toast.show({
                                placement: "top",
                                render:() => {
                                    return (
                                        <Alert w="100%" variant="left-accent" colorScheme="success" status="success">
                                            <VStack space={2} flexShrink={1} w="100%">
                                                <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                                                    <HStack space={2} flexShrink={1} alignItems="center">
                                                        <Alert.Icon />
                                                        <Text color="coolGray.800">
                                                            Synced Successfully!
                                                        </Text>
                                                    </HStack>
                                                </HStack>
                                            </VStack>
                                        </Alert>
                                    );
                                }
                }))
                .catch(() => toast.show({
                                placement: "top",
                                render:() => {
                                    return (
                                        <Alert w="100%" variant="left-accent" colorScheme="error" status="error">
                                            <VStack space={2} flexShrink={1} w="100%">
                                                <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                                                    <HStack space={2} flexShrink={1} alignItems="center">
                                                        <Alert.Icon />
                                                        <Text color="coolGray.800">
                                                            Sync Failed!
                                                        </Text>
                                                    </HStack>
                                                </HStack>
                                            </VStack>
                                        </Alert> 
                                    );
                                }
                }))
    }

    const randomHexColor = () => {
        return '#000000'.replace(/0/g, () => {
            return (~~(Math.random() * 16)).toString(16);
        });
    };

    const viewRow = (rowMap: any, rowKey: any) => {
        console.log(typeof(rowMap[0]), "on View Row");
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const onRowDidOpen = (rowKey:any) => {
        console.log('This row opened', rowKey);
    };

    const renderItem = (data:any) => (
        <TouchableHighlight
            onPress={() => viewReference(data)}
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
            <HStack width="100%" px={4}
                   flex={1} space={5} alignItems="center">
                <Ionicons name="exit" size={50} color="#0d9488" />
                <VStack >
                    <HStack>
                        <Text color="warmGray.400" _dark={{ color: "warmGray.200" }}>
                            NUI:
                        </Text>
                        <Text color="darkBlue.300" _dark={{ color: "warmGray.200" }}>
                            {` ${getBeneficiary(data.item.beneficiary_id).nui}`}
                        </Text>
                    </HStack>
                    <HStack>
                        <Text color="warmGray.400" _dark={{ color: "warmGray.200" }}>
                            Referente:
                        </Text>
                        <Text color="darkBlue.300" _dark={{ color: "warmGray.200" }}>
                            {` ${getUser(data.item._raw.created_by)?.name + " " + getUser(data.item._raw.created_by)?.surname}`}
                        </Text>
                    </HStack>
                    <HStack>
                        <Text color="warmGray.400" _dark={{ color: "warmGray.200" }}>
                            Organização:
                        </Text>
                        <Text color="darkBlue.300" _dark={{ color: "warmGray.200" }}>
                            {` ${getOrganization(getUser(data.item._raw.created_by).partner_id).name}`}
                        </Text>
                    </HStack>
                </VStack>
                <VStack >
                    <HStack>
                        <Text color="warmGray.400" _dark={{ color: "warmGray.200" }}>
                            Data:
                        </Text>
                        <Text color="darkBlue.300" _dark={{ color: "warmGray.200" }}>
                            {` ${data.item.date_created}`}
                        </Text>
                    </HStack>
                    <HStack>
                        <Text color="warmGray.400" _dark={{ color: "warmGray.200" }}>
                            Notificar ao:
                        </Text>
                        <Text color="darkBlue.300" _dark={{ color: "warmGray.200" }}>
                            {` ${getUser(data.item._raw.notify_to).name + " " + getUser(data.item._raw.notify_to).surname}`}
                        </Text>
                    </HStack>
                    <HStack>
                        <Text color="warmGray.400" _dark={{ color: "warmGray.200" }}>
                            Status:
                        </Text>
                        <Text color="darkBlue.300" _dark={{ color: "warmGray.200" }}>
                            {` ${getStatus(data.item._raw.status)}`}
                        </Text>
                    </HStack>
                </VStack>
                {/* <View>
                    <Text color="darkBlue.800">{getUser(data.item._raw.notify_to).name + " " + getUser(data.item._raw.notify_to).surname}</Text>
                    <Text color="darkBlue.800">{getOrganization(getUser(data.item._raw.notify_to).partner_id).name}</Text>
                    <Text color="darkBlue.800">{getStatus(data.item._raw.status)}</Text>
                </View> */}
            </HStack>
        </TouchableHighlight>
    );

    const renderHiddenItem = (data: any, rowMap: any) => (
        <HStack flex={1} pl={2}>
            <Pressable px={4} ml="auto" bg="lightBlue.700" justifyContent="center"
                            onPress={() => viewReference(data)}
                            _pressed={{opacity:0.5}}
            >
                <Icon as={MaterialIcons} name="remove-red-eye" size={6} color="gray.200" />
            </Pressable>
            <Pressable px={4} bg="lightBlue.700" justifyContent="center"
                            onPress={() => navigate({name:"ReferenceForm", params:{reference:data.item}})}
                            _pressed={{opacity:0.5}}
            >
                <Icon as={MaterialIcons} name="mode-edit" size={6} color="gray.200" />
            </Pressable>
        </HStack>
    );

    const handleChange = (e:any) => {
        setSearchField(e);
    };

    const filteredReferences = references?.filter(reference =>
        (getUser(reference.notify_to).name + " " + getUser(reference.notify_to).surname).toLowerCase().includes(searchField.toLowerCase())    
    )

    return (
        <View style={styles.container}>
            <View style={styles.heading}>
                <Box alignItems="center" w="80%" bgColor="white" style={{borderRadius: 5}}>
                    <Input w={{base:"100%", md:"25%"}} onChangeText={handleChange} 
                        InputLeftElement={<Icon as={MaterialIcons} name="search" size={5} ml="2" color="muted.700" />} placeholder="Search"
                        style={{borderRadius:45}} />
                </Box>
            </View>
            <SwipeListView
                data={filteredReferences}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-110}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={onRowDidOpen}
            />
            <TouchableOpacity onPress={syncronize} style={styles.fab1}>
                <Icon as={MaterialIcons} name="refresh" size={8} color="#0c4a6e" />
            </TouchableOpacity>
        </View>
    )
}

const enhance = withObservables([], () => ({
    references: database.collections
        .get("references")
        .query().observe(),
    beneficiaries: database.collections
        .get("beneficiaries")
        .query().observe(),
    users: database.collections
        .get("users")
        .query().observe(),
    partners: database.collections
        .get("partners")
        .query().observe(),
    services: database.collections
        .get("services")
        .query().observe(),
    subServices: database.collections
        .get("sub_services")
        .query().observe()
}))

export default enhance(ReferencesMain);