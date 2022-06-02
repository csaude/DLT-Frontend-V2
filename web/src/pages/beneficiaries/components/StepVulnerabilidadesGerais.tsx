import React, { Fragment, useEffect, useState } from 'react';
import { Badge, Button, Steps, Row, Col, Input, message, Space, Form, Tabs, Modal, DatePicker, Checkbox, Select, Radio, Divider } from 'antd';
import './index.css';
const { Option } = Select;
const { Step } = Steps;

const StepVulnerabilidadesGerais = ({ form }: any) => {
    const [isDateRequired, setIsDateRequired] = useState<any>(true);

    const RequiredFieldMessage = "Campo Obrigatório!";
    const LivesWith = ['Pais', 'Avós', 'Parceiro', 'Sozinho', 'Outros Familiares'];

    return (
        <>
            <Row gutter={24}>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="VbltLivesWith"
                        label="Com quem mora?"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                    >
                        <Select
                            mode="multiple"
                            size='middle'
                            placeholder="Please select"
                            //defaultValue={['a10', 'c12']}
                            //onChange={handleChange}
                            style={{width: '100%',}}
                        >
                            {LivesWith.map(item => (
                                <Option key={item}>{item}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="VbltHouseSustainer"
                        label="Sustenta a Casa?"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                    >
                        <Radio.Group>
                            <Radio.Button value="1">SIM</Radio.Button>
                            <Radio.Button value="0">NÃO</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="VbltIsOrphan"
                        label="É Orfã?"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                    >
                        <Radio.Group>
                            <Radio.Button value="1">SIM</Radio.Button>
                            <Radio.Button value="0">NÃO</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="VbltIsStudent"
                        label="Vai a Escola?"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                    >
                        <Radio.Group>
                            <Radio.Button value="1">SIM</Radio.Button>
                            <Radio.Button value="0">NÃO</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="VbltSchoolGrade"
                        label="Classe"
                        style={{ textAlign: 'left' }}
                    >
                        <Select
                            size='middle'
                            placeholder="Please select"
                            //defaultValue={['a10', 'c12']}
                            //onChange={handleChange}
                            style={{width: '100%',}}
                        >
                            {['1','2','3','4','5','6','7','8','9','10','11','12'].map(item => (
                                <Option key={item}>{item}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="VbltSchoolName"
                        label="Nome da Instituição de Ensino"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                    >
                        <Input placeholder="Insira o nome da instituição de ensino" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="VbltIsDeficient"
                        label="Tem Deficiência?"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                    >
                        <Radio.Group>
                            <Radio.Button value="1">SIM</Radio.Button>
                            <Radio.Button value="0">NÃO</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="VbltDeficiencyType"
                        label="Tipo de Deficiência"
                        style={{ textAlign: 'left' }}
                    >
                        <Select
                            size='middle'
                            placeholder="Please select"
                            //defaultValue={['a10', 'c12']}
                            //onChange={handleChange}
                            style={{width: '100%',}}
                        >
                            {['Não Anda','Não Fala','Não Vê','Não Ouve','Tem Algum Membro Amputado ou Deformado'].map(item => (
                                <Option key={item}>{item}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="VbltMarriedBefore"
                        label="Já foi Casada?"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                    >
                        <Radio.Group>
                            <Radio.Button value="1">SIM</Radio.Button>
                            <Radio.Button value="0">NÃO</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="VbltPregnantBefore"
                        label="Já esteve Gravida?"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                    >
                        <Radio.Group>
                            <Radio.Button value="1">SIM</Radio.Button>
                            <Radio.Button value="0">NÃO</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="VbltChildren"
                        label="Tem Filhos?"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                    >
                        <Radio.Group>
                            <Radio.Button value="1">SIM</Radio.Button>
                            <Radio.Button value="0">NÃO</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="VbltPregnantOrBreastfeeding"
                        label="Está Grávida ou a amamentar?"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                    >
                        <Radio.Group>
                            <Radio.Button value="1">SIM</Radio.Button>
                            <Radio.Button value="0">NÃO</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="VbltIsEmployed"
                        label="Trabalha?"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                    >
                        <Select
                            size='middle'
                            placeholder="Please select"
                            //defaultValue={['a10', 'c12']}
                            //onChange={handleChange}
                            style={{width: '100%',}}
                        >
                            {['Não Trabalha','Empregada Doméstica','Babá (Cuida das Crianças)','Outros'].map(item => (
                                <Option key={item}>{item}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="VbltTestedHiv"
                        label="Já fez Teste de HIV?"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                    >
                        <Select
                            size='middle'
                            placeholder="Please select"
                            //defaultValue={['a10', 'c12']}
                            //onChange={handleChange}
                            style={{width: '100%',}}
                        >
                            {['Não','SIM ( + 3 meses)','SIM ( - 3 meses)'].map(item => (
                                <Option key={item}>{item}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>



        </>
    );
}
export default StepVulnerabilidadesGerais;