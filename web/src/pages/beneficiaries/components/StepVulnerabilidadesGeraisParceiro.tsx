import React, { useState } from "react";
import { Row, Col, Input, Form, Select, Radio } from "antd";
import "./index.css";
const { Option } = Select;

const StepVulnerabilidadesGerais = ({ form, beneficiary }: any) => {
  const [schoolInfoEnabled, setSchoolInfoEnabled] = useState<any>(true);
  const [deficiencyTypeEnabled, setDeficiencyTypeEnabled] = useState<any>(true);

  const isStudentChange = async (values: any) => {
    setSchoolInfoEnabled(values.target.value != 1);
  };

  const onIsDeficientChange = async (values: any) => {
    form.setFieldsValue({ vblt_deficiency_type: null });
    setDeficiencyTypeEnabled(values.target.value != 1);
  };

  const RequiredFieldMessage = "Obrigatório!";
  const LivesWith = [
    "Pais",
    "Avós",
    "Parceiro",
    "Sozinho",
    "Outros Familiares",
  ];

  return (
    <>
      <Row gutter={24} hidden={beneficiary === undefined}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            name="nui"
            label="Código do Pareceiro (NUI)"
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.nui}
          >
            <Input
              disabled={true}
              style={{ fontWeight: "bold", color: "#17a2b8" }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            name="vblt_lives_with"
            label="Com quem mora?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            initialValue={beneficiary?.vbltLivesWith.split(",")}
          >
            <Select
              mode="multiple"
              size="middle"
              placeholder="Please select"
              //defaultValue={['a10', 'c12']}
              //onChange={handleChange}
              style={{ width: "100%" }}
            >
              {LivesWith.map((item) => (
                <Option key={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            name="vblt_is_orphan"
            label="É Orfã?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltIsOrphan}
          >
            <Radio.Group>
              <Radio.Button value={1}>SIM</Radio.Button>
              <Radio.Button value={0}>NÃO</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            name="vblt_is_student"
            label="Vai a Escola?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltIsStudent}
          >
            <Radio.Group onChange={isStudentChange}>
              <Radio.Button value={1}>SIM</Radio.Button>
              <Radio.Button value={0}>NÃO</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            name="vblt_school_grade"
            label="Classe"
            rules={[
              { required: !schoolInfoEnabled, message: RequiredFieldMessage },
            ]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltSchoolGrade}
          >
            <Select
              size="middle"
              allowClear
              placeholder="Please select"
              //defaultValue={['a10', 'c12']}
              //onChange={handleChange}
              style={{ width: "100%" }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                <Option key={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            name="vblt_school_name"
            label="Nome da Instituição de Ensino"
            rules={[
              { required: !schoolInfoEnabled, message: RequiredFieldMessage },
            ]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltSchoolName}
          >
            <Input placeholder="Insira o nome da instituição de ensino" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            name="vblt_is_deficient"
            label="Tem Deficiência?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltIsDeficient}
          >
            <Radio.Group onChange={onIsDeficientChange}>
              <Radio.Button value={1}>SIM</Radio.Button>
              <Radio.Button value={0}>NÃO</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            name="vblt_deficiency_type"
            label="Tipo de Deficiência"
            rules={[
              {
                required: !deficiencyTypeEnabled,
                message: RequiredFieldMessage,
              },
            ]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltDeficiencyType}
          >
            <Select
              size="middle"
              placeholder="Please select"
              disabled={deficiencyTypeEnabled}
              //defaultValue={['a10', 'c12']}
              // onChange={handleChange}
              style={{ width: "100%" }}
            >
              {[
                "Não Anda",
                "Não Fala",
                "Não Vê",
                "Não Ouve",
                "Tem Algum Membro Amputado ou Deformado",
                "Tem Algum Atraso Mental",
              ].map((item) => (
                <Option key={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};
export default StepVulnerabilidadesGerais;
