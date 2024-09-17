import React, { Fragment, useState } from "react";
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
      <Row gutter={8} hidden={beneficiary === undefined}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="nui-control"
            name="nui"
            label="Código da Beneficiária (NUI)"
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.nui}
          >
            <Input
              id="nui-input"
              disabled={true}
              style={{ fontWeight: "bold", color: "#17a2b8" }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="vblt_lives_with-control"
            name="vblt_lives_with"
            label="Com quem mora?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            initialValue={beneficiary?.vbltLivesWith.split(",")}
          >
            <Select
              id="multiple-selection"
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
            id="vblt_house_sustainer-control"
            name="vblt_house_sustainer"
            label="Sustenta a Casa?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltHouseSustainer}
          >
            <Radio.Group id="vblt_house_sustainer-options">
              <Radio.Button value={1}>SIM</Radio.Button>
              <Radio.Button value={0}>NÃO</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="vblt_is_student-control"
            name="vblt_is_student"
            label="Vai a Escola?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltIsStudent}
          >
            <Radio.Group
              id="vblt_is_student-options"
              onChange={isStudentChange}
            >
              <Radio.Button value={1}>SIM</Radio.Button>
              <Radio.Button value={0}>NÃO</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="vblt_school_grade-control"
            name="vblt_school_grade"
            label="Classe"
            rules={[
              { required: !schoolInfoEnabled, message: RequiredFieldMessage },
            ]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltSchoolGrade}
          >
            <Select
              id="vblt_school_grade-selection"
              size="middle"
              allowClear
              placeholder="Please select"
              // disabled={schoolInfoEnabled}
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
            id="vblt_school_name-control"
            name="vblt_school_name"
            label="Nome da Instituição de Ensino"
            rules={[
              { required: !schoolInfoEnabled, message: RequiredFieldMessage },
            ]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltSchoolName}
          >
            <Input
              id="vblt_school_name-input"
              /*disabled={schoolInfoEnabled}*/ placeholder="Insira o nome da instituição de ensino"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="vblt_is_deficient-control"
            name="vblt_is_deficient"
            label="Tem Deficiência?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltIsDeficient}
          >
            <Radio.Group
              id="vblt_is_deficient-options"
              onChange={onIsDeficientChange}
            >
              <Radio.Button value={1}>SIM</Radio.Button>
              <Radio.Button value={0}>NÃO</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="vblt_deficiency_type-control"
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
              id="vblt_deficiency_type-selection"
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
      <Row gutter={24}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="vblt_married_before-control"
            name="vblt_married_before"
            label="É ou Já foi Casada?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltMarriedBefore}
          >
            <Radio.Group id="vblt_married_before-options">
              <Radio.Button value={1}>SIM</Radio.Button>
              <Radio.Button value={0}>NÃO</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="vblt_idp-control"
            name="vblt_idp"
            label="Deslocado Interno?/IDP?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltIdp}
          >
            <Radio.Group id="vblt_idp-options">
              <Radio.Button value={1}>SIM</Radio.Button>
              <Radio.Button value={0}>NÃO</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            id="vblt_tested_hiv-control"
            name="vblt_tested_hiv"
            label="Já fez Teste de HIV?"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            style={{ textAlign: "left" }}
            initialValue={beneficiary?.vbltTestedHiv}
          >
            <Select
              id="vblt_tested_hiv-selection"
              size="middle"
              placeholder="Please select"
              //defaultValue={['a10', 'c12']}
              //onChange={handleChange}
              style={{ width: "100%" }}
            >
              {["Não", "SIM ( + 3 meses)", "SIM ( - 3 meses)"].map((item) => (
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
