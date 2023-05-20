import React, { useContext } from 'react';
import {DrawerContentComponentProps, DrawerItemList, DrawerContentScrollView} from '@react-navigation/drawer';
import { View, Text, Image,  ActivityIndicator, TouchableOpacity} from 'react-native';
import { Box } from 'native-base';
import { Context } from '../DrawerNavigator';


interface DrawerProps extends DrawerContentComponentProps{
    onLogout: (e?: any) => void;
    loggedUser?: any;
}

const CustomDrawer: React.FC<DrawerProps> = ({ onLogout, /*loggedUser,*/ ...props}) => {
    const loggedUser:any = useContext(Context);

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
                    <Text style={{ color: '#212121'}}>{`${loggedUser?.name} ${loggedUser?.surname}`}  </Text>
                    <Text style={{ color: '#212121'}}>{loggedUser?.email}</Text>
                </View>
                <Image
                    source={{
                        uri: 'https://asota.umobile.edu/wp-content/uploads/2021/08/Person-icon.jpeg',
                        
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
                <Text style={{ color: '#212121'}}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
};
export default CustomDrawer;