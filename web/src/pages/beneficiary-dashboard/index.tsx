import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  pagedQueryByFilters,
  queryCountByFilters,
} from "../../utils/beneficiary";
import {
  allUsesByDistricts,
  allUsesByProvinces,
  query as queryUser,
} from "../../utils/users";
import {
  Badge,
  Button,
  message,
  Card,
  Input,
  Space,
  Table,
  Typography,
  Form,
  ConfigProvider,
  Row,
  Col,
  Select,
  Modal,
  Tag,
  TableProps,
} from "antd";
import { queryDistrictsByProvinces } from "@app/utils/locality";
import ptPT from "antd/lib/locale-provider/pt_PT";
import Highlighter from "react-highlight-words";
import "antd/dist/antd.css";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import moment from "moment";
import ViewBeneficiary, { ViewBenefiaryPanel } from "./components/View";
import { getEntryPoint, UserModel } from "@app/models/User";
import { calculateAge, getUserParams } from "@app/models/Utils";
import { add as addRef, Reference } from "../../utils/reference";
import { Title } from "@app/components";
import { ADMIN, MNE, SUPERVISOR } from "@app/utils/contants";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "@app/components/modal/LoadingModal";
import { FilterObject } from "@app/models/FilterObject";
import { allDistrict, allDistrictsByIds } from "@app/utils/district";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { getAgeByDate } from "@app/utils/ageRange";
import FormReference from "../beneficiaries/components/FormReference";

const { Text } = Typography;
const { confirm } = Modal;

const ages = [
  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
];

const BeneficiaryDashboard: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserModel[]>([]);
  const [listUsers, setListUsers] = useState<any[]>([]);
  const [visibleDistrict, setVisibleDistrict] = useState<any>(true);
  const [updaters, setUpdaters] = useState<UserModel[]>([]);
  const [user, setUser] = React.useState<any>();
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [services, setServices] = useState<any>([]);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [beneficiary, setBeneficiary] = useState<any>(undefined);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [beneficiaryModalVisible, setBeneficiaryModalVisible] =
    useState<boolean>(false);
  const [beneficiaryPartnerModalVisible, setBeneficiaryPartnerModalVisible] =
    useState<boolean>(false);
  const [referenceModalVisible, setReferenceModalVisible] =
    useState<boolean>(false);
  const [addStatus, setAddStatus] = useState<boolean>(false);
  const [districts, setDistricts] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [visibleName, setVisibleName] = useState<any>(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [filters, setFilters] = useState<any>(null);
  const pageSize = 100;

  const interventionSelector = useSelector(
    (state: any) => state?.intervention.loadedInterventions
  );

  const userSelector = useSelector((state: any) => state?.user);
  const beneficiariesTotal = useSelector(
    (state: any) => state.beneficiary.total
  );

  const convertedUserData: FilterObject[] = listUsers?.map(
    ([value, label]) => ({
      value: value.toString(),
      label: label.charAt(0).toUpperCase() + label.slice(1),
    })
  );

  const convertedDistrictsData: FilterObject[] = districts?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const [searchNui, setSearchNui] = useState<any>("");
  const [searchName, setSearchName] = useState<any>("");
  const [searchDistrict, setSearchDistrict] = useState<any>("");
  const [searchUserCreator, setSearchUserCreator] = useState<any>("");

  const [district, setDistrict] = useState<any>();
  const [userCreator, setUserCreator] = useState<any>();
  const [nui, setNui] = useState<any>();
  const [name, setName] = useState<any>();

  let data;
  let countByFilter;
  const [dataLoading, setDataLoading] = useState(false);
  const [searchCounter, setSearchCounter] = useState<any>();

  const userId = localStorage.getItem("user");
  const dispatch = useDispatch();

  const getBeneficiaryIntervention = (beneficiaryId) => {
    const element = interventionSelector?.find(
      (item) => item.beneficiaryId === beneficiaryId
    );
    return element;
  };

  const getUsernames = (userId) => {
    const currentNames = userSelector?.users?.map((item) => {
      if (item[0] == userId) {
        return item[1];
      }
    });
    const filteredNames = currentNames.filter((name) => name);
    return filteredNames[0];
  };

  let searchInput;
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      const user = await queryUser(localStorage.user);
      data = await pagedQueryByFilters(
        getUserParams(user),
        currentPageIndex,
        pageSize,
        searchNui,
        searchName,
        searchUserCreator,
        searchDistrict
      );

      countByFilter = await queryCountByFilters(
        getUserParams(user),
        searchNui,
        searchName,
        searchUserCreator,
        searchDistrict
      );
      setSearchCounter(countByFilter);

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

      if (user && user?.districts.length > 0) {
        user?.districts?.length === 1
          ? setVisibleDistrict(false)
          : setVisibleDistrict(true);
        const dIds = user?.districts.map((item) => {
          return item.id + "";
        });
        const dataDistricts = await allDistrictsByIds({ districts: dIds });

        const sortedDistricts = dataDistricts.sort((dist1, dist2) =>
          dist1.name.localeCompare(dist2.name)
        );

        setDistricts(sortedDistricts);

        const dataUsers = await allUsesByDistricts({ districts: dIds });
        const sortedUsers = dataUsers.sort((user1, user2) =>
          user1[1].localeCompare(user2[1])
        );
        setListUsers(sortedUsers);
      } else if (user && user.provinces.length > 0) {
        const pIds = user?.provinces.map((item) => {
          return item.id + "";
        });

        const dataUsers = await allUsesByProvinces({ provinces: pIds });
        const dataDistrict = await queryDistrictsByProvinces({
          provinces: pIds,
        });

        setDistricts(dataDistrict);
        setListUsers(dataUsers);
      } else {
        const allUser = userSelector?.users;

        const sortedUsers = allUser.sort((user1, user2) =>
          user1[1].localeCompare(user2[1])
        );
        setListUsers(sortedUsers);

        const dataDistricts = await allDistrict();

        const sortedDistricts = dataDistricts.sort((dist1, dist2) =>
          dist1.name.localeCompare(dist2.name)
        );

        setDistricts(sortedDistricts);
      }

      const partners = data
        .map((beneficiary) => beneficiary?.partners)
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

      const creators = userSelector?.loadedUsers.filter((u) =>
        creatorsIds.includes(u.id)
      );
      const updaters = userSelector?.loadedUsers.filter((u) =>
        updatersIds.includes(u.id)
      );

      setPartners(partners);
      setUsers(creators);
      setUpdaters(updaters);

      if ([ADMIN, MNE, SUPERVISOR].includes(user.profiles.id)) {
        setVisibleName(false);
      }
    };

    fetchData().catch((error) => console.log(error));
  }, [
    currentPageIndex,
    searchNui,
    searchName,
    searchUserCreator,
    searchDistrict,
    beneficiary,
  ]);

  const handleAddRef = async (
    values: any,
    buttonRef: React.RefObject<HTMLButtonElement>
  ) => {
    if (values !== undefined) {
      const servicesObjects = services.map((e: any) => {
        const listServices: any = {
          services: { id: e.servico.id },
          description: e.description,
          status: 0,
          createdBy: localStorage.user,
        };
        return listServices;
      });

      const payload: Reference = {
        beneficiaries: {
          id: beneficiary.id,
        },
        referredBy: {
          id: values.referredBy,
        },
        notifyTo: {
          id: values.notifyTo,
        },
        us: {
          id: values.local,
        },
        referenceNote: values.referenceNote,
        description: "",
        referTo: values.referTo,
        bookNumber: values.bookNumber,
        referenceCode: values.referenceCode,
        serviceType: values.serviceType === "CLINIC" ? "1" : "2",
        date: moment(values.date).format("YYYY-MM-DD"),
        remarks: values.remarks,
        status: "0",
        cancelReason: "0",
        otherReason: "",
        userCreated: localStorage.user,
        dateCreated: new Date(),
        referencesServiceses: servicesObjects,
      };

      if (servicesObjects.length == 0) {
        setAddStatus(false);

        message.error({
          content: "Referência sem Intervenção!",
          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });
        if (buttonRef.current) {
          buttonRef.current.disabled = false;
        }
      } else {
        setAddStatus(true);
        const { data } = await addRef(payload);

        message.success({
          content: "Registado com Sucesso!" + data?.referenceNote,
          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });

        setReferenceModalVisible(false);

        navigate("/referenceList");
      }
    }
  };

  const handleAddBeneficiary = (data: any) => {
    const bens = [...beneficiaries, data];
    const sortedBeneficiaries = bens.sort((benf1, benf2) =>
      moment(benf2.dateCreated)
        .format("YYYY-MM-DD HH:mm:ss")
        .localeCompare(moment(benf1.dateCreated).format("YYYY-MM-DD HH:mm:ss"))
    );
    setBeneficiaries(sortedBeneficiaries);
    setBeneficiary(data);
    handleViewModalVisible(true, data);
  };

  const handleUpdateBeneficiary = (data: any) => {
    setBeneficiaries((existingItems) => {
      return existingItems.map((item) => {
        return item.id === beneficiary.id ? data : item;
      });
    });
    setBeneficiary(data);
    setBeneficiaryModalVisible(false);
    setBeneficiaryPartnerModalVisible(false);
  };

  const handleViewModalVisible = (flag?: boolean, record?: any) => {
    setBeneficiary(record);
    setModalVisible(!!flag);
  };

  const handleModalRefVisible = (flag?: boolean, record?: any) => {
    setBeneficiary(record);
    setReferenceModalVisible(!!flag);
  };
  const handleRefServicesList = (data?: any) => {
    setServices(data);
  };

  const handleBeneficiaryModalVisible = (flag?: boolean) => {
    form.resetFields();
    setBeneficiary(undefined);
    setBeneficiaryModalVisible(!!flag);
  };

  const handleBeneficiaryPartnerModalVisible = (flag?: boolean) => {
    form.resetFields();
    setBeneficiary(undefined);
    setBeneficiaryPartnerModalVisible(!!flag);
  };

  const handleModalVisible = (flag?: boolean) => {
    setModalVisible(!!flag);
  };

  const getName = (record: any) => {
    return visibleName === false
      ? record.name + " " + record.surname
      : "DREAMS" + record.nui;
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

  const parentMethods = {
    handleModalVisible: handleModalVisible,
  };

  const columns = [
    {
      title: "Código do Beneficiário (NUI)",
      dataIndex: "",
      key: "nui",
      ...getColumnSearchProps("nui"),
      render: (text, record) => (
        <Text type="danger">
          {record.district?.code}/{record.nui}
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
      onFilter: (value, record) => record.gender == value,
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
      onFilter: (value, record) => record.entryPoint == value,
      filterSearch: true,
      render: (text, record) => getEntryPoint(record.entryPoint),
      width: 60,
    },
    {
      title: "Distrito",
      dataIndex: "",
      key: "district",
      render: (text, record) => record.district.name,
      filters: filterItem(districts)((i) => i?.name),
      onFilter: (value, record) => record?.district?.name == value,
      filterSearch: true,
    },
    {
      title: "Idade",
      dataIndex: "age",
      key: "age",
      render: (text, record) => calculateAge(record.dateOfBirth) + " anos",
      filters: filterItem(ages)((i) => i),
      onFilter: (value, record) => calculateAge(record.dateOfBirth) == value,
      filterSearch: true,
    },
    {
      title: "Total de Sub-Serviços",
      dataIndex: "beneficiariesInterventionses",
      key: "beneficiariesInterventionses",
      render(val: any, record) {
        return <Badge count={getBeneficiaryIntervention(record.id)?.total} />;
      },
      width: 60,
    },
    {
      title: "Total de Subserviços Clínicos",
      dataIndex: "clinicalInterventions",
      key: "clinicalInterventions",
      render(val: any, record) {
        return (
          <Badge count={getBeneficiaryIntervention(record.id)?.clinicalTotal} />
        );
      },
      width: 60,
    },
    {
      title: "Total de subserviços comunitários",
      dataIndex: "communityInterventions",
      key: "communityInterventions",
      render(val: any, record) {
        return (
          <Badge
            count={getBeneficiaryIntervention(record.id)?.communityTotal}
          />
        );
      },
      width: 60,
    },
    {
      title: "Org",
      dataIndex: "partner",
      key: "partner",
      render: (text, record) => record?.partners?.name,
      filters: filterItem(partners)((i) => i?.name),
      onFilter: (value, record) => record?.partners?.name == value,
      filterSearch: true,
    },
    {
      title: "Criado Por",
      dataIndex: "",
      key: "createdBy",
      render: (text, record) => getUsernames(record.createdBy),
      filters: filterItem(users)((i) => i.username),
      onFilter: (value, record) =>
        users
          .filter((user) => record.createdBy == user.id)
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
      render: (text, record) => getUsernames(record.updatedBy),
      filters: filterItem(updaters)((i) => i.username),
      onFilter: (value, record) =>
        updaters
          .filter((user) => record.updatedBy == user.id)
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
    {
      title: "Status",
      dataIndex: "",
      key: "status",
      render: (text, record) => <Text type="danger">{record.status}</Text>,
      width: 120,
    },
    {
      title: "Acção",
      dataIndex: "",
      key: "x",
      render: (text, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewModalVisible(true, record)}
          ></Button>
        </Space>
      ),
      width: 100,
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

  const loadPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const loadNextPage = () => {
    setCurrentPageIndex(currentPageIndex + 1);
  };

  const handleGlobalSearch = async () => {
    if (nui !== undefined) {
      setSearchNui(nui);
    }
    if (name !== undefined) {
      setSearchName(name);
    }
    if (userCreator !== undefined) {
      setSearchUserCreator(userCreator);
    }
    if (district !== undefined) {
      setSearchDistrict(district);
    }
  };

  const onChange = (e, name) => {
    if (name === "userCreator") {
      setUserCreator(e);
    }
    if (name === "district") {
      setDistrict(e);
    }
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

  const ClickableTag = () => {
    return (
      <a onClick={handleExportarXLS}>
        <Tag color={"geekblue"}>{"Exportar XLS"}</Tag>
      </a>
    );
  };

  const handleExportarXLS = async () => {
    console.log("On Export XLS");

    try {
      setDataLoading(true);
      const pageElements = 1000;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Lista_Beneficiarios_");

      const headers = [
        "#",
        "Código do Beneficiário",
        "Nome do Beneficiário",
        "Sexo",
        "PE",
        "Distrito",
        "Idade",
        "#Interv",
        "Org",
        "Criado Por",
        "Actualizado Por",
        "Inscrito Em",
        "Criado Em",
        "Actualizado Em",
      ];

      const headerRow = worksheet.getRow(1);
      headers.forEach((header, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.value = header;
        cell.font = { bold: true };
      });

      const user = await queryUser(localStorage.user);

      const lastPage = Math.ceil(beneficiariesTotal / pageElements);

      let sequence = 1;

      for (let i = 0; i < lastPage; i++) {
        data = await pagedQueryByFilters(
          getUserParams(user),
          i,
          pageElements,
          searchNui,
          searchName,
          searchUserCreator,
          searchDistrict
        );

        if (filters) {
          if (filters.nui != null) {
            data = data.filter((d) => d.nui.includes(filters.nui[0]));
          }
          if (filters.name != null) {
            data = data.filter((d) =>
              (d.name + " " + d.surname).match(filters.name)
            );
          }
          if (filters.gender != null) {
            data = data.filter((d) => filters.gender.includes(d.gender));
          }
          if (filters.entryPoint != null) {
            data = data.filter((d) =>
              filters.entryPoint.includes(d.entryPoint)
            );
          }
          if (filters.district != null) {
            data = data.filter((d) =>
              filters.district.includes(d.district.name)
            );
          }
          if (filters.age != null) {
            data = data.filter((d) =>
              filters.age.includes(calculateAge(d.dateOfBirth))
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
          if (filters.dateUpdated != null) {
            data = data.filter(
              (d) =>
                d.dateUpdated && d.dateUpdated.includes(filters.dateUpdated)
            );
          }
          if (filters.createdBy != null) {
            data = data.filter((d) =>
              filters.createdBy.includes(getUsernames(d.createdBy))
            );
          }
          if (filters.updatedBy != null) {
            data = data.filter((d) =>
              filters.updatedBy.includes(getUsernames(d.updatedBy))
            );
          }
        }

        const sortedBeneficiaries = data.sort((benf1, benf2) =>
          moment(benf2.dateCreated)
            .format("YYYY-MM-DD HH:mm:ss")
            .localeCompare(
              moment(benf1.dateCreated).format("YYYY-MM-DD HH:mm:ss")
            )
        );

        if (sortedBeneficiaries.length === 0) {
          break;
        }

        sortedBeneficiaries.forEach((beneficiary) => {
          const values = [
            sequence,
            beneficiary.district.code + "/" + beneficiary?.nui,
            getName(beneficiary),
            beneficiary?.gender === "1" ? "M" : "F",
            beneficiary?.entryPoint === "1"
              ? "US"
              : beneficiary?.entryPoint === "2"
              ? "CM"
              : "ES",
            beneficiary?.district?.name,
            getAgeByDate(beneficiary.dateOfBirth) + " anos",
            getBeneficiaryIntervention(beneficiary.id)?.total,
            getBeneficiaryIntervention(beneficiary.id)?.clinicalTotal,
            getBeneficiaryIntervention(beneficiary.id)?.communityTotal,
            beneficiary?.partners?.name,
            getUsernames(beneficiary.createdBy),
            getUsernames(beneficiary.updatedBy),
            moment(beneficiary.enrollmentDate).format("YYYY-MM-DD"),
            moment(beneficiary.dateCreated).format("YYYY-MM-DD"),
            beneficiary.dateUpdated !== null
              ? moment(beneficiary.dateUpdated).format("YYYY-MM-DD")
              : "",
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
      saveAs(blob, `Lista_Beneficiarios_${created}.xlsx`);

      setDataLoading(false);
    } catch (error) {
      // Handle any errors that occur during report generation
      console.error("Error generating XLSX report:", error);
      setDataLoading(false);
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
        title="Painel da Beneficiário"
        bordered={false}
        headStyle={{ color: "#17a2b8" }}
      >
        <Row gutter={16}>
          <Col className="gutter-row">
            <Form.Item name="nui" label="" initialValue={nui}>
              <Input
                placeholder="Pesquisar por NUI"
                value={nui}
                onChange={(e) => setNui(e.target.value)}
              />
            </Form.Item>
          </Col>
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
            <Select
              showSearch
              allowClear
              onClear={() => onClear("userCreator")}
              placeholder="Selecione o utilizador"
              optionFilterProp="children"
              onChange={(e) => onChange(e, "userCreator")}
              onSearch={() => {
                /**Its OK */
              }}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={convertedUserData}
            />
          </Col>

          <Col className="gutter-row" hidden={visibleDistrict === false}>
            <Select
              showSearch
              allowClear
              onClear={() => onClear("district")}
              placeholder="Selecione o distrito"
              optionFilterProp="children"
              onChange={(e) => onChange(e, "district")}
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
            sortDirections={["descend", "ascend"]}
            columns={columns}
            title={(beneficiaries) => (
              <span style={{ display: "flex", justifyContent: "flex-end" }}>
                <Tag color={"geekblue"}>
                  {beneficiaries.length + "/" + searchCounter}
                </Tag>
                <ClickableTag />
              </span>
            )}
            expandable={{
              expandedRowRender: (record) => (
                <div
                  style={{
                    border: "2px solid #d9edf7",
                    backgroundColor: "white",
                  }}
                >
                  <ViewBenefiaryPanel
                    beneficiary={record}
                    handleModalVisible={handleModalVisible}
                    handleViewModalVisible={handleViewModalVisible}
                    handleModalRefVisible={handleModalRefVisible}
                    user={user}
                  />
                </div>
              ),
              rowExpandable: (record) => record.name !== "Not Expandable",
            }}
            dataSource={beneficiaries}
            bordered
            scroll={{ x: 1500 }}
            onChange={handleChange}
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
        {<LoadingModal modalVisible={dataLoading} />}
      </Card>
      <ViewBeneficiary
        {...parentMethods}
        beneficiary={beneficiary}
        modalVisible={modalVisible}
        handleViewModalVisible={handleViewModalVisible}
        handleModalRefVisible={handleModalRefVisible}
        user={user}
      />
      <FormReference
        form={form}
        beneficiary={beneficiary}
        modalVisible={referenceModalVisible}
        addStatus={addStatus}
        handleAdd={handleAddRef}
        handleModalRefVisible={handleModalRefVisible}
        handleRefServicesList={handleRefServicesList}
      />
    </>
  );
};

export default BeneficiaryDashboard;
