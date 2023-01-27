import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { ExclamationCircleFilled } from '@ant-design/icons';
import { allDistrict } from "@app/utils/district";

const { Option } = Select;
const { confirm } = Modal;
const status = [{ value: '0', label: "Inactivo" }, { value: '1', label: "Activo" }];

const OrganizationForm = ({ form, organization, modalVisible, handleModalVisible, handleAdd }) => {

    const [statusEnabled, setStatusEnabled] = useState(false);   
    const [districts, setDistricts] = useState<any[]>([]);

    const partnerTypes =[
                            {value:1,label:'Parceiro Clínico'},
                            {value:2,label:'Parceiro Comunitário'},
                            {value:3,label:'Apoio Técnico'},
                            {value:4,label:'Doadores'},
                        ]

    const RequiredFieldMessage = "Obrigatório!";
    console.log(organization);

    useEffect(() => {
        setStatusEnabled(organization !== undefined);
    },[organization]);

    useEffect(() => {
        const fetchData = async () => {           
            const districts = await allDistrict()
            setDistricts(districts)         
        }

        fetchData().catch(error => console.log(error));
    }, []);

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
            title='Dados de Registo do Distrito'
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
                
                <Row gutter={12}>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            name="district"
                            label="Distrito"
                            rules={[{ required: true, message: 'Obrigatório' }]}
                            initialValue={organization === undefined ? "" : organization?.district?.id.toString()}
                        >
                            <Select placeholder="Seleccione o Distrito">
                            {districts?.map(item => (
                                <Option key={item.id}>{item.name}</Option>
                            ))}
                            </Select>
                        </Form.Item>
                    </Col>  
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Nome"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={organization?.name}
                        >
                            <Input placeholder="Insira o nome da Organização" />
                        </Form.Item>
                    </Col>                  
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item
                            name="abbreviation"
                            label="Abreviação"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={organization?.abbreviation}
                        >
                            <Input placeholder="Insira a abreviação da organização" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="description"
                            label="Descrição"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={organization?.description}
                        >
                            <Input placeholder="Insira a descrição da Organização" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            name="partnerType"
                            label="Tipo"
                            rules={[{ required: true, message: 'Obrigatório' }]}
                            initialValue={organization === undefined ? "1" : organization?.partnerType?.toString()}
                        >
                            <Select >
                            {partnerTypes?.map(item => (
                                <Option key={item.value}>{item.label}</Option>
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
                            initialValue={organization === undefined ? "1" : organization?.status?.toString()}
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

export default OrganizationForm;