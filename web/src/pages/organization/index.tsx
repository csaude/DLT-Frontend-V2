import React, { useEffect, useState } from "react";
import { Title } from "@app/components";
import { add, edit, allOrganization } from "@app/utils/organization";
import { allProvinces } from "@app/utils/locality";
import { Badge, Button, Card, Form, Input, message, Space, Table, Typography } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import OrganizationForm from "./components/OrganizationForm";
import { allDistrict } from "@app/utils/district";

const OrganizationList: React.FC = () => {

    const [organizations, setOrganizations] = useState<any[]>([]);    
    const [district, setDistrict] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [organizationModalVisible, setOrganizationModalVisible] = useState<boolean>(false);
    const [selectedOrganization, setSelectedOrganization] = useState<any>(undefined);
    const [form] = Form.useForm();

    let searchInput;
    useEffect(() => {
        const fetchData = async () => {
            const organizations = await allOrganization();
            const sortedOrganizations = organizations.sort((ser1, ser2) => ser2.code - ser1.code);
            const districts = await allDistrict()

            setOrganizations(sortedOrganizations);
            setDistrict(districts)           
        }

        fetchData().catch(error => console.log(error));
    }, []);

    const organizationSort = (data: any) => {
        const orgs = ([...organizations, data]);
        const sortedOrganizations = (orgs).sort((ser1, ser2) => ser2.code - ser1.code);

        setOrganizations(sortedOrganizations);
    }

    const handleOrganizationModalVisible = (flag?: boolean) => {
        form.resetFields();
        setSelectedOrganization(undefined);
        setOrganizationModalVisible(!!flag);
    };

    const onEditOrganization = (record: any) => {
        form.resetFields();
        setSelectedOrganization(record)
        setOrganizationModalVisible(true);
    };

    const handleAdd = () => {
        form.validateFields().then(async (values) => {
            const organization: any = selectedOrganization ? selectedOrganization : {};

            organization.name = values.name;
            organization.abbreviation = values.abbreviation;
            organization.description = values.description;
            organization.partnerType = values.partnerType;
            organization.logo = values.logo
            organization.status = values.status;
            organization.district = {id: values.district};

            if (selectedOrganization === undefined) {

                organization.status = 1;
                organization.createdBy = localStorage.user;

                const result = organizations.some(organizations => organizations.name.replace(/ /g, '').toLowerCase() === values.name.replace(/ /g, '').toLowerCase());
                if (result){

                    message.error({
                        content: ' Organização repetida.', className: 'custom-class',
                        style: {
                            marginTop: '10vh',
                        }
                    })

                }else{
                    const { data } = await add(organization);
                    organizationSort(data);
    
                    message.success({
                        content: 'Registado com Sucesso!', className: 'custom-class',
                        style: {
                            marginTop: '10vh',
                        }
                    });
                    handleOrganizationModalVisible(false);
                }
            } else {
                organization.updatedBy = localStorage.user;
                
                const { data } = await edit(organization);
                setOrganizations(existingItems => {
                    return existingItems.map((item, j) => {
                        return item.id === selectedOrganization.id ? data : item;
                    })
                });

                message.success({
                    content: 'Actualizado com Sucesso!', className: 'custom-class',
                    style: {
                        marginTop: '10vh',
                    }
                });
                handleOrganizationModalVisible(false);
            }
        }).catch(error => {
            const errSt = JSON.stringify(error);
            const errObj = JSON.parse(errSt);
            console.log(error);
            message.error({
                content: 'Não foi possível Registar o Organização', className: 'custom-class',
                style: {
                    marginTop: '10vh',
                }
            })
        })
    };

    const filterItem = data => formatter => data.map( item => ({
        text: formatter(item),
        value: formatter(item)
    }));

    const getColumnSearchProps = (dataIndex: any) => ({
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
                    <Button onClick={() => handleReset(clearFilters, selectedKeys, confirm, dataIndex)} size="small" style={{ width: 90 }}>
                        Limpar
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
            ) : (value),
    });

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

    const columns = [        
        {
            title: "Nome do Organização",
            dataIndex: 'name',
            key: 'type',
            ...getColumnSearchProps('name'),
            render: (text, record) => record?.name
        },
        {
            title: "Abreviação",
            dataIndex: 'abbreviation',
            key: 'type',
            ...getColumnSearchProps('abbreviation'),
            render: (text, record) => record?.abbreviation
        },
        {
            title: "Descrição",
            dataIndex: 'desctiption',
            key: 'type',
            ...getColumnSearchProps('description'),
            render: (text, record) => record?.description
        },
        {
            title: "Distrito",
            dataIndex: 'name',
            key: 'type',
            render: (text, record) => record?.district?.name,
            filters: filterItem(district)(i => i.name),
            onFilter: (value, record) => record?.district?.name == value,
            filterSearch: true,
        },
        {
            title: "Estado",
            dataIndex: 'status',
            key: 'type',
            render: (text, record) => (

                <Badge
                    className="site-badge-count-190"
                    count={record.status == 1 ? 'Activo' : 'Inactivo'}
                    style={record.status == 1 ? { backgroundColor: '#52c41a' } :
                        { backgroundColor: '#f5222d' }
                    }
                />
            ),
            filters: [
                {
                    text: 'Activo',
                    value: 1,
                },
                {
                    text: 'Inactivo',
                    value: 0,
                },
            ],
            onFilter: (value, record) => record?.status == value,
            filterSearch: true
        },
        {
            title: 'Acção',
            dataIndex: '',
            key: 'x',
            render: (text, record) => (
                <Space>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => onEditOrganization(record)} />
                </Space>
            )
        }
    ]

    return (
        <>
            <Title />
            <Card title="Lista de Organizações" bordered={false} headStyle={{ color: "#17a2b8" }}
                extra={
                    <Space>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOrganizationModalVisible(true)}>
                            Adicionar Organização
                        </Button>
                    </Space>
                }
            >
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={organizations}
                    bordered
                >

                </Table>
            </Card>
            <OrganizationForm form={form} organization={selectedOrganization} modalVisible={organizationModalVisible} handleModalVisible={handleOrganizationModalVisible} handleAdd={handleAdd} />
        </>
    );
}

export default OrganizationList;