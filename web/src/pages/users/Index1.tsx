import React, { useEffect } from 'react';
/*import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fuzzyTextFilterFn, GlobalFilter, filterGreaterThan, NumberRangeColumnFilter, SelectColumnFilter, SliderColumnFilter, DefaultColumnFilter  } from '../../components/expandable-table/Filters'
import { NativeBaseProvider, Pressable, Center, Box, Heading, 
  Button, Flex, View}
from 'native-base';
import {Table} from 'react-bootstrap';
import { faEye, faPen, faAdd} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
//import Styles from '../../components/expandable-table/styles';
import styles from './styles';
import { useState } from 'react';
//import ExpandableTable from '../../components/expandable-table'
import { query } from '../../utils/users';
import { UserModel } from '../../models/User';

filterGreaterThan.autoRemove = val => typeof val !== 'number'

const userList: React.FC = () => {

  const [ users, setUsers ] = useState<UserModel[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await query();
      setUsers(data);
    } 

    fetchData().catch(error => console.log(error));

  }, []);
  
  const columns = React.useMemo(
    () => [
        {
            Header: 'Tipo de Utilizador',
            accessor: 'profiles.description',
            Filter: SelectColumnFilter,
            filter: 'includes',
        },
        {
            Header: 'Estado de Utilizador',
            accessor: 'status',
            filter: 'fuzzyText',
        },
        {
            Header: 'Username',
            accessor: 'username',
            filter: 'fuzzyText',
        },
      ],
      []
  );

  const data = React.useMemo(
    () => [
      {
        firstName: 'Hello',
        lastName: 'World',
        age:6,
        visits:12,
        status:'single',
        progress:13

      },
      {
        firstName: 'Hello',
        lastName: 'World',
        age:2,
        visits:12,
        status:'single',
        progress:13
      },
      {
        firstName: 'Hello',
        lastName: 'World',
        age:0,
        visits:14,
        status:'single',
        progress:56
      },
    ],
    []
  )    

    console.log(users);
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
            
                  <Table  striped bordered hover >
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
                                                    onPress={() => navigate("/usersView", { state: { user: item } } )} 
                                                    _pressed={{opacity: 0.5}}
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </Pressable>
                                    </td>
                                    <td>                                                                                
                                        <Pressable justifyContent="center" 
                                                    onPress={() => navigate("/usersForm", { state: { user: item } } )} 
                                                    _pressed={{opacity: 0.5}}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </Pressable> 
                                    </td>
                                </tr>
                            )
                        }
                      </tbody>
                  </Table> 
                  <Flex direction="row" mb="2.5" mt="1.5" style={{justifyContent: 'flex-end', marginRight: "3%",}}>
                      <Center>
                          <Button onPress={() => navigate("/usersForm") }  size={'md'}  style={styles.fab} >
                                                       
                            <FontAwesomeIcon icon={faAdd} />
                        
                          </Button>
                      </Center>
                      
                  </Flex>                              
                </Box>  
            </Center>  
      </View>
    </NativeBaseProvider>
  )};

export default userList;*/
