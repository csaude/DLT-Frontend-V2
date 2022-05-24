import React, { Fragment, useEffect, useState } from 'react';
import { Badge, Button, Steps, Row, Col, Input, message, Space, Form, Tabs, Modal, DatePicker, Checkbox, Select, Radio, Divider } from 'antd';
import './index.css';
const { Option } = Select;
const { Step } = Steps;

const StepVulnerabilidadesGerais = ({ form }: any) => {
    const [isDateRequired, setIsDateRequired] = useState<any>(true);

    const RequiredFieldMessage = "Campo Obrigatório!";


    const onChangeCheckbox = (e) => {
        setIsDateRequired(!e.target.checked);
    }

    return (
        <>
            <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="surname"
                        label="Apelido"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                    >
                        <Input placeholder="Insira o apelido do Beneficiário" />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="nickName"
                        label="Nome"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                    >
                        <Input placeholder="Insira o nome do Beneficiário" />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="nickName"
                        label="Nome"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                    >
                        <Input placeholder="Insira o nome do Beneficiário" />
                    </Form.Item>
                </Col>
            </Row>

        </>
    );
}
export default StepVulnerabilidadesGerais;