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
  Tag,
  TableProps,
} from "antd";
import ptPT from "antd/lib/locale-provider/pt_PT";
import { UserModel, getEntryPoint } from "../../models/User";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {
  getPagedUsersLastSync,
  queryByUserId,
  queryCountByFilters,
} from "@app/utils/users";
import { Title } from "@app/components";
import LoadingModal from "@app/components/modal/LoadingModal";
import { useSelector } from "react-redux";
import { getUserParams } from "@app/models/Utils";
import { FilterObject } from "@app/models/FilterObject";
import moment from "moment";
import { queryDistrictsByProvinces } from "@app/utils/locality";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

const UsersLastSync: React.FC = () => {
  const [usersLastSync, setUsersLastSync] = useState<UserModel[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [partners, setPartners] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCounter, setSearchCounter] = useState<any>();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [searchName, setSearchName] = useState<any>("");
  const [searchUsername, setSearchUsername] = useState<any>("");
  const [searchDistrict, setSearchDistrict] = useState<any>("");
  const [searchEntryPoint, setSearchEntryPoint] = useState<any>("");
  const [searchUserCreator, setSearchUserCreator] = useState<any>("");
  const [district, setDistrict] = useState<any>();
  const [entryPoint, setEntryPoint] = useState<any>();
  const [userCreator, setUserCreator] = useState<any>();
  const [name, setName] = useState<any>();
  const [username, setUsername] = useState<any>();
  const [districts, setDistricts] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [user, setUser] = useState<any>();
  const [filters, setFilters] = useState<any>(null);

  const pageSize = 100;

  const entryPoints = [
    {
      value: 1,
      label: "US",
    },
    {
      value: 2,
      label: "CM",
    },
    {
      value: 3,
      label: "ES",
    },
  ];

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
    const userId = localStorage.user;
    const fetchData = async () => {
      const user = await queryByUserId(userId);
      const data = await getPagedUsersLastSync(
        getUserParams(user),
        currentPageIndex,
        pageSize,
        searchName,
        searchUsername,
        searchUserCreator,
        searchDistrict,
        searchEntryPoint
      );

      const countByFilter = await queryCountByFilters(
        userId,
        searchName,
        searchUsername,
        searchUserCreator,
        searchDistrict,
        searchEntryPoint
      );
      setSearchCounter(countByFilter);
      setUser(user);

      const sortedData = data.sort((data1, data2) =>
        moment(data2.lastSyncDate)
          .format("YYYY-MM-DD HH:mm:ss")
          .localeCompare(
            moment(data1.lastSyncDate).format("YYYY-MM-DD HH:mm:ss")
          )
      );
      setUsersLastSync(sortedData);

      let districts;

      if (user && user.districts.length > 0) {
        const districtsIds = user?.districts.map((item) => {
          return item.id;
        });

        districts = districtsSelector.filter((d) =>
          districtsIds.includes(d.id)
        );
      } else if (user && user.provinces.length > 0) {
        const provincesIds = user?.provinces.map((item) => {
          return item.id + "";
        });

        const provincesDistricts = await queryDistrictsByProvinces({
          provinces: provincesIds,
        });

        const districtsIds = provincesDistricts.map((item) => {
          return item.id;
        });

        districts = districtsSelector.filter((d) =>
          districtsIds.includes(d.id)
        );
      } else {
        districts = districtsSelector;
      }

      const sortedDistricts = districts?.sort((dist1, dist2) =>
        dist1?.name.localeCompare(dist2.name)
      );
      const sortedProvinces = provincesSelector?.sort((prov1, prov2) =>
        prov1?.name.localeCompare(prov2.name)
      );

      setDistricts(sortedDistricts);
      setProvinces(sortedProvinces);
    };

    fetchData().catch((error) => console.log(error));
  }, [
    currentPageIndex,
    searchName,
    searchUsername,
    searchUserCreator,
    searchDistrict,
    searchEntryPoint,
  ]);

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
      filters: entryPoints,
      onFilter: (value, record) => record.user?.entryPoint == value,
      filterSearch: true,
      render: (text, record) => getEntryPoint(record.user?.entryPoint),
    },
    {
      title: "Organização",
      dataIndex: "",
      key: "record.user.partner.id",
      render: (text, record) => record.user?.partners?.name,
      filters: filterObjects(partners)((i) => i.name),
      onFilter: (value, record) => record.user?.partners?.name == value,
      filterSearch: true,
    },
    {
      title: "Versão do APK",
      dataIndex: "",
      key: "record.appVersion",
      render: (text, record) => record.appVersion,
    },
    {
      title: "Ultima Sincronização",
      dataIndex: "",
      key: "record.lastSyncDate",
      render: (text, record) =>
        moment(record.lastSyncDate).format("YYYY-MM-DD"),
    },
  ];

  const handleGlobalSearch = async () => {
    if (name !== undefined) {
      setSearchName(name);
    }
    if (username !== undefined) {
      setSearchUsername(username);
    }
    if (userCreator !== undefined) {
      setSearchUserCreator(userCreator);
    }
    if (district !== undefined) {
      setSearchDistrict(district);
    }
    if (entryPoint !== undefined) {
      setSearchEntryPoint(entryPoint);
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
    if (name === "entryPoint") {
      setEntryPoint(undefined);
      setSearchEntryPoint("");
    }
  }

  const ClickableTag = () => {
    return (
      <a onClick={handleExportXLS}>
        <Tag color={"geekblue"}>{"Exportar XLS"}</Tag>
      </a>
    );
  };

  const handleExportXLS = async () => {
    try {
      setLoading(true);
      const pageElements = 1000;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(
        "Lista_de_Adolescentes_e_Jovens_"
      );

      const headers = [
        "#",
        "Nome do Utilizador",
        "Username",
        "Perfil",
        "Províncias",
        "Distritos",
        "Postos Administrativos",
        "Locais",
        "Ponto de Entrada",
        "Organização",
        "Versão do APK",
        "Última Sincronização",
      ];

      const headerRow = worksheet.getRow(1);
      headers.forEach((header, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.value = header;
        cell.font = { bold: true };
      });

      const lastPage = Math.ceil(searchCounter / pageElements);

      let sequence = 1;

      for (let i = 0; i < lastPage; i++) {
        let data = await getPagedUsersLastSync(
          getUserParams(user),
          i,
          pageElements,
          searchName,
          searchUsername,
          searchUserCreator,
          searchDistrict,
          searchEntryPoint
        );

        if (filters) {
          if (filters.name != null) {
            data = data.filter((d) =>
              (d.name + " " + d.surname).match(filters.name)
            );
          }
          if (filters.username != null) {
            data = data.filter((d) => d.username.includes(filters.username[0]));
          }
          if (filters.profile != null) {
            data = data.filter((d) => filters.profile.includes(d.profile));
          }
          if (filters.province != null) {
            data = data.filter((d) => filters.province.includes(d.province));
          }
          if (filters.district != null) {
            data = data.filter((d) =>
              filters.district.includes(d.district.name)
            );
          }
          if (filters.entryPoint != null) {
            data = data.filter((d) =>
              filters.entryPoint.includes(d.entryPoint)
            );
          }
          if (filters.partner != null) {
            data = data.filter((d) =>
              filters.partner.includes(d.partners.name)
            );
          }
          if (filters.dateCreated != null) {
            data = data.filter((d) =>
              d.dateCreated.includes(filters.dateCreated)
            );
          }
        }

        const sortedUsers = data.sort((u1, u2) =>
          moment(u2.dateCreated)
            .format("YYYY-MM-DD HH:mm:ss")
            .localeCompare(moment(u1.dateCreated).format("YYYY-MM-DD HH:mm:ss"))
        );

        if (sortedUsers.length === 0) {
          break;
        }

        sortedUsers.forEach((record) => {
          const values = [
            sequence,
            record.user.name + " " + record.user.surname,
            record.username,
            record.user.profiles.description,
            record.user.provinces.map((p) => p.name + ", ").toString(),
            record.user.districts.map((d) => d.name + ", ").toString(),
            record.user.localities.map((l) => l.name + ", ").toString(),
            record.user.us.map((u) => u.name + ", ").toString(),
            record.user.entryPoint === "1"
              ? "US"
              : record.user.entryPoint === "2"
              ? "CM"
              : "ES",
            record.user.partners?.name,
            record.appVersion,
            moment(record.lastSyncDate).format("YYYY-MM-DD"),
          ];
          sequence++;
          worksheet.addRow(values);
        });
      }

      const created = moment().format("YYYYMMDD_hhmmss");
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `Relatorio_Suncronizacao_${created}.xlsx`);

      setLoading(false);
    } catch (error) {
      // Handle any errors that occur during report generation
      console.error("Error generating XLSX report:", error);
      setLoading(false);
      // Display an error message using your preferred method (e.g., toast.error)
      toast.error("An error occurred during report generation.");
    }
  };

  const handleChange: TableProps<any>["onChange"] = (
    pagination,
    _filters,
    _sorter,
    extra
  ) => {
    setFilters(_filters);
  };

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
                id="username-input"
                placeholder="Pesquisar por Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col className="gutter-row">
            <Select
              id="entryPoint-selection"
              showSearch
              allowClear
              onClear={() => onClear("entryPoint")}
              placeholder="Selecione o PE"
              optionFilterProp="children"
              onChange={(e) => setEntryPoint(e)}
              onSearch={() => {
                /**Its OK */
              }}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={entryPoints}
            />
          </Col>

          <Col className="gutter-row">
            <Select
              id="district-selection"
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
            <Button
              id="search-buttpn"
              type="primary"
              onClick={handleGlobalSearch}
            >
              Pesquisar
            </Button>
          </Col>
        </Row>
        <ConfigProvider locale={ptPT}>
          <Table
            id="usersLastSync-table"
            rowKey="id"
            columns={columns}
            title={(users) => (
              <span style={{ display: "flex", justifyContent: "flex-end" }}>
                <Tag color={"geekblue"}>
                  {users.length + "/" + searchCounter}
                </Tag>
                <ClickableTag />
              </span>
            )}
            dataSource={usersLastSync}
            bordered
            scroll={{ x: 1500 }}
          />
          <Space>
            <Button
              id="loadPreviousPage-button"
              disabled={currentPageIndex === 0}
              onClick={loadPreviousPage}
              size="small"
              style={{ width: 90 }}
            >
              {"<<"} {pageSize}
            </Button>
            <Button
              id="loadNextPage-button"
              onClick={loadNextPage}
              size="small"
              style={{ width: 90 }}
            >
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
