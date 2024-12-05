import React, { useEffect, useState } from "react";
import { query as queryUser } from "@app/utils/users";
import { query as queryBeneficiary } from "@app/utils/beneficiary";
import {
  query as queryReferenceService,
  decline as declineReferenceService,
} from "@app/utils/reference-service";
import { queryById } from "@app/utils/reference";
import { query as queryBeneficiaryIntervention } from "@app/utils/beneficiaryIntervention";
import {
  Button,
  Card,
  Col,
  Drawer,
  Form,
  FormInstance,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import moment from "moment";
import ReferenceInterventionForm from "@app/pages/reference/components/ReferenceInterventionForm";
import { addSubService, SubServiceParams } from "@app/utils/service";
import { Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { MENTOR, SUPERVISOR } from "@app/utils/contants";
import { useDispatch, useSelector } from "react-redux";
import {
  resetNextServiceIndex,
  updateNextServiceIndex,
  loadRemarks,
} from "@app/store/reducers/referenceIntervention";
import PropTypes from "prop-types";
import TextArea from "antd/lib/input/TextArea";

const { Text } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const ViewReferencePanel = ({ selectedReference, allowDataEntry }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [reference, setReference] = useState<any>();
  const [user, setUser] = useState<any>();
  const [loggedUser, setLoggedUser] = useState<any>();
  const [interventions, setInterventions] = useState<any>();
  const [services, setServices] = useState<any>();
  const [refServices, setRefServices] = useState<any>();
  const [canAddress, setCanAddress] = useState<boolean>(true);
  const [requiredServices, setRequiredServices] = useState<any>([]);
  const [select, setSelect] = useState<any>([]);
  const [key, setKey] = useState(0);
  const dispatch = useDispatch();
  const index = useSelector((state: any) => state.referenceIntervention.index);
  const [declineReason, setDeclineReason] = useState<any>();
  const [otherReason, setOtherReason] = useState<any>();
  const [otherReasonEnabled, setOtherReasonEnabled] = useState(false);
  const formRef = React.useRef<FormInstance>(null);
  const formFilter = React.useRef<FormInstance>(null);

  const attendToRequiredServices = (reqRefServices) => {
    dispatch(resetNextServiceIndex());
    const selectReqServices = reqRefServices?.filter((item) => {
      return select.includes(item?.id?.serviceId);
    });
    setRequiredServices(selectReqServices);
    if (selectReqServices.length > 0) {
      setVisible(true);
    } else {
      showSelectServices();
    }
  };

  const declineToRequiredServices = (reqRefServices) => {
    const selectReqServices = reqRefServices?.filter((item) => {
      return select.includes(item?.id?.serviceId);
    });
    setRequiredServices(selectReqServices);
    if (selectReqServices.length > 0) {
      setIsOpenServiceDeclineModal(true);
    } else {
      showSelectServices();
    }
  };

  const { confirm } = Modal;

  const showSelectServices = () => {
    confirm({
      title: "Nenhum serviço Selecionado, Selecione os serviços a atender",
      icon: <ExclamationCircleFilled />,
    });
  };

  const onChange = (e: CheckboxChangeEvent, value) => {
    if (e.target.checked) {
      setSelect([...select, value]);
    } else {
      const myArray = select;
      const index = myArray.indexOf(value);
      myArray.splice(index);
      setSelect([...myArray]);
    }
  };
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      const loggedUser = await queryUser(localStorage.user);
      const data1 = await queryBeneficiary(selectedReference.beneficiaries.id);
      const refServices = await queryReferenceService(selectedReference.id);
      const beneficiaryInterventions = await queryBeneficiaryIntervention(
        selectedReference.beneficiaries.id
      );

      setUser(selectedReference.referredBy);
      setLoggedUser(loggedUser);

      if (data1.beneficiariesInterventionses !== undefined) {
        setInterventions(data1.beneficiariesInterventionses);
        const services = data1.beneficiariesInterventionses.map(
          (s) => s.subServices.service
        );
        const uniqueServices: any = [
          ...new Map(services.map((item) => [item["id"], item])).values(),
        ];
        const sortedServices = uniqueServices.sort((ser1, ser2) =>
          ser1.name.localeCompare(ser2.name)
        );
        setServices(sortedServices);
      } else {
        setInterventions(beneficiaryInterventions);
        const services = beneficiaryInterventions.map(
          (s) => s.subServices.service
        );
        const uniqueServices: any = [
          ...new Map(services.map((item) => [item["id"], item])).values(),
        ];
        const sortedServices = uniqueServices.sort((ser1, ser2) =>
          ser1.name.localeCompare(ser2.name)
        );
        setServices(sortedServices);
      }

      if (selectedReference.referencesServiceses !== undefined) {
        setRefServices(selectedReference.referencesServiceses);
      } else {
        setRefServices(refServices);
      }

      setReference(selectedReference);

      if (
        !allowDataEntry ||
        (loggedUser.partners.partnerType ==
          selectedReference.referredBy.partners.partnerType &&
          loggedUser.entryPoint == selectedReference.referredBy.entryPoint) ||
        (loggedUser.partners.partnerType == "2" &&
          selectedReference.serviceType == 1) ||
        (loggedUser.partners.partnerType == "1" &&
          selectedReference.serviceType == 2)
      ) {
        setCanAddress(false);
      }
    };

    fetchData().catch((error) => console.log(error));
  }, []);

  const handleAttendServicesSequence = () => {
    setVisible(true);
    if (requiredServices[index + 1] === undefined) {
      setVisible(false);
    } else {
      dispatch(updateNextServiceIndex());
    }
  };

  const onSubmit = async () => {
    form
      .validateFields()
      .then(async (values) => {
        const payload: SubServiceParams = {
          id: {
            beneficiaryId: reference.beneficiaries.id,
            subServiceId: values.subservice,
            date: moment(values.dataBeneficio).format("YYYY-MM-DD"),
          },
          beneficiaries: {
            id: "" + reference.beneficiaries.id,
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

        dispatch(loadRemarks(values.outros));
        const { data } = await addSubService(payload);

        setInterventions((interventions) => [
          ...interventions,
          data.intervention,
        ]);
        const ref = data.references.filter((r) => r.id == selectedReference.id);

        if (ref.length > 0) {
          setReference(ref[0]);
          setRefServices(ref[0].referencesServiceses);
        }

        message.success({
          content: "Registado com Sucesso!",
          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });

        setVisible(false);

        handleAttendServicesSequence();
      })
      .catch(() => {
        message.error({
          content: "Não foi possivel associar a Intervenção!",
          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });
      });
  };

  const onClose = () => {
    setVisible(false);
  };

  const showCloseConfirm = () => {
    confirm({
      title: "Deseja fechar este formulário?",
      icon: <ExclamationCircleFilled />,
      okText: "Sim",
      okType: "danger",
      cancelText: "Não",
      onOk() {
        onClose();
      },
      onCancel() {
        /**Its OK */
      },
    });
  };

  const getFilteredIntervention = (serviceId) => {
    const filteredIntervention = interventions.filter(
      (i) => i.subServices.service.id == serviceId
    );
    const sortedInterventions = filteredIntervention.sort((int1, int2) =>
      moment(int2.id.date)
        .format("YYYY-MM-DD HH:mm:ss")
        .localeCompare(moment(int1.id.date).format("YYYY-MM-DD HH:mm:ss"))
    );
    return sortedInterventions;
  };

  const servicesColumns = [
    {
      title: "#",
      dataIndex: "",
      key: "order",
      render: (text, record) => refServices.indexOf(record) + 1,
    },
    {
      title: "Serviço",
      dataIndex: "",
      key: "service",
      render: (text, record) => record.services.name,
    },
    {
      title: "Status",
      dataIndex: "",
      key: "intervention",
      render: (text, record) =>
        record.status == 0 ? (
          <Text type="danger">Pendente </Text>
        ) : record.status == 1 ? (
          <Text type="warning">Em curso </Text>
        ) : record.status == 3 ? (
          <Text style={{ color: "brown" }}>Recusado </Text>
        ) : (
          <Text type="success">Atendido </Text>
        ),
    },
    Table.SELECTION_COLUMN,
    {
      title: "Selecionar",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Space>
          <Checkbox
            disabled={record.status >= 2 ? true : false}
            onChange={(e) => onChange(e, record.id.serviceId)}
          />
        </Space>
      ),
    },
  ];

  const serviceColumns = [
    {
      title: "Serviços",
      dataIndex: "",
      key: "service",
      render: (text, record) => record.name,
    },
  ];

  const interventionColumns = [
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
      render: (text, record) => (
        <span>{moment(record.id.date).format("YYYY-MM-DD")}</span>
      ),
    },
    {
      title: "Intervenções",
      dataIndex: "",
      key: "intervention",
      render: (text, record) =>
        [MENTOR, SUPERVISOR].includes(loggedUser.profiles.id) &&
        loggedUser.partners.partnerType == 2 &&
        record.subServices.service.id == 9
          ? ""
          : record.subServices.name,
    },
    {
      title: "Atendido Por",
      dataIndex: "",
      key: "provider",
      render: (text, record) => record.provider,
    },
  ];

  const forceRemount = () => {
    setKey((prevKey) => prevKey + 1);
  };

  const showDeclineConfirm = () => {
    if (declineReason) {
      confirm({
        title: "Deseja recusar este(s) serviço(s)?",
        icon: <ExclamationCircleFilled />,
        okText: "Sim",
        okType: "danger",
        cancelText: "Não",
        onOk() {
          onServiceDecline();
        },
        onCancel() {
          /**Its OK */
        },
      });
    } else {
      confirm({
        title: "Nenhuma Razão foi Selecionada",
        icon: <ExclamationCircleFilled />,
        okText: "Voltar",
        okType: "danger",
        cancelButtonProps: { style: { display: "none" } },
        onOk() {
          /**Its OK */
        },
      });
    }
  };

  const onServiceDecline = async () => {
    const userId = Number(loggedUser.id);
    let res;
    for (const item of requiredServices) {
      if (otherReasonEnabled) {
        res = await declineReferenceService(
          item.id.referenceId,
          item.id.serviceId,
          otherReason,
          userId
        );
      } else {
        res = await declineReferenceService(
          item.id.referenceId,
          item.id.serviceId,
          getCancelDescription(declineReason),
          userId
        );
      }
    }
    setSelect([]);
    message.success({
      content: "Recusado(s) com Sucesso!",
      className: "custom-class",
      style: {
        marginTop: "10vh",
      },
    });

    const reqRefServices = await queryReferenceService(selectedReference.id);
    setRefServices(reqRefServices);
    const ref = await queryById(selectedReference.id);
    setReference(ref);
    forceRemount();
    setIsOpenServiceDeclineModal(false);
  };

  const [isOpenServiceDeclineModal, setIsOpenServiceDeclineModal] =
    useState(false);

  const onReset = () => {
    formRef.current?.resetFields();
    formFilter.current?.resetFields();
    setDeclineReason(undefined);
    setOtherReasonEnabled(false);
    onCloseServiceRefuse();
  };

  const onReasonBeforeChange = (values: any) => {
    formRef.current?.setFieldsValue({ otherReason: null });
    values == 3 ? setOtherReasonEnabled(true) : setOtherReasonEnabled(false);
    setDeclineReason(values);
  };

  const onOtherReasonBeforeChange = (values: any) => {
    setOtherReason(values);
  };
  const RequiredFieldMessage = "Obrigatório!";

  const reasons = [
    {
      id: 1,
      desc: "Beneficiária recusou o serviço",
    },
    {
      id: 2,
      desc: "Beneficiária não necessita do serviço",
    },
    {
      id: 3,
      desc: "Outro Motivo",
    },
  ];

  const getCancelDescription = (declineReasonId) => {
    const result = reasons.filter((item) => item.id == declineReasonId);
    return result[0].desc;
  };

  const onCloseServiceRefuse = () => {
    setIsOpenServiceDeclineModal(false);
  };

  const okHandle = () => {
    console.log("okHandle");
  };

  return (
    <>
      <Modal
        width={1300}
        centered
        destroyOnClose
        title={"Recusa de Servicos"}
        visible={isOpenServiceDeclineModal}
        maskClosable={false}
        onOk={okHandle}
        onCancel={() => onCloseServiceRefuse()}
        footer={
          <Button
            type="primary"
            key="Cancel"
            onClick={() => onCloseServiceRefuse()}
          >
            Sair
          </Button>
        }
      >
        <Card
          title="Motivos de recusa de servico"
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
                  name="declineReason"
                  label="Motivo de Recusa"
                  rules={[{ required: true, message: RequiredFieldMessage }]}
                >
                  <Select
                    allowClear
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
                  <TextArea
                    rows={2}
                    placeholder="Outro Motivo"
                    onChange={(e) => onOtherReasonBeforeChange(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={0}>
              <Col className="gutter-row" span={3}>
                <Button
                  type="primary"
                  onClick={() => showDeclineConfirm()}
                  htmlType="submit"
                  hidden={!allowDataEntry}
                >
                  Confirmar
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
      </Modal>
      <div className="site-drawer-render-in-current-wrapper" key={key}>
        <Card
          bordered={false}
          bodyStyle={{ margin: 0, marginBottom: "20px", padding: 0 }}
        >
          <Row gutter={24}>
            <Col className="gutter-row" span={24}>
              <Card
                title={
                  reference?.referenceNote +
                  " | " +
                  reference?.beneficiaries.district.code +
                  "/" +
                  reference?.beneficiaries.nui
                }
                bordered={true}
                headStyle={{ background: "#17a2b8" }}
                bodyStyle={{
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  height: "120px",
                }}
              >
                <Row>
                  <Col className="gutter-row" span={3}>
                    <b>Data Registo</b>
                  </Col>
                  <Col className="gutter-row" span={3}>
                    <b>Referente</b>
                  </Col>
                  <Col className="gutter-row" span={2}>
                    <b>Contacto</b>
                  </Col>
                  <Col className="gutter-row" span={3}>
                    <b>Data Emissão</b>
                  </Col>
                  <Col className="gutter-row" span={2}>
                    <b>Nº do Livro</b>
                  </Col>
                  <Col className="gutter-row" span={3}>
                    <b>Organização</b>
                  </Col>
                  <Col className="gutter-row" span={3}>
                    <b>Número da Guia</b>
                  </Col>
                  <Col className="gutter-row" span={3}>
                    <b>Tipo Serviço</b>
                  </Col>
                  <Col className="gutter-row" span={2}>
                    <b>Status</b>
                  </Col>
                </Row>
                <hr
                  style={{
                    background: "gray",
                    height: "1px",
                  }}
                />
                <Row>
                  <Col className="gutter-row" span={3}>
                    {moment(reference?.dateCreated).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </Col>
                  <Col className="gutter-row" span={3}>
                    {user?.name + " " + user?.surname}
                  </Col>
                  <Col className="gutter-row" span={2}>
                    {user?.phoneNumber}
                  </Col>
                  <Col className="gutter-row" span={3}>
                    {moment(reference?.date).format("YYYY-MM-DD")}
                  </Col>
                  <Col className="gutter-row" span={2}>
                    {reference?.bookNumber}
                  </Col>
                  <Col className="gutter-row" span={3}>
                    {user?.partners?.name}
                  </Col>
                  <Col className="gutter-row" span={3}>
                    {reference?.referenceCode}
                  </Col>
                  <Col className="gutter-row" span={3}>
                    {reference?.serviceType == 1
                      ? "Serviços Clínicos"
                      : "Serviços Comunitários"}
                  </Col>
                  <Col className="gutter-row" span={2}>
                    {reference?.status == 0 ? (
                      <Text type="danger">Pendente </Text>
                    ) : reference?.status == 1 ? (
                      <Text type="warning">Atendida Parcialmente </Text>
                    ) : (
                      <Text type="success">Atendida </Text>
                    )}
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Card>
        <Card
          bordered={false}
          bodyStyle={{ margin: 0, marginBottom: "20px", padding: 0 }}
        >
          <Row gutter={24}>
            <Col className="gutter-row" span={12}>
              <Card
                title="Serviços Solicitados"
                bordered={true}
                headStyle={{ background: "#17a2b8" }}
                bodyStyle={{ paddingLeft: "10px", paddingRight: "10px" }}
              >
                <Table
                  rowKey={(record?) => `${record?.services?.id}`}
                  columns={servicesColumns}
                  dataSource={refServices}
                  pagination={false}
                />
                <Button
                  htmlType="submit"
                  disabled={
                    !canAddress ||
                    (reference?.status !== 0 && reference?.status !== 1)
                  }
                  onClick={() => attendToRequiredServices(refServices)}
                  type="primary"
                  style={{ marginRight: "8px" }} // Add spacing to the right
                >
                  Atender
                </Button>
                <Button
                  disabled={!canAddress || reference?.status !== 0}
                  danger
                  htmlType="submit"
                  onClick={() => declineToRequiredServices(refServices)}
                  type="primary"
                >
                  Recusar
                </Button>
              </Card>
            </Col>
            <Col className="gutter-row" span={12}>
              <Card
                title={"Intervenções Recebidas"}
                bordered={true}
                headStyle={{ background: "#17a2b8" }}
                bodyStyle={{ paddingLeft: "10px", paddingRight: "10px" }}
              >
                <Table
                  rowKey={(record?) => `${record?.id}`}
                  columns={serviceColumns}
                  dataSource={services}
                  pagination={false}
                  expandable={{
                    expandedRowRender: (record) => (
                      <div
                        style={{
                          border: "2px solid #d9edf7",
                          backgroundColor: "white",
                        }}
                      >
                        <Table
                          rowKey={(record?) =>
                            `${record.id.subServiceId}${record.id.date}`
                          }
                          columns={interventionColumns}
                          dataSource={getFilteredIntervention(record.id)}
                          bordered
                          pagination={false}
                        />
                      </div>
                    ),
                    rowExpandable: (record) => record.name !== "Not Expandable",
                  }}
                />
              </Card>
            </Col>
          </Row>
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
          extra={
            <Space>
              <Button onClick={showCloseConfirm}>Cancelar</Button>
              <Button
                htmlType="submit"
                onClick={() => onSubmit()}
                type="primary"
              >
                Atender
              </Button>
            </Space>
          }
        >
          <Form form={form} layout="vertical" onFinish={() => onSubmit()}>
            <ReferenceInterventionForm
              form={form}
              reference={reference}
              refServices={requiredServices}
              beneficiary={reference?.beneficiaries}
            />
          </Form>
        </Drawer>
      </div>
    </>
  );
};
ViewReferencePanel.propTypes = {
  selectedReference: PropTypes.object.isRequired,
  allowDataEntry: PropTypes.bool.isRequired,
};
export { ViewReferencePanel };

const ViewReferral = ({
  reference,
  modalVisible,
  handleModalVisible,
  allowDataEntry,
}) => {
  const dispatch = useDispatch();

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
        dispatch(loadRemarks(""));
        handleModalVisible();
      },
      onCancel() {
        /**Its OK */
      },
    });
  };

  return (
    <Modal
      width={1300}
      centered
      destroyOnClose
      title={"Dados Referência "}
      visible={modalVisible}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => showCloseConfirm()}
      footer={
        <Button type="primary" key="Cancel" onClick={() => showCloseConfirm()}>
          Sair
        </Button>
      }
    >
      <ViewReferencePanel
        selectedReference={reference}
        allowDataEntry={allowDataEntry}
      />
    </Modal>
  );
};

ViewReferral.propTypes = {
  reference: PropTypes.object.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  handleModalVisible: PropTypes.func.isRequired,
  allowDataEntry: PropTypes.bool.isRequired,
};

export default ViewReferral;
