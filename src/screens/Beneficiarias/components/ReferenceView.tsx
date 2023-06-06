import React, { useState, useEffect, useContext } from "react";
import { View, TouchableHighlight } from 'react-native';
import { useToast, HStack, Text,VStack, Center } from "native-base";
import { Ionicons } from "@native-base/icons";
import { navigate } from '../../../routes/NavigationRef';
import styles from './styles';
import { database } from '../../../database';
import { SwipeListView } from 'react-native-swipe-list-view';
import StepperButton from './StapperButton';
import { SuccessHandler, ErrorHandler, WithoutNetwork} from "../../../components/SyncIndicator";
import { Context } from '../../../routes/DrawerNavigator';
import { sync } from '../../../database/sync';
import NetInfo from "@react-native-community/netinfo";
import Spinner from "react-native-loading-spinner-overlay/lib";

const ReferenceView: React.FC = ({ route }: any) => {
    const [loading, setLoading] = useState(false);
	const [isOffline, setIsOffline] = useState(false);
    const {
        beneficiary,
        references,
    } = route.params;
    //const [references, setReferences] = useState<any>([]);
    const loggedUser:any = useContext(Context);
    const toast = useToast();

    const syncronize = () => {
        setLoading(true);      
        if(isOffline){
			toast.show({
                placement: "top",
                render: () => {
                    return (<WithoutNetwork />);
                }
            })
			setLoading(false);
		}else{
            sync({ username: loggedUser.username })
                .then(() => toast.show({
                    placement: "top",
                    render: () => {
                        return (<SuccessHandler />);
                    }
                }))
                .catch(() => toast.show({
                    placement: "top",
                    render: () => {
                        return (<ErrorHandler />);
                    }
                }))
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchRefsData = async () => {
            const getRefList = await database.get('references_services').query(
            ).fetch();

            const refListSerialized = getRefList.map(item => item._raw);
            //console.log("references_services: ",refListSerialized);
            //setReferences(refListSerialized);
        }

        fetchRefsData().catch(error => console.log(error));

        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
			const status = !(state.isConnected && state.isInternetReachable);
			setIsOffline(status);
		});
		return () => removeNetInfoSubscription();
    }, []);

    const renderItem = (data: any) => {
        //console.log(data.item);
        return  (
        <TouchableHighlight
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
            <HStack width="100%" px={4} flex={1} space={5} alignItems="center">
                <Ionicons name="exit" size={50} color="#0d9488" />
                <VStack width='200px' >
                    <Text _dark={{color: "warmGray.50"}} color="darkBlue.800" >
                        {data.item.reference_note}
                    </Text>
                    <HStack>
                        <Text color="warmGray.400" _dark={{ color: "warmGray.200" }}>
                            Referir para:
                        </Text>
                        <Text color="darkBlue.300" _dark={{ color: "warmGray.200" }}>
                            {` ${data.item.refer_to === '1'?'US': data.item.refer_to === '2'? 'CM':'ES'}`}
                        </Text>
                    </HStack>
                    <HStack>
                        <Text color="warmGray.400" _dark={{ color: "warmGray.200" }}>
                            Estado:
                        </Text>
                        <Text color="darkBlue.300" _dark={{ color: "warmGray.200" }}>
                            {` ${ data.item.status === 0? 'Pendente' : data.item.status === 1? 'Atendida parcialmente': 'Atendida'}`}
                        </Text>
                    </HStack>
                </VStack>
                <Text color="coolGray.500" alignSelf="flex-start" marginTop={2}>{data.item.date_created}</Text>
            </HStack>

        </TouchableHighlight>
    )};

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
            {loading ?
                <Spinner
                    visible={true}
                    textContent={'Sincronizando...'}
                    textStyle={styles.spinnerTextStyle}
                /> : undefined
            }
            <Center flex={1} px="3" >
                <StepperButton onAdd={() => navigate({ name: "ReferenceForm", params: { beneficiary:  beneficiary, 
                                                                                            references: references,
                                                                                            userId: isNaN(loggedUser.id) ? loggedUser.online_id : loggedUser.id, 
                                                                                            refs: references.length} })}
                                onRefresh={syncronize} />
            </Center>
        </>

    );
}

export default ReferenceView;