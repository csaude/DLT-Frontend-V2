import React, { useEffect, useState } from "react";
import { query  as queryUser} from '@app/utils/users';
import { query as queryBeneficiry } from "@app/utils/beneficiary";
import { Button, Card, Col, Drawer, Form, Modal, Row, Space, Table } from "antd";
import { SearchOutlined, EditOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import InterventionForm from "@app/pages/beneficiaries/components/InterventionForm";

export function ViewReferencePanel({reference, columns}) {
    const [visible, setVisible] = useState<boolean>(false);
    const [user, setUser] = useState<any>();
    const [interventions, setInterventions] = useState<any>();
    const [selectedService, setSelectedService] = useState<any>();

    const [form] = Form.useForm();

    const services = reference.referencesServiceses;

    useEffect(() => {
        const fetchData = async () => {
          const data = await queryUser(reference.createdBy);
          const data1 = await queryBeneficiry(reference.beneficiaries.id);

          setUser(data);
          setInterventions(data1.beneficiariesInterventionses);
        } 
    
        fetchData().catch(error => console.log(error));
    
    }, []);

    const onAddIntervention = (record: any) => {
        console.log(record);
        // form.resetFields();
        setVisible(true);
        setSelectedService(record);
    };

    const onSubmit = async (intervention: any) => {
       
        form.validateFields().then(async (values) => {
            
           
        })
            .catch(error => {
                // message.error({
                //     content: 'Não foi possivel associar a Intervenção!', className: 'custom-class',
                //     style: {
                //         marginTop: '10vh',
                //     }
                // });
            });

    };

    const onClose = () => {
        setVisible(false);
    };



    const servicesColumns = [
        { title: '#', 
            dataIndex: '', 
            key: 'order',
            render: (text, record) => services.indexOf(record) + 1,
        },
        { title: 'Cod Referência', 
            dataIndex: 'date', 
            key: 'date',
            render: (text, record) => reference.referenceCode
        },
        { title: 'Serviço', 
            dataIndex: '', 
            key: 'service',
            render: (text, record)  => record.services.name,
        },
        { title: 'Status', 
            dataIndex: '', 
            key: 'intervention',
            render: (text, record)  => record.status==0? 'Pendente' : 'Atendido',
        },
        { title: 'Atender', 
            dataIndex: '', 
            key: 'action',
            render: (text, record) => (
              <Space>
                <Button type="link" icon={<EditOutlined />} onClick={() => onAddIntervention(record) } >
                </Button>
              </Space>
            ),
        }
    ];

    const interventionColumns = [
        { title: 'Data', 
            dataIndex: 'date', 
            key: 'date',
            render: (text, record) => <span>{moment(record.dateCreated).format('YYYY-MM-DD')}</span>,
        },
        { title: 'Serviço', 
            dataIndex: '', 
            key: 'service',
            render: (text, record)  => record.subServices.service.name,
        },
        { title: 'Intervenções', 
            dataIndex: '', 
            key: 'intervention',
            render: (text, record)  => record.subServices.name,
        },
        { title: 'Atendido Por', 
            dataIndex: '', 
            key: 'createdBy',
            render: (text, record)  => record.createdBy,
        }
    ];

    return (
        <>
            <div className="site-drawer-render-in-current-wrapper">
                <Card 
                    bordered={false} 
                    bodyStyle={{ margin: 0, marginBottom: "20px", padding: 0 }}
                >
                    <Row gutter={24}>
                        <Col className="gutter-row" span={24}>
                            <Card 
                                title={reference.referenceNote + ' | ' + reference.beneficiaries.neighborhood.locality.district.code + '/' + reference.beneficiaries.nui}
                                bordered={true}
                                headStyle={{ background: "#17a2b8"}}
                                bodyStyle={{ paddingLeft: "10px", paddingRight: "10px", height: "120px" }}
                            >
                                <Row>
                                    <Col className="gutter-row" span={3}><b>Data Registo</b></Col>
                                    <Col className="gutter-row" span={3}><b>Referente</b></Col>
                                    <Col className="gutter-row" span={3}><b>Contacto</b></Col>
                                    <Col className="gutter-row" span={3}><b>No do Livro</b></Col>
                                    <Col className="gutter-row" span={3}><b>Organização</b></Col>
                                    <Col className="gutter-row" span={3}><b>Cod Referências</b></Col>
                                    <Col className="gutter-row" span={3}><b>Tipo Serviço</b></Col>
                                    <Col className="gutter-row" span={3}><b>Status</b></Col>
                                </Row>
                                <hr style={{
                                    background: 'gray',
                                    height: '1px',
                                    }}/>
                                <Row>
                                    <Col className="gutter-row" span={3}>{moment(reference.dateCreated).format('YYYY-MM-DD HH:MM')}</Col>
                                    <Col className="gutter-row" span={3}>{user?.name+' '+user?.surname}</Col>
                                    <Col className="gutter-row" span={3}>{user?.phoneNumber}</Col>
                                    <Col className="gutter-row" span={3}>{reference.bookNumber}</Col>
                                    <Col className="gutter-row" span={3}>{user?.partners.name}</Col>
                                    <Col className="gutter-row" span={3}>{reference.referenceCode}</Col>
                                    <Col className="gutter-row" span={3}>{reference.serviceType==1? 'Serviços Clínicos': 'Serviços Comunitários'}</Col>
                                    <Col className="gutter-row" span={3}>{reference.statusRef==0? 'Pendente': 'Atendido'}</Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Card>
                <Card 
                    bordered={false} 
                    bodyStyle={{ margin: 0, marginBottom: "20px", padding: 0 }}
                >
                    <Row gutter={24}>
                        <Col className="gutter-row" span={12}>
                            <Card 
                                title='Serviços Solicitados'
                                bordered={true}
                                headStyle={{ background: "#17a2b8"}}
                                bodyStyle={{ paddingLeft: "10px", paddingRight: "10px" }}
                            >
                                <Table
                                    rowKey="id"
                                    columns={servicesColumns}
                                    dataSource={services}
                                    pagination={false}
                                />
                            </Card>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <Card 
                                title={`Intervenções Recebidas`}
                                bordered={true}
                                headStyle={{ background: "#17a2b8"}}
                                bodyStyle={{ paddingLeft: "10px", paddingRight: "10px" }}
                            >
                                <Table
                                    rowKey="id"
                                    columns={interventionColumns}
                                    // expandable={{
                                    //     expandedRowRender: record =>  <div style={{border:"2px solid #d9edf7", backgroundColor:"white"}}><ViewBenefiaryPanel beneficiary={record} columns={interventionColumns} /></div>,
                                    //     rowExpandable: record => record.name !== 'Not Expandable',
                                    // }}
                                    dataSource={interventions}
                                    bordered
                                    pagination={false}
                                />
                            </Card>
                        </Col>
                    </Row>
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
                            <Button htmlType="submit" onClick={() => onSubmit(selectedService)} type="primary">
                                Submit
                            </Button>
                        </Space>
                    }
                >
                    <Form form={form} layout="vertical" onFinish={() => onSubmit(selectedService)}> 
                        <InterventionForm record={selectedService} />
                    </Form> 
                </Drawer>                
            </div>
        </>
    );
}

const ViewReferral = ({reference, modalVisible, handleModalVisible}) => {

    const okHandle = () => {
        handleModalVisible();
    }

    
    return (
        <Modal
            width={1300}
            centered
            destroyOnClose
            title={`Dados Referência: `}
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <ViewReferencePanel reference={reference} columns={undefined} />
        </Modal>
    )
}

export default ViewReferral;