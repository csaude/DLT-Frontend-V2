import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableHighlight, ScrollView , Platform} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { HStack,Text, Avatar, Pressable, Icon, Box, Select,Heading, VStack, FormControl, Input, Link, Button, CheckIcon, WarningOutlineIcon, Center, Flex } from 'native-base';
import { navigate } from '../../routes/NavigationRef';
import withObservables from '@nozbe/with-observables';
import { MaterialIcons } from "@native-base/icons";
import { Q } from "@nozbe/watermelondb";
import { database } from '../../database';

import styles from './styles';


const UsersMain: React.FC = ({ users }:any) => {
    const [searchField, setSearchField] = useState('');

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

    const onRowDidOpen = (rowKey: any) => {
        console.log('This row opened', rowKey);
    };

    const renderItem = (data: any) => (
        <TouchableHighlight
            onPress={() => navigate({name: "UserView", params: {user: data.item}})} 
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
            <HStack width="100%" px={4}
                    flex={1} space={5} alignItems="center">
                {/* <Avatar color="white" bg={'warning.600'} > */}              
                <Avatar color="white" bg={randomHexColor()} >
                    {data.item.username.charAt(0).toUpperCase()}
                    {/* {"A"} */}
                </Avatar>    
                <View>
                    <Text color="darkBlue.800">{data.item.username} </Text>
                    <Text color="darkBlue.800">{data.item.name} {data.item.surname}</Text>
                    <Text color="darkBlue.800">{data.item.partners?.name}</Text>
                </View> 
                
            </HStack>

        </TouchableHighlight>
    );
    

    const renderHiddenItem = (data: any, rowMap: any) => (

        <HStack flex={1} pl={2}>
            <Pressable px={4} ml="auto" bg="lightBlue.700" justifyContent="center" 
                            onPress={() => navigate({name: "UserView", params: {user: data.item}})} 
                            _pressed={{opacity: 0.5}}
            >
                <Icon as={MaterialIcons} name="mode-edit" color="gray.200" />
            </Pressable> 
            <Pressable px={4} bg="lightBlue.800" justifyContent="center" 
                        onPress={() => navigate({name: "UserForm", params: {user: data.item}})}
                        _pressed={{opacity: 0.5}} 
            >
                <Icon as={MaterialIcons} name="remove-red-eye" color="gray.200" />
            </Pressable>
        </HStack>

    );

    const handleChange = (e: any) => {
        setSearchField(e);
    };


    const filteredUsers = users.filter(user =>
        (user.name + ' '+ user.surname).toLowerCase().includes(searchField.toLowerCase())
    )

    return (
        <View style={styles.container}>
            <View style={styles.heading}>
                <Box alignItems="center" w="80%" bgColor="white" style={{borderRadius: 5,}}>
                    <Input w={{base: "100%",md: "25%"}} onChangeText={handleChange}
                            InputLeftElement={<Icon  as={MaterialIcons} name="search"  size={5} ml="2" color="muted.700"  />} placeholder="Search" 
                            style={{borderRadius: 45,}}/>
                </Box>

            </View>
            <SwipeListView
                data={filteredUsers}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                //leftOpenValue={75} 
                rightOpenValue={-150}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={onRowDidOpen}
            />
            <TouchableOpacity onPress={() => navigate({name: "UserForm", params: {}}) } style={styles.fab}>
                <Icon as={MaterialIcons} name="add" color="white" />
            </TouchableOpacity>
        </View>
    );
}

const enhance = withObservables([], () => ({
    users: database.collections
      .get("users")
      .query().observe()
}));
export default enhance(UsersMain);
