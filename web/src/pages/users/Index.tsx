import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  message,
  Button,
  Space,
  Badge,
  Form,
  Input,
  ConfigProvider,
} from "antd";
import ptPT from "antd/lib/locale-provider/pt_PT";
import { query } from "../../utils/users";
import { allPartners } from "@app/utils/partners";
import { allProfiles } from "@app/utils/profiles";
import { UserModel, getEntryPoint } from "../../models/User";
import { SearchOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import UsersForm from "./components/UsersForm";
import { add, edit } from "@app/utils/users";
import { Title } from "@app/components";
import LoadingModal from "@app/components/modal/LoadingModal";

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [usersModalVisible, setUsersModalVisible] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(undefined);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [form] = Form.useForm();

  const [partners, setPartners] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (users.length > 0) {
      setLoading(false);
    }
  }, [users]);

  let searchInput;

  useEffect(() => {
    const fetchData = async () => {
      const data = await query();
      const partners = await allPartners();
      const profiles = await allProfiles();
      setUsers(data);
      setPartners(partners);
      setProfiles(profiles);
    };

    fetchData().catch((error) => console.log(error));
  }, []);

  const handleUsersModalVisible = (flag?: boolean) => {
    form.resetFields();
    setSelectedUser(undefined);
    setUsersModalVisible(!!flag);
  };

  const onEditUser = (record: any) => {
    form.resetFields();
    setUsersModalVisible(true);
    setSelectedUser(record);
  };

  const filterObjects = (data) => (formatter) =>
    data.map((item) => ({
      text: formatter(item),
      value: formatter(item),
    }));

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
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
          <Button
            onClick={() =>
              handleReset(clearFilters, selectedKeys, confirm, dataIndex)
            }
            size="small"
            style={{ width: 90 }}
          >
            Limpar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? value
            .toLowerCase()
            .split(" ")
            .every((item) =>
              (dataIndex == "name"
                ? record[dataIndex] + " " + record["surname"]
                : record[dataIndex]
              )
                .toString()
                .toLowerCase()
                .includes(item)
            )
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, selectedKeys, confirm, dataIndex) => {
    clearFilters();
    setSearchText(searchText);
    handleSearch(selectedKeys, confirm, dataIndex);
  };

  const getMessage = (status) => {
    if (status == 403) {
      return "O username informado já existe no sistema, por favor escolha um username diferente";
    } else {
      return "Corrija os erros apresentados antes de avançar!";
    }
  };

  const handleAdd = () => {
    form
      .validateFields()
      .then(async (values) => {
        const user: any = selectedUser ? selectedUser : {};

        const provinces =
          values.provinces === undefined
            ? []
            : Array.isArray(values.provinces)
            ? values.provinces
            : [values.provinces];
        const districts =
          values.districts === undefined
            ? []
            : Array.isArray(values.districts)
            ? values.districts
            : [values.districts];
        const localities =
          values.localities === undefined
            ? []
            : Array.isArray(values.localities)
            ? values.localities
            : [values.localities];

        user.surname = values.surname;
        user.name = values.name;
        user.phoneNumber = values.phoneNumber;
        user.phoneNumber2 = values.phoneNumber2;
        user.email = values.email;
        user.username = values.username;
        user.entryPoint = values.entryPoint;
        user.status = values.status;
        user.partners = { id: values.partners };
        user.profiles = { id: values.profiles };
        user.provinces = provinces?.map((item) => ({ id: item }));
        user.districts = districts?.map((item) => ({ id: item }));
        user.localities = localities?.map((item) => ({ id: item }));
        user.us = values.us?.map((item) => ({ id: item }));

        if (selectedUser === undefined) {
          const { data } = await add(user);
          setUsers((users) => [...users, data]);

          message.success({
            content: "Registado com Sucesso!",
            className: "custom-class",
            style: {
              marginTop: "10vh",
            },
          });
        } else {
          const { data } = await edit(user);
          setUsers((existingItems) => {
            return existingItems.map((item) => {
              return item.id === selectedUser.id ? data : item;
            });
          });

          message.success({
            content: "Actualizado com  Sucesso!",
            className: "custom-class",
            style: {
              marginTop: "10vh",
            },
          });
        }

        handleUsersModalVisible(false);
      })
      .catch((error) => {
        const errSt = JSON.stringify(error);
        const errObj = JSON.parse(errSt);
        message.error({
          content: getMessage(errObj.status),
          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });
      });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "",
      key: "order",
      render: (text, record) => users.indexOf(record) + 1,
    },
    {
      title: "Nome do Utilizador",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      render: (text, record) => (
        <div>
          {record.name} {record.surname}
        </div>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      ...getColumnSearchProps("username"),
    },
    {
      title: "Perfil",
      dataIndex: "",
      key: "type",
      render: (text, record) => record.profiles.description,
      filters: filterObjects(profiles)((i) => i.description),
      onFilter: (value, record) => record.profiles.description == value,
      filterSearch: true,
    },
    {
      title: "Províncias",
      dataIndex: "",
      key: "provinces",
      render: (text, record) => record.provinces.map((p) => p.name + ", "),
      // filters: filterObjects(provinces)(i => i.name),
      // onFilter: (value, record) => record.provinces.map(p => p.name+' ').includes(value),
      // filterSearch: true,
    },
    {
      title: "Distritos",
      dataIndex: "",
      key: "districts",
      render: (text, record) => record.districts.map((d) => d.name + ", "),
    },
    {
      title: "Postos Administrativos",
      dataIndex: "",
      key: "localities",
      render: (text, record) => record.localities.map((l) => l.name + ", "),
    },
    {
      title: "Locais",
      dataIndex: "",
      key: "us",
      render: (text, record) => record.us.map((u) => u.name + " "),
    },
    {
      title: "Ponto de Entrada",
      dataIndex: "record.entryPoint",
      key: "record.entryPoint",
      filters: [
        {
          text: "US",
          value: 1,
        },
        {
          text: "CM",
          value: 2,
        },
        {
          text: "ES",
          value: 3,
        },
      ],
      onFilter: (value, record) => record.entryPoint == value,
      filterSearch: true,
      render: (text, record) => getEntryPoint(record.entryPoint),
    },
    {
      title: "Organização",
      dataIndex: "",
      key: "type",
      render: (text, record) => record.partners?.name,
      filters: filterObjects(partners)((i) => i.name),
      onFilter: (value, record) => record.partners?.name == value,
      filterSearch: true,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Telefone", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Estado",
      dataIndex: "",
      key: "status",
      filters: [
        {
          text: "Inactivo",
          value: 0,
        },
        {
          text: "Activo",
          value: 1,
        },
      ],
      onFilter: (value, record) => record.status == value,
      render: (text, record) => (
        <Badge
          className="site-badge-count-109"
          count={record.status == 1 ? "Activo" : "Inactivo"}
          style={
            record.status == 1
              ? { backgroundColor: "#52c41a" }
              : { backgroundColor: "#f5222d" }
          }
        />
      ),
    },
    {
      title: "Acção",
      dataIndex: "",
      key: "x",
      render: (text, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEditUser(record)}
          ></Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title />
      <Card
        title="Lista de Utilizadores"
        bordered={false}
        headStyle={{ color: "#17a2b8" }}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleUsersModalVisible(true)}
            >
              Adicionar Utilizador
            </Button>
          </Space>
        }
      >
        <ConfigProvider locale={ptPT}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={users}
            bordered
            scroll={{ x: 1500 }}
          />
        </ConfigProvider>

        {<LoadingModal modalVisible={loading} />}
      </Card>
      <UsersForm
        form={form}
        user={selectedUser}
        modalVisible={usersModalVisible}
        handleModalVisible={handleUsersModalVisible}
        handleAdd={handleAdd}
      />
    </>
  );
};
export default UsersList;
