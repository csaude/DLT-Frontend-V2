import React, { useEffect } from 'react';
import {ContentHeader} from '@components';
import {Link, useNavigate} from 'react-router-dom';

import { NativeBaseProvider, Pressable, Center, Box, Text, Heading, VStack, FormControl, 
  Input,  Button, Select, WarningOutlineIcon, HStack, Stack, 
  Alert, Flex, Icon, View, Radio}
from 'native-base';
import {Table} from 'react-bootstrap';
import { MaterialIcons, Ionicons } from "@native-base/icons";

import styles from './styles';
import { useState } from 'react';

import { query } from '../../utils/users';

interface UserType {
  id?: string,
	surname?: string,
	name?: string,
	phoneNumber?: string,
	email?: string,
	username?: string,
	password?: string,
	entryPoint?: any,
	status?: any,
	createdBy?: string,
	dateCreated?: string,
	updatedBy?: string,
	dateUpdated?: string,
  locality?: any,
  partners?: any,
  profiles?: any,
  us?: any
}

const userList = () => {

  const [ users, setUsers ] = useState<UserType[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await query();
      setUsers(data);
    } 

    fetchData().catch(error => console.log(error));

  }, []);

  return (
    <NativeBaseProvider>
    
      <View style={styles.webStyle1}>                     
          <Center w="100%" bgColor="white">
              <Box safeArea p="2" w="90%" py="8">
                  <Heading size="lg" color="coolGray.800" 
                                      _dark={{ color: "warmGray.50"}} 
                                      fontWeight="semibold"
                                      marginBottom={5}
                                      marginTop={0} 
                                      textAlign={'center'}>
                      Utilizadores
                  </Heading>
            
                  <Table  striped bordered hover /*style={{ borderWidth: 4, borderColor: "#20232a",marginLeft: "3%", marginRight: "3%",}}*/>
                      <thead style={{ fontWeight: "bold"}}>
                          <tr>
                              <td> Tipo de Utilizador</td>
                              <td> Estado de Utilizador</td>
                              <td> Username</td>
                              <td> Nome de Utilizador</td>
                              <td> Ponto de Entrada</td>
                              <td> Parceiro</td>
                              <td> Email</td>
                              <td> Telefone</td>
                          </tr>
                      </thead>
                      <tbody>
                        {
                            users.map((item)=>
                                <tr>
                                    <td>{ item.profiles?.description }</td>
                                    <td>{ (item.status===1)  ? "Activo" : "Inactivo" }</td>
                                    <td>{ item.username }</td>
                                    <td>{ item.name + ' '+ item.surname }</td>
                                    <td>
                                        { 
                                            (item.entryPoint==="1") ?
                                                "Unidade Sanitaria"
                                            : 
                                            (item.entryPoint==="2") ? 
                                                "Escola"
                                            : 
                                                "Comunidade"                                            
                                        }  
                                    </td>
                                    <td>{ item.partners?.name }</td>
                                    <td>{ item.email }</td>
                                    <td>{ item.phoneNumber }</td>
                                    <td>                                         
                                        <Pressable justifyContent="center" 
                                                    onPress={() => navigate("/UserView")} 
                                                    _pressed={{opacity: 0.5}}
                                        >
                                            <Icon as={<Ionicons name="eye" />} color="primary.700" /> 
                                        </Pressable>
                                    </td>
                                    <td>                                                                                
                                        <Pressable justifyContent="center" 
                                                    onPress={() => navigate("/usersForm" /*, params: {user: item}}*/)} 
                                                    _pressed={{opacity: 0.5}}
                                        >
                                            <Icon as={<Ionicons name="pencil" />} color="primary.700" />
                                        </Pressable> 
                                    </td>
                                </tr>
                            )
                        }
                      </tbody>
                  </Table> 
                  <Flex direction="row" mb="2.5" mt="1.5" style={{justifyContent: 'flex-end', marginRight: "3%",}}>
                      <Center>
                          <Button onPress={() => '' }  style={{marginTop: 35, marginLeft: 10,}} size={'md'} colorScheme="tertiary">
                              <Icon as={<MaterialIcons name="add" />} color="white" />
                          </Button>
                      </Center>
                      
                  </Flex>                              
                </Box>  
            </Center>  
      </View>
    </NativeBaseProvider>
  )};

export default userList;
