import React, { useEffect, useState } from "react";
import { Row, Col, Input, Form, Select, Radio } from "antd";
import "./index.css";
import moment from "moment";
const { Option } = Select;

const StepVulnerabilidadesEspecificas = ({
  form,
  beneficiary,
  firstStepValues,
}: any) => {
  const [gbvTypeEnabled, setGbvTypeEnabled] = useState<any>(true);
  const [gbvTimeEnabled, setGbvTimeEnabled] = useState<any>(true);
  const [minAge, setMinAge] = useState<boolean>();

  useEffect(() => {
    if (beneficiary) {
      form.setFieldsValue({ nui: beneficiary?.nui });
    }
    ageBeneficiary();
  }, [beneficiary]);

  const ageBeneficiary = () => {
    const today = new Date();
    const bday = moment(firstStepValues.date_of_birth).format("YYYY-MM-DD");
    const birthDate = new Date(bday);
    const age = today.getFullYear() - birthDate.getFullYear();
    const validate = age >= 18 ? true : false;

    setMinAge(!validate);
  };
  const gbvVictimChange = async (values: any) => {
    form.setFieldsValue({ vblt_vbg_type: null });
    form.setFieldsValue({ vblt_vbg_time: null });
    setGbvTypeEnabled(values.target.value != 1);
    if (values.target.value != 1) {
      setGbvTimeEnabled(true);
    }
  };

  const gbvTypeChange = async (values: any) => {
    form.setFieldsValue({ vblt_vbg_time: null });
    setGbvTimeEnabled(values == undefined);
  };

  const RequiredFieldMessage = "Obrigatório!";

  return (
    <>
      <Row gutter={24}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="nui-control"
            name="nui"
            label="Código da Beneficiária (NUI)"
            style={{ textAlign: "left" }}
          >
            <Input
              id="nui-input"
              disabled={true}
              style={{ fontWeight: "bold", color: "#17a2b8" }}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="vblt_sexually_active-control"
            name="vblt_sexually_active"
            label="Sexualmente Activa?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltSexuallyActive}
          >
            <Radio.Group id="vblt_sexually_active-options">
              <Radio.Button value={1}>SIM</Radio.Button>
              <Radio.Button value={0}>NÃO</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="vblt_pregnant_or_has_children-control"
            name="vblt_pregnant_or_has_children"
            label="Está ou Já esteve Grávida ou Tem filhos?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltPregnantOrHasChildren}
          >
            <Radio.Group id="vblt_pregnant_or_has_children-options">
              <Radio.Button value={1}>SIM</Radio.Button>
              <Radio.Button value={0}>NÃO</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="vblt_multiple_partners-control"
            name="vblt_multiple_partners"
            label="Relações Múltiplas e Concorrentes?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltMultiplePartners}
          >
            <Radio.Group id="vblt_multiple_partners-options">
              <Radio.Button value={1}>SIM</Radio.Button>
              <Radio.Button value={0}>NÃO</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="vblt_sexual_exploitation-trafficking-victim-control"
            name="vblt_sexual_exploitation_trafficking_victim"
            label="Vítima de Exploração Sexual ou de Tráfico?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltSexualExploitationTraffickingVictim}
          >
            <Radio.Group
              id="vblt_sexual_exploitation-options"
            >
              <Radio.Button value={1}>SIM</Radio.Button>
              <Radio.Button value={0}>NÃO</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="vblt_vbg_victim-control"
            name="vblt_vbg_victim"
            label="Vítima de Violéncia Baseada no Gênero?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltVbgVictim}
          >
            <Radio.Group
              id="vblt_vbg_victim-options"
              onChange={gbvVictimChange}
            >
              <Radio.Button value={1}>SIM</Radio.Button>
              <Radio.Button value={0}>NÃO</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="vblt_vbg_type-control"
            name="vblt_vbg_type"
            label="Tipo de Violéncia"
            rules={[
              { required: !gbvTypeEnabled, message: RequiredFieldMessage },
            ]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltVbgType}
          >
            <Select
              id="vblt_vbg_type-selection"
              size="middle"
              placeholder="Please select"
              disabled={gbvTypeEnabled}
              //defaultValue={['a10', 'c12']}
              onChange={gbvTypeChange}
              style={{ width: "100%" }}
            >
              {["Física", "Sexual", "Psicológica"].map((item) => (
                <Option key={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="vblt_vbg_time-control"
            name="vblt_vbg_time"
            label="Tempo"
            rules={[
              { required: !gbvTimeEnabled, message: RequiredFieldMessage },
            ]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltVbgTime}
          >
            <Select
              id="vblt_vbg_time-selection"
              size="middle"
              placeholder="Please select"
              disabled={gbvTimeEnabled}
              //defaultValue={['a10', 'c12']}
              //onChange={handleChange}
              style={{ width: "100%" }}
            >
              {["+3 Dias", "-3 Dias"].map((item) => (
                <Option key={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="vblt_alcohol_drugs_use-control"
            name="vblt_alcohol_drugs_use"
            label="Uso de Álcool e Drogas?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltAlcoholDrugsUse}
          >
            <Radio.Group id="vblt_alcohol_drugs_use-options">
              <Radio.Button value={1}>SIM</Radio.Button>
              <Radio.Button value={0}>NÃO</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="vblt_sti_history-control"
            name="vblt_sti_history"
            label="Histórico de ITS?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltStiHistory}
          >
            <Radio.Group id="vblt_sti_history-options">
              <Radio.Button value={1}>SIM</Radio.Button>
              <Radio.Button value={0}>NÃO</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8} hidden={minAge}>
          <Form.Item
            id="vblt_sex_worker-control"
            name="vblt_sex_worker"
            label="Trabalhadora do Sexo"
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltSexWorker}
          >
            <Radio.Group id="vblt_sex_worker-options">
              <Radio.Button value={1}>SIM</Radio.Button>
              <Radio.Button value={0}>NÃO</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};
export default StepVulnerabilidadesEspecificas;
