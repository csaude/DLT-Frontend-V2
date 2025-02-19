import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { queryAll } from "@app/utils/province";
import { allDistrict } from "@app/utils/district";
import { queryDistrictsByProvinces } from "@app/utils/locality";
import PropTypes from "prop-types";

const { Option } = Select;
const { confirm } = Modal;
const status = [
  { value: "0", label: "Inactivo" },
  { value: "1", label: "Activo" },
];

const LocalityForm = ({
  form,
  locality,
  modalVisible,
  handleModalVisible,
  handleAdd,
  allowDataEntry,
}) => {
  const [statusEnabled, setStatusEnabled] = useState(false);
  const [enabledDistricts, setEnabledDistricts] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  const RequiredFieldMessage = "Obrigatório!";

  useEffect(() => {
    setStatusEnabled(locality !== undefined);
  }, [locality]);

  useEffect(() => {
    const fetchData = async () => {
      const provinces = await queryAll();

      setProvinces(provinces);

      if (locality !== undefined) {
        const districts = await allDistrict();
        setDistricts(districts);
      }
    };

    const fetchDistricts = async () => {
      if (!statusEnabled) {
        const dataDistricts = await allDistrict();
        setDistricts(dataDistricts);
      } else {
        setEnabledDistricts(true);
      }
    };

    fetchData().catch((error) => console.log(error));
    fetchDistricts().catch((error) => console.log(error));
  }, []);

  const onChangeProvinces = async (values: any) => {
    if (values.length > 0) {
      const dataDistricts = await queryDistrictsByProvinces({
        provinces: Array.isArray(values) ? values : [values],
      });
      setDistricts(dataDistricts);
      setEnabledDistricts(true);
    } else {
      setDistricts([undefined]);
      setEnabledDistricts(false);
    }

    form.setFieldsValue({ district: null });
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
      width={1200}
      centered
      destroyOnClose
      title="Dados de Registo do Posto Administrativo/Localidade"
      visible={modalVisible}
      onCancel={() => showCloseConfirm()}
      maskClosable={false}
      footer={[
        <Button key="Cancel" onClick={() => showCloseConfirm()}>
          Cancelar
        </Button>,
        <Button
          key="OK"
          onClick={handleAdd}
          hidden={!allowDataEntry}
          type="primary"
        >
          Salvar
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              name="province"
              label="Provincia"
              rules={[{ required: true, message: RequiredFieldMessage }]}
              initialValue={
                locality === undefined
                  ? ""
                  : locality?.district?.province?.id.toString()
              }
            >
              <Select
                placeholder="Seleccione a Província"
                onChange={onChangeProvinces}
              >
                {provinces?.map((item) => (
                  <Option key={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="district"
              label="Distrito"
              rules={[{ required: true, message: RequiredFieldMessage }]}
              initialValue={
                locality === undefined ? "" : locality?.district?.id.toString()
              }
            >
              <Select disabled={!enabledDistricts}>
                {districts?.map((item) => (
                  <Option key={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Posto Administrativo"
              rules={[{ required: true, message: RequiredFieldMessage }]}
              initialValue={locality?.name}
            >
              <Input placeholder="Insira o nome do Posto Administrativo" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="description"
              label="Descrição"
              rules={[{ required: true, message: RequiredFieldMessage }]}
              initialValue={locality?.description}
            >
              <Input placeholder="Insira a Descrição" />
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
                locality === undefined ? "1" : locality?.status?.toString()
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

LocalityForm.propTypes = {
  form: PropTypes.object.isRequired,
  locality: PropTypes.object.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  handleModalVisible: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  allowDataEntry: PropTypes.bool.isRequired,
};

export default LocalityForm;
