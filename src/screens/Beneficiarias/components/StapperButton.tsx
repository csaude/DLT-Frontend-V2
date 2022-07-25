import React, { useState, useEffect, useContext } from "react";
import { HStack, Text, Icon, VStack, Pressable, useDisclose, Center, Box, Stagger, IconButton } from "native-base";
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "@native-base/icons";
import styles from './styles';

const StapperButton: React.FC<any> = ({onAdd, onRefresh}:any)=> {
    const { isOpen, onToggle } = useDisclose();
    
    const handleRefresh = () =>{
        onRefresh();

    }

    return <Center style={styles.fabStagger}>
        <Box alignItems="center" minH="120">
            <Stagger visible={isOpen} initial={{
                opacity: 0,
                scale: 0,
                translateY: 34,
            }} animate={{
                translateY: 0,
                scale: 1,
                opacity: 1,
                transition: {
                    type: "spring",
                    mass: 0.8,
                    stagger: {
                        offset: 30,
                        reverse: true
                    }
                }
            }} exit={{
                translateY: 34,
                scale: 0.5,
                opacity: 0,
                transition: {
                    duration: 100,
                    stagger: {
                        offset: 30,
                        reverse: true
                    }
                }
            }}>
               
                <IconButton style={{ elevation: 12 }} mb="4" variant="solid" bg="teal.400" colorScheme="teal" borderRadius="full" icon={<Icon as={MaterialIcons} _dark={{
                    color: "warmGray.50"
                }} size="6" name="refresh" color="warmGray.50" onPress={handleRefresh} />} />
                <IconButton style={{ elevation: 12 }} mb="4" variant="solid" bg="indigo.500" colorScheme="red" borderRadius="full" icon={<Icon as={MaterialIcons} size="6" name="add" _dark={{
                    color: "warmGray.50"
                }} color="warmGray.50" onPress={onAdd} />} />
            </Stagger>
        </Box>

        <HStack alignItems="center" >
            <IconButton style={{ elevation: 12 }} variant="solid" borderRadius="full" size="lg" onPress={onToggle} bg="#17a2b8" icon={<Icon as={MaterialCommunityIcons} size="7" name="dots-horizontal" color="warmGray.50" _dark={{
                color: "warmGray.50"
            }} />} />
        </HStack>

    </Center>;
};
export default StapperButton;