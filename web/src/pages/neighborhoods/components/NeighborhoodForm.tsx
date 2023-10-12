import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import PropTypes from "prop-types";
import { allDistrict } from "@app/utils/district";
import { allLocality } from "@app/utils/locality";
import { allUs } from "@app/utils/uSanitaria";

const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;
const status = [
  { value: "0", label: "Inactivo" },
  { value: "1", label: "Activo" },
];

const NeighborhoodForm = ({
  form,
  neighborhood,
  modalVisible,
  handleModalVisible,
  handleAdd,
}) => {
  const [districts, setDistricts] = useState<any[]>([]);
  const [localities, setLocalities] = useState<any[]>([]);
  const [us, setUs] = useState<any[]>([]);
  const [distLocality, setDistLocality] = useState<any[]>([]);
  const [localityUs, setLocalityUs] = useState<any[]>([]);
  const [statusEnabled, setStatusEnabled] = useState(false);

  const RequiredFieldMessage = "Obrigatório!";

  useEffect(() => {
    setStatusEnabled(neighborhood !== undefined);
    if (neighborhood !== undefined) {
      fetchLocality(neighborhood?.locality?.district?.id.toString());
      fetchUs(neighborhood?.locality?.id.toString());
    }
  }, [neighborhood]);

  useEffect(() => {
    const fetchData = async () => {
      const districts = await allDistrict();
      setDistricts(districts);

      const locality = await allLocality();
      setLocalities(locality);

      const us = await allUs();
      setUs(us);
    };
    fetchData().catch((error) => console.log(error));
  }, []);

  const handleOnChangeDistrict = (e) => {
    form.setFieldsValue({ locality: null });
    fetchLocality(e);
  };

  const handleOnChangeLocality = (e) => {
    form.setFieldsValue({ us: null });
    fetchUs(e);
  };

  const fetchLocality = (district_id) => {
    const localitiesByDistrict = localities.filter((item) => {
      return item?.district?.id.toString() === district_id;
    });
    setDistLocality(localitiesByDistrict);
  };

  const fetchUs = (locality_id) => {
    const usByLocality = us.filter((item) => {
      return (
        item?.locality?.id.toString() === locality_id &&
        item.usType?.entryPoint === "1"
      );
    });
    setLocalityUs(usByLocality);
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
      title="Registo de Bairro Residencial"
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
          <Col span={7}>
            <Form.Item
              name="name"
              label="Nome da US"
              rules={[{ required: true, message: RequiredFieldMessage }]}
              initialValue={neighborhood?.name}
            >
              <Input placeholder="Insira o Nome da US" />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={7}>
            <Form.Item
              name="district"
              label="Distrito"
              rules={[{ required: true, message: "Obrigatório" }]}
              initialValue={
                neighborhood === undefined
                  ? ""
                  : neighborhood?.locality?.district?.id.toString()
              }
            >
              <Select
                placeholder="Seleccione o Distrito"
                onChange={handleOnChangeDistrict}
              >
                {districts?.map((item) => (
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
              initialValue={
                neighborhood === undefined
                  ? ""
                  : neighborhood?.locality?.id.toString()
              }
            >
              <Select
                placeholder="Seleccione o Posto Administrativo"
                onChange={handleOnChangeLocality}
              >
                {distLocality?.map((item) => (
                  <Option key={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col className="gutter-row" span={7}>
            <Form.Item
              name="us"
              label="US mais Próxima"
              rules={[{ required: true, message: "Obrigatório" }]}
              initialValue={
                neighborhood === undefined
                  ? ""
                  : neighborhood?.us?.id.toString()
              }
            >
              <Select placeholder="Seleccione a US">
                {localityUs?.map((item) => (
                  <Option key={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item
              name="description"
              label="Observação"
              initialValue={neighborhood?.description}
            >
              <TextArea
                rows={4}
                placeholder="Insira a observação"
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
              initialValue={
                neighborhood === undefined
                  ? "1"
                  : neighborhood?.status?.toString()
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

NeighborhoodForm.propTypes = {
  neighborhood: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  handleModalVisible: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
};

export default NeighborhoodForm;
