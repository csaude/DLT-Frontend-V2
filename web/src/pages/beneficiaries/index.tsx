import React, { Fragment, useEffect, useState } from 'react';
import {useNavigate, Link} from 'react-router-dom';
import { query } from '../../utils/beneficiary';
import { query as queryUser } from '../../utils/users';
import classNames from "classnames";
import {matchSorter} from "match-sorter";
import { Badge, Button, message, Card, Input, Space, Table, Typography, Form, ConfigProvider } from 'antd';
import ptPT  from 'antd/lib/locale-provider/pt_PT';
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
import { allDistrict } from '@app/utils/district';
import { allPartners } from '@app/utils/partners';
import FullPageLoader from '@app/components/full-page-loader/FullPageLoader';
import { Title } from '@app/components';
import { ADMIN, MNE, SUPERVISOR } from '@app/utils/contants';

const { Text } = Typography;

const ages = [9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];

const BeneficiariesList: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [ users, setUsers ] = useState<UserModel[]>([]);
    const [ updaters, setUpdaters ] = useState<UserModel[]>([]);
    const [ user, setUser ] = React.useState<any>();
    const [ beneficiaries, setBeneficiaries ] = useState<any[]>([]);
    const [ searchText, setSearchText ] = useState('');
    const [ services, setServices ] = useState<any>([]);
    const [ searchedColumn, setSearchedColumn ] = useState('');
    const [ beneficiary, setBeneficiary ] = useState<any>(undefined);
    const [ modalVisible, setModalVisible ] = useState<boolean>(false);
    const [ beneficiaryModalVisible, setBeneficiaryModalVisible ] = useState<boolean>(false);
    const [ beneficiaryPartnerModalVisible, setBeneficiaryPartnerModalVisible ] = useState<boolean>(false);
    const [ referenceModalVisible, setReferenceModalVisible ] = useState<boolean>(false);
    const [ addStatus, setAddStatus ] = useState<boolean>(false);    
    const [ district, setDistrict] = useState<any[]>([]);
    const [ partners, setPartners] = useState<any[]>([]);
    const [ visibleName, setVisibleName ] = useState<any>(true);
    const [ loading, setLoading ] = useState(false);

    let searchInput ;
    useEffect(() => { 

        const fetchData = async () => {
            setLoading(true);
            const user = await queryUser(localStorage.user);
            const data = await query(getUserParams(user));

            const sortedBeneficiaries = data.sort((benf1, benf2) => moment(benf2.dateCreated).format('YYYY-MM-DD').localeCompare(moment(benf1.dateCreated).format('YYYY-MM-DD')));

            setUser(user);
            setBeneficiaries(sortedBeneficiaries);

            const localities = data.map(beneficiary => beneficiary?.locality).filter((value, index, self) => self.findIndex(v => v?.id === value?.id) === index);
            const districts = localities.map(locality => locality?.district).filter((value, index, self) => self.findIndex(v => v?.id === value?.id) === index);
            const partners = data.map(beneficiary => beneficiary?.partner).filter((value, index, self) => self.findIndex(v => v?.id === value?.id) === index);
            const creatorsIds = data.map(beneficiary => beneficiary?.createdBy).filter((value, index, self) => self.findIndex(v => v === value) === index);
            const updatersIds = data.map(beneficiary => beneficiary?.updatedBy).filter((value, index, self) => self.findIndex(v => v === value) === index);

            const users = await queryUser();
            const creators = users.filter(u => creatorsIds.includes(u.id));
            const updaters = users.filter(u => updatersIds.includes(u.id));
            
            setDistrict(districts);
            setPartners(partners);
            setUsers(creators);
            setUpdaters(updaters);

            if(user.profiles.id === ADMIN || user.profiles.id === MNE || user.profiles.id === SUPERVISOR){
                setVisibleName(false);
            }
            setLoading(false);
        }
    
        fetchData().catch(error => console.log(error));
    
    }, [modalVisible]);

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
                referredBy: {
                    id: values.referredBy
                },
                users: {
                    id: values.notifyTo
                },
                us: {
                    id: values.local
                },
                referenceNote: values.referenceNote,
                description: '',
                referTo: values.referTo,
                bookNumber: values.bookNumber,
                referenceCode: values.referenceCode,
                serviceType: values.serviceType === "CLINIC" ? "1" : "2",
                remarks: values.remarks,
                status: '0',
                cancelReason: '0',
                otherReason: '',
                userCreated: localStorage.user,
                dateCreated: '',
                referencesServiceses: servicesObjects,
                
            };

            if(servicesObjects.length==0){
                setAddStatus(false);
                
                message.error({
                    content: 'Referência sem Intervenção!', className: 'custom-class',
                    style: {
                        marginTop: '10vh',
                    }
                });
                
            }else{
                setAddStatus(true);
                
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
    }

    const handleAddBeneficiary = (data: any) => {
        const bens = [...beneficiaries, data];
        const sortedBeneficiaries = bens.sort((benf1, benf2) => moment(benf2.dateCreated).format('YYYY-MM-DD').localeCompare(moment(benf1.dateCreated).format('YYYY-MM-DD')));
        setBeneficiaries(sortedBeneficiaries);
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
        setBeneficiaryPartnerModalVisible(false);
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
        return visibleName === false ? record.name + ' ' + record.surname : 'DREAMS'+record.nui;
    }

    const filterItem = data => formatter => data.map( item => ({
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
                    placeholder={`Pesquisar ${dataIndex=='name'?'nome':dataIndex}`}
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
                <Button onClick={() => handleReset(clearFilters,selectedKeys, confirm, dataIndex)} size="small" style={{ width: 90 }}>
                    Limpar
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
                    Filtrar
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
            render: (text, record) => <span>{moment(record.id.date).format('YYYY-MM-DD')}</span>,
        },
        { title: 'Serviço', 
            dataIndex: '', 
            key: 'service',
            render: (text, record)  => record.subServices.service.name,
        },
        { title: 'Intervenções', 
            dataIndex: '', 
            key: 'intervention',
            render: (text, record)  => 
                ((user.profiles.id == 4 || user.profiles.id == 3 && user.partners.partnerType == 2) && record.subServices.service.id == 9)? 
                '' : record.subServices.name,
        },
        { title: 'Ponto de Entrada', 
            dataIndex: '', 
            key: 'entryPoint',
            render: (text, record)  => record.us.name,
        },
        // {
        //     title: 'Acção',
        //     dataIndex: '',
        //     key: 'x',
        //     render: (text, record) => (
        //         <Space>
        //             <Button type="primary" icon={<EyeOutlined />} onClick={() => showDrawer(record)} >
        //             </Button>
        //             <Button type="primary" icon={<EditOutlined />} onClick={() => onEditIntervention(record)} >
        //             </Button>
        //         </Space>
        //     ),
        // },
    ];

    const columns = [
        { title: 'Código do Beneficiário (NUI)', dataIndex: '', key: 'nui', ...getColumnSearchProps('nui'),
            render: (text, record)  => (
                <Text type="danger" >   
                    {record.neighborhood?.locality?.district?.code}/{record.nui}
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
            render: (text, record)  => record.neighborhood?.locality?.district.name,
            filters: filterItem(district)(i => i?.name),
            onFilter: (value, record) => record?.neighborhood?.locality?.district?.name == value,
            filterSearch: true,
        },
        { title: 'Idade', dataIndex: 'age', key: 'age',
            render: (text, record) => calculateAge(record.dateOfBirth) + ' anos',
            filters: filterItem(ages)(i => i),
            onFilter: (value, record) => calculateAge(record.dateOfBirth) == value,
            filterSearch: true,
        },
        { title: '#Interv', dataIndex: 'beneficiariesInterventionses', key: 'beneficiariesInterventionses', 
            render(val: any) {
                return (
                    <Badge count={val?.length} />
                );
            },
        },
        { title: 'Org',
            dataIndex: 'partner', 
            key: 'partner',
            render: (text, record)  => record?.partner?.name,
            filters: filterItem(partners)(i => i?.name),
            onFilter: (value, record) => (record?.partner?.name == value),
            filterSearch: true,
        },
        { title: 'Criado Por', dataIndex: '', key: 'createdBy',
            render: (text, record)  => users.filter(user => record.createdBy == user.id).map(filteredUser => `${filteredUser.username}`)[0],
            filters: filterItem(users)(i => i.username),
            onFilter: (value, record) => (users.filter(user => record.createdBy == user.id).map(filteredUser => `${filteredUser.username}`)[0] == value),
            filterSearch: true,
        },
        { title: 'Criado Em', dataIndex: 'dateCreated', key: 'dateCreated', ...getColumnSearchProps('data criação'),
            render: (val: string) => <span>{moment(val).format('YYYY-MM-DD')}</span>,
            sorter: (benf1, benf2) => moment(benf2.dateCreated).format('YYYY-MM-DD').localeCompare(moment(benf1.dateCreated).format('YYYY-MM-DD')),
        },
        { title: 'Atualizado Por', dataIndex: '', key: 'updatedBy',
            render: (text, record)  => updaters.filter(user => record.updatedBy == user.id).map(filteredUser => `${filteredUser.username}`)[0],
            filters: filterItem(updaters)(i => i.username),
            onFilter: (value, record) => (updaters.filter(user => record.updatedBy == user.id).map(filteredUser => `${filteredUser.username}`)[0] == value),
            filterSearch: true,
        },
        { title: 'Atualizado Em', dataIndex: 'dateUpdated', key: 'dateUpdated', ...getColumnSearchProps('data actualização'),
            render: (val: string) =>val != undefined ? <span>{moment(val).format('YYYY-MM-DD')} </span>: '',
            sorter: (benf1, benf2) => moment(benf2.dateCreated).format('YYYY-MM-DD').localeCompare(moment(benf1.dateCreated).format('YYYY-MM-DD')),
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

    const handleReset = (clearFilters,selectedKeys, confirm, dataIndex) => { 
        clearFilters();
        setSearchText(searchText);
        handleSearch(selectedKeys, confirm, dataIndex)
    };
    
    return (
        
        <>        
            <Title />
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
                {
                    loading?
                        <FullPageLoader />
                    : undefined
                }
                <ConfigProvider locale={ptPT}>
                    <Table
                        rowKey="id"
                        sortDirections={["descend", "ascend"]}
                        columns={columns}
                        expandable={{
                            expandedRowRender: record =>  <div style={{border:"2px solid #d9edf7", backgroundColor:"white"}}><ViewBenefiaryPanel beneficiary={record} columns={interventionColumns} handleModalVisible={handleModalVisible} handleModalRefVisible={handleModalRefVisible} user={user} /></div>,
                            rowExpandable: record => record.name !== 'Not Expandable',
                        }}
                        dataSource={beneficiaries}
                        bordered
                    />
                </ConfigProvider>
            </Card>
            <ViewBeneficiary 
                {...parentMethods}
                beneficiary={beneficiary} 
                modalVisible={modalVisible} 
                handleModalRefVisible={handleModalRefVisible}
                user={user}
            />
            <FormBeneficiary form={form} beneficiary={beneficiary} beneficiaries={beneficiaries}
                modalVisible={beneficiaryModalVisible}
                handleAddBeneficiary={handleAddBeneficiary}
                handleUpdateBeneficiary={handleUpdateBeneficiary}
                handleModalVisible={handleBeneficiaryModalVisible} 
            />
            <FormBeneficiaryPartner form={form} beneficiary={beneficiary} modalVisible={beneficiaryPartnerModalVisible}
                handleAddBeneficiary={handleAddBeneficiary}
                handleUpdateBeneficiary={handleUpdateBeneficiary}
                handleModalVisible={handleBeneficiaryPartnerModalVisible} 
            />
            <FormReference  form={form} beneficiary={beneficiary} 
                modalVisible={referenceModalVisible}
                addStatus={addStatus}
                handleAdd={handleAddRef}   
                handleModalRefVisible={handleModalRefVisible} 
                handleRefServicesList={handleRefServicesList}
            />
        </>
    );
}

export default BeneficiariesList;