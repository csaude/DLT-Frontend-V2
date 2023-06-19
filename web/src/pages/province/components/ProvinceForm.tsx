import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import PropTypes from "prop-types";

const { Option } = Select;
const { confirm } = Modal;
const status = [
  { value: "0", label: "Inactivo" },
  { value: "1", label: "Activo" },
];

const ProvinceForm = ({
  form,
  province,
  modalVisible,
  handleModalVisible,
  handleAdd,
}) => {
  const [statusEnabled, setStatusEnabled] = useState(false);

  const RequiredFieldMessage = "Obrigatório!";

  useEffect(() => {
    setStatusEnabled(province !== undefined);
  }, [province]);

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
      title="Dados de Registo da Província"
      open={modalVisible}
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
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              name="code"
              label="code"
              rules={[{ required: true, message: RequiredFieldMessage }]}
              initialValue={province?.code}
            >
              <Input placeholder="Insira o code da província" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Nome"
              rules={[{ required: true, message: RequiredFieldMessage }]}
              initialValue={province?.name}
            >
              <Input placeholder="Insira o nome da província" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}></Row>
        <Row gutter={8}>
          <Col className="gutter-row" span={8}>
            <Form.Item
              name="status"
              label="Estado"
              rules={[{ required: true, message: "Obrigatório" }]}
              initialValue={
                province === undefined ? "1" : province?.status?.toString()
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

ProvinceForm.propTypes = {
  form: PropTypes.object.isRequired,
  province: PropTypes.object.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  handleModalVisible: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
};

export default ProvinceForm;
