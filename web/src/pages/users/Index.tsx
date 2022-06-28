import { Card, Table, message, Button, Space, Badge, Form, Input } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { query } from '../../utils/users';
import { UserModel } from '../../models/User';
import { SearchOutlined, PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import UsersForm from './components/UsersForm';
import { add, edit } from '@app/utils/users';


const UsersList: React.FC = () => {
    const [users, setUsers] = useState<UserModel[]>([]);
    const [usersModalVisible, setUsersModalVisible] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<any>(undefined);
    const [ searchText, setSearchText ] = useState('');
    const [ searchedColumn, setSearchedColumn ] = useState('');
    const [form] = Form.useForm();

    let searchInput ;

    useEffect(() => {
        const fetchData = async () => {
            const data = await query();
            setUsers(data);
        }

        fetchData().catch(error => console.log(error));

    }, []);

    const handleUsersModalVisible = (flag?: boolean) => {
        form.resetFields();
        setSelectedUser(undefined);
        setUsersModalVisible(!!flag);
    };

    const onEditUser = (record: any) => {
        //console.log(record);
        form.resetFields();
        setUsersModalVisible(true);
        setSelectedUser(record);
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

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText(searchText);
    };

    const handleAdd = () => {

        form.validateFields().then(async (values) => {

            const user: any = selectedUser ? selectedUser : {};

            user.surname = values.surname;
            user.name = values.name;
            user.phoneNumber = values.phoneNumber;
            user.phoneNumber2 = values.phoneNumber2;
            user.email = values.email;
            user.username = values.username;
            user.entryPoint = values.entryPoint;
            user.status = values.status;
            user.partners = { "id": values.partners };
            user.profiles = { "id": values.profiles };
            user.us = { "id": values.us };
            user.provinces = values.provinces?.map(item => (
                { "id": item }
            ));
            user.districts = values.districts?.map(item => (
                { "id": item }
            ));
            user.localities = values.localities?.map(item => (
                { "id": item }
            ));

            const { data } = selectedUser ? await edit(user) : await add(user);

            if (selectedUser === undefined) {
                const { data } = await add(user);
                setUsers(users => [...users, data]);

            } else {
                const { data } = await edit(user);
                setUsers(existingItems => {
                    return existingItems.map((item, j) => {
                        return item.id === selectedUser.id ?
                            data : item
                    })
                });
            }

            handleUsersModalVisible(false);

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
                    content: 'Não foi possivel Registrar Utilizador!', className: 'custom-class',
                    style: {
                        marginTop: '10vh',
                    }
                });
            });


    }

    const columns = [
        { title: 'Nome de Utilizador', dataIndex: 'name', key: 'name' },
        { title: 'Username', dataIndex: 'username', key: 'username', ...getColumnSearchProps('username') },
        {
            title: 'Ponto de Entrada', dataIndex: '', key: 'type',
            render: (text, record) =>
                (record.entryPoint === "1") ?
                    "Unidade Sanitaria"
                    :
                    (record.entryPoint === "2") ?
                        "Escola"
                        :
                        "Comunidade"

        },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Parceiro', dataIndex: '', key: 'type',
            render: (text, record) => record.partners?.name,
        },
        {
            title: 'Tipo de Utilizador', dataIndex: '', key: 'type',
            render: (text, record) => record.profiles.description,
        },
        {
            title: 'Estado de Utilizador', dataIndex: '', key: 'status',
            render: (text, record) => (

                <Badge
                    className="site-badge-count-109"
                    count={record.status == 1 ? 'activo' : 'Inactivo'}
                    style={record.status == 1 ? { backgroundColor: '#52c41a' } :
                        { backgroundColor: '#f5222d' }
                    }
                />
            ),
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record) => (
                <Space>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => onEditUser(record)} >
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Card bordered={false} style={{ marginBottom: '10px', textAlign: "center", fontWeight: "bold", color: "#17a2b8" }} >
                SISTEMA INTEGRADO DE CADASTRO DE ADOLESCENTES E JOVENS
            </Card>
            <Card title="Lista de Utilizadores" bordered={false} headStyle={{ color: "#17a2b8" }}
                extra={
                    <Space>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleUsersModalVisible(true)}>
                            Adicionar Utilizador
                        </Button>
                    </Space>
                }
            >
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={users}
                    bordered
                />
            </Card>
            <UsersForm form={form} user={selectedUser} modalVisible={usersModalVisible} handleModalVisible={handleUsersModalVisible} handleAdd={handleAdd} />
        </>
    );
}
export default UsersList;