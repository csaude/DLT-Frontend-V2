import React, { useEffect, useState } from "react";
import {
  edit as editRef,
  Reference,
  pagedQueryByUser,
} from "@app/utils/reference";
import { allDistrict } from "@app/utils/district";
import { allUsersByProfilesAndUser, query as query1 } from "@app/utils/users";
import { query as beneficiaryQuery } from "@app/utils/beneficiary";
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
} from "antd";
import ptPT from "antd/lib/locale-provider/pt_PT";
import "antd/dist/antd.css";
import moment from "moment";
import Highlighter from "react-highlight-words";
import { SearchOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import ViewReferral from "./components/View";
import FormReference from "../beneficiaries/components/FormReference";
import { Title } from "@app/components";
import {
  ADMIN,
  COUNSELOR,
  MENTOR,
  NURSE,
  SUPERVISOR,
} from "@app/utils/contants";
import LoadingModal from "@app/components/modal/LoadingModal";
import { useDispatch } from "react-redux";
import { loadReferers } from "@app/store/actions/users";

const { Text } = Typography;

const ReferenceList: React.FC = () => {
  const [form] = Form.useForm();
  const [references, setReferences] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [reference, setReference] = useState<any>();
  const [services, setServices] = useState<any>([]);
  const [beneficiary, setBeneficiary] = useState<any>(undefined);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [referenceModalVisible, setReferenceModalVisible] =
    useState<boolean>(false);
  const [partners, setPartners] = useState<any[]>([]);
  const [referredPartners, setReferredPartners] = useState<any[]>([]);
  const [referrers, setReferrers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [district, setDistrict] = useState<any[]>([]);
  const [us, setUs] = useState<any[]>([]);
  const [loggedUser, setLoggedUser] = useState<any>(undefined);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const pageSize = 100;
  const [searchNui, setSearchNui] = useState<any>();
  const [nui, setNui] = useState("");
  let data;
  const [dataLoading, setDataLoading] = useState(false);

  const navigate = useNavigate();

  const userId = localStorage.getItem("user");
  const dispatch = useDispatch();

  let searchInput;
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      data = await pagedQueryByUser(
        localStorage.user,
        currentPageIndex,
        pageSize,
        nui
      );
      const districts = await allDistrict();
      const loggedUser = await query1(localStorage.user);

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
      setDistrict(districts);
      setLoggedUser(loggedUser);
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
  }, [modalVisible, currentPageIndex, nui]);

  const handleModalRefVisible = (flag?: boolean) => {
    setReferenceModalVisible(!!flag);
  };

  const handleViewModalVisible = (flag?: boolean, record?: any) => {
    setReference(record);
    setModalVisible(!!flag);
  };

  const onEditRefence = (record?: any) => {
    setReference(record);
    fetchBeneficiary(record?.beneficiaries.id);
    setReferenceModalVisible(true);
  };

  const fetchBeneficiary = async (beneficiaryId) => {
    const beneficiary = await beneficiaryQuery(beneficiaryId);
    setBeneficiary(beneficiary);
  };

  const handleAdd = () => {
    /**Its OK */
  };

  const handleModalVisible = (flag?: boolean) => {
    setModalVisible(!!flag);
  };

  const handleRefUpdate = async (values: any) => {
    const ref: any = reference;
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
        id: ref?.id,
        beneficiaries: {
          id: beneficiary?.id,
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
        status: values.status,
        cancelReason: values.cancelReason,
        otherReason: values.otherReason,
        userCreated: ref?.userCreated,
        dateCreated: ref?.dateCreated,
        updatedBy: localStorage.user,
        dateUpdated: new Date(),
        referencesServiceses: servicesObjects,
      };

      if (servicesObjects.length == 0) {
        message.error({
          content: "Referência sem Intervenção!",
          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });

        setReferenceModalVisible(true);
      } else {
        const { data } = await editRef(payload);
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
          content: "Actualizado com Sucesso!" + data?.referenceNote,
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
    render: (value) =>
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

  const parentMethods = {
    handleAdd: handleAdd,
    handleModalVisible: handleModalVisible,
  };

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

  const handleRefServicesList = (data?: any) => {
    setServices(data);
  };

  const columnsRef = [
    {
      title: "Distrito",
      dataIndex: "",
      key: "type",
      render: (_text, record) => record?.beneficiaries?.district?.name,
      filters: filterItem(district)((i) => i.name),
      onFilter: (value, record) =>
        record?.beneficiaries?.district?.name == value,
      filterSearch: true,
    },
    {
      title: "Organização Referente",
      dataIndex: "",
      key: "type",
      render: (_text, record) => record?.referredBy?.partners?.name,
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
      render: (_text, record) =>
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
      render: (_text, record) => record?.notifyTo?.phoneNumber,
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
      render: (_text, record) =>
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
      render: (_text, record) =>
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
      render: (_text, record) => record?.notifyTo?.partners?.name,
      filters: filterItem(referredPartners)((i) => i?.name),
      onFilter: (value, record) => record?.notifyTo?.partners?.name == value,
      filterSearch: true,
    },
    {
      title: "Ponto de Entrada para Referência",
      dataIndex: "us",
      key: "us",
      render: (_text, record) => record?.us?.name,
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
      render: (_text, record) =>
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
    {
      title: "Acção",
      dataIndex: "",
      key: "x",
      render: (_text, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewModalVisible(true, record)}
          ></Button>
          <Button
            type="primary"
            disabled={
              loggedUser?.profiles.id !== ADMIN &&
              record.referredBy?.partners?.partnerType !==
                loggedUser?.partners?.partnerType
            }
            icon={<EditOutlined />}
            onClick={() =>
              record.status == 0
                ? onEditRefence(record)
                : message.info({
                    content: "Referência já atendida!",
                    className: "custom-class",
                    style: {
                      marginTop: "10vh",
                    },
                  })
            }
          ></Button>
        </Space>
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
    if (searchNui !== undefined) {
      setNui(searchNui);
    }
  };

  return (
    <>
      <Title />
      <Card
        title="Lista de Referências e Contra-Referências"
        bordered={false}
        headStyle={{ color: "#17a2b8" }}
      >
        <Row gutter={16}>
          <Col className="gutter-row" span={4}>
            <Form.Item name="nui" label="NUI" initialValue={searchNui}>
              <Input
                placeholder="Pesquisar por NUI"
                value={searchNui}
                onChange={(e) => setSearchNui(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Button type="primary" onClick={handleGlobalSearch}>
              Pesquisar
            </Button>
          </Col>
        </Row>

        <ConfigProvider locale={ptPT}>
          <Table
            rowKey={(record?) => `${record.id}${record.id.date}`}
            columns={columnsRef}
            dataSource={references}
            bordered
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
      <ViewReferral
        {...parentMethods}
        reference={reference}
        modalVisible={modalVisible}
      />

      <FormReference
        form={form}
        reference={reference}
        handleUpdate={handleRefUpdate}
        modalVisible={referenceModalVisible}
        handleModalRefVisible={handleModalRefVisible}
        handleRefServicesList={handleRefServicesList}
      />
    </>
  );
};
export default ReferenceList;
