import React, { Fragment, useEffect, useState } from 'react';
import { query } from '@app/utils/reference';
import { Card, Table, Button, Space, Badge, Input, Typography, Form } from 'antd';
import Highlighter from 'react-highlight-words';
import 'antd/dist/antd.css';
import moment from 'moment';
import { SearchOutlined, PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { getEntryPoint } from '@app/models/User';

import { useNavigate } from 'react-router-dom';
import { UserModel } from '../../models/User';

const { Text } = Typography;

const ReferenceList: React.FC = () => {

    const [ form ] = Form.useForm();
    const [ references, setReferences ] = useState<any[]>([]);
    const [ searchText, setSearchText ] = useState('');
    const [ searchedColumn, setSearchedColumn ] = useState('');
    const [ reference, setReference] = useState();
    const [ modalVisible, setModalVisible] = useState<boolean>(false);
    const [ referenceModalVisible, setReferenceModalVisible] = useState<boolean>(false);

    const [ users, setUsers ] = useState<UserModel[]>([]);
    
    const navigate = useNavigate();

    let searchInput ;
    useEffect(() => {
        const fetchData = async () => {
          const data = await query();

          setReferences(data);
        } 
    
        fetchData().catch(error => console.log(error));
    
    }, []);

    
    const columnsRef = [
        { 
            title: 'Distrito', 
            dataIndex: '', 
            key: 'type',
            render: (text, record)  => record.beneficiaries.neighborhood.locality.district.name,
        },
        { 
            title: 'Organização Referente', 
            dataIndex: '', 
            key: 'type',
            // render: (text, record)  => record.beneficiaries.neighborhood.locality.district.name,
        },
        { 
            title: 'Referido em', 
            dataIndex: 'dateCreated', 
            key: 'dateCreated',
            render: (val: string) => <span>{moment(val).format('YYYY-MM-DD')}</span>,
        },
        { 
            title: 'Nota Referência', 
            dataIndex: 'referenceNote', 
            key: 'referenceNote'
        }, 
        { 
            title: 'Código do Beneficiário', 
            dataIndex: '', 
            key: '',
            render: (text, record)  => record.beneficiaries.nui,
        },	
        { 
            title: 'Referente', 
            dataIndex: 'createdBy', 
            key: 'createdBy'
        },		
        { 
            title: 'Contacto', 
            dataIndex: '', 
            key: ''
        },		
        { 
            title: 'Notificar ao', 
            dataIndex: '', 
            key: '',
            render: (text, record)  => record.users.name,
        },		
        { 
            title: 'Ref. Para', 
            dataIndex: '', 
            key: ''
        },		
        { 
            title: 'Organização Referida', 
            dataIndex: '', 
            key: ''
        },	
        { 
            title: 'Ponto de Entrada para Referência', 
            dataIndex: '', 
            key: ''
        },	
        { 
            title: 'Estado', 
            dataIndex: 'statusRef', 
            key: 'statusRef',
            render: (text, record)  => 
                (record.statusRef==0) ?
                    "Pendente"
                :  
                (record.statusRef==1) ?
                    "Atendido"
                : 
                    ""
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record) => (
              <Space>
                <Button type="primary" icon={<EyeOutlined />} onClick={() => navigate("/usersView", { state: { user: record } } )} >
                </Button>
                <Button type="primary" icon={<EditOutlined />} onClick={() => navigate("/usersForm", { state: { user: record } } )} >
                </Button>
              </Space>
            ),
        },
    ];
    
    return (
        <>
            <Card  bordered={false} style={{marginBottom:'10px', textAlign:"center", fontWeight:"bold", color:"#17a2b8"}} >
                SISTEMA INTEGRADO DE CADASTRO DE ADOLESCENTES E JOVENS
            </Card>
            <Card title="Lista de Referências e Contra-Referências" bordered={false} headStyle={{color:"#17a2b8"}}>
                <Table
                    rowKey="id"
                    columns={columnsRef}
                    dataSource={references}
                    bordered
                />
            </Card>
        </>
    );
}
export default ReferenceList;