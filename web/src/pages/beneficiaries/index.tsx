import React, { Fragment, useEffect, useState } from 'react'
import { query } from '../../utils/beneficiary';
import classNames from "classnames";
import {matchSorter} from "match-sorter";
import { Badge, Button, Card, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import 'antd/dist/antd.css';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';


const BeneficiariesList: React.FC = () => {
    const [ beneficiaries, setBeneficiaries ] = useState<any[]>([]);
    const [ searchText, setSearchText ] = useState('');
    const [ searchedColumn, setSearchedColumn ] = useState('');
    let searchInput ;
    useEffect(() => {
        const fetchData = async () => {
          const data = await query();
          setBeneficiaries(data);
        } 
    
        fetchData().catch(error => console.log(error));
    
    }, []);

    
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
        { title: 'PE', dataIndex: 'entryPoint', key: 'entryPoint' },
        { title: 'Distrito', dataIndex: 'neighborhood.locality.district.name', key: 'district' },
        { title: 'Idade', dataIndex: 'grade', key: 'grade' },
        { title: '#Interv', dataIndex: 'status', key: 'status' },
        { title: 'Criado Por', dataIndex: 'createdBy', key: 'createdBy' },
        { title: 'Actualizado Por', dataIndex: 'updatedBy', key: 'updatedBy' },
        { title: 'Criado Em', dataIndex: 'dateCreated', key: 'dateCreated',
            render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
          title: 'Action',
          dataIndex: '',
          key: 'x',
          render: (text, record) => (
            <Fragment>
              <Button type="primary" icon={<EditOutlined />}>
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
                        expandedRowRender: record => <p style={{ margin: 0 }}>{record.name}</p>,
                        rowExpandable: record => record.name !== 'Not Expandable',
                    }}
                    dataSource={beneficiaries}
                />
            </Card>
            
        </>
    );
}

export default BeneficiariesList;