import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Form,
  Input,
  ConfigProvider,
  Row,
  Col,
  Select,
} from "antd";
import ptPT from "antd/lib/locale-provider/pt_PT";
import { UserModel, getEntryPoint } from "../../models/User";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { getPagedUsersLastSync, queryByUserId } from "@app/utils/users";
import { Title } from "@app/components";
import LoadingModal from "@app/components/modal/LoadingModal";
import { useSelector } from "react-redux";
import { getUserParams } from "@app/models/Utils";
import { FilterObject } from "@app/models/FilterObject";
import moment from "moment";

const UsersLastSync: React.FC = () => {
  const [usersLastSync, setUsersLastSync] = useState<UserModel[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [partners, setPartners] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const pageSize = 100;
  const [searchUsername, setSearchNui] = useState<any>("");
  const [searchDistrict, setSearchDistrict] = useState<any>("");
  const [searchUserCreator, setSearchUserCreator] = useState<any>("");
  const [district, setDistrict] = useState<any>();
  const [userCreator, setUserCreator] = useState<any>();
  const [username, setUsername] = useState<any>();
  const [districts, setDistricts] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);

  const profileSelector = useSelector(
    (state: any) => state?.profile.loadedProfiles
  );
  const partnerSelector = useSelector(
    (state: any) => state?.partner.loadedPartners
  );
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
    if (usersLastSync?.length > 0) {
      setLoading(false);
    }
  }, [usersLastSync]);

  let searchInput;

  useEffect(() => {
    setPartners(partnerSelector);
    setProfiles(profileSelector);
    const fetchData = async () => {
      const user = await queryByUserId(localStorage.user);
      const data = await getPagedUsersLastSync(
        getUserParams(user),
        currentPageIndex,
        pageSize,
        searchUsername,
        searchUserCreator,
        searchDistrict
      );
      setUsersLastSync(data);
    };

    fetchData().catch((error) => console.log(error));

    const sortedDistricts = districtsSelector?.sort((dist1, dist2) =>
      dist1?.name.localeCompare(dist2.name)
    );
    const sortedProvinces = provincesSelector?.sort((prov1, prov2) =>
      prov1?.name.localeCompare(prov2.name)
    );

    setDistricts(sortedDistricts);
    setProvinces(sortedProvinces);
  }, [currentPageIndex, searchUsername, searchUserCreator, searchDistrict]);

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

  const columns = [
    {
      title: "#",
      dataIndex: "",
      key: "order",
      render: (text, record) => usersLastSync.indexOf(record) + 1,
    },
    {
      title: "Nome do Utilizador",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      render: (text, record) => (
        <div>
          {record.user?.name} {record.user?.surname}
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
      render: (text, record) => record.user?.profiles.description,
      filters: filterObjects(profiles)((i) => i.description),
      onFilter: (value, record) => record.user?.profiles.description == value,
      filterSearch: true,
    },
    {
      title: "Províncias",
      dataIndex: "",
      key: "provinces",
      render: (text, record) =>
        record.user?.provinces.map((p) => p.name + ", "),
      filters: filterObjects(provinces)((i) => i.name),
      onFilter: (value, record) =>
        record.user?.provinces.map((p) => p.name).includes(value),
      filterSearch: true,
    },
    {
      title: "Distritos",
      dataIndex: "",
      key: "districts",
      render: (text, record) =>
        record.user?.districts.map((d) => d.name + ", "),
      filters: filterObjects(districts)((i) => i?.name),
      onFilter: (value, record) =>
        record?.user?.districts.map((d) => d.name).includes(value),
      filterSearch: true,
    },
    {
      title: "Postos Administrativos",
      dataIndex: "",
      key: "localities",
      render: (text, record) =>
        record.user?.localities.map((l) => l.name + ", "),
    },
    {
      title: "Locais",
      dataIndex: "",
      key: "us",
      render: (text, record) => record.user?.us.map((u) => u.name + " "),
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
      onFilter: (value, record) => record.user?.entryPoint == value,
      filterSearch: true,
      render: (text, record) => getEntryPoint(record.user?.entryPoint),
    },
    {
      title: "Organização",
      dataIndex: "",
      key: "type",
      render: (text, record) => record.user?.partners?.name,
      filters: filterObjects(partners)((i) => i.name),
      onFilter: (value, record) => record.user?.partners?.name == value,
      filterSearch: true,
    },
    {
      title: "Ultima Sincronização",
      dataIndex: "",
      key: "type",
      render: (text, record) =>
        moment(record.lastSyncDate).format("YYYY-MM-DD HH:mm"),
    },
  ];

  const handleGlobalSearch = async () => {
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
        title="Relatório de Sincronização - Utilizadores Móveis"
        bordered={false}
        headStyle={{ color: "#17a2b8" }}
      >
        <Row gutter={16}>
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
            dataSource={usersLastSync}
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
    </>
  );
};
export default UsersLastSync;
