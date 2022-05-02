import React, { Fragment, useEffect, useState } from 'react'
import { query } from '../../utils/beneficiary';
import classNames from "classnames";
import {matchSorter} from "match-sorter";
import { Badge, Button, Card, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import 'antd/dist/antd.css';
import { SearchOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import ViewBeneficiary, { ViewBenefiaryPanel } from './components/View';
import { getEntryPoint } from '@app/models/User';


const BeneficiariesList: React.FC = () => {
    const [ beneficiaries, setBeneficiaries ] = useState<any[]>([]);
    const [ searchText, setSearchText ] = useState('');
    const [ searchedColumn, setSearchedColumn ] = useState('');
    const [ beneficiary, setBeneficiary] = useState();
    const [ modalVisible, setModalVisible] = useState<boolean>(false);


    let searchInput ;
    useEffect(() => {
        const fetchData = async () => {
          const data = await query();
          setBeneficiaries(data);
        } 
    
        fetchData().catch(error => console.log(error));
    
    }, []);

    const handleAdd = (record:any) => {
        console.log(record);
    }

    const handleViewModalVisible = (flag?: boolean, record?: any) => {
        console.log(record.interventions);
        setBeneficiary(record);
        setModalVisible(!!flag);
        
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
            render: (text, record)  => record.subService.service.name,
        },
        { title: 'Intervenções', 
            dataIndex: '', 
            key: 'intervention',
            render: (text, record)  => record.subService.name,
        },
        { title: 'Ponto de Entrada', 
            dataIndex: '', 
            key: 'entryPoint',
            render: (text, record)  => getEntryPoint(record.entryPoint),
        }
    ];

    const columns = [
        { title: 'Código do Beneficiário', dataIndex: 'nui', key: 'nui', ...getColumnSearchProps('nui')},
        { title: 'Nome do Beneficiário', dataIndex: 'name', key: 'name' },
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
                        ? 'M'
                        : 'F'
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
        { title: '#Interv', dataIndex: 'status', key: 'status' },
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
              <Button type="primary" icon={<EditOutlined />} onClick={()=>handleViewModalVisible(true, record)}>
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
            <Card title="Lista de Adolescentes e Jovens" bordered={false} headStyle={{color:"#17a2b8"}}>
                <Table
                    rowKey="id"
                    columns={columns}
                    expandable={{
                        expandedRowRender: record =>  <div style={{border:"2px solid #d9edf7", backgroundColor:"white"}}><ViewBenefiaryPanel beneficiary={record} columns={interventionColumns} /></div>,
                        rowExpandable: record => record.name !== 'Not Expandable',
                    }}
                    dataSource={beneficiaries}
                />
            </Card>
            <ViewBeneficiary 
                {...parentMethods}
                beneficiary={beneficiary} 
                modalVisible={modalVisible} />
        </>
    );
}

export default BeneficiariesList;