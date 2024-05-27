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
  Row,
  Col,
  Select,
} from "antd";
import ptPT from "antd/lib/locale-provider/pt_PT";
import { UserModel, getEntryPoint } from "../../models/User";
import { SearchOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import UsersForm from "./components/UsersForm";
import { add, edit, queryByUserId } from "@app/utils/users";
import { Title } from "@app/components";
import LoadingModal from "@app/components/modal/LoadingModal";
import { useSelector } from "react-redux";
import { pagedQueryByFilters } from "@app/utils/users";
import { getUserParams } from "@app/models/Utils";
import { FilterObject } from "@app/models/FilterObject";

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

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const pageSize = 100;
  const [searchName, setSearchName] = useState<any>("");
  const [searchUsername, setSearchNui] = useState<any>("");
  const [searchDistrict, setSearchDistrict] = useState<any>("");
  const [searchUserCreator, setSearchUserCreator] = useState<any>("");
  const [district, setDistrict] = useState<any>();
  const [userCreator, setUserCreator] = useState<any>();
  const [name, setName] = useState<any>();
  const [username, setUsername] = useState<any>();
  const [districts, setDistricts] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);

  const profileSelector = useSelector(
    (state: any) => state?.profile.loadedProfiles
  );
  const partnerSelector = useSelector(
    (state: any) => state?.partner.loadedPartners
  );
  const usersSelector = useSelector((state: any) => state?.user.loadedUsers);
  const districtsSelector = useSelector(
    (state: any) => state?.district.loadedDistricts
  );
  const provincesSelector = useSelector(
    (state: any) => state.province.loadedProvinces
  );

  const convertedDistrictsData: FilterObject[] = districts?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  useEffect(() => {
    if (users?.length > 0) {
      setLoading(false);
    }
  }, [users]);

  let searchInput;

  useEffect(() => {
    setPartners(partnerSelector);
    setProfiles(profileSelector);
    const fetchData = async () => {
      const user = await queryByUserId(localStorage.user);
      const data = await pagedQueryByFilters(
        getUserParams(user),
        currentPageIndex,
        pageSize,
        searchName,
        searchUsername,
        searchUserCreator,
        searchDistrict
      );
      setUsers(data);
    };

    fetchData().catch((error) => console.log(error));

    const sortedDistricts = districtsSelector?.sort((dist1, dist2) =>
      dist1?.name.localeCompare(dist2.name)
    );
    const sortedCreators = usersSelector?.sort((dist1, dist2) =>
      dist1?.username.localeCompare(dist2.username)
    );
    const sortedProvinces = provincesSelector?.sort((prov1, prov2) =>
      prov1?.name.localeCompare(prov2.name)
    );

    setDistricts(sortedDistricts);
    setCreators(sortedCreators);
    setProvinces(sortedProvinces);
  }, [
    currentPageIndex,
    searchName,
    searchUsername,
    searchUserCreator,
    searchDistrict,
  ]);

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
    data?.map((item) => ({
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

  const handleAdd = (buttonRef: React.RefObject<HTMLButtonElement>) => {
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
          user.createdBy = localStorage.user;
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
          user.updatedBy = localStorage.user;
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
        if (buttonRef.current) {
          buttonRef.current.disabled = false;
        }
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
      filters: filterObjects(provinces)((i) => i.name),
      onFilter: (value, record) =>
        record.provinces.map((p) => p.name).includes(value),
      filterSearch: true,
    },
    {
      title: "Distritos",
      dataIndex: "",
      key: "districts",
      render: (text, record) => record.districts.map((d) => d.name + ", "),
      filters: filterObjects(districts)((i) => i?.name),
      onFilter: (value, record) =>
        record?.districts.map((d) => d.name).includes(value),
      filterSearch: true,
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

  const handleGlobalSearch = async () => {
    if (name !== undefined) {
      setSearchName(name);
    }
    if (username !== undefined) {
      setSearchNui(username);
    }
    if (userCreator !== undefined) {
      setSearchUserCreator(userCreator);
    }
    if (district !== undefined) {
      setSearchDistrict(district);
    }
  };

  const loadPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const loadNextPage = () => {
    setCurrentPageIndex(currentPageIndex + 1);
  };

  function onClear(name) {
    if (name === "userCreator") {
      setUserCreator(undefined);
      setSearchUserCreator("");
    }
    if (name === "district") {
      setDistrict(undefined);
      setSearchDistrict("");
    }
  }

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
        <Row gutter={16}>
          <Col className="gutter-row">
            <Form.Item name="name" label="" initialValue={name}>
              <Input
                placeholder="Pesquisar por nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row">
            <Form.Item name="username" label="" initialValue={username}>
              <Input
                placeholder="Pesquisar por Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col className="gutter-row">
            <Select
              showSearch
              allowClear
              onClear={() => onClear("district")}
              placeholder="Selecione o distrito"
              optionFilterProp="children"
              onChange={(e) => setDistrict(e)}
              onSearch={() => {
                /**Its OK */
              }}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={convertedDistrictsData}
            />
          </Col>

          <Col className="gutter-row" span={12}>
            <Button type="primary" onClick={handleGlobalSearch}>
              Pesquisar
            </Button>
          </Col>
        </Row>
        <ConfigProvider locale={ptPT}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={users}
            bordered
            scroll={{ x: 1500 }}
          />
          <Space>
            <Button
              disabled={currentPageIndex === 0}
              onClick={loadPreviousPage}
              size="small"
              style={{ width: 90 }}
            >
              {"<<"} {pageSize}
            </Button>
            <Button onClick={loadNextPage} size="small" style={{ width: 90 }}>
              {pageSize} {">>"}
            </Button>
          </Space>
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
