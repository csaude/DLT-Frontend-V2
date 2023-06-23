import React, { useEffect, useState } from "react";
import { Title } from "@app/components";
import { add, edit, queryAll } from "@app/utils/service";
import { Badge, Button, Card, ConfigProvider, Form, Input, message, Space, Table, Typography } from "antd";
import ptPT  from 'antd/lib/locale-provider/pt_PT';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ServiceForm from "./components/ServiceForm";

const { Text } = Typography;

const ServicesList: React.FC = () => {

    const [ services, setServices ] = useState<any[]>([]);
    const [ searchText, setSearchText ] = useState('');
    const [ searchedColumn, setSearchedColumn ] = useState('');
    const [ serviceModalVisible, setServiceModalVisible ] = useState<boolean>(false);
    const [ selectedService, setSelectedService ] = useState<any>(undefined);
    const [ form ] = Form.useForm();

    let searchInput;
    useEffect(() => {
        const fetchData = async () => {
            const services = await queryAll();
            const sortedServices = services.sort((ser1, ser2) => ser1.serviceType - ser2.serviceType);
            setServices(sortedServices);
        }

        fetchData().catch(error => console.log(error));
    }, []);

    const handleServiceModalVisible = (flag?: boolean) => {
        form.resetFields();
        setSelectedService(undefined);
        setServiceModalVisible(!!flag);
    };

    const onEditService = (record: any) => {
        form.resetFields();
        setSelectedService(record)
        setServiceModalVisible(true);
    };

    const filterItem = data => formatter => data.map( item => ({
        text: formatter(item),
        value: formatter(item)
    }));

    const handleAdd = () => {
        form.validateFields().then(async (values) => {
            const service: any = selectedService ? selectedService : {};

            service.serviceType = values.serviceType;
            service.name = values.name;
            service.description = values.description;
            service.ageBands = values.ageBands.toString();
            
            if (selectedService === undefined) {
                service.createdBy = localStorage.user;
                service.status = 1;

                const result = services.some(services => services.name.replace(/\s+/g, '').toLowerCase() === values.name.replace(/\s+/g, '').toLowerCase());
                if (result){

                    message.error({
                        content: ' Serviço repetido.', className: 'custom-class',
                        style: {
                            marginTop: '10vh',
                        }
                    })

                }else{

                    const { data } = await add(service);
                    setServices(services => [...services, data]);
    
                    message.success({
                        content: 'Registado com Sucesso!', className: 'custom-class',
                        style: {
                            marginTop: '10vh',
                        }
                    });
                    handleServiceModalVisible(false);
                }
            } else {
                service.updatedBy = localStorage.user;
                service.status = values.status;
                const { data } = await edit(service);
                setServices(existingItems => {
                    return existingItems.map((item, j) => {
                        return item.id === selectedService.id ? data : item;
                    })
                });

                message.success({
                    content: 'Actualizado com Sucesso!', className: 'custom-class',
                    style: {
                        marginTop: '10vh',
                    }
                });
                handleServiceModalVisible(false);
            }
        }).catch(error => {
            const errSt = JSON.stringify(error);
            const errObj = JSON.parse(errSt);
            message.error({
                content: 'Não foi possível Registar o Serviço', className: 'custom-class',
                style: {
                    marginTop: '10vh',
                }
            })
        })
    };

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
            ) : ( value),            
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

    const columns = [
        {
            title: "Tipo de Serviço",
            dataIndex:'serviceType',
            key: 'type',
            render: (text, record) => 
            (record?.serviceType == 1) ?
                <Text>Clínico</Text>
            :
                <Text>Comunitário</Text>,
            filters: [
                {
                    text: 'Clínico',
                    value: 1,
                },
                {
                    text: 'Comunitário',
                    value: 2,
                },
            ],
            onFilter: (value, record) => record.serviceType == value,
            filterSearch: true,
        },
        {
            title: "Serviço",
            dataIndex:'name',
            key: 'type',
            ...getColumnSearchProps('name'),
            render: (text, record) => record?.name
        },
        {
            title: "Descrição",
            dataIndex:'descriptin',
            key: 'type',
            render: (text, record) => record?.description
        },
        {
            title: "Faixas Etárias",
            dataIndex:'ageBands',
            key: 'type',
            render: (text, record) => record?.ageBands,
        },
        {
            title: "Estado",
            dataIndex:'status',
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
                    <Button type="primary" icon={<EditOutlined />} onClick={() => onEditService(record)} />
                </Space>
            )
        }
    ]
    
    return (
        <>
            <Title />
            <Card title="Lista de Serviços DREAMS" bordered={false} headStyle={{color:"#17a2b8"}}
                extra={
                    <Space>
                        <Button type="primary" icon={<PlusOutlined />} onClick = {() => handleServiceModalVisible(true)}>
                            Adicionar Serviço
                        </Button>
                    </Space>
                }
            >
                <ConfigProvider locale={ptPT}>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={services}
                        bordered
                    />
                </ConfigProvider>
            </Card>
            <ServiceForm form={form} service={selectedService} modalVisible={serviceModalVisible} handleModalVisible={handleServiceModalVisible} handleAdd={handleAdd} />
        </>
    );
}

export default ServicesList;