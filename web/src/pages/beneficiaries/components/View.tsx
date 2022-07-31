import React, { Fragment, useEffect, useState } from 'react'
import { message, Form, Modal, Card, Row, Col, Image, Table, Button, Drawer, Space } from 'antd';
import { SearchOutlined, ArrowUpOutlined, EyeOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import emblema from '../../../assets/emblema.png';
import moment from 'moment';
import { getEntryPoint } from '@app/models/User'
import ViewIntervention from './ViewIntervention';
import { addSubService, updateSubService, SubServiceParams } from '@app/utils/service'

import 'antd/dist/antd.css';

import '../styles.css'
import InterventionForm from './InterventionForm';

export function ViewBenefiaryPanel({ beneficiary, columns }) {
    const [visible, setVisible] = useState<boolean>(false);
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [selectedBeneficiary, setSelectedBeneficiary] = useState();
    const [selectedIntervention, setSelectedIntervention] = useState<any>();
    const [interventions, setInterventions] = useState(beneficiary?.beneficiariesInterventionses);

    const [form] = Form.useForm();

    const showDrawer = (record: any) => {

        setVisible(true);
        setSelectedBeneficiary(record);
    };

    const onAddIntervention = () => {
        form.resetFields();
        setVisible(true);
        setIsAdd(true);
        setSelectedIntervention(undefined);
    };

    const onEditIntervention = (record: any) => {
        setVisible(true);
        setIsAdd(true);
        setSelectedIntervention(record);
    };

    const onClose = () => {
        setVisible(false);
        setIsAdd(false);
    };

    const onSubmit = async (intervention: any) => {
       
        form.validateFields().then(async (values) => {
            
            let payload: SubServiceParams = {
                id: {
                    beneficiaryId: beneficiary.id,
                    subServiceId: values.subservice,
                    date: moment(values.dataBeneficio).format('YYYY-MM-DD'),
                },
                beneficiaries: {
                    id: '' + beneficiary.id
                },
                subServices: {
                    id: values.subservice
                },
                result: "", 
                us: { id: values.location},
                activistId: "6",
                entryPoint: values.entryPoint,
                provider: values.provider,
                remarks: values.outros,
                status: "1",
                createdBy: "1"
            };

            const { data } = selectedIntervention === undefined ? await addSubService(payload) : await updateSubService(payload);
            
            if(selectedIntervention === undefined){
                setInterventions(interventions => [...interventions, data]);
            } else {
                setInterventions(existingItems => {
                    return existingItems.map((item, j) => {
                      return    item.id.beneficiaryId === selectedIntervention.id.beneficiaryId && 
                                item.id.subServiceId === selectedIntervention.id.subServiceId   &&
                                item.id.date === selectedIntervention.id.date ?
                                    data : item
                    })
                });
            }

            message.success({
                content: 'Registado com Sucesso!', className: 'custom-class',
                style: {
                    marginTop: '10vh',
                }
            });

            setVisible(false);
            setIsAdd(false);
            form.resetFields();
        })
            .catch(error => {
                message.error({
                    content: 'Não foi possivel associar a Intervenção!', className: 'custom-class',
                    style: {
                        marginTop: '10vh',
                    }
                });
            });

    };

    const interventionColumns = columns === undefined ?
        [
            {
                title: 'Data',
                dataIndex: '',
                key: 'date',
                render: (text, record) => <span>{moment(record.id.date).format('YYYY-MM-DD')}</span>,
            },
            {
                title: 'Serviço',
                dataIndex: '',
                key: 'service',
                render: (text, record) => record.subServices.service.name,
            },
            {
                title: 'Intervenções',
                dataIndex: '',
                key: 'intervention',
                render: (text, record) => record.subServices.name,
            },
            {
                title: 'Ponto de Entrada',
                dataIndex: '',
                key: 'entryPoint',
                render: (text, record) => getEntryPoint(record.entryPoint),
            },
            {
                title: 'Action',
                dataIndex: '',
                key: 'x',
                render: (text, record) => (
                    <Space>
                        <Button type="primary" icon={<EyeOutlined />} onClick={() => showDrawer(record)} >
                        </Button>
                        <Button type="primary" icon={<EditOutlined />} onClick={() => onEditIntervention(record)} >
                        </Button>
                    </Space>
                ),
            },
        ] : columns;

    return (
        <>
            <div className="site-drawer-render-in-current-wrapper">
                <Card
                    //title={` Dados de Registo do Beneficiário: DREAMS1 DREAMS2 ${beneficiary?.name}`}
                    bordered={false} //headStyle={{background:"#17a2b8"}}
                    bodyStyle={{ margin: 0, marginBottom: "20px", padding: 0 }}
                >
                    <Row gutter={16}>
                        <Col className="gutter-row" span={8}>
                            <Card

                            >
                                <div style={{ textAlign: "center" }}>
                                    <Image
                                        width={50}
                                        preview={false}
                                        src={emblema}
                                    /><br />
                                    <span>República de Moçambique</span><br />
                                    <span>Ministério da Saúde</span><br />
                                    <span>Serviços de Saúde Reprodutiva</span><br />
                                    <span>de Adolescente e Jovens</span><br />
                                    <span style={{ fontWeight: "bold", color: "#17a2b8" }}>
                                        {beneficiary?.nui}</span><br />
                                    <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                        {`${beneficiary?.name} ${beneficiary?.surname}`}</span><br /><br />
                                    <span>Ponto de Referencia:</span><br />
                                    <span>{beneficiary?.entryPoint}</span><br />
                                </div>
                            </Card>

                        </Col>
                        <Col className="gutter-row" span={8}>
                            <Card
                                title="Dados Gerais"
                                bordered={true}
                                headStyle={{ background: "#17a2b8" }}
                                bodyStyle={{ paddingLeft: "10px", paddingRight: "10px", height: "244px" }}
                            >
                                <Row gutter={8}>
                                    <Col className="gutter-row" style={{ background: "#f3f4f5" }} span={12}>Nacionalidade</Col>
                                    <Col className="gutter-row" style={{ background: "#f3f4f5" }} span={12}>Mozambique</Col>
                                </Row>
                                <Row gutter={8} >
                                    <Col className="gutter-row" span={12}>Província</Col>
                                    <Col className="gutter-row" span={12}>{beneficiary?.neighborhood.locality.district.province.name}</Col>
                                </Row>
                                <Row gutter={8}>
                                    <Col className="gutter-row" style={{ background: "#f3f4f5" }} span={12}>Distrito</Col>
                                    <Col className="gutter-row" style={{ background: "#f3f4f5" }} span={12}>{beneficiary?.neighborhood.locality.district.name}</Col>
                                </Row>
                                <Row gutter={8} >
                                    <Col className="gutter-row" span={12}>Idade</Col>
                                    <Col className="gutter-row" span={12}>{beneficiary?.grade}</Col>
                                </Row>
                                <Row gutter={8}>
                                    <Col className="gutter-row" style={{ background: "#f3f4f5" }} span={12}>Sexo</Col>
                                    <Col className="gutter-row" style={{ background: "#f3f4f5" }} span={12}>{beneficiary?.gender === 1 ? 'M' : 'F'}</Col>
                                </Row>
                                <Row gutter={8} >
                                    <Col className="gutter-row" span={12}>Com quem mora?</Col>
                                    <Col className="gutter-row" span={12}>{beneficiary?.livesWith}</Col>
                                </Row>

                            </Card>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <Card

                                title="Contactos"
                                bordered={true}
                                headStyle={{ background: "#f2dede" }}

                            >
                                <span>MZ</span><br />
                                <span>{`${beneficiary?.neighborhood.description}`}</span><br />
                                <span>{beneficiary?.phoneNumber}</span><br />
                            </Card>
                        </Col>
                    </Row>

                </Card>
                <Card
                    title="Lista de Intervenções DREAMS"
                    extra={
                        <Space>
                            <Button type='primary' icon={<ArrowUpOutlined />} danger >Referir Beneficiaria</Button>
                            <Button onClick={onAddIntervention} type="primary" icon={<PlusOutlined />} >
                                Adicionar Serviço Dreams
                            </Button>
                        </Space>
                    }
                >
                    <Table
                        rowKey="dateCreated"
                        pagination={false}
                        columns={interventionColumns}
                        dataSource={interventions}
                        bordered

                    />
                </Card>
                <Drawer
                    title="Intervenções Dreams"
                    placement="top"
                    closable={false}
                    onClose={onClose}
                    visible={visible}
                    getContainer={false}
                    style={{ position: 'absolute' }}
                    extra={
                        <Space>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button htmlType="submit" onClick={() => onSubmit(selectedIntervention)} type="primary">
                                Submit
                            </Button>
                        </Space>
                    }
                >
                    {isAdd ? <Form form={form} layout="vertical" onFinish={() => onSubmit(selectedIntervention)}> <InterventionForm record={selectedIntervention} /></Form> :
                        <ViewIntervention record={selectedBeneficiary} beneficiary={beneficiary} />
                    }
                </Drawer>
            </div>
        </>
    );
}

const ViewBeneficiary = ({ beneficiary, modalVisible, handleAdd, handleModalVisible }) => {

    const okHandle = () => {
        handleAdd("test");
        handleModalVisible();
    }


    return (

        <Modal
            width={1000}
            centered
            destroyOnClose
            title={` Dados de Registo do Beneficiário: ${beneficiary?.name}`}
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <ViewBenefiaryPanel beneficiary={beneficiary} columns={undefined} />

        </Modal>


    );
}
export default ViewBeneficiary;