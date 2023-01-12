import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { ExclamationCircleFilled } from '@ant-design/icons';

const { Option } = Select;
const { confirm } = Modal;
const serviceTypes = [ { label: 'Serviços Clínicos', value: '1' }, { label: 'Serviços Comunitários', value: '2' } ];
const ageBands = ['9-14', '15-19', '20-24'];
const status = [{ value: '0', label: "Inactivo" }, { value: '1', label: "Activo" }];

const ServiceForm = ({ form, service, modalVisible, handleModalVisible, handleAdd }) => {

    const [statusEnabled, setStatusEnabled] = useState(false);

    const RequiredFieldMessage = "Obrigatório!";

    useEffect(() => {
        setStatusEnabled(service !== undefined);
    },[service]);

    const showCloseConfirm = () => {
        confirm({
        title: 'Deseja fechar este formulário?',
        icon: <ExclamationCircleFilled />,
        okText: 'Sim',
        okType: 'danger',
        cancelText: 'Não',
        onOk() {
            handleModalVisible();
        },
        onCancel() {
        },
        });
    };

    return(
        <Modal
            width={1200}
            centered
            destroyOnClose
            title='Dados de Registo do Serviço'
            visible={modalVisible}
            onCancel={() => showCloseConfirm()}
            maskClosable={false}
            footer={[
                <Button key="Cancel" onClick={() => showCloseConfirm()} >
                    Cancelar
                </Button>,
                <Button key='OK' onClick={handleAdd} type='primary'>
                    Salvar
                </Button>
            ]}
        >
            <Form form={form} layout="vertical">
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item
                            name="serviceType"
                            label="Tipo de Serviço"
                            rules={[{ required: true, message: RequiredFieldMessage}]}
                            initialValue={service?.serviceType}
                        >
                            <Select placeholder="Seleccione o Tipo Serviço">
                                {serviceTypes.map(item => (
                                    <Option key={item.value}>{item.label}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Serviço"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={service?.name}
                        >
                            <Input placeholder="Insira o Serviço" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item
                            name="description"
                            label="Descrição"
                            initialValue={service?.description}
                        >
                            <Input placeholder="Insira a Descrição" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            name="ageBands"
                            label="Faixas Etárias"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={service?.ageBands.split(",")}
                        >
                            <Select
                                mode="multiple"
                                size='middle'
                                placeholder="Seleccione as faixas etárias"
                                style={{width: '100%',}}
                            >
                                {ageBands.map(item => (
                                    <Option key={item}>{item}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            name="status"
                            label="Estado"
                            rules={[{ required: true, message: 'Obrigatório' }]}
                            initialValue={service === undefined ? "1" : service?.status?.toString()}
                        >
                            <Select disabled={!statusEnabled}>
                            {status?.map(item => (
                                <Option key={item.value}>{item.label}</Option>
                            ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default ServiceForm;