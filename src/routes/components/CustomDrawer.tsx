import React from 'react';
import {DrawerContentComponentProps, DrawerItemList, DrawerContentScrollView} from '@react-navigation/drawer';
import { View, Text, Image,  ActivityIndicator, TouchableOpacity} from 'react-native';


interface DrawerProps extends DrawerContentComponentProps{
    onLogout: (e?: any) => void;
    loggedUser?: any;
}

const CustomDrawer: React.FC<DrawerProps> = ({ onLogout, loggedUser, ...props}) => {

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 20,
                    backgroundColor: '#f6f6f6',
                    marginBottom: 20,
                }}
            >
                <View>
                    <Text>{loggedUser?.name}</Text>
                    <Text>{loggedUser?.email}</Text>
                </View>
                <Image
                    source={{
                        uri: 'https://images.unsplash.com/photo-1624243225303-261cc3cd2fbc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
                    }}
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                />
            </View>
            <DrawerItemList {...props} />
            </DrawerContentScrollView>
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    right: 0,
                    left: 0,
                    bottom: 50,
                    backgroundColor: '#f6f6f6',
                    padding: 20,
                }}
                onPress={()=> onLogout()}
            >
                <Text>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
};
export default CustomDrawer;