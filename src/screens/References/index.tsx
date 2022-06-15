import React, { useEffect, useState, useContext } from 'react';
import { View, TouchableOpacity, TouchableHighlight } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useToast, HStack, Text, Avatar, Pressable, Icon, Box, Alert, VStack, Input } from 'native-base';
import { navigate } from '../../routes/NavigationRef';
import withObservables from '@nozbe/with-observables';
import { MaterialIcons } from '@native-base/icons';
import { database } from '../../database';
import { Context } from '../../routes/DrawerNavigator';
import { sync } from '../../database/sync';

import styles from './styles';

const ReferencesMain: React.FC = ({ references, beneficiaries, users }:any) => {
    const [searchField, setSearchField] = useState('');
    const loggedUser:any = useContext(Context);
    const toast = useToast();

    const getBeneficiary = (beneficiaty_id: any) => {
        return beneficiaries.filter((e) => {
            console.log(e);
            return e._raw.online_id == beneficiaty_id
        })[0];
    }

    const getUser = (user_id: any) => {
        return users.filter((e) => {
            console.log(e);
            return e._raw.online_id == user_id
        })[0];
    }

    const viewReference = (data:any) => {
        const reference = data.item._raw;

        navigate({name:"ReferenceView", params:{reference:data.item}});
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
                <Avatar color="white" bg={randomHexColor()}>
                    {data.item.reference_code.charAt(0).toUpperCase()}
                </Avatar>
                <View>
                    <Text color="darkBlue.800">{data.item.reference_code}</Text>
                    <Text color="darkBlue.800">{getBeneficiary(data.item.beneficiary_id).nui}</Text>
                    <Text color="darkBlue.800">{getUser(data.item.notify_to).name}</Text>
                </View>
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
            <Pressable px={4} ml="auto" bg="lightBlue.700" justifyContent="center"
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
        (reference.reference_code).toLowerCase().includes(searchField.toLowerCase())    
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
                rightOpenValue={-150}
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
}))

export default enhance(ReferencesMain);