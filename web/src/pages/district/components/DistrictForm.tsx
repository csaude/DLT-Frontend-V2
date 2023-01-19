import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { ExclamationCircleFilled } from '@ant-design/icons';
import { allProvinces } from "@app/utils/locality";
import { queryAll } from "@app/utils/province";

const { Option } = Select;
const { confirm } = Modal;
const ageBands = ['9-14', '15-19', '20-24'];
const status = [{ value: '0', label: "Inactivo" }, { value: '1', label: "Activo" }];

const DistrictForm = ({ form, district, modalVisible, handleModalVisible, handleAdd }) => {

    const [statusEnabled, setStatusEnabled] = useState(false);   
    const [provinces, setProvinces] = useState<any[]>([]);

    const RequiredFieldMessage = "Obrigatório!";
    console.log(district);

    useEffect(() => {
        setStatusEnabled(district !== undefined);
        const serviceTypes = [ { label: 'Serviços Clínicos', value: '1' }, { label: 'Serviços Comunitários', value: '2' } ];
    },[district]);

    useEffect(() => {
        const fetchData = async () => {
           
            const provinces = await queryAll();

            setProvinces(provinces);
            
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
                            name="province"
                            label="Província"
                            rules={[{ required: true, message: 'Obrigatório' }]}
                            initialValue={district === undefined ? "" : district?.province?.id.toString()}
                        >
                            <Select placeholder="Seleccione a Província">
                            {provinces?.map(item => (
                                <Option key={item.id}>{item.name}</Option>
                            ))}
                            </Select>
                        </Form.Item>
                    </Col>                    
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item
                            name="code"
                            label="code"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={district?.code}
                        >
                            <Input placeholder="Insira o code da província" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Nome"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={district?.name}
                        >
                            <Input placeholder="Insira o nome da província" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                </Row>
                <Row gutter={8}>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            name="status"
                            label="Estado"
                            rules={[{ required: true, message: 'Obrigatório' }]}
                            initialValue={district === undefined ? "1" : district?.status?.toString()}
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

export default DistrictForm;