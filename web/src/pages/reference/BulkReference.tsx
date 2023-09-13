import React, { useEffect, useState } from "react";
import {
  bulkCancel as cancelAll,
  BulkReferenceCancel,
  pagedQueryByUser,
  pagedQueryPendingByUser,
  queryCountByPendingFilters,
} from "@app/utils/reference";
import { allDistrict, allDistrictsByIds } from "@app/utils/district";
import {
  allUsersByProfilesAndUser,
  allUsesByDistricts,
  allUsesByProvinces,
  query as query1,
} from "@app/utils/users";
import { queryDistrictsByProvinces } from "@app/utils/locality";
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Typography,
  Form,
  message,
  ConfigProvider,
  Row,
  Col,
  Select,
  Tag,
  DatePicker,
} from "antd";
import ptPT from "antd/lib/locale-provider/pt_PT";
import "antd/dist/antd.css";
import moment from "moment";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd/es/form";

import { useNavigate } from "react-router-dom";
import { Title } from "@app/components";
import { COUNSELOR, MENTOR, NURSE, SUPERVISOR } from "@app/utils/contants";
import LoadingModal from "@app/components/modal/LoadingModal";
import { useDispatch, useSelector } from "react-redux";
import { loadReferers } from "@app/store/actions/users";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const BulkReference: React.FC = ({ resetModal }: any) => {
  const [form] = Form.useForm();
  const [references, setReferences] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [reference, setReference] = useState<any>();
  const [beneficiary, setBeneficiary] = useState<any>(undefined);
  const [partners, setPartners] = useState<any[]>([]);
  const [referredPartners, setReferredPartners] = useState<any[]>([]);
  const [referrers, setReferrers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [district, setDistrict] = useState<any>();
  const [us, setUs] = useState<any[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const formRef = React.useRef<FormInstance>(null);
  const pageSize = 100;
  let data;
  let countByFilter;
  const [dataLoading, setDataLoading] = useState(false);
  const [otherReasonEnabled, setOtherReasonEnabled] = useState(false);
  const [searchCounter, setSearchCounter] = useState<any>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [searchNui, setSearchNui] = useState<any>("");
  const [searchDistrict, setSearchDistrict] = useState<any>("");
  const [searchUserCreator, setSearchUserCreator] = useState<any>("");

  const [nui, setNui] = useState<any>();
  const [userCreator, setUserCreator] = useState<any>();
  const [districts, setDistricts] = useState<any[]>([]);

  const RequiredFieldMessage = "Obrigatório!";
  const reasons = [
    {
      id: 1,
      desc: "Serviço não provido nos últimos 6 meses",
    },
    {
      id: 2,
      desc: "Beneficiária não encontrada",
    },
    {
      id: 3,
      desc: "Abandono",
    },
    {
      id: 4,
      desc: "Beneficiária recusou o serviço",
    },
    {
      id: 5,
      desc: "Outro Motivo",
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("Referencias Selecionadas: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const userSelector = useSelector((state: any) => state?.user);
  const navigate = useNavigate();

  const userId = localStorage.getItem("user");
  const dispatch = useDispatch();
  const beneficiariesTotal = useSelector(
    (state: any) => state.beneficiary.total
  );

  let searchInput;
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      data = await pagedQueryPendingByUser(
        localStorage.user,
        currentPageIndex,
        pageSize,
        searchNui,
        searchUserCreator,
        searchDistrict
      );

      countByFilter = await queryCountByPendingFilters(
        localStorage.user,
        searchNui,
        searchUserCreator,
        searchDistrict
      );
      setSearchCounter(countByFilter);

      const loggedUser = await query1(localStorage.user);
      if (loggedUser && loggedUser?.districts.length > 0) {
        const dIds = loggedUser?.districts.map((item) => {
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
      } else if (loggedUser && loggedUser.provinces.length > 0) {
        const pIds = loggedUser?.provinces.map((item) => {
          return item.id + "";
        });

        const dataUsers = await allUsesByProvinces({ provinces: pIds });
        const dataDistrict = await queryDistrictsByProvinces({
          provinces: pIds,
        });

        setDistricts(dataDistrict);
      } else {
        const allUser = userSelector?.users;

        const sortedUsers = allUser.sort((user1, user2) =>
          user1[1].localeCompare(user2[1])
        );

        const dataDistricts = await allDistrict();

        const sortedDistricts = dataDistricts.sort((dist1, dist2) =>
          dist1.name.localeCompare(dist2.name)
        );

        setDistricts(sortedDistricts);
      }

      const existingUs = data
        .map((reference) => reference.us)
        .filter(
          (value, index, self) =>
            self.findIndex((v) => v?.id === value?.id) === index
        );
      const referrers = data
        .map((reference) => reference.referredBy)
        .filter(
          (value, index, self) =>
            self.findIndex((v) => v?.id === value?.id) === index
        );
      const referreds = data
        .map((reference) => reference.notifyTo)
        .filter(
          (value, index, self) =>
            self.findIndex((v) => v?.id === value?.id) === index
        );
      const referringPartners = referrers
        .map((referrer) => referrer.partners)
        .filter(
          (value, index, self) =>
            self.findIndex((v) => v?.id === value?.id) === index
        );
      const referredPartners = referreds
        .map((referred) => referred?.partners)
        .filter(
          (value, index, self) =>
            self.findIndex((v) => v?.id === value?.id) === index
        );

      const sortedReferences = data.sort(
        (ref1, ref2) =>
          ref1.status - ref2.status ||
          moment(ref2.dateCreated)
            .format("YYYY-MM-DD HH:mm:ss")
            .localeCompare(
              moment(ref1.dateCreated).format("YYYY-MM-DD HH:mm:ss")
            )
      );
      setDataLoading(false);

      setReferences(sortedReferences);
      setPartners(referringPartners);
      setReferredPartners(referredPartners);
      setReferrers(referrers);
      setUsers(referreds);
      setUs(existingUs);
    };

    fetchData()
      .then()
      .catch((error) => console.log(error));

    const fetchReferersUsers = async () => {
      const payload = {
        profiles: [SUPERVISOR, MENTOR, NURSE, COUNSELOR].toString(),
        userId: Number(userId),
      };

      const referers = await allUsersByProfilesAndUser(payload);
      dispatch(loadReferers(referers));
    };

    fetchReferersUsers().catch((error) => console.log(error));
  }, [currentPageIndex, searchNui, searchUserCreator, searchDistrict]);

  const handleRefUpdate = async (values: any) => {
    const ref: any = reference;
    if (values !== undefined) {
      // const ids = selectedRowKeys.map((e: any) => {
      //   const listIds: any = {
      //     id: e,
      //   };
      //   return listIds;
      // });

      const payload: BulkReferenceCancel = {
        ids: selectedRowKeys,
        status: "3",
        cancelReason: values.cancelReason,
        otherReason: values.otherReason,
        updatedBy: localStorage.user,
        dateUpdated: new Date(),
      };

      if (selectedRowKeys.length == 0) {
        message.error({
          content: "Nenhuma referência selencionada!",
          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });
      } else {
        const { data } = await cancelAll(payload);
        const allReferences: any = await pagedQueryByUser(
          localStorage.user,
          currentPageIndex,
          pageSize,
          nui
        );
        const sortedReferences = allReferences.sort(
          (ref1, ref2) =>
            ref1.status - ref2.status ||
            moment(ref2.dateCreated)
              .format("YYYY-MM-DD HH:mm:ss")
              .localeCompare(
                moment(ref1.dateCreated).format("YYYY-MM-DD HH:mm:ss")
              )
        );
        setReferences(sortedReferences);

        message.success({
          content: "Referências canceladas com Sucesso!",
          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });

        navigate("/bulkReference");
      }
    }
  };

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
          placeholder={"Pesquisar "}
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
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (value, record) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={value ? value.toString() : ""}
        />
      ) : (
        value
      ),
  });

  const filterItem = (data) => (formatter) =>
    data.map((item) => ({
      text: formatter(item),
      value: formatter(item),
    }));

  const getColumnSearchBenProps = (dataIndex: any) => ({
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
          placeholder={"Pesquisar pelo nui da Beneficiária"}
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
      record.beneficiaries?.nui
        ? record?.beneficiaries?.nui
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (value, record) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={value ? "" : record?.beneficiaries?.nui}
        />
      ) : (
        record?.beneficiaries?.nui
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

  const columnsRef = [
    {
      title: "Distrito",
      dataIndex: "",
      key: "type",
      render: (text, record) => record?.beneficiaries?.district?.name,
      filters: filterItem(districts)((i) => i.name),
      onFilter: (value, record) =>
        record?.beneficiaries?.district?.name == value,
      filterSearch: true,
    },
    {
      title: "Organização Referente",
      dataIndex: "",
      key: "type",
      render: (text, record) => record?.referredBy?.partners?.name,
      filters: filterItem(partners)((i) => i.name),
      onFilter: (value, record) => record?.referredBy?.partners?.name == value,
      filterSearch: true,
    },
    {
      title: "Data Registo",
      dataIndex: "dateCreated",
      key: "dateCreated",
      render: (val: string) => (
        <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>
      ),
    },
    {
      title: "Nota Referência",
      dataIndex: "referenceNote",
      key: "",
      ...getColumnSearchProps("referenceNote"),
    },
    {
      title: "Código do Beneficiário",
      dataIndex: "beneficiaries.nui",
      key: "",
      ...getColumnSearchBenProps("beneficiaries.nui"),
    },
    {
      title: "Referente",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (text, record) =>
        record?.referredBy?.name + " " + record?.referredBy?.surname,
      filters: filterItem(referrers)((i) => i.name + " " + i.surname),
      onFilter: (value, record) =>
        referrers
          .filter((user) => record.referredBy.id == user.id)
          .map(
            (filteredUser) =>
              `${filteredUser.name} ` + `${filteredUser.surname}`
          )[0] == value,
      filterSearch: true,
    },
    {
      title: "Contacto",
      dataIndex: "",
      key: "",
      render: (text, record) => record?.notifyTo?.phoneNumber,
    },
    {
      title: "Data Emissão",
      dataIndex: "date",
      key: "date",
      render: (val: string) => <span>{moment(val).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Notificar ao",
      dataIndex: "record.notifyTo.name",
      key: "",
      render: (text, record) =>
        record?.notifyTo?.name + " " + record?.notifyTo?.surname,
      filters: filterItem(users)((i) => i?.name + " " + i?.surname),
      onFilter: (value, record) =>
        users
          .filter((user) => record.notifyTo?.id == user.id)
          .map(
            (filteredUser) =>
              `${filteredUser?.name} ` + `${filteredUser?.surname}`
          )[0] == value,
      filterSearch: true,
    },
    {
      title: "Ref. Para",
      dataIndex: "record.notifyTo.entryPoint",
      key: "record.notifyTo.entryPoint",
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
      onFilter: (value, record) => record?.notifyTo?.entryPoint == value,
      filterSearch: true,
      render: (text, record) =>
        record.notifyTo?.entryPoint == 1 ? (
          <Text>US </Text>
        ) : record.notifyTo?.entryPoint == 2 ? (
          <Text>CM </Text>
        ) : (
          <Text>ES </Text>
        ),
    },
    {
      title: "Organização Referida",
      dataIndex: "",
      key: "",
      render: (text, record) => record?.notifyTo?.partners?.name,
      filters: filterItem(referredPartners)((i) => i?.name),
      onFilter: (value, record) => record?.notifyTo?.partners?.name == value,
      filterSearch: true,
    },
    {
      title: "Ponto de Entrada para Referência",
      dataIndex: "us",
      key: "us",
      render: (text, record) => record?.us?.name,
      filters: filterItem(us)((i) => i?.name),
      onFilter: (value, record) => record?.us?.name == value,
      filterSearch: true,
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Pendente",
          value: 0,
        },
        {
          text: "Atendida Parcialmente",
          value: 1,
        },
        {
          text: "Atendida",
          value: 2,
        },
      ],
      onFilter: (value, record) => record?.status == value,
      filterSearch: true,
      render: (text, record) =>
        record.status == 0 ? (
          <Text type="danger">Pendente </Text>
        ) : record.status == 1 ? (
          <Text type="warning">Atendida Parcialmente </Text>
        ) : record.status == 2 ? (
          <Text type="success">Atendida </Text>
        ) : (
          ""
        ),
    },
  ];

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

  const onReset = () => {
    formRef.current?.resetFields();
  };

  const onReasonBeforeChange = (values: any) => {
    formRef.current?.setFieldsValue({ otherReason: null });
    values == 5 ? setOtherReasonEnabled(true) : setOtherReasonEnabled(false);
  };

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
      const worksheet = workbook.addWorksheet("Lista_Referencias");

      const headers = [
        "#",
        "Distrito",
        "Organização Referente",
        "Referido em",
        "Nota Referência",
        "Código do Beneficiário",
        "Referente",
        "Contacto",
        "Notificar ao",
        "Ref. Para",
        "Organização Referida",
        "Ponto de Entrada para Referência",
        "Criado em",
        "Estado",
      ];

      const headerRow = worksheet.getRow(1);
      headers.forEach((header, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.value = header;
        cell.font = { bold: true };
      });

      const user = await query1(localStorage.user);

      const lastPage = Math.ceil(beneficiariesTotal / pageElements);

      let sequence = 1;

      for (let i = 0; i < lastPage; i++) {
        data = await pagedQueryByUser(
          localStorage.user,
          i,
          pageElements,
          searchNui,
          searchUserCreator,
          searchDistrict
        );

        const sortedReferences = data.sort((benf1, benf2) =>
          moment(benf2.dateCreated)
            .format("YYYY-MM-DD HH:mm:ss")
            .localeCompare(
              moment(benf1.dateCreated).format("YYYY-MM-DD HH:mm:ss")
            )
        );

        if (sortedReferences.length === 0) {
          break;
        }

        sortedReferences.forEach((reference) => {
          const values = [
            sequence,
            reference.beneficiaries?.district?.name,
            reference.beneficiaries?.partners?.name,
            moment(reference.date).format("YYYY-MM-DD"),
            reference.referenceNote,
            reference.beneficiaries.district.code +
              "/" +
              reference.beneficiaries?.nui,
            reference.referredBy?.name + " " + reference.referredBy?.surname,
            reference.beneficiaries?.phoneNumber,
            reference.notifyTo?.name + " " + reference.notifyTo?.surname,
            reference.beneficiaries?.entryPoint === "1"
              ? "US"
              : reference.beneficiaries?.entryPoint === "2"
              ? "CM"
              : "ES",
            reference.notifyTo?.partners?.name,
            reference.us?.name,
            moment(reference.dateCreated).format("YYYY-MM-DD"),
            reference.status === 1
              ? "Pendente"
              : reference.status === 2
              ? "Atendido"
              : "Cancelado",
          ];
          sequence++;
          worksheet.addRow(values);

          const textStyling = {
            fontSimple: { color: { argb: "FF800000" } },
            font: { bold: true, color: { argb: "FF800000" } },
          };

          worksheet.eachRow((row, rowNumber) => {
            const cell5 = row.getCell(5);
            cell5.font = textStyling.fontSimple;
            const cell6 = row.getCell(6);
            cell6.font = textStyling.font;
            const cell7 = row.getCell(7);
            cell7.font = textStyling.font;
            const cell8 = row.getCell(8);
            cell8.font = textStyling.font;

            const cellStatus = row.getCell("N");
            if (cellStatus.value === "Pendente") {
              cellStatus.font = { bold: true, color: { argb: "FF800000" } }; // Red color
            } else if (cellStatus.value === "Atendido") {
              cellStatus.font = { bold: true, color: { argb: "004000" } }; // Green color
            } else {
              cellStatus.font = { bold: true };
            }
          });

          headers.forEach((header, index) => {
            const cell = headerRow.getCell(index + 1);
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.value = header;
            cell.font = { bold: true };
          });
        });
      }

      const created = moment().format("YYYYMMDD_hhmmss");
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `Lista_Referencias_${created}.xlsx`);

      setDataLoading(false);
    } catch (error) {
      // Handle any errors that occur during report generation
      console.error("Error generating XLSX report:", error);
      setDataLoading(false);
      // Display an error message using your preferred method (e.g., toast.error)
      toast.error("An error occurred during report generation.");
    }
  };

  return (
    <>
      <Title />
      <Card
        title="Lista de Referências e Contra-Referências Pendentes"
        bordered={false}
        headStyle={{ color: "#17a2b8" }}
      >
        <Row gutter={5}>
          <Col span={12}>
            <Card
              title="FILTROS"
              bordered={true}
              headStyle={{ background: "#17a2b8", color: "#fff" }}
            >
              <Row gutter={30}>
                <Col className="gutter-row" span={12}>
                  <Form.Item name="start_date" label="Data Inicio">
                    <DatePicker
                      // defaultPickerValue={moment(getMaxDate(), "YYYY-MM-DD")}
                      inputReadOnly={true}
                      style={{ width: "100%" }}
                      placeholder="Data Inicio"
                    />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Form.Item name="end_date" label="Data Fim">
                    <DatePicker
                      // defaultPickerValue={moment(getMaxDate(), "YYYY-MM-DD")}
                      inputReadOnly={true}
                      style={{ width: "100%" }}
                      placeholder="Data Inicio"
                    />
                  </Form.Item>
                </Col>
                {/* <Col className="gutter-row"> */}
                {/* <Form.Item
                    name="nui"
                    // label="Data Inicio"
                    initialValue={searchNui}
                  >
                    <Input
                      placeholder="Pesquisar por NUI"
                      value={searchNui}
                      onChange={(e) => setNui(e.target.value)}
                    />
                  </Form.Item> */}
                {/* </Col> */}
                {/* <Col className="gutter-row" hidden={visibleDistrict === false}>
                  <Form.Item name="nui" initialValue={searchNui}>
                    <Select
                      showSearch
                      allowClear
                      onClear={() => onClear("district")}
                      placeholder="Selecione o distrito"
                      optionFilterProp="children"
                      onChange={(e) => onChange(e, "district")}
                      onSearch={() => {
                      }}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={convertedDistrictsData}
                    />
                  </Form.Item>
                </Col> */}
              </Row>
              <Row gutter={50}>
                <Col className="gutter-row" span={12}>
                  <Button type="primary" onClick={handleGlobalSearch}>
                    Pesquisar
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="Detalhes do cancelamento das Referências"
              bordered={true}
              headStyle={{ background: "#3366b8", color: "#fff" }}
            >
              <Form
                ref={formRef}
                name="ref"
                initialValues={{ remember: true }}
                autoComplete="off"
              >
                <Row gutter={30}>
                  <Col className="gutter-row" span={12}>
                    <Form.Item
                      name="cancelReason"
                      label="Motivo de Cancelamento"
                      rules={[
                        { required: true, message: RequiredFieldMessage },
                      ]}
                    >
                      <Select
                        allowClear
                        onClear={() => onClear("reason")}
                        placeholder="Selecione Aqui"
                        onChange={(e) => onReasonBeforeChange(e)}
                      >
                        {reasons.map((item) => (
                          <Option key={item.id}>{item.desc}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col
                    className="gutter-row"
                    span={12}
                    hidden={!otherReasonEnabled}
                  >
                    <Form.Item
                      name="otherReason"
                      label="Outro Motivo"
                      rules={[
                        {
                          required: otherReasonEnabled,
                          message: RequiredFieldMessage,
                        },
                      ]}
                    >
                      <TextArea rows={2} placeholder="Outro Motivo" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={0}>
                  <Col className="gutter-row" span={3}>
                    <Button
                      type="primary"
                      onClick={handleRefUpdate}
                      htmlType="submit"
                    >
                      Salvar
                    </Button>
                  </Col>
                  <Col className="gutter-row" span={4}>
                    <Button type="primary" onClick={onReset}>
                      Cancelar
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
        <ConfigProvider locale={ptPT}>
          <Table
            rowKey={(record?) => `${record.id}`}
            rowSelection={rowSelection}
            columns={columnsRef}
            title={(references) => (
              <span style={{ display: "flex", justifyContent: "flex-end" }}>
                <Tag color={"geekblue"}>
                  {references.length + "/" + searchCounter}
                </Tag>
                <ClickableTag />
              </span>
            )}
            dataSource={references}
            bordered
            scroll={{ x: 1500 }}
          ></Table>
          <Space>
            <Button
              disabled={currentPageIndex === 0}
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
export default BulkReference;
