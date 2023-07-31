import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { allDistrict } from "@app/utils/district";
import { queryAll } from "@app/utils/province";
import { allLocality } from "@app/utils/locality";
import { allUsType } from "@app/utils/uSanitaria";
import PropTypes from "prop-types";

const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;
const status = [
  { value: "0", label: "Inactivo" },
  { value: "1", label: "Activo" },
];

const UsForm = ({ form, us, modalVisible, handleModalVisible, handleAdd }) => {
  const [statusEnabled, setStatusEnabled] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [locality, setLocality] = useState<any[]>([]);
  const [usType, setUsType] = useState<any[]>([]);
  const [provDistricts, setProvDistricts] = useState<any[]>([]);
  const [distLocality, setDistLocality] = useState<any[]>([]);

  const RequiredFieldMessage = "Obrigatório!";

  useEffect(() => {
    setStatusEnabled(us !== undefined);
    if (us !== undefined) {
      fetchDistricts(us?.locality?.district?.province?.id.toString());
      fetchLocality(us?.locality?.district?.id.toString());
    }
  }, [us]);

  useEffect(() => {
    const fetchData = async () => {
      const provinces = await queryAll();
      setProvinces(provinces);

      const districts = await allDistrict();
      setDistricts(districts);

      const locality = await allLocality();
      setLocality(locality);

      const usType = await allUsType();
      setUsType(usType);
    };
    fetchData().catch((error) => console.log(error));
  }, []);

  const handleOnChangeProvince = (e) => {
    form.setFieldsValue({ district: null });
    form.setFieldsValue({ locality: null });
    fetchDistricts(e);
  };

  const handleOnChangeDistrict = (e) => {
    form.setFieldsValue({ locality: null });
    fetchLocality(e);
  };

  const fetchDistricts = (province_id) => {
    const districtsByProvince = districts.filter((item) => {
      return item?.province?.id.toString() === province_id;
    });
    setProvDistricts(districtsByProvince);
  };

  const fetchLocality = (district_id) => {
    const localitiesByDistrict = locality.filter((item) => {
      return item?.district?.id.toString() === district_id;
    });
    setDistLocality(localitiesByDistrict);
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
      title="Dados de Registo da Unidade Sanitária"
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
        <Row gutter={12}>
          <Col className="gutter-row" span={7}>
            <Form.Item
              name="province"
              label="Província"
              rules={[{ required: true, message: "Obrigatório" }]}
              initialValue={
                us === undefined
                  ? ""
                  : us?.locality?.district?.province?.id.toString()
              }
            >
              <Select
                placeholder="Seleccione a Província"
                onChange={handleOnChangeProvince}
              >
                {provinces?.map((item) => (
                  <Option key={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={7}>
            <Form.Item
              name="district"
              label="Distrito"
              rules={[{ required: true, message: "Obrigatório" }]}
              initialValue={
                us === undefined ? "" : us?.locality?.district?.id.toString()
              }
            >
              <Select
                placeholder="Seleccione o Distrito"
                onChange={handleOnChangeDistrict}
              >
                {provDistricts?.map((item) => (
                  <Option key={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={7}>
            <Form.Item
              name="locality"
              label="Posto Administrativo"
              rules={[{ required: true, message: "Obrigatório" }]}
              initialValue={us === undefined ? "" : us?.locality?.id.toString()}
            >
              <Select placeholder="Seleccione o Posto Administrativo">
                {distLocality?.map((item) => (
                  <Option key={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={7}>
            <Form.Item
              name="name"
              label="Nome da US"
              rules={[{ required: true, message: RequiredFieldMessage }]}
              initialValue={us?.name}
            >
              <Input placeholder="Insira o Nome da US" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              name="code"
              label="Código da US"
              rules={[{ required: true, message: RequiredFieldMessage }]}
              initialValue={us?.code}
            >
              <Input placeholder="Insira Código da US" />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={7}>
            <Form.Item
              name="usType"
              label="Nível"
              rules={[{ required: true, message: "Obrigatório" }]}
              initialValue={us === undefined ? "" : us?.usType?.id.toString()}
            >
              <Select placeholder="Seleccione o Nível">
                {usType?.map((item) => (
                  <Option key={item.id}>{item.type}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12} hidden={true}>
          <Col span={7}>
            <Form.Item
              name="latitude"
              label="Latitude"
              initialValue={us?.abbreviation}
            >
              <Input placeholder="Insira a abreviação da organização" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              name="longitude"
              label="Longitude"
              initialValue={us?.abbreviation}
            >
              <Input placeholder="Insira a abreviação da organização" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={14}>
            <Form.Item
              name="description"
              label="Descrição"
              initialValue={us?.description}
            >
              <TextArea
                rows={4}
                placeholder="Insira a descrição da Organização"
                maxLength={6}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col className="gutter-row" span={5}>
            <Form.Item
              name="status"
              label="Estado"
              rules={[{ required: true, message: "Obrigatório" }]}
              initialValue={us === undefined ? "1" : us?.status?.toString()}
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

UsForm.propTypes = {
  us: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  handleModalVisible: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
};

export default UsForm;
