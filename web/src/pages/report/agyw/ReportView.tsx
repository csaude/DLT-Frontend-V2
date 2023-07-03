import React, { useEffect, useState } from "react";
import { pagedQueryByIds } from "../../../utils/beneficiary";
import {
  allUsersByProfilesAndUser,
  query as queryUser,
} from "../../../utils/users";
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
import {
  ADMIN,
  COUNSELOR,
  MENTOR,
  MNE,
  NURSE,
  SUPERVISOR,
} from "@app/utils/contants";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "@app/components/modal/LoadingModal";
import { loadReferers } from "@app/store/actions/users";
import { getInterventionsCount } from "@app/store/actions/interventions";
import { pagedQueryByBeneficiariesIds } from "@app/utils/beneficiaryIntervention";
import {
  getAgeAtRegistrationDate,
  getAgeBandByDate,
  getAgeByDate,
  getAgeRangeAtRegistrationDate,
  getAgeRangeByDate,
  getPackageLabel,
} from "@app/utils/ageRange";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { getVulnerabilitiesCounter } from "@app/utils/vulnerabilitiesCounter";

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
  const [interventions, setInterventions] = useState<any>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [districts, setDistricts] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [visibleName, setVisibleName] = useState<any>(true);
  const [currentPageStart, setCurrentPageStart] = useState(0);
  const [currentPageEnd, setCurrentPageEnd] = useState(99);
  const pageSize = 100;
  const interventionSelector = useSelector((state: any) => state?.intervention);
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
  const dispatch = useDispatch();

  const getBeneficiaryIntervention = (beneficiaryId) => {
    const currentInterventin = interventionSelector?.interventions?.map(
      (item) => {
        if (item[1] == beneficiaryId) {
          return item[0];
        }
      }
    );
    return currentInterventin;
  };

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

      if ([ADMIN, MNE, SUPERVISOR].includes(user.profiles.id)) {
        setVisibleName(false);
      }
    };

    fetchData().catch((error) => console.log(error));

    const fetchReferersUsers = async () => {
      const payload = {
        profiles: [SUPERVISOR, MENTOR, NURSE, COUNSELOR].toString(),
        userId: Number(userId),
      };

      const referers = await allUsersByProfilesAndUser(payload);
      dispatch(loadReferers(referers));
    };

    fetchReferersUsers().catch((error) => console.log(error));
  }, [currentBeneficiariesIds]);

  const getName = (record: any) => {
    return visibleName === false
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
        return <Badge count={getBeneficiaryIntervention(record?.id)} />;
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
    dispatch(getInterventionsCount());
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
    const currentUserName = authSelector?.name;
    let currentPageEnd = 99;
    const pageSize = 100;

    const workbook = new ExcelJS.Workbook();

    workbook.creator = currentUserName;
    workbook.lastModifiedBy = currentUserName;
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    workbook.properties.date1904 = true;
    workbook.calcProperties.fullCalcOnLoad = true;
    workbook.views = [
      {
        x: 0,
        y: 0,
        width: 10000,
        height: 20000,
        firstSheet: 0,
        activeTab: 1,
        visibility: "visible",
      },
    ];
    const worksheet = workbook.addWorksheet("PEPFAR_MER_2.6_AGYW");

    const a1 = worksheet.getCell("A1");
    a1.alignment = { vertical: "middle", horizontal: "center" };
    a1.value = "PROVINCE";

    const b1 = worksheet.getCell("B1");
    b1.alignment = { vertical: "middle", horizontal: "center" };
    b1.value = "DISTRICT";

    const c1 = worksheet.getCell("C1");
    c1.alignment = { vertical: "middle", horizontal: "center" };
    c1.value = "NEIGHBORHOOD";

    const d1 = worksheet.getCell("D1");
    d1.alignment = { vertical: "middle", horizontal: "center" };
    d1.value = "ENTRY POINT";

    const e1 = worksheet.getCell("E1");
    e1.alignment = { vertical: "middle", horizontal: "center" };
    e1.value = "ORGANIZATION";

    const f1 = worksheet.getCell("F1");
    f1.alignment = { vertical: "middle", horizontal: "center" };
    f1.value = "DATE REGISTERED";

    const g1 = worksheet.getCell("G1");
    g1.alignment = { vertical: "middle", horizontal: "center" };
    g1.value = "NUI";

    const h1 = worksheet.getCell("H1");
    h1.alignment = { vertical: "middle", horizontal: "center" };
    h1.value = "AGE (AT REGISTRATION)";

    const bm3 = worksheet.getCell("I1");
    bm3.alignment = { vertical: "middle", horizontal: "center" };
    bm3.value = "CURRENT AGE";

    const i1 = worksheet.getCell("J1");
    i1.alignment = { vertical: "middle", horizontal: "center" };
    i1.value = "AGE GROUP (AT REGISTRATION)";

    const k1 = worksheet.getCell("K1");
    k1.alignment = { vertical: "middle", horizontal: "center" };
    k1.value = "AGE GROUP (CURRENT)";

    const l1 = worksheet.getCell("L1");
    l1.alignment = { vertical: "middle", horizontal: "center" };
    l1.value = "DATE OF BIRTH";

    const m1 = worksheet.getCell("M1");
    m1.alignment = { vertical: "middle", horizontal: "center" };
    m1.value = "NUMBER OF VULNERABILITIES";

    const n1 = worksheet.getCell("N1");
    n1.alignment = { vertical: "middle", horizontal: "center" };
    n1.value = "TYPE OF SERVICE";

    const o1 = worksheet.getCell("O1");
    o1.alignment = { vertical: "middle", horizontal: "center" };
    o1.value = "SERVICE";

    const p1 = worksheet.getCell("P1");
    p1.alignment = { vertical: "middle", horizontal: "center" };
    p1.value = "SUB SERVICE";

    const q1 = worksheet.getCell("Q1");
    q1.alignment = { vertical: "middle", horizontal: "center" };
    q1.value = "SERVICE PACKAGE";

    const r1 = worksheet.getCell("R1");
    r1.alignment = { vertical: "middle", horizontal: "center" };
    r1.value = "SERVICE ENTRY POINT";

    const s1 = worksheet.getCell("S1");
    s1.alignment = { vertical: "middle", horizontal: "center" };
    s1.value = "SERVICE LOCATION";

    const t1 = worksheet.getCell("T1");
    t1.alignment = { vertical: "middle", horizontal: "center" };
    t1.value = "SERVICE DATE";

    const u1 = worksheet.getCell("U1");
    u1.alignment = { vertical: "middle", horizontal: "center" };
    u1.value = "PROVIDER";

    const v1 = worksheet.getCell("V1");
    v1.alignment = { vertical: "middle", horizontal: "center" };
    v1.value = "REMARKS";

    let fetchedBeneficiariesIds: number[] = [];
    for (let i = 0; i <= currentPageEnd; i++) {
      /*console.log(
        "Size=",
        beneficiariesIdsSelector.length,
        "elemt:",
        i,
        "/from:",
        currentPageEnd,
        "FoundElement=",
        beneficiariesIdsSelector[i]
      );*/

      if (beneficiariesIdsSelector[i] == undefined) {
        break;
      }

      fetchedBeneficiariesIds.push(beneficiariesIdsSelector[i]);

      if (fetchedBeneficiariesIds.length == pageSize) {
        /***console.log(
          "-------fetchedBeneficiariesIds.length == pageSize------",
          fetchedBeneficiariesIds.length,
          pageSize,
          fetchedBeneficiariesIds.length == pageSize
        );**/
        const interventions = await pagedQueryByBeneficiariesIds(
          0,
          pageSize,
          fetchedBeneficiariesIds
        );

        interventions.map(async (intervention: any) => {
          const values: any = [];
          let cell = 1;
          values[cell] =
            intervention.beneficiary?.locality?.district?.province.name;
          cell = cell + 1;
          values[cell] = intervention.beneficiary?.locality?.district?.name;
          cell = cell + 1;
          values[cell] = intervention.beneficiary?.neighborhood.name;
          cell = cell + 1;
          values[cell] =
            intervention.beneficiary?.entryPoint == 1
              ? "US"
              : intervention.beneficiary?.entryPoint == 2
              ? "CM"
              : "ES";
          cell = cell + 1;
          values[cell] = intervention.beneficiary?.partners?.name;
          cell = cell + 1;
          values[cell] = moment(intervention.beneficiary.dateCreated).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          cell = cell + 1;
          values[cell] = intervention.beneficiary.nui;
          cell = cell + 1;
          values[cell] = getAgeAtRegistrationDate(
            intervention.beneficiary.dateOfBirth,
            intervention.beneficiary.dateCreated
          );
          cell = cell + 1;
          values[cell] = getAgeByDate(intervention.beneficiary.dateOfBirth);
          cell = cell + 1;
          values[cell] = getAgeRangeAtRegistrationDate(
            intervention.beneficiary.dateOfBirth,
            intervention.beneficiary.dateCreated
          ); //"age group at registration";
          cell = cell + 1;
          values[cell] = getAgeRangeByDate(
            intervention.beneficiary.dateOfBirth
          ); //"age group current";
          cell = cell + 1;
          values[cell] = moment(intervention.beneficiary.dateOfBirth).format(
            "YYYY-MM-DD"
          );
          cell = cell + 1;
          values[cell] = getVulnerabilitiesCounter(intervention.beneficiary);
          cell = cell + 1;
          values[cell] =
            intervention.subServices?.service?.serviceType == 1
              ? "Serviços  Clinicos"
              : "Serviços Comunitários";
          cell = cell + 1;
          values[cell] = intervention.subServices?.service?.name;
          cell = cell + 1;
          values[cell] = intervention.subServices?.name;

          cell = cell + 1;
          values[cell] = getServiceBandByServiceIdAndAge(
            intervention.subServices?.service?.id,
            intervention.beneficiary.dateOfBirth
          );
          cell = cell + 1;
          values[cell] =
            intervention.entryPoint == 1
              ? "US"
              : intervention?.entryPoint == 2
              ? "CM"
              : "ES";
          cell = cell + 1;
          values[cell] = intervention.us?.name;
          cell = cell + 1;
          values[cell] = moment(intervention.id.date).format("YYYY-MM-DD");
          cell = cell + 1;
          values[cell] = intervention.provider;

          cell = cell + 1;
          values[cell] = intervention.remarks;
          cell = cell + 1;

          worksheet.addRow(values);
        });
        fetchedBeneficiariesIds = [];
      }

      if (i + 1 == currentPageEnd) {
        currentPageEnd += pageSize;
        /* console.log("----------currentPageEnd--------------", currentPageEnd);*/
      }
    }

    const created = moment(new Date()).format("YYYYMMDD_hhmmss");

    workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], { type: "applicationi/xlsx" });
      saveAs(
        blob,
        "PEPFAR_MER_2.6_AGYW_PREV_Beneficiaries_" + created + ".xls"
      );
    });
  }

  return (
    <>
      <Title />
      <Card
        title={`${reportSelector.title}  (${reportSelector.total})`}
        bordered={false}
        headStyle={{ color: "#17a2b8" }}
        extra={<Space></Space>}
      >
        <ConfigProvider locale={ptPT}>
          <Space>
            <Button
              onClick={() => handleGenerateXLSXReport()}
              size="small"
              style={{ width: 100 }}
            >
              Exportar XLS
            </Button>
          </Space>
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
