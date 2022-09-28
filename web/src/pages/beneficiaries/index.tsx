import React, { Fragment, useEffect, useState } from 'react';
import {useNavigate, Link} from 'react-router-dom';
import { query } from '../../utils/beneficiary';
import { query as queryUser } from '../../utils/users';
import classNames from "classnames";
import {matchSorter} from "match-sorter";
import { Badge, Button, message, Card, Input, Space, Table, Typography, Form } from 'antd';
import Highlighter from 'react-highlight-words';
import 'antd/dist/antd.css';
import { SearchOutlined, EditOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import ViewBeneficiary, { ViewBenefiaryPanel } from './components/View';
import { getEntryPoint, UserModel } from '@app/models/User';
import { calculateAge, getUserParams } from '@app/models/Utils';
import FormBeneficiary from './components/FormBeneficiary';
import FormBeneficiaryPartner from './components/FormBeneficiaryPartner';
import { add, edit } from '../../utils/beneficiary';
import { add as addRef, Reference } from '../../utils/reference';
import FormReference from './components/FormReference';


const { Text } = Typography;

const BeneficiariesList: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [ users, setUsers ] = useState<UserModel[]>([]);
    const [ user, setUser ] = React.useState<any>();
    const [ beneficiaries, setBeneficiaries ] = useState<any[]>([]);
    const [ searchText, setSearchText ] = useState('');
    const [ services, setServices ] = useState<any>([]);
    const [ searchedColumn, setSearchedColumn ] = useState('');
    const [ beneficiary, setBeneficiary ] = useState<any>(undefined);
    const [ reference, setReference ] = useState<any>(undefined);
    const [ modalVisible, setModalVisible ] = useState<boolean>(false);
    const [ beneficiaryModalVisible, setBeneficiaryModalVisible ] = useState<boolean>(false);
    const [ beneficiaryPartnerModalVisible, setBeneficiaryPartnerModalVisible ] = useState<boolean>(false);
    const [ referenceModalVisible, setReferenceModalVisible ] = useState<boolean>(false);
    const [ params, setParams] = useState<any>(undefined);

    let searchInput ;
    useEffect(() => { 

        const fetchData = async () => {
            const user = await queryUser(localStorage.user);
            const data = await query(getUserParams(user));

            setUser(user);
            setBeneficiaries(data);
        } 

        const fetchUsers = async () => {
            const users = await queryUser();
            setUsers(users);
        }
    
        fetchData().catch(error => console.log(error));
        fetchUsers().catch(error => console.log(error));
    
    }, []);

    const handleAddRef = async (values:any) => {
    
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
                beneficiaries: {
                    id: beneficiary.id
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
                userCreated: localStorage.user,
                dateCreated: '',
                referencesServiceses: servicesObjects,
                
            };

            const { data } = await addRef(payload);

            message.success({
                content: 'Registado com Sucesso!'+data?.referenceNote, className: 'custom-class',
                style: {
                    marginTop: '10vh',
                }
            });

            setReferenceModalVisible(false);

            navigate('/referenceList');            
        }
    }

    const handleAddBeneficiary = (data: any) => {
        setBeneficiaries(beneficiaries => [...beneficiaries, data]);
        setBeneficiary(data);
    }

    const handleUpdateBeneficiary = (data: any) => {
        setBeneficiaries(existingItems => {
            return existingItems.map((item, j) => {
                return item.id === beneficiary.id ?
                    data : item
            })
        });
        setBeneficiary(data);
        setBeneficiaryModalVisible(false);
    }

    

    const handleViewModalVisible = (flag?: boolean, record?: any) => {
        setBeneficiary(record);
        setModalVisible(!!flag);
    };

    const handleModalRefVisible = (flag?: boolean, record?: any) => {
        setBeneficiary(record);
        setReferenceModalVisible(!!flag);
    };
    const handleRefServicesList = (data?: any) => {
        setServices(data);
    };

    const handleBeneficiaryModalVisible = (flag?: boolean) => {
        form.resetFields();
        setBeneficiary(undefined);
        setBeneficiaryModalVisible(!!flag);
    };

    const handleBeneficiaryPartnerModalVisible = (flag?: boolean) => {
        form.resetFields();
        setBeneficiary(undefined);
        setBeneficiaryPartnerModalVisible(!!flag);
    };

    const handleModalVisible = (flag?: boolean) => {
        setModalVisible(!!flag);
    };

    const fetchPartner = async (record: any) => {
        const data = await query(record.partnerId);
        record.partnerNUI = data.nui;
    }

    const onEditBeneficiary = async (record: any) => {
        
        form.resetFields();
        
        if (record.gender === "2") {
            if (record.partnerId != null) {
                await fetchPartner(record).catch(error => console.log(error));
            }
            setBeneficiaryModalVisible(true);
        }
        else {
            setBeneficiaryPartnerModalVisible(true);
        }
        setBeneficiary(record);
    };

    const getName = (record: any) => {
        return user?.profiles.id === 1 ? record.name + ' ' + record.surname : 'DREAMS'+record.nui;
    }

    const getColumnSearchProps = (dataIndex:any) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
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
                    Search
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

    const parentMethods = {
        handleModalVisible: handleModalVisible
    };

    const interventionColumns = [
        { title: 'Data', 
            dataIndex: 'date', 
            key: 'date',
            render: (text, record) => <span>{moment(record.dateCreated).format('YYYY-MM-DD')}</span>,
        },
        { title: 'Serviço', 
            dataIndex: '', 
            key: 'service',
            render: (text, record)  => record.subServices.service.name,
        },
        { title: 'Intervenções', 
            dataIndex: '', 
            key: 'intervention',
            render: (text, record)  => record.subServices.name,
        },
        { title: 'Ponto de Entrada', 
            dataIndex: '', 
            key: 'entryPoint',
            render: (text, record)  => record.us.name,
        }
    ];

    const columns = [
        { title: 'Código do Beneficiário (NUI)', dataIndex: '', key: 'nui', ...getColumnSearchProps('nui'),
            render: (text, record)  => (
                <Text type="danger" >   
                    {record.neighborhood.locality?.district?.code}/{record.nui}
                </Text>),
        },
        { title: 'Nome do Beneficiário', dataIndex: 'name', key: 'name', ...getColumnSearchProps('name'),
            render: (text, record) => getName(record),
        },
        { title: 'Sexo', dataIndex: 'gender', key: 'gender',
            filters: [
            {
                text: 'M',
                value: '1',
            },
            {
                text: 'F',
                value: '2',
            },
            ],
            onFilter: (value, record) => record.gender == value,
            filterSearch: true,
            render(val: any) {
                return (
                  <Badge
                    status={val == true ? 'success' : 'warning'}
                    text={
                      val == '2'
                        ? 'F' 
                        : 'M'
                    }
                  />
                );
              },
        },
        { title: 'PE', dataIndex: '', key: 'entryPoint', 
            filters: [
            {
                text: 'US',
                value: '1',
            },
            {
                text: 'CM',
                value: '2',
            },
            {
                text: 'ES',
                value: '3',
            },
            ],
            onFilter: (value, record) => record.entryPoint == value,
            filterSearch: true,
            render: (text, record)  => getEntryPoint(record.entryPoint) 
        },
        { title: 'Distrito', dataIndex: '', key: 'district',
            render: (text, record)  => record.neighborhood.locality.district.name,
        },
        { title: 'Idade', dataIndex: 'age', key: 'age',
            render: (text, record) => calculateAge(record.dateOfBirth) + ' anos'
        },
        { title: '#Interv', dataIndex: 'beneficiariesInterventionses', key: 'beneficiariesInterventionses', 
            render(val: any) {
                return (
                    <Badge count={val.length} />
                );
            },
        },
        { title: 'Org', dataIndex: 'partner', key: 'partner',
            render: (text, record)  => record.partner.abbreviation,
        },
        { title: 'Criado Por', dataIndex: '', key: 'createdBy',
            render: (text, record)  => users.filter(user => record.createdBy == user.id).map(filteredUser => `${filteredUser.name} ` + `${filteredUser.surname}`)[0],
        },
        { title: 'Criado Em', dataIndex: 'dateCreated', key: 'dateCreated',
            render: (val: string) => <span>{moment(val).format('YYYY-MM-DD')}</span>,
        },
        { title: 'Atualizado Por', dataIndex: '', key: 'updatedBy',
            render: (text, record)  => users.filter(user => record.updatedBy == user.id).map(filteredUser => `${filteredUser.name} ` + `${filteredUser.surname}`)[0],
        },
        { title: 'Atualizado Em', dataIndex: 'dateCreated', key: 'dateUpdated',
            render: (val: string) => <span>{moment(val).format('YYYY-MM-DD')}</span>,
        },
        {
          title: 'Acção',
          dataIndex: '',
          key: 'x',
          render: (text, record) => (
                <Space>
                    <Button type="primary" icon={<EyeOutlined />} onClick={()=>handleViewModalVisible(true, record)}>
                    </Button>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => onEditBeneficiary(record)} >
                    </Button>
                </Space>
          ),
        },
    ];

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText(searchText);
    };
    
    return (
        
        <>
            <Card  bordered={false} style={{marginBottom:'10px', textAlign:"center", fontWeight:"bold", color:"#17a2b8"}} >
                SISTEMA INTEGRADO DE CADASTRO DE ADOLESCENTES E JOVENS
            </Card>
            <Card title="Lista de Adolescentes e Jovens" 
                    bordered={false} 
                    headStyle={{color:"#17a2b8"}}
                    extra={
                        <Space>
                          <Button type="primary" onClick={()=>handleBeneficiaryModalVisible(true)} icon={<PlusOutlined />} style={{ background: "#00a65a", borderColor: "#00a65a", borderRadius:'4px' }}>
                            Adicionar Nova Beneficiária
                          </Button>
                          <Button type="primary" onClick={()=>handleBeneficiaryPartnerModalVisible(true)} icon={<PlusOutlined />} style={{ background: "#a69e00", borderColor: "#a69e00", borderRadius:'4px' }}>
                            Adicionar Novo Parceiro
                          </Button>
                        </Space>
                    }
            >
                <Table
                    rowKey="id"
                    columns={columns}
                    expandable={{
                        expandedRowRender: record =>  <div style={{border:"2px solid #d9edf7", backgroundColor:"white"}}><ViewBenefiaryPanel beneficiary={record} columns={interventionColumns} handleModalVisible={handleModalVisible} handleModalRefVisible={handleModalRefVisible} /></div>,
                        rowExpandable: record => record.name !== 'Not Expandable',
                    }}
                    dataSource={beneficiaries}
                    bordered
                />
            </Card>
            <ViewBeneficiary 
                {...parentMethods}
                beneficiary={beneficiary} 
                modalVisible={modalVisible} 
                handleModalRefVisible={handleModalRefVisible}
            />
            <FormBeneficiary form={form} beneficiary={beneficiary} modalVisible={beneficiaryModalVisible}
                handleAddBeneficiary={handleAddBeneficiary}
                handleUpdateBeneficiary={handleUpdateBeneficiary}
                handleModalVisible={handleBeneficiaryModalVisible} 
            />
            <FormBeneficiaryPartner form={form} beneficiary={beneficiary} modalVisible={beneficiaryPartnerModalVisible}
                handleAddBeneficiary={handleAddBeneficiary}
                handleModalVisible={handleBeneficiaryPartnerModalVisible} 
            />
            <FormReference  form={form} beneficiary={beneficiary} 
                modalVisible={referenceModalVisible}
                handleAdd={handleAddRef}   
                handleModalRefVisible={handleModalRefVisible} 
                handleRefServicesList={handleRefServicesList}
            />
        </>
    );
}

export default BeneficiariesList;