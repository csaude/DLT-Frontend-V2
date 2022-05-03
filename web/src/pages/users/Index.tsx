import { Card, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { query } from '../../utils/users';
import { UserModel } from '../../models/User';

const UsersList: React.FC = () => {
    const [ users, setUsers ] = useState<UserModel[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
          const data = await query();
          setUsers(data);
        } 
    
        fetchData().catch(error => console.log(error));
    
    }, []);

    const columns = [
        { title: 'Tipo de Utilizador', dataIndex: '', key: 'type', 
            render: (text, record)  => record.profiles.description,
        },
        { title: 'Estado de Utilizador', dataIndex: 'status', key: 'status'},
        { title: 'Username', dataIndex: 'username', key: 'username'},
        { title: 'Nome de Utilizador', dataIndex: 'name', key: 'name'},
        { title: 'Ponto de Entrada', dataIndex: '', key: 'type', 
            render: (text, record)  => 
                (record.entryPoint==="1") ?
                    "Unidade Sanitaria"
                : 
                (record.entryPoint==="2") ? 
                    "Escola"
                : 
                    "Comunidade"                                            
            
        },
        { title: 'Parceiro', dataIndex: '', key: 'type', 
            render: (text, record)  => record.partners?.name,
        },
        { title: 'Email', dataIndex: 'email', key: 'email'},
        { title: 'Telefone', dataIndex: 'phoneNumber', key: 'phoneNumber'}
    ];

    
    return (
        <>
            <Card  bordered={false} style={{marginBottom:'10px', textAlign:"center", fontWeight:"bold", color:"#17a2b8"}} >
                SISTEMA INTEGRADO DE CADASTRO DE ADOLESCENTES E JOVENS
            </Card>
            <Card title="Lista de Utilizadores" bordered={false} headStyle={{color:"#17a2b8"}}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={users}
                    bordered
                />
            </Card>
        </>
    );
}
export default UsersList;