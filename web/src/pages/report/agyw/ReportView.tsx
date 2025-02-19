import React, { useEffect, useState } from "react";
import { pagedQueryByIds } from "../../../utils/beneficiary";
import { query as queryUser } from "../../../utils/users";
import {
  Badge,
  Button,
  Card,
  Input,
  Space,
  Table,
  Typography,
  Form,
  ConfigProvider,
} from "antd";
import ptPT from "antd/lib/locale-provider/pt_PT";
import Highlighter from "react-highlight-words";
import "antd/dist/antd.css";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { getEntryPoint, UserModel } from "@app/models/User";
import { calculateAge } from "@app/models/Utils";
import { allDistrict } from "@app/utils/district";
import { Title } from "@app/components";
import { ADMIN, MNE, SUPERVISOR } from "@app/utils/contants";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "@app/components/modal/LoadingModal";
import { getAgeBandByDate, getPackageLabel } from "@app/utils/ageRange";
import {
  getAgywPrevBeneficiariesReportGenerated,
  getFileDownloaded,
} from "@app/utils/report";

const { Text } = Typography;

const ages = [
  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
];

const ReportView: React.FC = () => {
  const [form] = Form.useForm();

  const [users, setUsers] = useState<UserModel[]>([]);
  const [updaters, setUpdaters] = useState<UserModel[]>([]);
  const [user, setUser] = React.useState<any>();
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [districts, setDistricts] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [visibleName, setVisibleName] = useState<any>(false);
  const [currentPageStart, setCurrentPageStart] = useState(0);
  const [currentPageEnd, setCurrentPageEnd] = useState(99);
  const pageSize = 100;
  const userSelector = useSelector((state: any) => state?.user);
  const authSelector = useSelector((state: any) => state?.auth.currentUser);
  const beneficiariesIdsSelector: [] = useSelector(
    (state: any) => state?.report.ids
  );
  const reportSelector = useSelector((state: any) => state?.report);

  let data;
  const [dataLoading, setDataLoading] = useState(false);
  const [currentBeneficiariesIds, setCurrentBeneficiariesIds] = useState([]);

  const userId = localStorage.getItem("user");
  const username = localStorage.getItem("username");
  const dispatch = useDispatch();

  const getUsernames = (userId) => {
    const currentNames = userSelector?.users?.map((item) => {
      if (item[0] == userId) {
        return item[1];
      }
    });
    return currentNames;
  };

  let searchInput;
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      const user = await queryUser(localStorage.user);

      data = await pagedQueryByIds(0, pageSize, currentBeneficiariesIds);

      const sortedBeneficiaries = data.sort((benf1, benf2) =>
        moment(benf2.dateCreated)
          .format("YYYY-MM-DD HH:mm:ss")
          .localeCompare(
            moment(benf1.dateCreated).format("YYYY-MM-DD HH:mm:ss")
          )
      );
      setDataLoading(false);

      setUser(user);
      setBeneficiaries(sortedBeneficiaries);

      const districts = await allDistrict();
      const sortedDistricts = districts.sort((dist1, dist2) =>
        dist1.name.localeCompare(dist2.name)
      );
      const partners = data
        .map((beneficiary) => beneficiary?.partner)
        .filter(
          (value, index, self) =>
            self.findIndex((v) => v?.id === value?.id) === index
        );
      const creatorsIds = data
        .map((beneficiary) => beneficiary?.createdBy)
        .filter(
          (value, index, self) => self.findIndex((v) => v === value) === index
        );
      const updatersIds = data
        .map((beneficiary) => beneficiary?.updatedBy)
        .filter(
          (value, index, self) => self.findIndex((v) => v === value) === index
        );

      const users = await queryUser();
      const creators = users.filter((u) => creatorsIds.includes(u.id));
      const updaters = users.filter((u) => updatersIds.includes(u.id));

      setDistricts(sortedDistricts);
      setPartners(partners);
      setUsers(creators);
      setUpdaters(updaters);

      if ([ADMIN, MNE, SUPERVISOR].includes(user.profiles?.id)) {
        setVisibleName(true);
      }
    };

    fetchData().catch((error) => console.log(error));
  }, [currentBeneficiariesIds]);

  const getName = (record: any) => {
    return visibleName
      ? record?.name + " " + record?.surname
      : "DREAMS" + record?.nui;
  };

  const filterItem = (data) => (formatter) =>
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
          placeholder={`Pesquisar ${dataIndex == "name" ? "nome" : dataIndex}`}
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
        ? (dataIndex == "name"
            ? record[dataIndex] + " " + record["surname"]
            : record[dataIndex]
          )
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
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

  const columns = [
    {
      title: "Código do Beneficiário (NUI)",
      dataIndex: "",
      key: "nui",
      ...getColumnSearchProps("nui"),
      render: (text, record) => (
        <Text type="danger">
          {record?.district?.code}/{record?.nui}
        </Text>
      ),
      width: 120,
    },
    {
      title: "Nome do Beneficiário",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      render: (text, record) => getName(record),
      width: 200,
    },
    {
      title: "Sexo",
      dataIndex: "gender",
      key: "gender",
      filters: [
        {
          text: "M",
          value: "1",
        },
        {
          text: "F",
          value: "2",
        },
      ],
      onFilter: (value, record) => record?.gender == value,
      filterSearch: true,
      render(val: any) {
        return (
          <Badge
            status={val == true ? "success" : "warning"}
            text={val == "2" ? "F" : "M"}
          />
        );
      },
      width: 70,
    },
    {
      title: "PE",
      dataIndex: "",
      key: "entryPoint",
      filters: [
        {
          text: "US",
          value: "1",
        },
        {
          text: "CM",
          value: "2",
        },
        {
          text: "ES",
          value: "3",
        },
      ],
      onFilter: (value, record) => record?.entryPoint == value,
      filterSearch: true,
      render: (text, record) => getEntryPoint(record?.entryPoint),
      width: 60,
    },
    {
      title: "Distrito",
      dataIndex: "",
      key: "district",
      render: (text, record) => record?.district.name,
      filters: filterItem(districts)((i) => i?.name),
      onFilter: (value, record) => record?.district?.name == value,
      filterSearch: true,
    },
    {
      title: "Idade",
      dataIndex: "age",
      key: "age",
      render: (text, record) => calculateAge(record?.dateOfBirth) + " anos",
      filters: filterItem(ages)((i) => i),
      onFilter: (value, record) => calculateAge(record?.dateOfBirth) == value,
      filterSearch: true,
    },
    {
      title: "#Interv",
      dataIndex: "beneficiariesInterventionses",
      key: "beneficiariesInterventionses",
      render(val: any, record) {
        return (
          <Badge
            count={
              record?.clinicalInterventions + record?.communityInterventions
            }
          />
        );
      },
      width: 60,
    },
    {
      title: "#Interv Clínicas",
      dataIndex: "clinicalInterventions",
      key: "clinicalInterventions",
      render(val: any, record) {
        return <Badge count={record?.clinicalInterventions} />;
      },
      width: 60,
    },
    {
      title: "#Interv Comunitárias",
      dataIndex: "communityInterventions",
      key: "communityInterventions",
      render(val: any, record) {
        return <Badge count={record?.communityInterventions} />;
      },
      width: 60,
    },
    {
      title: "Org",
      dataIndex: "partner",
      key: "partner",
      render: (text, record) => record?.partners?.name,
      filters: filterItem(partners)((i) => i?.name),
      onFilter: (value, record) => record?.partner?.name == value,
      filterSearch: true,
    },
    {
      title: "Criado Por",
      dataIndex: "",
      key: "createdBy",
      render: (text, record) => getUsernames(record?.createdBy),
      filters: filterItem(users)((i) => i.username),
      onFilter: (value, record) =>
        users
          .filter((user) => record?.createdBy == user.id)
          .map((filteredUser) => `${filteredUser.username}`)[0] == value,
      filterSearch: true,
    },
    {
      title: "Criado Em",
      dataIndex: "dateCreated",
      key: "dateCreated",
      ...getColumnSearchProps("dateCreated"),
      render: (val: string) => <span>{moment(val).format("YYYY-MM-DD")}</span>,
      sorter: (benf1, benf2) =>
        moment(benf2.dateCreated)
          .format("YYYY-MM-DD HH:mm:ss")
          .localeCompare(
            moment(benf1.dateCreated).format("YYYY-MM-DD HH:mm:ss")
          ),
    },
    {
      title: "Atualizado Por",
      dataIndex: "",
      key: "updatedBy",
      render: (text, record) => getUsernames(record?.updatedBy),
      filters: filterItem(updaters)((i) => i.username),
      onFilter: (value, record) =>
        updaters
          .filter((user) => record?.updatedBy == user.id)
          .map((filteredUser) => `${filteredUser.username}`)[0] == value,
      filterSearch: true,
    },
    {
      title: "Atualizado Em",
      dataIndex: "dateUpdated",
      key: "dateUpdated",
      ...getColumnSearchProps("dateUpdated"),
      render: (val: string) =>
        val != undefined ? (
          <span>{moment(val).format("YYYY-MM-DD")} </span>
        ) : (
          ""
        ),
      sorter: (benf1, benf2) =>
        moment(benf2.dateUpdated)
          .format("YYYY-MM-DD HH:mm:ss")
          .localeCompare(
            moment(benf1.dateUpdated).format("YYYY-MM-DD HH:mm:ss")
          ),
    },
  ];

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

  function fetchElements(startIndex, endIndex) {
    const fetchedElements = [];
    for (let i = startIndex; i <= endIndex; i++) {
      fetchedElements.push(beneficiariesIdsSelector[i]);
    }
    setCurrentBeneficiariesIds(fetchedElements);
  }

  const loadPreviousPage = () => {
    if (currentPageStart > 0) {
      setCurrentPageStart(currentPageStart - pageSize);
      setCurrentPageEnd(currentPageEnd - pageSize);
    }
  };

  const loadNextPage = () => {
    setCurrentPageStart(currentPageStart + pageSize);
    setCurrentPageEnd(currentPageEnd + pageSize);
  };

  useEffect(() => {
    fetchElements(currentPageStart, currentPageEnd);
  }, [currentPageStart, currentPageEnd]);

  const getServiceBandByServiceIdAndAge = (serviceId, dateOfBirth) => {
    const ageBand = getAgeBandByDate(dateOfBirth); // so para testes
    const filteredServiceAgebands = reportSelector.serviceAgebands.filter(
      (serviceAgeband) => {
        return (
          serviceAgeband.serviceId === serviceId &&
          serviceAgeband.ageBand === ageBand
        );
      }
    );
    const level = filteredServiceAgebands[0]?.level;
    return getPackageLabel(level);
  };

  async function handleGenerateXLSXReport() {
    const beneficiariesIds = beneficiariesIdsSelector.slice(); // Copy the array

    setDataLoading(true);
    try {
      const response = await getAgywPrevBeneficiariesReportGenerated(
        beneficiariesIds,
        username
      );
      await downloadFile(response.data);
      setDataLoading(false);
    } catch (error) {
      setDataLoading(false);
      console.error("Error downloading the Excel report", error);
    }
  }

  const downloadFile = async (filePath) => {
    try {
      setDataLoading(true);
      const response = await getFileDownloaded(filePath);

      const filename = filePath.substring(filePath.lastIndexOf("/") + 1);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setDataLoading(false);
      console.error("Error downloading file: ", error);
    }
  };

  return (
    <>
      <Title />
      <Card style={{ textAlign: "end" }}>
        <Button
          onClick={() => handleGenerateXLSXReport()}
          size="small"
          style={{ float: "right", width: 100 }}
        >
          Exportar XLS
        </Button>
      </Card>
      <Card
        style={{
          textAlign: "center",
        }}
        title={`${reportSelector.title}  (${reportSelector.total})`}
        bordered={false}
        headStyle={{ color: "#17a2b8" }}
        extra={<Space></Space>}
      >
        <ConfigProvider locale={ptPT}>
          <Table
            rowKey="id"
            sortDirections={["descend", "ascend"]}
            columns={columns}
            dataSource={beneficiaries}
            bordered
            scroll={{ x: 1500 }}
          />
          <Space>
            <Button
              disabled={currentPageStart === 0}
              onClick={loadPreviousPage}
              size="small"
              style={{ width: 90 }}
            >
              {"<<"} Anterior
            </Button>
            <Button onClick={loadNextPage} size="small" style={{ width: 90 }}>
              Próxima {">>"}
            </Button>
          </Space>
        </ConfigProvider>
        {<LoadingModal modalVisible={dataLoading} />}
      </Card>
    </>
  );
};

export default ReportView;
