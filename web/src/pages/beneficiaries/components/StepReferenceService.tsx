import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Input,
  message,
  Form,
  Select,
  Card,
  Table,
  Space,
  Drawer,
} from "antd";
import "./index.css";
import moment from "moment";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { query as queryUser } from "@app/utils/users";
import { query as beneficiaryInterventionQuery } from "../../../utils/beneficiaryIntervention";
import { queryByTypeAndBeneficiary } from "@app/utils/service";
import { MENTOR, SUPERVISOR } from "@app/utils/contants";
import PropTypes from "prop-types";

const { Option } = Select;
const { TextArea } = Input;

const StepReferenceService = ({
  form,
  reference,
  beneficiary,
  firstStepValues,
  handleRefServicesList,
}: any) => {
  const [user, setUser] = React.useState<any>();

  const [visible, setVisible] = useState<boolean>(false);
  const [services, setServices] = useState<any>([]);
  const [interventionsServices, setInterventionsServices] = useState<any>();
  const [servicesList, setServicesList] = useState<any>();
  const [interventions, setInterventions] = useState<any>();
  const [selectedService, setSelectedService] = useState<any>();

  beneficiary =
    reference !== undefined ? reference?.beneficiaries : beneficiary;

  const showDrawer = () => {
    setVisible(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (firstStepValues !== undefined) {
        const payload = {
          serviceType: firstStepValues?.serviceType,
          beneficiaryId: beneficiary.id,
        };
        const data = await queryByTypeAndBeneficiary(payload);
        const sortedData = data.sort((dist1, dist2) =>
          dist1.name.localeCompare(dist2.name)
        );
        setServicesList(sortedData);
      }

      if (reference !== undefined) {
        const data = await queryUser(reference?.userCreated);
        setUser(data);
      } else {
        const data = await queryUser(localStorage.user);
        setUser(data);
      }
    };
    const fetchBeneficiariesInterventionses = async () => {
      const benIntervs = await beneficiaryInterventionQuery(beneficiary?.id);
      setInterventions(benIntervs);

      const services = benIntervs.map((s) => s.subServices.service);
      const uniqueServices: any = [
        ...new Map(services.map((item) => [item["id"], item])).values(),
      ];
      const sortedServices = uniqueServices.sort((ser1, ser2) =>
        ser1.name.localeCompare(ser2.name)
      );
      setInterventionsServices(sortedServices);
    };

    if (reference !== undefined) {
      const referencesServiceses = reference?.referencesServiceses;

      if (referencesServiceses.length !== 0) {
        referencesServiceses.forEach((item) => {
          const serv = services.filter(
            (s) => s.servico.id === item.services.id
          );

          if (serv.length === 0 || services.length === 0) {
            const service = {
              servico: item?.services,
              description: item?.description,
            };
            setServices((services) => [...services, service]);
          }
          handleRefServicesList(services);
        });
      }
    }

    fetchData().catch((error) => console.log(error));

    fetchBeneficiariesInterventionses().catch((err) => console.log(err));
  }, [firstStepValues]);

  const onRemoveServico = (value: any) => {
    const serv = services.filter((v, i) => i !== services.indexOf(value));
    handleRefServicesList(serv);
    setServices(serv);

    message.warning({
      content:
        value.servico.name +
        " foi removido da lista de serviços a serem providos.",
      className: "custom-class",
      style: {
        marginTop: "10vh",
      },
    });
  };

  const onAddService = () => {
    if (
      selectedService.serviceType == 2 &&
      interventionsServices.some((service) => service.id === selectedService.id)
    ) {
      message.error({
        content: "Este Serviço já foi provido!",
        className: "custom-class",
        style: {
          marginTop: "10vh",
        },
      });
    } else {
      form
        .validateFields()
        .then(async () => {
          const servOther = {
            servico: selectedService,
            description: form.getFieldValue("outros"),
          };
          const serv = services.filter(
            (s) => s.servico.id === servOther.servico.id
          );

          if (serv.length === 0 || services.length === 0) {
            const newServices = [servOther, ...services];

            handleRefServicesList(newServices);
            setServices(newServices);

            message.success({
              content: "Adicionado com Sucesso!",
              className: "custom-class",
              style: {
                marginTop: "10vh",
              },
            });
          } else {
            message.error({
              content: "Já existe este Serviço!",
              className: "custom-class",
              style: {
                marginTop: "10vh",
              },
            });
          }

          setVisible(false);
          form.setFieldValue("outros", "");
        })
        .catch(() => {
          message.error({
            content: "Nenhum Serviço selecionado!",
            className: "custom-class",
            style: {
              marginTop: "10vh",
            },
          });
        });

      setSelectedService(undefined);
      form.setFieldValue("service", undefined);
    }
  };

  const onChangeServico = async (value: any) => {
    const serv = servicesList.filter((item) => {
      return item.id == value;
    })[0];
    setSelectedService(serv);
  };

  const onClose = () => {
    setVisible(false);
    setSelectedService(undefined);
    form.setFieldValue("service", "");
    form.setFieldValue("outros", "");
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
      dataIndex: "order",
      key: "order",
      render: (text, record) => services.indexOf(record) + 1,
    },

    {
      title: "Serviço",
      dataIndex: "",
      key: "servico.id",
      render: (text, record) => record?.servico.name,
    },
    {
      title: "Acção",
      dataIndex: "",
      key: "intervention",
      render: (text, record) => (
        <Button
          disabled={reference?.status == 1}
          type="primary"
          icon={<DeleteFilled />}
          onClick={() => onRemoveServico(record)}
          danger
        ></Button>
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
        [MENTOR, SUPERVISOR].includes(user?.profiles.id) &&
        user?.partners.partnerType == 2 &&
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

  return (
    <>
      <div className="site-drawer-render-in-current-wrapper">
        <Card
          bordered={false}
          bodyStyle={{ margin: 0, marginBottom: "20px", padding: 0 }}
        >
          <Row gutter={24}>
            <Col className="gutter-row" span={24}>
              <Card
                title={
                  firstStepValues?.referenceNote +
                  " | " +
                  beneficiary?.neighborhood.locality.district.code +
                  "/" +
                  beneficiary?.nui
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
                    <b>Data de Registo</b>
                  </Col>
                  <Col className="gutter-row" span={5}>
                    <b>Referente</b>
                  </Col>
                  <Col className="gutter-row" span={3}>
                    <b>Contacto</b>
                  </Col>
                  <Col className="gutter-row" span={3}>
                    <b>Nº do Livro</b>
                  </Col>
                  <Col className="gutter-row" span={4}>
                    <b>Organização</b>
                  </Col>
                  <Col className="gutter-row" span={3}>
                    <b>Número da Guia</b>
                  </Col>
                  <Col className="gutter-row" span={3}>
                    <b>Tipo Serviço</b>
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
                    {moment(firstStepValues?.dateCreated).format(
                      "YYYY-MM-DD HH:MM"
                    )}
                  </Col>
                  <Col className="gutter-row" span={5}>
                    {user?.name + " " + user?.surname}
                  </Col>
                  <Col className="gutter-row" span={3}>
                    {user?.phoneNumber}
                  </Col>
                  <Col className="gutter-row" span={3}>
                    {firstStepValues?.bookNumber}
                  </Col>
                  <Col className="gutter-row" span={4}>
                    {user?.partners.name}
                  </Col>
                  <Col className="gutter-row" span={3}>
                    {firstStepValues?.referenceCode}
                  </Col>
                  <Col className="gutter-row" span={3}>
                    {firstStepValues?.serviceType == "CLINIC"
                      ? "Serviços Clínicos"
                      : "Serviços Comunitários"}
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
                extra={
                  <Button
                    disabled={reference?.status == 1}
                    type="primary"
                    onClick={() => showDrawer()}
                    icon={<PlusOutlined />}
                    style={{
                      background: "#00a65a",
                      borderColor: "#00a65a",
                      borderRadius: "4px",
                    }}
                  >
                    Intervenção
                  </Button>
                }
              >
                <Table
                  rowKey={(record?) => `${record?.servico?.id}`}
                  columns={servicesColumns}
                  dataSource={services}
                  pagination={false}
                />
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
                  dataSource={interventionsServices}
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
          title="Adicionar Serviço Dreams"
          placement="top"
          onClose={onClose}
          visible={visible}
          getContainer={false}
          style={{ position: "absolute" }}
          extra={
            <Space>
              <Button onClick={onClose}>Cancelar</Button>
              <Button
                htmlType="submit"
                onClick={() => onAddService()}
                type="primary"
              >
                Adicionar
              </Button>
            </Space>
          }
        >
          <>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  name="service"
                  label="Serviço Referido"
                  rules={[{ required: true, message: "Obrigatório" }]}
                >
                  <Select
                    placeholder="Selecione um Serviço"
                    onChange={onChangeServico}
                  >
                    {servicesList?.map((item) => (
                      <Option key={item.id}>{item.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="outros" label="Observações">
                  <TextArea
                    rows={2}
                    placeholder="Insira as Observações"
                    maxLength={50}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        </Drawer>
      </div>
    </>
  );
};
StepReferenceService.propTypes = {
  form: PropTypes.object.isRequired,
  reference: PropTypes.object.isRequired,
  beneficiary: PropTypes.object.isRequired,
  firstStepValues: PropTypes.object.isRequired,
  handleRefServicesList: PropTypes.func.isRequired,
};
export default StepReferenceService;
