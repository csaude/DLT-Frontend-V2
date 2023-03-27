import React, { useEffect, useState } from "react";
import { query  as queryUser} from '@app/utils/users';
import { query as queryBeneficiary } from "@app/utils/beneficiary";
import { query as queryReferenceService } from "@app/utils/reference-service";
import { query as queryBeneficiaryIntervention } from "@app/utils/beneficiaryIntervention";
import { Button, Card, Col, Drawer, Form, message, Modal, Row, Space, Table, Typography } from "antd";
import { ExclamationCircleFilled ,FileDoneOutlined } from '@ant-design/icons';
import moment from 'moment';
import ReferenceInterventionForm from "@app/pages/reference/components/ReferenceInterventionForm";
import { addSubService, SubServiceParams } from '@app/utils/service'
import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

const { Text } = Typography;
const { confirm } = Modal;

export function ViewReferencePanel({selectedReference, columns}) {
    const [visible, setVisible] = useState<boolean>(false);
    const [reference, setReference] = useState<any>();
    const [user, setUser] = useState<any>();
    const [interventions, setInterventions] = useState<any>();
    const [refServices, setRefServices] = useState<any>();
    const [canAddress, setCanAddress] = useState<boolean>(true);
    const [requiredServices, setRequiredServices] = useState<any>([]);
    const [select, setSelect] = useState<any>([]);

    const attendToRequiredServices = (refServices) =>{
        const selectServices = refServices?.filter(refServ=>{return select.includes(refServ?.id?.serviceId)})
        setRequiredServices(selectServices)
        if(selectServices.length > 0){
            setVisible(true);
        }else{
            showSelectServices()
        }
    }

    const { confirm } = Modal;

    const showSelectServices = () => {
        confirm({
        title: 'Nenhum serviço Selecionado, Selecione os serviços a atender',
        icon: <ExclamationCircleFilled />,
        });
    };

    const goToNextIntervention = () =>{
        setVisible(true);
    }

    const onChange = (e: CheckboxChangeEvent, value) => {
        if(e.target.checked){
            setSelect([...select, value]);
        }else{
            const myArray = select
            const index = myArray.indexOf(value);
            myArray.splice(index);
            setSelect([...myArray]);
        }
    };
    const [form] = Form.useForm();

    // const refServices = reference.referencesServiceses;

    useEffect(() => {
        const fetchData = async () => {
          const data = await queryUser(localStorage.user);
          const data1 = await queryBeneficiary(selectedReference.beneficiaries.id);
          const refServices = await queryReferenceService(selectedReference.id)
          const beneficiaryInterventions = await queryBeneficiaryIntervention(selectedReference.beneficiaries.id)
   
          setUser(selectedReference.referredBy);

          if(data1.beneficiariesInterventionses !== undefined){
                setInterventions(data1.beneficiariesInterventionses);
          }else{
                setInterventions(beneficiaryInterventions);
          }

          if(selectedReference.referencesServiceses !==undefined){
                setRefServices(selectedReference.referencesServiceses);
          }else{
                setRefServices(refServices);
          }

          setReference(selectedReference);

          if (data.partners.partnerType == selectedReference.referredBy.partners.partnerType) {
            setCanAddress(false);
          }
        } 
        
        fetchData().catch(error => console.log(error));
    
    }, []);

    const onSubmit = async () => {
               
        form.validateFields().then(async (values) => {
            
            let payload: SubServiceParams = {
                id: {
                    beneficiaryId: reference.beneficiaries.id,
                    subServiceId: values.subservice,
                    date: moment(values.dataBeneficio).format('YYYY-MM-DD'),
                },
                beneficiaries: {
                    id: '' + reference.beneficiaries.id
                },
                subServices: {
                    id: values.subservice
                },
                date: moment(values.dataBeneficio).format('YYYY-MM-DD'),
                result: "",
                us: { id: values.location},
                activistId: localStorage.user,
                entryPoint: values.entryPoint,
                provider: values.provider,
                remarks: values.outros,
                status: "1",
                createdBy: localStorage.user
            };

            const { data } = await addSubService(payload);
            
            setInterventions(interventions => [...interventions, data.intervention]);
            const ref = data.references.filter(r => r.id == selectedReference.id);
            
            if (ref.length > 0) {
                setReference(ref[0]);
                setRefServices(ref[0].referencesServiceses)
            }

            message.success({
                content: 'Registado com Sucesso!', className: 'custom-class',
                style: {
                    marginTop: '10vh',
                }
            });

            setVisible(false);

            goToNextIntervention();
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

    const onClose = () => {
        setVisible(false);
    };

    const showCloseConfirm = () => {
        confirm({
        title: 'Deseja fechar este formulário?',
        icon: <ExclamationCircleFilled />,
        okText: 'Sim',
        okType: 'danger',
        cancelText: 'Não',
        onOk() {
            onClose();
        },
        onCancel() {
        },
        });
    };

    const servicesColumns = [
        { title: '#', 
            dataIndex: '', 
            key: 'order',
            render: (text, record) => refServices.indexOf(record) + 1,
        },
        { title: 'Serviço', 
            dataIndex: '', 
            key: 'service',
            render: (text, record)  => record.services.name,
        },
        { title: 'Status', 
            dataIndex: '', 
            key: 'intervention',
            render: (text, record)  => 
                (record.status == 0) ? 
                    <Text type="danger" >Pendente </Text>
                :
                (record.status == 1) ? 
                    <Text type="warning" >Em curso </Text>
                : 
                    <Text type="success" >Atendido </Text>
            ,
        },
        Table.SELECTION_COLUMN,
        { 
            title: 'Selecionar', 
            dataIndex: 'action', 
            key: 'action',
            render: (text, record) => (
              <Space>
                <Checkbox 
                   disabled={record.status >= 2 ? true : false } 
                   onChange={e => onChange(e, record.id.serviceId)}/>
              </Space>
            ),
        }
    ];

    const interventionColumns = [
        { title: 'Data', 
            dataIndex: 'date', 
            key: 'date',
            render: (text, record) => <span>{moment(record.id.date).format('YYYY-MM-DD')}</span>,
        },
        { title: 'Serviço', 
            dataIndex: '', 
            key: 'service',
            render: (text, record)  => record.subServices.service.name,
        },
        { title: 'Intervenções', 
            dataIndex: '', 
            key: 'intervention',
            render: (text, record)  => (user?.profiles.id == 4 && record.subServices.service.id == 9)? '' : record.subServices.name,
        },
        { title: 'Atendido Por', 
            dataIndex: '', 
            key: 'provider',
            render: (text, record)  => record.provider,
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
                                title={reference?.referenceNote + ' | ' + reference?.beneficiaries.district.code + '/' + reference?.beneficiaries.nui}
                                bordered={true}
                                headStyle={{ background: "#17a2b8"}}
                                bodyStyle={{ paddingLeft: "10px", paddingRight: "10px", height: "120px" }}
                            >
                                <Row>
                                    <Col className="gutter-row" span={3}><b>Data Registo</b></Col>
                                    <Col className="gutter-row" span={3}><b>Referente</b></Col>
                                    <Col className="gutter-row" span={3}><b>Contacto</b></Col>
                                    <Col className="gutter-row" span={3}><b>Nº do Livro</b></Col>
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
                                    <Col className="gutter-row" span={3}>{moment(reference?.dateCreated).format('YYYY-MM-DD HH:MM')}</Col>
                                    <Col className="gutter-row" span={3}>{user?.name+' '+user?.surname}</Col>
                                    <Col className="gutter-row" span={3}>{user?.phoneNumber}</Col>
                                    <Col className="gutter-row" span={3}>{reference?.bookNumber}</Col>
                                    <Col className="gutter-row" span={3}>{user?.partners?.name}</Col>
                                    <Col className="gutter-row" span={3}>{reference?.referenceCode}</Col>
                                    <Col className="gutter-row" span={3}>{reference?.serviceType==1? 'Serviços Clínicos': 'Serviços Comunitários'}</Col>
                                    <Col className="gutter-row" span={3}>{reference?.status==0?  
                                                                            <Text type="danger" >Pendente </Text> 
                                                                        : reference?.status==1? 
                                                                            <Text type="warning" >Atendida Parcialmente </Text>
                                                                        : <Text type="success" >Atendida </Text>}
                                    </Col>
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
                                    rowKey={(record?) => `${record?.services?.id}`}
                                    columns={servicesColumns}
                                    dataSource={refServices}
                                    pagination={false}                                
                                />
                                <Button htmlType="submit" disabled={!canAddress} onClick={() => attendToRequiredServices(refServices)} type="primary">
                                    Atender
                                </Button>
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
                                    rowKey={(record?) => `${record.id.subServiceId}${record.id.date}`}
                                    columns={interventionColumns}
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
                    onClose={showCloseConfirm}
                    visible={visible}
                    maskClosable={false}
                    getContainer={false}
                    style={{ position: 'absolute' }}
                    extra={
                        <Space>
                            <Button onClick={showCloseConfirm}>Cancel</Button>
                            <Button htmlType="submit" onClick={() => onSubmit()} type="primary">
                                Submit
                            </Button>
                        </Space>
                    }
                >
                    <Form form={form} layout="vertical" onFinish={() => onSubmit()}> 
                        <ReferenceInterventionForm form={form} reference={reference} records={requiredServices} beneficiary={reference?.beneficiaries} />
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
    
    return (
        <Modal
            width={1300}
            centered
            destroyOnClose
            title={`Dados Referência `}
            visible={modalVisible}
            maskClosable={false}
            onOk={okHandle}
            onCancel={() => showCloseConfirm()}
        >
            <ViewReferencePanel selectedReference={reference} columns={undefined} />
        </Modal>
    )
}

export default ViewReferral;