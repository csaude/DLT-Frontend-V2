import React, { useEffect, useState } from "react";
import {
  message,
  Form,
  Modal,
  Card,
  Row,
  Col,
  Image,
  Table,
  Button,
  Drawer,
  Space,
} from "antd";
import {
  ArrowUpOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  ExclamationCircleFilled,
  DeleteOutlined,
} from "@ant-design/icons";
import emblema from "../../../assets/emblema.png";
import moment from "moment";
import { query } from "../../../utils/beneficiary";
import {
  query as beneficiaryInterventionQuery,
  getInterventionCountByBeneficiaryAndServiceTypeQuery,
  getInterventionCountByBeneficiaryIdAndAgeBandAndLevelQuery,
} from "../../../utils/beneficiaryIntervention";
import ViewIntervention from "./ViewIntervention";
import { calculateAge } from "@app/models/Utils";
import {
  addSubService,
  updateSubService,
  SubServiceParams,
} from "@app/utils/service";

import "antd/dist/antd.css";

import "../styles.css";
import InterventionForm from "./InterventionForm";
import { ADMIN, MENTOR, MNE, SUPERVISOR } from "@app/utils/contants";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { getAgeBandByDate } from "@app/utils/ageRange";
import { getReferencesCountByBeneficiaryQuery } from "@app/utils/reference";
import { loadGeneralIndicators } from "@app/store/reducers/beneficiaryDashboard";

const { confirm } = Modal;

const ViewBenefiaryPanel = ({
  beneficiary,
  handleModalVisible,
  handleViewModalVisible,
  handleModalRefVisible,
  user,
  allowDataEntry,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(beneficiary);
  const [selectedIntervention, setSelectedIntervention] = useState<any>();
  const [interventions, setInterventions] = useState(
    beneficiary?.beneficiariesInterventionses
  );
  const [partner, setPartner] = useState<any>();
  const [visibleName, setVisibleName] = useState<any>(true);
  const beneficiaryDashboardSelector = useSelector(
    (state: any) => state.beneficiaryDashboard
  );

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (beneficiary?.partnerId) {
        const partner = await query(beneficiary?.partnerId);
        setPartner(partner);
      }

      if (
        user.profiles.id === ADMIN ||
        user.profiles.id === MNE ||
        user.profiles.id === SUPERVISOR
      ) {
        setVisibleName(false);
      }
    };
    const fetchBeneficiariesInterventionses = async () => {
      const benIntervs = await beneficiaryInterventionQuery(beneficiary?.id);
      setInterventions(benIntervs);
    };

    fetchData().catch((error) => console.log("---: ", error));
    fetchBeneficiariesInterventionses().catch((err) => console.log(err));
  }, [selectedIntervention]);

  const showDrawer = (record: any) => {
    setVisible(true);
    setSelectedBeneficiary(record);
  };

  const onAddReference = (flag?: boolean, record?: any) => {
    handleModalVisible();
    handleModalRefVisible(flag, record);
  };

  const onAddIntervention = () => {
    form.resetFields();
    setVisible(true);
    setIsAdd(true);
    setSelectedIntervention(undefined);
  };

  const onEditIntervention = (record: any) => {
    form.resetFields();
    setVisible(true);
    setIsAdd(true);
    setSelectedIntervention(record);
  };

  const onViewBeneficiaryPartner = async (flag?: boolean, id?: any) => {
    const beneficiary = await query(id);
    handleViewModalVisible(flag, beneficiary);
  };

  const handleVoidIntervention = async (intervention: any) => {
    intervention.status = 0;
    intervention.beneficiaries = { id: intervention.id.beneficiaryId };
    intervention.date = intervention.id.date;
    intervention.updatedBy = localStorage.user;
    intervention.dateUpdated = new Date();
    const { data } = await updateSubService(intervention);
    setSelectedIntervention(data);
    message.success({
      content: "Excluída com Sucesso!",
      className: "custom-class",
      style: {
        marginTop: "10vh",
      },
    });
  };

  const showCloseConfirm = () => {
    confirm({
      title: "Deseja fechar este formulário?",
      icon: <ExclamationCircleFilled />,
      okText: "Sim",
      okType: "danger",
      cancelText: "Não",
      onOk() {
        setVisible(false);
        setIsAdd(false);
      },
      onCancel() {
        /**Its OK */
      },
    });
  };

  const showConfirmVoid = (data: any) => {
    confirm({
      title: "Deseja Excluir a Intervenção?",
      icon: <ExclamationCircleFilled />,
      okText: "Sim",
      okType: "danger",
      cancelText: "Não",
      onOk() {
        handleVoidIntervention(data);
      },
      onCancel() {
        /**Its OK */
      },
    });
  };

  const showConfirmDuplicate = () => {
    confirm({
      title: "Esta intervenção já foi provida. Deseja prover novamente?",
      icon: <ExclamationCircleFilled />,
      okText: "Sim",
      okType: "danger",
      cancelText: "Não",
      onOk() {
        handleSaveIntervention();
      },
      onCancel() {
        /**Its OK */
      },
    });
  };

  const getInterventionsCount = async (beneficiary) => {
    const ageBand: any = getAgeBandByDate(beneficiary.dateOfBirth);

    const interventionsCount =
      await getInterventionCountByBeneficiaryAndServiceTypeQuery(
        beneficiary.id
      );
    const getPrimaryInterventionsCOunt =
      await getInterventionCountByBeneficiaryIdAndAgeBandAndLevelQuery(
        beneficiary.id,
        ageBand,
        1
      );
    const getSecondaryInterventionsCOunt =
      await getInterventionCountByBeneficiaryIdAndAgeBandAndLevelQuery(
        beneficiary.id,
        ageBand,
        2
      );
    const getContextualInterventionsCOunt =
      await getInterventionCountByBeneficiaryIdAndAgeBandAndLevelQuery(
        beneficiary.id,
        ageBand,
        3
      );

    const getReferencesCOunt = await getReferencesCountByBeneficiaryQuery(
      beneficiary.id
    );

    dispatch(
      loadGeneralIndicators({
        totalOfClinicalInterventions:
          interventionsCount.length > 0 ? interventionsCount[0][2] : 0,
        totalOfCommunityInterventions:
          interventionsCount.length > 0 ? interventionsCount[0][3] : 0,
        totalOfPrimaryInterventions:
          getPrimaryInterventionsCOunt.length > 0
            ? getPrimaryInterventionsCOunt[0][1]
            : 0,
        totalOfSecondaryInterventions:
          getSecondaryInterventionsCOunt.length > 0
            ? getSecondaryInterventionsCOunt[0][1]
            : 0,
        totalOfContextualInterventions:
          getContextualInterventionsCOunt.length > 0
            ? getContextualInterventionsCOunt[0][1]
            : 0,
        totalReferences:
          getReferencesCOunt.length > 0 ? getReferencesCOunt[0][1] : 0,
      })
    );
  };

  const onSubmit = () => {
    const interventionsIds = interventions.map((i) => i.id.subServiceId);

    const subServiceId = form.getFieldValue("subservice");

    if (interventionsIds.includes(Number(subServiceId))) {
      showConfirmDuplicate();
    } else {
      handleSaveIntervention();
    }
  };

  const handleSaveIntervention = async () => {
    form
      .validateFields()
      .then(async (values) => {
        if (selectedIntervention === undefined) {
          const payload: SubServiceParams = {
            id: {
              beneficiaryId: beneficiary?.id,
              subServiceId: values.subservice,
              date: moment(values.dataBeneficio).format("YYYY-MM-DD"),
            },
            beneficiaries: {
              id: "" + beneficiary?.id,
            },
            subServices: {
              id: values.subservice,
            },
            date: moment(values.dataBeneficio).format("YYYY-MM-DD"),
            result: "",
            us: { id: values.location },
            activistId: localStorage.user,
            entryPoint: values.entryPoint,
            provider: values.provider,
            remarks: values.outros,
            endDate: values.endDate
              ? moment(values.endDate).format("YYYY-MM-DD")
              : "",
            status: "1",
            createdBy: localStorage.user,
          };

          const { data } = await addSubService(payload);

          setInterventions((interventions) => [
            ...interventions,
            data.intervention,
          ]);
        } else {
          const payload: SubServiceParams = {
            id: {
              beneficiaryId: beneficiary?.id,
              subServiceId: selectedIntervention.id.subServiceId,
              date: moment(selectedIntervention.id.date).format("YYYY-MM-DD"),
            },
            beneficiaries: {
              id: "" + beneficiary?.id,
            },
            subServices: {
              id: values.subservice,
            },
            date: moment(values.dataBeneficio).format("YYYY-MM-DD"),
            result: "",
            us: { id: values.location },
            activistId: localStorage.user,
            entryPoint: values.entryPoint,
            provider: values.provider,
            remarks: values.outros,
            endDate: values.endDate
              ? moment(values.endDate).format("YYYY-MM-DD")
              : "",
            status: selectedIntervention.status,
            updatedBy: localStorage.user,
            createdBy: selectedIntervention.createdBy,
          };

          const { data } = await updateSubService(payload);

          setInterventions((existingItems) => {
            return existingItems.map((item) => {
              return item.id.beneficiaryId ===
                selectedIntervention.id.beneficiaryId &&
                item.id.subServiceId === selectedIntervention.id.subServiceId &&
                item.id.date === selectedIntervention.id.date
                ? data
                : item;
            });
          });
        }

        message.success({
          content: "Registado com Sucesso!",
          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });

        setVisible(false);
        setIsAdd(false);
        form.resetFields();

        getInterventionsCount(beneficiary);
      })
      .catch((e) => {
        if (e.response?.status == 400) {
          message.error({
            content:
              "A Data de Provisão do Serviço não deve ser inferior a Data da Inscrição!",
            className: "custom-class",
            style: {
              marginTop: "10vh",
            },
          });
        } else {
          message.error({
            content: "Não foi possivel associar a Intervenção!",
            className: "custom-class",
            style: {
              marginTop: "10vh",
            },
          });
        }
      });
  };

  const interventionColumns = [
    {
      title: "Data",
      dataIndex: "",
      key: "date",
      render: (text, record) => (
        <span>{moment(record.id.date).format("YYYY-MM-DD")}</span>
      ),
    },
    {
      title: "Serviço",
      dataIndex: "",
      key: "service",
      render: (text, record) => record.subServices.service.name,
    },
    {
      title: "Intervenções",
      dataIndex: "",
      key: "intervention",
      render: (text, record) =>
        [MENTOR, SUPERVISOR].includes(user.profiles.id) &&
        user.partners.partnerType == 2 &&
        record.subServices.service.id == 9
          ? ""
          : record.subServices.name,
    },
    {
      title: "Ponto de Entrada",
      dataIndex: "",
      key: "entryPoint",
      render: (text, record) => record.us.name,
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
            onClick={() => showDrawer(record)}
          ></Button>
          <Button
            type="primary"
            hidden={
              user?.partners?.partnerType == 2 &&
              record?.subServices.service.serviceType == 1
                ? true
                : user?.partners?.partnerType == 1 &&
                  record?.subServices.service.serviceType == 2
                ? true
                : false
            }
            icon={<EditOutlined />}
            onClick={() => onEditIntervention(record)}
          ></Button>
          <Button
            type="primary"
            hidden={visibleName === true}
            icon={<DeleteOutlined />}
            onClick={() => showConfirmVoid(record)}
          ></Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="site-drawer-render-in-current-wrapper">
        <Card
          //title={` Dados de Registo do Beneficiário: DREAMS1 DREAMS2 ${beneficiary?.name}`}
          bordered={false} //headStyle={{background:"#17a2b8"}}
          bodyStyle={{ margin: 0, marginBottom: "20px", padding: 0 }}
        >
          <Row gutter={16}>
            <Col className="gutter-row" span={8}>
              <Card>
                <div style={{ textAlign: "center" }}>
                  <Image width={50} preview={false} src={emblema} />
                  <br />
                  <span>República de Moçambique</span>
                  <br />
                  <span>Ministério da Saúde</span>
                  <br />
                  <span>Serviços de Saúde Reprodutiva</span>
                  <br />
                  <span>de Adolescente e Jovens</span>
                  <br />
                  <span style={{ fontWeight: "bold", color: "#17a2b8" }}>
                    {`${beneficiary?.district.code}/${beneficiary?.nui}`}
                  </span>
                  <br />
                  <span
                    style={{
                      fontWeight: "bold" /*, textTransform: "uppercase" */,
                    }}
                  >
                    {visibleName === false
                      ? `${beneficiary?.name} ${beneficiary?.surname}`
                      : "DREAMS" + `${beneficiary?.nui}`}
                  </span>
                  <br />
                  <br />
                  <span>Ponto de Referência:</span>
                  <br />
                  <span style={{ color: "#17a2b8" }}>
                    {beneficiary?.neighborhood.name}
                  </span>
                  <br />
                </div>
              </Card>
            </Col>
            <Col className="gutter-row" span={8}>
              <Card
                title="Dados Gerais"
                bordered={true}
                headStyle={{ background: "#17a2b8" }}
                bodyStyle={{
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  height: "244px",
                  textAlign: "left",
                }}
              >
                <Row gutter={8}>
                  <Col
                    className="gutter-row"
                    style={{ fontWeight: "bold", background: "#f3f4f5" }}
                    span={12}
                  >
                    Nacionalidade
                  </Col>
                  <Col
                    className="gutter-row"
                    style={{ background: "#f3f4f5" }}
                    span={12}
                  >
                    Moçambicana
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col
                    className="gutter-row"
                    style={{ fontWeight: "bold" }}
                    span={12}
                  >
                    Província
                  </Col>
                  <Col className="gutter-row" span={12}>
                    {beneficiary?.district.province.name}
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col
                    className="gutter-row"
                    style={{ fontWeight: "bold", background: "#f3f4f5" }}
                    span={12}
                  >
                    Distrito
                  </Col>
                  <Col
                    className="gutter-row"
                    style={{ background: "#f3f4f5" }}
                    span={12}
                  >
                    {beneficiary?.district.name}
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col
                    className="gutter-row"
                    style={{ fontWeight: "bold" }}
                    span={12}
                  >
                    Idade
                  </Col>
                  <Col className="gutter-row" span={12}>
                    {calculateAge(beneficiary?.dateOfBirth)} anos
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col
                    className="gutter-row"
                    style={{ fontWeight: "bold", background: "#f3f4f5" }}
                    span={12}
                  >
                    Sexo
                  </Col>
                  <Col
                    className="gutter-row"
                    style={{ background: "#f3f4f5" }}
                    span={12}
                  >
                    {beneficiary?.gender === "1" ? "M" : "F"}
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col
                    className="gutter-row"
                    style={{ fontWeight: "bold" }}
                    span={12}
                  >
                    Com quem mora?
                  </Col>
                  <Col className="gutter-row" span={12}>
                    {beneficiary?.vbltLivesWith}
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col className="gutter-row" span={8}>
              <Card
                title="Contactos"
                bordered={true}
                headStyle={{ background: "#f2dede" }}
              >
                <span>MZ</span>
                <br />
                <span>{`${beneficiary?.locality?.name}${
                  beneficiary?.address == null
                    ? ""
                    : ", " + beneficiary?.address
                }`}</span>
                <br />
                <span>{beneficiary?.phoneNumber}</span>
                <br />
                <span>{beneficiary?.email}</span>
                <br />
              </Card>
              <br />
              <Card
                title="Parceiro/Acompanhante"
                bordered={true}
                headStyle={{ background: "#17a2b8" }}
              >
                <span>
                  <Button
                    hidden={beneficiary?.partnerId === null}
                    onClick={() =>
                      onViewBeneficiaryPartner(true, beneficiary?.partnerId)
                    }
                    type="primary"
                    style={{
                      background: "#00a65a",
                      borderColor: "#00a65a",
                      borderRadius: "4px",
                    }}
                  >
                    {`${partner?.neighborhood.locality.district.code}/${partner?.nui}`}
                  </Button>
                </span>
                <br />
              </Card>
            </Col>
          </Row>
        </Card>
        <Col className="gutter-row">
          <Card
            title="Indicadores Gerais"
            bordered={true}
            headStyle={{ background: "#17a2b8" }}
            bodyStyle={{
              paddingLeft: "10px",
              paddingRight: "10px",
              height: "244px",
              textAlign: "left",
            }}
          >
            <Row gutter={8}>
              <Col
                className="gutter-row"
                style={{ fontWeight: "bold", background: "#f3f4f5" }}
                span={12}
              >
                Total de Intervenções Clínicas
              </Col>
              <Col
                className="gutter-row"
                style={{ background: "#f3f4f5" }}
                span={12}
              >
                {beneficiaryDashboardSelector.totalOfClinicalInterventions}
              </Col>
            </Row>
            <Row gutter={8}>
              <Col
                className="gutter-row"
                style={{ fontWeight: "bold" }}
                span={12}
              >
                Total de Intervenções Comunitárias
              </Col>
              <Col className="gutter-row" span={12}>
                {beneficiaryDashboardSelector.totalOfCommunityInterventions}
              </Col>
            </Row>
            <Row gutter={8}>
              <Col
                className="gutter-row"
                style={{ fontWeight: "bold", background: "#f3f4f5" }}
                span={12}
              >
                Total de Intervenções Primárias
              </Col>
              <Col
                className="gutter-row"
                style={{ background: "#f3f4f5" }}
                span={12}
              >
                {beneficiaryDashboardSelector.totalOfPrimaryInterventions}
              </Col>
            </Row>
            <Row gutter={8}>
              <Col
                className="gutter-row"
                style={{ fontWeight: "bold" }}
                span={12}
              >
                Total de Intervenções Secundárias
              </Col>
              <Col className="gutter-row" span={12}>
                {beneficiaryDashboardSelector.totalOfSecondaryInterventions}
              </Col>
            </Row>
            <Row gutter={8}>
              <Col
                className="gutter-row"
                style={{ fontWeight: "bold", background: "#f3f4f5" }}
                span={12}
              >
                Total de Intervenções Contextuais
              </Col>
              <Col
                className="gutter-row"
                style={{ background: "#f3f4f5" }}
                span={12}
              >
                {beneficiaryDashboardSelector.totalOfContextualInterventions}
              </Col>
            </Row>
            <Row gutter={8}>
              <Col
                className="gutter-row"
                style={{ fontWeight: "bold" }}
                span={12}
              >
                Total de Referências
              </Col>
              <Col className="gutter-row" span={12}>
                {beneficiaryDashboardSelector.totalReferences}
              </Col>
            </Row>
          </Card>
        </Col>
        <Card
          title="Lista de Intervenções DREAMS"
          extra={
            <Space>
              <Button
                onClick={() => onAddReference(true, beneficiary)}
                type="primary"
                icon={<ArrowUpOutlined />}
                hidden={!allowDataEntry}
                danger
              >
                Referir Beneficiária
              </Button>
              <Button
                onClick={onAddIntervention}
                type="primary"
                icon={<PlusOutlined />}
                hidden={!allowDataEntry}
              >
                Adicionar Serviço Dreams
              </Button>
            </Space>
          }
        >
          <Table
            rowKey={(record?) => `${record.id.subServiceId}${record.id.date}`}
            pagination={false}
            columns={interventionColumns}
            dataSource={interventions}
            bordered
          />
        </Card>
        <Drawer
          title="Intervenções Dreams"
          placement="top"
          closable={false}
          onClose={showCloseConfirm}
          visible={visible}
          maskClosable={false}
          getContainer={false}
          style={{ position: "absolute" }}
          height={440}
          footer={
            <Space>
              <Button onClick={showCloseConfirm}>Cancelar</Button>
              <Button
                htmlType="submit"
                onClick={() => onSubmit()}
                type="primary"
                hidden={!isAdd || !allowDataEntry}
              >
                Salvar
              </Button>
            </Space>
          }
          footerStyle={{ textAlign: "right" }}
        >
          {isAdd ? (
            <Form form={form} layout="vertical" onFinish={() => onSubmit()}>
              {" "}
              <InterventionForm
                record={selectedIntervention}
                beneficiary={beneficiary}
              />
            </Form>
          ) : (
            <ViewIntervention
              record={selectedBeneficiary}
              beneficiary={beneficiary}
              user={user}
            />
          )}
        </Drawer>
      </div>
    </>
  );
};
ViewBenefiaryPanel.propTypes = {
  beneficiary: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleModalVisible: PropTypes.func.isRequired,
  handleViewModalVisible: PropTypes.func.isRequired,
  handleModalRefVisible: PropTypes.func.isRequired,
  allowDataEntry: PropTypes.bool.isRequired,
};

export { ViewBenefiaryPanel };

const ViewBeneficiary = ({
  beneficiary,
  modalVisible,
  handleModalVisible,
  handleViewModalVisible,
  handleModalRefVisible,
  user,
  allowDataEntry,
}) => {
  const okHandle = () => {
    handleModalVisible();
  };

  const showCloseConfirm = () => {
    confirm({
      title: "Deseja fechar este formulário?",
      icon: <ExclamationCircleFilled />,
      okText: "Sim",
      okType: "danger",
      cancelText: "Não",
      onOk() {
        handleModalVisible();
      },
      onCancel() {
        /**Its OK */
      },
    });
  };

  return (
    <Modal
      width={1000}
      centered
      destroyOnClose
      title={" Dados de Registo do Beneficiário"}
      visible={modalVisible}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => showCloseConfirm()}
    >
      <ViewBenefiaryPanel
        beneficiary={beneficiary}
        handleModalVisible={handleModalVisible}
        handleViewModalVisible={handleViewModalVisible}
        handleModalRefVisible={handleModalRefVisible}
        user={user}
        allowDataEntry={allowDataEntry}
      />
    </Modal>
  );
};

ViewBeneficiary.propTypes = {
  beneficiary: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleModalVisible: PropTypes.func.isRequired,
  handleViewModalVisible: PropTypes.func.isRequired,
  handleModalRefVisible: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  allowDataEntry: PropTypes.bool.isRequired,
};

export default ViewBeneficiary;
