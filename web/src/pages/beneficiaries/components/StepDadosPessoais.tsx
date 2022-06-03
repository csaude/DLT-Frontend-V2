import React, { Fragment, useEffect, useState } from 'react';
import { Badge, Button, Steps, Row, Col, Input, message, Space, Form, Tabs, Modal, DatePicker, Checkbox, Select, Radio, Divider } from 'antd';
import './index.css';
const { Option } = Select;
const { Step } = Steps;

const StepDadosPessoais = ({ form }: any) => {
    const [isDateRequired, setIsDateRequired] = useState<any>(true);

    const RequiredFieldMessage = "Campo Obrigatório!";
    const Idades = ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];

    const onChangeCheckbox = (e) => {
        setIsDateRequired(!e.target.checked);
    }

    return (
        <>
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="surname"
                        label="Apelido"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                    >
                        <Input placeholder="Insira o apelido do Beneficiário" />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="nick_name"
                        label="Nome"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                    >
                        <Input placeholder="Insira o nome do Beneficiário" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    <Row >
                        <Col span={10}>
                            <Form.Item
                                name="date_of_birth"
                                label="Data Nascimento"
                                rules={[{ required: isDateRequired, message: RequiredFieldMessage }]}
                            >
                                <DatePicker disabled={!isDateRequired} style={{ width: '100%' }} placeholder="Selecione a data" />
                            </Form.Item>
                        </Col>
                        <Col span={14}>
                            <Checkbox style={{ marginTop: '30px' }} onChange={onChangeCheckbox} > <span style={{ color: '#008d4c', fontWeight: 'normal' }}>Não Conhece a Data de Nascimento</span> </Checkbox>
                        </Col>
                    </Row>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="age"
                        label="Idade (em anos)"
                        rules={[{ required: !isDateRequired, message: RequiredFieldMessage }]}
                    >
                        <Select disabled={isDateRequired} placeholder="Seleccione a Idade" >
                            {Idades.map(item => (
                                <Option key={item}>{item}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="nationality"
                        label="Nacionalidade"
                    >
                        <Select placeholder="Seleccione a Nacionalidade" >
                            <Option key='1'>Moçambicana</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="provice"
                        label="Provincia"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                    >
                        <Select placeholder="Seleccione a Provincia" >
                            <Option key='1'>Maputo</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="district"
                        label="Distrito"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                    >
                        <Select placeholder="Seleccione o Distrito" >
                            <Option key='1'>Ka Mavota</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="locality"
                        label="Posto Administrativo"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                    >
                        <Select placeholder="Seleccione o Posto Administrativo" >
                            <Option key='1'>Bairro Central</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="gender"
                        label="Sexo"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                    >
                        <Radio.Group defaultValue="1" buttonStyle="solid">
                            <Radio.Button value="1">F</Radio.Button>
                            <Radio.Button value="0">M</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="entry_point"
                        label="Ponto de Entrada"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                    >
                        <Radio.Group defaultValue="1" buttonStyle="solid">
                            <Radio.Button value="1">US</Radio.Button>
                            <Radio.Button value="2">CM</Radio.Button>
                            <Radio.Button value="3">ES</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>
            <Divider></Divider>
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="schoolName"
                        label="Alcunha"
                    >
                        <Input placeholder="Insira a alcunha" />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="address"
                        label="Morada (Bairro)"
                    >
                        <Input placeholder="Insira a morada" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="phone_number"
                        label="Telemóvel"
                    >
                        <Input placeholder="Insira o Telemóvel" />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="e_mail"
                        label="E-mail"
                    >
                        <Input placeholder="Insira o E-mail" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="neighbourhood_id"
                        label="Onde Mora"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                    >
                        <Select placeholder="Seleccione o Bairro" >
                            <Option key='1'>Bairro 1</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                    >
                        <Radio.Group defaultValue="1" buttonStyle="solid">
                            <Radio.Button value="1">Activo</Radio.Button>
                            <Radio.Button value="0">Inactivo</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
}
export default StepDadosPessoais;