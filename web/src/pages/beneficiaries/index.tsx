import React, { Fragment, useEffect, useState } from 'react'
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
import { calculateAge } from '@app/models/Utils';
import BeneficiaryForm from './components/BeneficiaryForm';
import FormBeneficiary from './components/FormBeneficiary';
import FormBeneficiaryPartner from './components/FormBeneficiaryPartner';
import { add, edit } from '../../utils/beneficiary';
import { stringify } from 'qs';
import FormReference from './components/FormReference';


const { Text } = Typography;

const BeneficiariesList: React.FC = () => {
    const [form] = Form.useForm();
    const [users, setUsers] = useState<UserModel[]>([]);
    const [ beneficiaries, setBeneficiaries ] = useState<any[]>([]);
    const [ searchText, setSearchText ] = useState('');
    const [ searchedColumn, setSearchedColumn ] = useState('');
    const [ beneficiary, setBeneficiary] = useState<any>(undefined);
    const [ modalVisible, setModalVisible] = useState<boolean>(false);
    const [ beneficiaryModalVisible, setBeneficiaryModalVisible] = useState<boolean>(false);
    const [ beneficiaryPartnerModalVisible, setBeneficiaryPartnerModalVisible] = useState<boolean>(false);
    const [ referenceModalVisible, setReferenceModalVisible] = useState<boolean>(false);

    let searchInput ;
    useEffect(() => {
        const fetchData = async () => {
          const data = await query();

          setBeneficiaries(data);
        } 

        const fetchUsers = async () => {
            const users = await queryUser();
            setUsers(users);
        }
    
        fetchData().catch(error => console.log(error));
        fetchUsers().catch(error => console.log(error));
    
    }, []);

    const handleAddRef = (values:any) => {
        console.log(values);

        message.success({
            content: 'Registado com Sucesso!', className: 'custom-class',
            style: {
                marginTop: '10vh',
            }
        });

        setReferenceModalVisible(false);
    }

    const handleAdd = (values:any, gender:string) => {

        form.validateFields().then(async (vblts) => {
            const ben: any = beneficiary ? beneficiary : {};

            ben.surname = values.surname;
            ben.name = values.name;
            ben.nickName = values.nick_name;
            ben.dateOfBirth = moment(values.date_of_birth).format('YYYY-MM-DD');
            ben.age = values.age;
            ben.gender=gender;
            ben.address = values.address;
            ben.email = values.e_mail;
            ben.phoneNumber = values.phone_number;
            ben.enrollmentDate = values.enrollment_date;
            ben.nationality = values.nationality;
            ben.entryPoint = values.entry_point;
            ben.neighborhood = { "id": values.neighbourhood_id };
            ben.partnerNUI = values.partner_nui;
            ben.vbltChildren = vblts.vblt_children;
            ben.vbltDeficiencyType = vblts.vblt_deficiency_type;
            ben.vbltHouseSustainer = vblts.vblt_house_sustainer;
            ben.vbltIsDeficient = vblts.vblt_is_deficient;
            ben.vbltIsEmployed = vblts.vblt_is_employed;
            ben.vbltIsOrphan = vblts.vblt_is_orphan;
            ben.vbltIsStudent = vblts.vblt_is_student;
            ben.vbltLivesWith = vblts.vblt_lives_with?.toString();
            ben.vbltMarriedBefore = vblts.vblt_married_before;
            ben.vbltPregnantBefore = vblts.vblt_pregnant_before;
            ben.vbltPregnantOrBreastfeeding = vblts.vblt_pregnant_or_breastfeeding;
            ben.vbltSchoolGrade = vblts.vblt_school_grade;
            ben.vbltSchoolName = vblts.vblt_school_name;
            ben.vbltTestedHiv = vblts.vblt_tested_hiv;
            ben.status="1";
            

            if (beneficiary === undefined) {
                ben.createdBy = localStorage.user;
                ben.partner = { "id": localStorage.organization };
                ben.organizationId = localStorage.organization;
                ben.us = { "id": localStorage.us };

                const { data } = await add(ben);
                setBeneficiaries(beneficiaries => [...beneficiaries, data]);
                setBeneficiary(data);
            } else {
                const { data } = await edit(ben);
                setBeneficiaries(existingItems => {
                    return existingItems.map((item, j) => {
                        return item.id === beneficiary.id ?
                            data : item
                    })
                });
            }

            message.success({
                content: 'Registado com Sucesso!', className: 'custom-class',
                style: {
                    marginTop: '10vh',
                }
            });
        })
        .catch(error => {
            console.log(error);
            message.error({
                content: 'Não foi possivel Registrar a Beneficiária!', className: 'custom-class',
                style: {
                    marginTop: '10vh',
                }
            });
        });
    }
    
    const handleUpdate = (firstStepValues, secondStepValues) => {
        form.validateFields().then(async (values) => {
            beneficiary.surname = firstStepValues.surname;
            beneficiary.name = firstStepValues.name;
            beneficiary.nickName = firstStepValues.nick_name;
            beneficiary.dateOfBirth = moment(firstStepValues.date_of_birth).format('YYYY-MM-DD');
            beneficiary.age = firstStepValues.age;
            beneficiary.address = firstStepValues.address;
            beneficiary.email = firstStepValues.e_mail;
            beneficiary.phoneNumber = firstStepValues.phone_number;
            beneficiary.enrollmentDate = firstStepValues.enrollment_date;
            beneficiary.nationality = firstStepValues.nationality;
            beneficiary.entryPoint = firstStepValues.entry_point;
            beneficiary.neighborhood = { "id": firstStepValues.neighbourhood_id };
            beneficiary.partnerNUI = values.partner_nui;
            beneficiary.vbltChildren = secondStepValues.vblt_children;
            beneficiary.vbltDeficiencyType = secondStepValues.vblt_deficiency_type;
            beneficiary.vbltHouseSustainer = secondStepValues.vblt_house_sustainer;
            beneficiary.vbltIsDeficient = secondStepValues.vblt_is_deficient;
            beneficiary.vbltIsEmployed = secondStepValues.vblt_is_employed;
            beneficiary.vbltIsOrphan = secondStepValues.vblt_is_orphan;
            beneficiary.vbltIsStudent = secondStepValues.vblt_is_student;
            beneficiary.vbltLivesWith = secondStepValues.vblt_lives_with.toString();
            beneficiary.vbltMarriedBefore = secondStepValues.vblt_married_before;
            beneficiary.vbltPregnantBefore = secondStepValues.vblt_pregnant_before;
            beneficiary.vbltPregnantOrBreastfeeding = secondStepValues.vblt_pregnant_or_breastfeeding;
            beneficiary.vbltSchoolGrade = secondStepValues.vblt_school_grade;
            beneficiary.vbltSchoolName = secondStepValues.vblt_school_name;
            beneficiary.vbltTestedHiv = secondStepValues.vblt_tested_hiv;
            beneficiary.vbltSexuallyActive = values.vblt_sexually_active;
            beneficiary.vbltMultiplePartners = values.vblt_multiple_partners;
            beneficiary.vbltIsMigrant = values.vblt_is_migrant;
            beneficiary.vbltTraffickingVictim = values.vblt_trafficking_victim;
            beneficiary.vbltSexualExploitation = values.vblt_sexual_exploitation;
            beneficiary.vbltSexploitationTime = values.vblt_sexploitation_time;
            beneficiary.vbltVbgVictim = values.vblt_vbg_victim;
            beneficiary.vbltVbgType = values.vblt_vbg_type;
            beneficiary.vbltVbgTime = values.vblt_vbg_time;
            beneficiary.vbltAlcoholDrugsUse = values.vblt_alcohol_drugs_use;
            beneficiary.vbltStiHistory = values.vblt_sti_history;
            beneficiary.vbltSexWorker = values.vblt_sex_worker;
            beneficiary.updatedBy = localStorage.user;

            const { data } = await edit(beneficiary);
            setBeneficiaries(existingItems => {
                return existingItems.map((item, j) => {
                    return item.id === beneficiary.id ?
                        data : item
                })
            });

            setBeneficiaryModalVisible(false);

            message.success({
                content: 'Actualizado com Sucesso!', className: 'custom-class',
                style: {
                    marginTop: '10vh',
                }
            });
        })
        .catch(error => {
            console.log(error);
            message.error({
                content: 'Não foi possivel Actualizar a Beneficiária!', className: 'custom-class',
                style: {
                    marginTop: '10vh',
                }
            });
        });
    };

    const handleViewModalVisible = (flag?: boolean, record?: any) => {
        setBeneficiary(record);
        setModalVisible(!!flag);
    };

    const handleModalRefVisible = (flag?: boolean, record?: any) => {
        setBeneficiary(record);
        setReferenceModalVisible(!!flag);
    };

    const handleBeneficiaryModalVisible = (flag?: boolean) => {
        // form.resetFields();
        setBeneficiary(undefined);
        setBeneficiaryModalVisible(!!flag);
    };

    const handleBeneficiaryPartnerModalVisible = (flag?: boolean) => {
        // form.resetFields();
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
        if (record.gender === "1") {
            if (record.partnerId != null) {
                await fetchPartner(record).catch(error => console.log(error));;
            }
            setBeneficiaryModalVisible(true)
        }
        else {
            setBeneficiaryPartnerModalVisible(true);
        }
        setBeneficiary(record);
    };

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
        handleAdd: handleAdd,
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
            render: (text, record)  => getEntryPoint(record.entryPoint),
        }
    ];

    const columns = [
        { title: 'Código do Beneficiário', dataIndex: '', key: 'nui', ...getColumnSearchProps('nui'),
            render: (text, record)  => (
                <Text type="danger" >
                    {record.neighborhood.locality.district.code}/{record.nui}
                </Text>),
        },
        { title: 'Nome do Beneficiário', dataIndex: 'name', key: 'name',
            render: (text, record) => (
                <div>
                    {record.name} {record.surname}
                </div>
            ), 
        },
        { title: 'Sexo', dataIndex: 'gender', key: 'gender',
            filters: [
            {
                text: 'Masculino',
                value: '0',
                },
                {
                text: 'Feminino',
                value: '1',
            },
            ],
            onFilter: (value, record) => record.gender == value,
            filterSearch: true,
            render(val: any) {
                return (
                  <Badge
                    status={val == true ? 'success' : 'warning'}
                    text={
                      val == '1'
                        ? 'F'
                        : 'M'
                    }
                  />
                );
              },
        },
        { title: 'PE', dataIndex: '', key: 'entryPoint', render: (text, record)  => getEntryPoint(record.entryPoint) },
        { title: 'Distrito', dataIndex: '', key: 'district',
            render: (text, record)  => record.neighborhood.locality.district.name,
        },
        { title: 'Idade', dataIndex: 'age', key: 'age',
            render: (text, record) => calculateAge(record.dateOfBirth)
        },
        { title: '#Interv', dataIndex: 'status', key: 'status', 
            render(val: any) {
                return (
                    <Badge count={val} />
                );
            },
        },
        { title: 'Org', dataIndex: 'partner', key: 'partner',
            render: (text, record)  => record.partner.abbreviation,
        },
        { title: 'Criado Por', dataIndex: '', key: 'createdBy',
            render: (text, record)  => users.filter(user => record.createdBy == user.id).map(filteredUser => filteredUser.username)[0],
        },
        { title: 'Atualizado Por', dataIndex: '', key: 'updatedBy',
            render: (text, record)  => users.filter(user => record.updatedBy == user.id).map(filteredUser => filteredUser.username)[0],
        },
        { title: 'Criado Em', dataIndex: 'dateCreated', key: 'dateCreated',
            render: (val: string) => <span>{moment(val).format('YYYY-MM-DD')}</span>,
        },
        {
          title: 'Action',
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
                handleModalRefVisible={handleModalRefVisible}/>
                
            <FormBeneficiary form={form} beneficiary={beneficiary} modalVisible={beneficiaryModalVisible}
                                handleAdd={handleAdd}
                                handleUpdate={handleUpdate}
                                handleModalVisible={handleBeneficiaryModalVisible} />

            <FormBeneficiaryPartner form={form} beneficiary={beneficiary} modalVisible={beneficiaryPartnerModalVisible}
                                handleAdd={handleAdd}
                                handleModalVisible={handleBeneficiaryPartnerModalVisible} />
            <FormReference  form={form} beneficiary={beneficiary} 
                            modalVisible={referenceModalVisible}
                            handleAdd={handleAddRef}   
                            handleModalRefVisible={handleModalRefVisible} 
                            />
        </>
    );
}

export default BeneficiariesList;