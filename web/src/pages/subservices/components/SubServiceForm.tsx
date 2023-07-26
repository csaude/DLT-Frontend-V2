import React, { useEffect, useState } from "react";
import { query } from "@app/utils/service";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Radio, Row, Select } from "antd";
import PropTypes from "prop-types";

const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;
const status = [
  { value: "0", label: "Inactivo" },
  { value: "1", label: "Activo" },
];

const SubServiceForm = ({
  form,
  subService,
  modalVisible,
  handleModalVisible,
  handleAdd,
}) => {
  const [services, setServices] = useState<any[]>([]);
  const [statusEnabled, setStatusEnabled] = useState<boolean>(false);

  const RequiredFieldMessage = "Obrigatório!";

  useEffect(() => {
    const fetchData = async () => {
      const services = await query();
      const sortedServices = services.sort((ser1, ser2) =>
        ser1.name.localeCompare(ser2.name)
      );
      setServices(sortedServices);
    };
    fetchData().catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    setStatusEnabled(subService !== undefined);
  }, [subService]);

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
      width={1200}
      centered
      destroyOnClose
      title="Dados de Registo do Sub-Serviço"
      visible={modalVisible}
      onCancel={() => showCloseConfirm()}
      maskClosable={false}
      footer={[
        <Button key="Cancel" onClick={() => showCloseConfirm()}>
          Cancelar
        </Button>,
        <Button key="OK" onClick={handleAdd} type="primary">
          Salvar
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="service"
              label="Serviço"
              rules={[{ required: true, message: RequiredFieldMessage }]}
              initialValue={
                subService ? subService?.service.id + "" : undefined
              }
            >
              <Select
                disabled={subService !== undefined}
                placeholder="Seleccione o Serviço"
              >
                {services.map((item) => (
                  <Option key={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Sub-Serviço"
              rules={[{ required: true, message: RequiredFieldMessage }]}
              initialValue={subService?.name}
            >
              <Input placeholder="Insira o Sub-Serviço" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="remarks"
              label="Observação"
              initialValue={subService?.remarks}
            >
              <TextArea
                rows={2}
                placeholder="Insira a Observação"
                maxLength={600}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item
              name="mandatory"
              label="Mandatório"
              rules={[{ required: true, message: RequiredFieldMessage }]}
              style={{ textAlign: "left" }}
              initialValue={subService?.mandatory}
            >
              <Radio.Group>
                <Radio.Button value={1}>SIM</Radio.Button>
                <Radio.Button value={0}>NÃO</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col className="gutter-row" span={8}>
            <Form.Item
              name="status"
              label="Estado"
              rules={[{ required: true, message: "Obrigatório" }]}
              initialValue={
                subService === undefined ? "1" : subService?.status?.toString()
              }
            >
              <Select disabled={!statusEnabled}>
                {status?.map((item) => (
                  <Option key={item.value}>{item.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

SubServiceForm.propTypes = {
  form: PropTypes.object.isRequired,
  subService: PropTypes.object.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  handleModalVisible: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
};

export default SubServiceForm;
