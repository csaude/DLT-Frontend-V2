import React, { useEffect, useState } from 'react';
import { queryByUser, edit as editRef, Reference} from '@app/utils/reference';
import {allPartners} from '@app/utils/partners';
import {allDistrict} from '@app/utils/district';
import { query  as query1} from '@app/utils/users';
import {allUs} from '@app/utils/uSanitaria';
import { Card, Table, Button, Space, Badge, Input, Typography, Form, message } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';
import ViewReferral from './components/View';
import FormReference from '../beneficiaries/components/FormReference';

const { Text } = Typography;

const ReferenceList: React.FC = ({resetModal}: any) => {

    const [ form ] = Form.useForm();
    const [ references, setReferences ] = useState<any[]>([]);
    const [ searchText, setSearchText ] = useState('');
    const [ searchedColumn, setSearchedColumn ] = useState('');
    const [ reference, setReference ] = useState();
    const [ services, setServices ] = useState<any>([])
    const [ beneficiary, setBeneficiary ] = useState<any>(undefined);
    const [ modalVisible, setModalVisible ] = useState<boolean>(false);
    const [ referenceModalVisible, setReferenceModalVisible ] = useState<boolean>(false);

    const [ partners, setPartners] = useState<any[]>([]);
    const [ user, setUser] = useState<any[]>([]);
    const [ district, setDistrict] = useState<any[]>([]);
    const [ us, setUs] = useState<any[]>([]);
    
    const navigate = useNavigate();

    let searchInput;
    useEffect(() => {
        const fetchData = async () => {
          const data = await queryByUser(localStorage.user);
          const partners = await allPartners();          
          const data2 = await query1();         
          const us = await allUs();
          const districts = await allDistrict();

          setReferences(data);
          setPartners(partners);
          setUser(data2);
          setUs(us);
          setDistrict(districts);
        } 
    
        fetchData().catch(error => console.log(error));
    
    }, []);

    const handleModalRefVisible = (flag?: boolean) => {
        setReferenceModalVisible(!!flag);
    };

    const handleViewModalVisible = (flag?: boolean, record?: any) => {
        setReference(record);
        setModalVisible(!!flag);
    }

    const onEditRefence = (record?: any) => {
        setReference(record);
        setBeneficiary(record?.beneficiaries);
        setReferenceModalVisible(true);
    }

    const handleAdd = () => {
        
    }

    
    const handleModalVisible = (flag?: boolean) => {
        setModalVisible(!!flag);
    };

    const handleRefUpdate = async (values:any) => {

        let ref:any = reference;    
        if(values !== undefined){

            const servicesObjects = services.map((e:any) => {
                let listServices:any = { 
                                            services: {id: e.servico.id},
                                            description: e.description, 
                                            status: 0,
                                            createdBy: localStorage.user,
                                        };
                return listServices
            });

            let payload: Reference = {
                id: ref?.id,
                beneficiaries: {
                    id: beneficiary?.id
                },
                referredBy: {
                    id: values.referredBy
                },
                users: {
                    id: values.notifyTo
                },
                referenceNote: values.referenceNote,
                description: '',
                referTo: values.referTo,
                bookNumber: values.bookNumber,
                referenceCode: values.referenceCode,
                serviceType: values.serviceType === "CLINIC" ? "1" : "2",
                remarks: values.remarks,
                statusRef: '0',
                status: '0',
                cancelReason: '0',
                otherReason: '',
                userCreated: ref?.userCreated, 
                dateCreated: ref?.dateCreated,
                updatedBy: localStorage.user,
                referencesServiceses: servicesObjects,
                
            };

            if(servicesObjects.length==0){
                message.error({
                    content: 'Referência sem Intervenção!', className: 'custom-class',
                    style: {
                        marginTop: '10vh',
                    }
                });

                setReferenceModalVisible(true);

            }else{

                const { data } = await editRef(payload);
                const allReferences: any = await queryByUser(localStorage.user);
                setReferences(allReferences);
    
                message.success({
                    content: 'Actualizado com Sucesso!'+data?.referenceNote, className: 'custom-class',
                    style: {
                        marginTop: '10vh',
                    }
                });

                setReferenceModalVisible(false);
    
                navigate('/referenceList');    

            }      
              
        }
    }
   
    const filterPartner = data => formatter => data.map( item => ({
        text: formatter(item),
        value: formatter(item)
    }));

    const filterUs = data => formatter => data.map( item => ({
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
                    placeholder={`Pesquisar `}
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
        render: (value, record) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={value ? value.toString() : ''}
                />
            ) : ( value),            
    });

    const parentMethods = {
        handleAdd: handleAdd,
        handleModalVisible: handleModalVisible
    };

    const getColumnSearchBenProps = (dataIndex:any) => ({
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
                    record.beneficiaries?.nui
                        ? record?.beneficiaries?.nui.toString().toLowerCase().includes(value.toLowerCase())
                        : '',                        
        onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    setTimeout(() => searchInput.select(), 100);
                }
        },
        render: (value , record) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={value  ? '' : record?.beneficiaries?.nui}
                />
            ) : ( record?.beneficiaries?.nui),
            
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

    const handleRefServicesList = (data?: any) => {
        setServices(data);
    };
    
    const columnsRef = [
        { 
            title: 'Distrito', 
            dataIndex: '', 
            key: 'type',
            render: (text, record)  => record?.beneficiaries?.neighborhood?.locality?.district?.name,
            filters: filterPartner(district)(i => i.name),
            onFilter: (value, record) => record?.beneficiaries?.neighborhood?.locality?.district?.name == value,
            filterSearch: true,
        },
        { 
            title: 'Organização Referente', 
            dataIndex: '', 
            key: 'type',
            render: (text, record)  => (
                user.map(data =>(
                    data?.id == record?.userCreated ?                        
                        data?.partners?.name                        
                        :
                        ''
                ))
            ),           
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
            key: '',
            ...getColumnSearchProps('referenceNote') ,
        }, 
        { 
            title: 'Código do Beneficiário', 
            dataIndex: 'beneficiaries.nui', 
            key: '',
            ...getColumnSearchBenProps('beneficiaries.nui') ,
        },	
        { 
            title: 'Referente', 
            dataIndex: 'createdBy', 
            key: 'createdBy',
            render: (text, record)  => (
                user.map(data =>(
                    data?.id == record?.userCreated ?                        
                        data?.name+' '+data?.surname                       
                        :
                        ''
                ))
            ),
        },		
        { 
            title: 'Contacto', 
            dataIndex: '', 
            key: '',
            render: (text, record)  => record?.users?.phoneNumber,
        },		
        { 
            title: 'Notificar ao', 
            dataIndex: 'record.users.name', 
            key: '',
            render: (text, record)  => record?.users?.name+' '+record?.users?.surname,
        },		
        { 
            title: 'Ref. Para', 
            dataIndex: 'record.users.entryPoint', 
            key: 'record.users.entryPoint',
            filters: [
                {
                    text: 'US',
                    value: 1,
                    },
                    {
                    text: 'CM',
                    value: 2,
                },
                {
                    text: 'ES',
                    value: 3,
                },
            ],
            onFilter: (value, record) => record?.users?.entryPoint == value,
            filterSearch: true,
            render: (text, record)  => 
                (record.users.entryPoint==1) ?
                    <Text>US </Text>
                :  
                (record.users.entryPoint==2) ?
                    <Text>CM </Text>
                : 
                <Text>ES </Text>
        },		
        { 
            title: 'Organização Referida', 
            dataIndex: '', 
            key: '',
            render: (text, record)  => record?.users?.partners?.name,
            filters: filterPartner(partners)(i => i.name),
            onFilter: (value, record) => record?.users?.partners?.name == value,
            filterSearch: true,
           
        },	
        { 
            title: 'Ponto de Entrada para Referência', 
            dataIndex: 'us', 
            key: 'us',
            render: (text, record) => record?.users?.us.map(u => u.name),
            // filters: filterUs(us)(i => i.name),
            // onFilter: (value, record) => record?.users?.us?.name == value,
            // filterSearch: true,
        },	
        { 
            title: 'Estado', 
            dataIndex: 'status', 
            key: 'status',
            filters: [
                {
                    text: 'Pendente',
                    value: 0,
                },
                {
                    text: 'Atendida Parcialmente',
                    value: 1,
                },
                {
                    text: 'Atendida',
                    value: 2,
                },
            ],
            onFilter: (value, record) => record?.status == value,
            filterSearch: true,
            render: (text, record)  => 
                (record.status==0) ?
                    <Text type="danger" >Pendente </Text>
                :  
                (record.status==1) ?
                    <Text type="warning" >Atendida Parcialmente </Text>
                :  
                (record.status==2) ?
                    <Text type="success" >Atendida </Text>
                : 
                    ""
        },
        {
            title: 'Acção',
            dataIndex: '',
            key: 'x',
            render: (text, record) => (
              <Space>
                <Button type="primary" icon={<EyeOutlined />} onClick={() =>handleViewModalVisible(true, record)} >
                </Button>
                    <Button type="primary" icon={<EditOutlined />} onClick={() =>(record.status == 0 ? onEditRefence(record) : 
                        (
                            message.info({
                            content: 'Referência já atendida!', className: 'custom-class',
                            style: {
                                marginTop: '10vh',
                            }
                            })
                        )
                        )} >
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
                    rowKey={(record?) => `${record.id}${record.id.date}`}
                    columns={columnsRef}
                    dataSource={references}
                    bordered
                />
            </Card>
            <ViewReferral
                {...parentMethods}
                reference={reference}
                modalVisible={modalVisible} />

            <FormReference
                form={form}
                reference={reference}
                handleUpdate={handleRefUpdate}
                modalVisible={referenceModalVisible}
                handleModalRefVisible={handleModalRefVisible} 
                handleRefServicesList={handleRefServicesList}/>

        </>
    );
}
export default ReferenceList;