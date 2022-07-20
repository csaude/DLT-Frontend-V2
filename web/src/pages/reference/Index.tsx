import React, { useEffect, useState } from 'react';
import { query } from '@app/utils/reference';
import {allPartners} from '@app/utils/partners';
import { Card, Table, Button, Space, Badge, Input, Typography, Form } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { getEntryPoint } from '@app/models/User';

import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const ReferenceList: React.FC = () => {

    const [ form ] = Form.useForm();
    const [ references, setReferences ] = useState<any[]>([]);
    const [ searchText, setSearchText ] = useState('');
    const [ searchedColumn, setSearchedColumn ] = useState('');
    const [ reference, setReference] = useState();
    const [ modalVisible, setModalVisible] = useState<boolean>(false);
    const [ referenceModalVisible, setReferenceModalVisible] = useState<boolean>(false);

    const [ partners, setPartners] = useState<any[]>([]);
    
    const navigate = useNavigate();

    let searchInput;
    useEffect(() => {
        const fetchData = async () => {
          const data = await query();
          const data1 = await allPartners();

          setReferences(data);
          setPartners(data1);
        } 
    
        fetchData().catch(error => console.log(error));
    
    }, []);    
   
    const filterPartner = data => formatter => data.map( item => ({
        text: formatter(item),
        value: formatter(item)
    }));

    const getColumnSearchProps = (dataIndex:any) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        searchInput = node;
                    }}
                    placeholder={`Pesquisar pelo nui da Beneficiária`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                    />
                <Space>
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                >
                    Pesquisar
                </Button>
                <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
                </Button>
                <Button
                    type="link"
                    size="small"
                    onClick={() => {
                    confirm({ closeDropdown: false });
                    setSearchText(selectedKeys[0]);
                    setSearchedColumn(dataIndex);
                    }}
                >
                    Filter
                </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
                    record[dataIndex]
                        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                        : '',
        onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    setTimeout(() => searchInput.select(), 100);
                }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
                />
            ) : ( text ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText(searchText);
    };
    
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
            render: (text, record)  => record.users.partners.name,
            filters: filterPartner(partners)(i => i.name),
            onFilter: (value, record) => record.users.partners.name == value,
            filterSearch: true,
           
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
            // render: (text, record)  => record.beneficiaries.nui,
             ...getColumnSearchProps('references') 
        },	
        { 
            title: 'Referente', 
            dataIndex: 'createdBy', 
            key: 'createdBy'
        },		
        { 
            title: 'Contacto', 
            dataIndex: '', 
            key: '',
            render: (text, record)  => record.users.phoneNumber,
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
            key: '',
            // render: (text, record)  => record.users.name,
        },		
        { 
            title: 'Organização Referida', 
            dataIndex: '', 
            key: '',
            render: (text, record)  => record.users.partners.name,
            filters: filterPartner(partners)(i => i.name),
            onFilter: (value, record) => record.users.partners.name == value,
            filterSearch: true,
           
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
            filters: [
                {
                    text: 'Pendente',
                    value: 0,
                    },
                    {
                    text: 'Atendido',
                    value: 1,
                },
            ],
            onFilter: (value, record) => record.statusRef == value,
            filterSearch: true,
            render: (text, record)  => 
                (record.statusRef==0) ?
                    <Text type="danger" >Pendente </Text>
                :  
                (record.statusRef==1) ?
                    <Text type="success" >Atendido </Text>
                : 
                    ""
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record) => (
              <Space>
                <Button type="primary" icon={<EyeOutlined />} onClick={() => { record } } >
                </Button>
                <Button type="primary" icon={<EditOutlined />} onClick={() => { record } } >
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