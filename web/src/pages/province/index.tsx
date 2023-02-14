import React, { useEffect, useState } from "react";
import { Title } from "@app/components";
import { add, edit, queryAll } from "@app/utils/province";
import { Badge, Button, Card, Form, Input, message, Space, Table, Typography } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ProvinceForm from "./components/ProvinceForm";

const ProvinceList: React.FC = () => {

    const [provinces, setProvinces] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [provincesModalVisible, setProvincesModalVisible] = useState<boolean>(false);
    const [selectedProvince, setSelectedProvincia] = useState<any>(undefined);
    const [form] = Form.useForm();

    let searchInput;
    useEffect(() => {
        const fetchData = async () => {
            const provinces = await queryAll();
            const sortedProvinces = provinces.sort((ser1, ser2) => ser2.code - ser1.code);
            setProvinces(sortedProvinces);
        }

        fetchData().catch(error => console.log(error));
    }, []);

    const handleProvinceModalVisible = (flag?: boolean) => {
        form.resetFields();
        setSelectedProvincia(undefined);
        setProvincesModalVisible(!!flag);
    };

    const onEditProvincia = (record: any) => {
        form.resetFields();
        setSelectedProvincia(record)
        setProvincesModalVisible(true);
    };

    const handleAdd = () => {
        form.validateFields().then(async (values) => {
            const province: any = selectedProvince ? selectedProvince : {};

            province.name = values.name;
            province.code = values.code;

            if (selectedProvince === undefined) {
                province.createdBy = localStorage.user;
                province.status = 1;
                const { data } = await add(province);
                setProvinces(provinces => [...provinces, data]);

                message.success({
                    content: 'Registado com Sucesso!', className: 'custom-class',
                    style: {
                        marginTop: '10vh',
                    }
                });
            } else {
                province.updatedBy = localStorage.user;
                province.status = values.status;
                console.log(province);
                const { data } = await edit(province);
                setProvinces(existingItems => {
                    return existingItems.map((item, j) => {
                        return item.id === selectedProvince.id ? data : item;
                    })
                });

                message.success({
                    content: 'Actualizado com Sucesso!', className: 'custom-class',
                    style: {
                        marginTop: '10vh',
                    }
                });
            }
            handleProvinceModalVisible(false);
        }).catch(error => {
            const errSt = JSON.stringify(error);
            const errObj = JSON.parse(errSt);
            message.error({
                content: 'Não foi possível Registar a Província', className: 'custom-class',
                style: {
                    marginTop: '10vh',
                }
            })
        })
    };

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
            title: "Codigo",
            dataIndex: 'serviceType',
            key: 'type',
            render: (text, record) =>
                (record?.code)
        },
        {
            title: "Nome da Província",
            dataIndex: 'name',
            key: 'type',
            ...getColumnSearchProps('name'),
            render: (text, record) => record?.name
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
                    <Button type="primary" icon={<EditOutlined />} onClick={() => onEditProvincia(record)} />
                </Space>
            )
        }
    ]

    return (
        <>
            <Title />
            <Card title="Lista de Províncias" bordered={false} headStyle={{ color: "#17a2b8" }}
                // extra={
                //     <Space>
                //         <Button type="primary" icon={<PlusOutlined />} onClick={() => handleProvinceModalVisible(true)}>
                //             Adicionar Província
                //         </Button>
                //     </Space>
                // }
            >
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={provinces}
                    bordered
                >

                </Table>
            </Card>
            <ProvinceForm form={form} province={selectedProvince} modalVisible={provincesModalVisible} handleModalVisible={handleProvinceModalVisible} handleAdd={handleAdd} />
        </>
    );
}

export default ProvinceList;