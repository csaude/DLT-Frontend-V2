import React from "react";
import { Form, Col, Row, Input, Select, Radio } from "antd";
import { allPartnersByType } from "@app/utils/partners";
import { allUsersByUs } from "@app/utils/users";
import { allUs } from "@app/utils/uSanitaria";

const { Option } = Select;
const { TextArea } = Input;

const areaServicos = [
  { id: "CLINIC", name: "Clinico" },
  { id: "COMMUNITY", name: "Comunitários" },
];
const options = [
  { label: "US", value: "1" },
  { label: "CM", value: "2" },
  { label: "ES", value: "3" },
];

const ReferenceForm = (record: any) => {
  const [us, setUs] = React.useState<any>(undefined);
  const selectedIntervention = record.record;
  const serviceType = selectedIntervention?.subServices?.service.serviceType;

  const [partners, setPartners] = React.useState<any>(undefined);
  const [users, setUsers] = React.useState<any>(undefined);
  const selectedReference = record.record;
  const partner_type = selectedReference?.serviceType;
  const userId = localStorage.getItem("user");

  const selectedOption = options
    ?.filter((o) => o.value === selectedIntervention?.service_type + "")
    .map((filteredOption) => filteredOption.value)[0];

  const onChangeTipoServico = async (value: any) => {
    const data = await allPartnersByType(value);
    setPartners(data);
  };

  const onChangeOrganization = async (value: any) => {
    const data = await allUs(value);
    setUs(data);
  };

  const onChangeUs = async (value: any) => {
    const data = await allUsersByUs(value);
    setUsers(data);
  };

  return (
    <>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            name="reference_note"
            label="Nota Referência"
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={selectedReference?.reference_note}
          >
            <Input placeholder="Nota Referência" disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="beneficiary_id"
            label="Nº de Beneficiário"
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={selectedReference?.nui}
          >
            <Input placeholder="Nº de Beneficiário" disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="refer_to"
            label="Referente"
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={userId}
          >
            <Input placeholder="Referente" disabled />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            name="service_type"
            label="Referir Para"
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={selectedOption}
          >
            <Radio.Group options={options} optionType="button" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="book_number"
            label="Nº do Livro"
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={selectedReference?.book_number}
          >
            <Input placeholder="Nº do Livro" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="reference_code"
            label="Código de Referência no livro"
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={selectedReference?.reference_code}
          >
            <Input placeholder="Código de Referência no livro" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            name="org_type"
            label="Tipo de Serviço"
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={
              serviceType === undefined
                ? undefined
                : serviceType === "1"
                ? "CLINIC"
                : "COMMUNITY"
            }
          >
            <Select
              placeholder="Seleccione o Tipo de Serviço"
              onChange={onChangeTipoServico}
            >
              {areaServicos.map((item) => (
                <Option key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="partner_id"
            label="Organização"
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={
              partner_type === undefined
                ? undefined
                : partner_type === "1"
                ? "CLINIC"
                : "COMMUNITY"
            }
          >
            <Select
              placeholder="Organização"
              onChange={onChangeOrganization}
              disabled={partners === undefined}
            >
              {partners?.map((item) => (
                <Option key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="local"
            label="Local"
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={
              selectedIntervention === undefined
                ? undefined
                : selectedIntervention?.subServices?.id + ""
            }
          >
            <Select
              placeholder="Local"
              onChange={onChangeUs}
              disabled={us === undefined}
              value={undefined}
            >
              {us?.map((item) => (
                <Option key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            name="notify_to"
            label="Notificar ao"
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={
              selectedIntervention === undefined
                ? undefined
                : selectedIntervention?.subServices?.id + ""
            }
          >
            <Select
              placeholder="Notificar ao"
              disabled={users === undefined}
              value={undefined}
            >
              {users?.map((item) => (
                <Option key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            name="remarks"
            label="Observações"
            initialValue={selectedIntervention?.remarks}
          >
            <TextArea rows={2} placeholder="Observações" maxLength={6} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default ReferenceForm;
