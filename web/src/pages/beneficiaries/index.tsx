import React, { Fragment, useEffect, useState } from 'react'
import { query } from '../../utils/beneficiary';
import classNames from "classnames";
import {matchSorter} from "match-sorter";
import { Badge, Button, message, Card, Input, Space, Table, Typography, Form } from 'antd';
import Highlighter from 'react-highlight-words';
import 'antd/dist/antd.css';
import { SearchOutlined, EditOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import ViewBeneficiary, { ViewBenefiaryPanel } from './components/View';
import { getEntryPoint } from '@app/models/User';
import BeneficiaryForm from './components/BeneficiaryForm';
import FormBeneficiary from './components/FormBeneficiary';
import { add, edit } from '../../utils/beneficiary';
import { stringify } from 'qs';


const { Text } = Typography;

const BeneficiariesList: React.FC = () => {
    const [form] = Form.useForm();
    const [ beneficiaries, setBeneficiaries ] = useState<any[]>([]);
    const [ searchText, setSearchText ] = useState('');
    const [ searchedColumn, setSearchedColumn ] = useState('');
    const [ beneficiary, setBeneficiary] = useState<any>(undefined);
    const [ modalVisible, setModalVisible] = useState<boolean>(false);
    const [ beneficiaryModalVisible, setBeneficiaryModalVisible] = useState<boolean>(false);


    let searchInput ;
    useEffect(() => {
        const fetchData = async () => {
          const data = await query();

          setBeneficiaries(data);
        } 
    
        fetchData().catch(error => console.log(error));
    
    }, []);

    const handleAdd = (values:any) => {

        form.validateFields().then(async (vblts) => {
            const ben: any = beneficiary ? beneficiary : {};

            ben.surname = values.surname;
            ben.name = values.name;
            ben.nickName = values.nick_name;
            ben.dateOfBirth = moment(values.date_of_birth).format('YYYY-MM-DD');
            ben.age = values.age;
            ben.gender="1";
            ben.address = values.address;
            ben.EMail = values.e_mail;
            ben.phoneNumber = values.phone_number;
            ben.entryPoint = values.entry_point;
            ben.neighborhood = { "id": values.neighbourhood_id };
            ben.partner = { "id": localStorage.organization };
            ben.organizationId = localStorage.organization;
            ben.us = { "id": localStorage.us };
            ben.vbltChildren = vblts.vblt_children;
            ben.vbltDeficiencyType = vblts.vblt_deficiency_type;
            ben.vbltHouseSustainer = vblts.vblt_house_sustainer;
            ben.vbltIsDeficient = vblts.vblt_is_deficient;
            ben.vbltIsEmployed = vblts.vblt_is_employed;
            ben.vbltIsOrphan = vblts.vblt_is_orphan;
            ben.vbltIsStudent = vblts.vblt_is_student;
            ben.vbltLivesWith = vblts.vblt_lives_with.toString();
            ben.vbltMarriedBefore = vblts.vblt_married_before;
            ben.vbltPregnantBefore = vblts.vblt_pregnant_before;
            ben.vbltPregnantOrBreastfeeding = vblts.vblt_pregnant_or_breastfeeding;
            ben.vbltSchoolGrade = vblts.vblt_school_grade;
            ben.vbltSchoolName = vblts.vblt_school_name;
            ben.vbltTestedHiv = vblts.vblt_tested_hiv;
            ben.status="1";
            ben.createdBy = localStorage.user;

            if (beneficiary === undefined) {
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
    
    const handleUpdate = () => {
        form.validateFields().then(async (values) => {
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

    const handleBeneficiaryModalVisible = (flag?: boolean) => {
        // form.resetFields();
        setBeneficiary(undefined);
        setBeneficiaryModalVisible(!!flag);
    };

    const handleModalVisible = (flag?: boolean) => {
        setModalVisible(!!flag);
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
            render: (val: string) => <span>{moment(val).format('YYYY-MM-DD')}</span>,
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
            render: (text, record)  => (<Text type="danger" >{record.nui}</Text>),
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
                value: '1',
                },
                {
                text: 'Feminino',
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
        { title: 'Idade', dataIndex: 'grade', key: 'grade'},
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
            render: (text, record)  => record.createdBy.username,
        },
        { title: 'Atualizado Por', dataIndex: '', key: 'updatedBy',
            render: (text, record)  => record.updatedBy?.username,
        },
        { title: 'Criado Em', dataIndex: 'dateCreated', key: 'dateCreated',
            render: (val: string) => <span>{moment(val).format('YYYY-MM-DD')}</span>,
        },
        {
          title: 'Action',
          dataIndex: '',
          key: 'x',
          render: (text, record) => (
            <Fragment>
              <Button type="primary" icon={<EyeOutlined />} onClick={()=>handleViewModalVisible(true, record)}>
              </Button>
            </Fragment>
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
                            Adicionar Novo Beneficiário
                          </Button>
                        </Space>
                    }
            >
                <Table
                    rowKey="id"
                    columns={columns}
                    expandable={{
                        expandedRowRender: record =>  <div style={{border:"2px solid #d9edf7", backgroundColor:"white"}}><ViewBenefiaryPanel beneficiary={record} columns={interventionColumns} /></div>,
                        rowExpandable: record => record.name !== 'Not Expandable',
                    }}
                    dataSource={beneficiaries}
                    bordered
                />
            </Card>
            <ViewBeneficiary 
                {...parentMethods}
                beneficiary={beneficiary} 
                modalVisible={modalVisible} />
                
            <FormBeneficiary form={form} modalVisible={beneficiaryModalVisible}
                                handleAdd={handleAdd}
                                handleUpdate={handleUpdate}
                                handleModalVisible={handleBeneficiaryModalVisible} />
        </>
    );
}

export default BeneficiariesList;