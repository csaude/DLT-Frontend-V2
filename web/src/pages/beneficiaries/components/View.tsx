import React, { Fragment, useEffect, useState } from 'react'
import { message, Form, Modal, Card, Row, Col, Image, Table, Button, Drawer, Space } from 'antd';
import { SearchOutlined, ArrowUpOutlined, EyeOutlined, EditOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import emblema from '../../../assets/emblema.png';
import moment from 'moment';
import { getEntryPoint } from '@app/models/User'
import { query as queryUser } from '../../../utils/users';
import { query } from '../../../utils/beneficiary';
import { query as beneficiaryInterventionQuery } from '../../../utils/beneficiaryIntervention';
import ViewIntervention from './ViewIntervention';
import { calculateAge } from '@app/models/Utils';
import { addSubService, updateSubService, SubServiceParams } from '@app/utils/service'

import 'antd/dist/antd.css';

import '../styles.css'
import InterventionForm from './InterventionForm';
import { ADMIN, MNE, SUPERVISOR } from '@app/utils/contants';
import { useDispatch } from 'react-redux';
import { getInterventionsCount } from '@app/store/actions/interventions';

const { confirm } = Modal;

export function ViewBenefiaryPanel({ beneficiary, columns , handleModalVisible, handleModalRefVisible, user}) {
    const [visible, setVisible] = useState<boolean>(false);
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [selectedBeneficiary, setSelectedBeneficiary] = useState();
    const [selectedIntervention, setSelectedIntervention] = useState<any>();
    const [interventions, setInterventions] = useState(beneficiary?.beneficiariesInterventionses);
    const [partner, setPartner] = useState<any>();
    const [ logUser, setLogUser ] = React.useState<any>();
    const [visibleName, setVisibleName] = useState<any>(true);

    const [form] = Form.useForm();
    const dispatch = useDispatch()

    useEffect(() => { 

        const fetchUser = async () => {

            const logUser = await queryUser(localStorage.user);
            setLogUser(logUser);

            if(beneficiary.partnerId){
                const user = await query(beneficiary.partnerId);
                setPartner(user);
            }
            
            if(user.profiles.id === ADMIN || user.profiles.id === MNE || user.profiles.id === SUPERVISOR){
                setVisibleName(false);
            }
            
        }
        const fetchBeneficiariesInterventionses = async () => { 
             const benIntervs = await beneficiaryInterventionQuery(beneficiary?.id);
             setInterventions(benIntervs);
        }
    
        fetchUser().catch(error => console.log("---: ",error));        
        fetchBeneficiariesInterventionses().catch(err => console.log(err))
    
    }, []);

    const showDrawer = (record: any) => {

        setVisible(true);
        setSelectedBeneficiary(record);
    };

    const onAddReference = (flag?: boolean, record?: any) => {

        handleModalVisible(); 
        handleModalRefVisible(flag, record);  
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

    const showCloseConfirm = () => {
        confirm({
        title: 'Deseja fechar este formulário?',
        icon: <ExclamationCircleFilled />,
        okText: 'Sim',
        okType: 'danger',
        cancelText: 'Não',
        onOk() {
            setVisible(false);
            setIsAdd(false);
        },
        onCancel() {
        },
        });
    };
    
    const onSubmit = async (intervention: any) => {
       
        form.validateFields().then(async (values) => {
            
            if (selectedIntervention === undefined) {
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
            } else {
                let payload: SubServiceParams = {
                    id: {
                        beneficiaryId: beneficiary.id,
                        subServiceId: selectedIntervention.id.subServiceId,
                        date: moment(selectedIntervention.id.date).format('YYYY-MM-DD'),
                    },
                    beneficiaries: {
                        id: '' + beneficiary.id
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
                    status: selectedIntervention.status,
                    updatedBy: localStorage.user,
                    createdBy: selectedIntervention.createdBy
                };

                const { data } = await updateSubService(payload);

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

            dispatch(getInterventionsCount())
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
                render: (text, record)  => 
                    ((user.profiles.id == 4 || user.profiles.id == 3 && user.partners.partnerType == 2) && record.subServices.service.id == 9)? 
                    '' : record.subServices.name,
            },
            {
                title: 'Ponto de Entrada',
                dataIndex: '',
                key: 'entryPoint',
                render: (text, record) => record.us.name,
            },
            {
                title: 'Acção',
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
                                        {`${beneficiary.district.code}/${beneficiary?.nui}`}
                                    </span><br />
                                    <span style={{ fontWeight: "bold" /*, textTransform: "uppercase" */}}>
                                        { visibleName === false ? `${beneficiary?.name} ${beneficiary?.surname}` : 'DREAMS'+ `${beneficiary?.nui}`}</span><br /><br />
                                    <span>Ponto de Referência:</span><br />
                                    <span style={{ color: "#17a2b8" }}>{beneficiary?.neighborhood.name}</span><br />
                                </div>
                            </Card>

                        </Col>
                        <Col className="gutter-row" span={8}>
                            <Card
                                title="Dados Gerais"
                                bordered={true}
                                headStyle={{ background: "#17a2b8" }}
                                bodyStyle={{ paddingLeft: "10px", paddingRight: "10px", height: "244px", textAlign: "left" }}
                            >
                                <Row gutter={8}>
                                    <Col className="gutter-row" style={{ fontWeight: "bold", background: "#f3f4f5" }} span={12}>Nacionalidade</Col>
                                    <Col className="gutter-row" style={{ background: "#f3f4f5" }} span={12}>Moçambicana</Col>
                                </Row>
                                <Row gutter={8} >
                                    <Col className="gutter-row" style={{ fontWeight: "bold"}} span={12}>Província</Col>
                                    <Col className="gutter-row" span={12}>{beneficiary?.district.province.name}</Col>
                                </Row>
                                <Row gutter={8}>
                                    <Col className="gutter-row" style={{ fontWeight: "bold", background: "#f3f4f5" }} span={12}>Distrito</Col>
                                    <Col className="gutter-row" style={{ background: "#f3f4f5" }} span={12}>{beneficiary?.district.name}</Col>
                                </Row>
                                <Row gutter={8} >
                                    <Col className="gutter-row" style={{ fontWeight: "bold"}} span={12}>Idade</Col>
                                    <Col className="gutter-row" span={12}>{calculateAge(beneficiary?.dateOfBirth)} anos</Col>
                                </Row>
                                <Row gutter={8}>
                                    <Col className="gutter-row" style={{ fontWeight: "bold", background: "#f3f4f5" }} span={12}>Sexo</Col>
                                    <Col className="gutter-row" style={{ background: "#f3f4f5" }} span={12}>{beneficiary?.gender === '1' ? 'M' : 'F' }</Col>
                                </Row>
                                <Row gutter={8} >
                                    <Col className="gutter-row" style={{ fontWeight: "bold"}} span={12}>Com quem mora?</Col>
                                    <Col className="gutter-row" span={12}>{beneficiary?.vbltLivesWith}</Col>
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
                                <span>{`${beneficiary?.neighborhood?.locality?.name}${beneficiary?.address==null? '' : ', ' + beneficiary?.address}`}</span><br />
                                <span>{beneficiary?.phoneNumber}</span><br />
                                <span>{beneficiary?.email}</span><br />
                            </Card>
                            <br />
                            <Card

                                title="Parceiro/Acompanhante"
                                bordered={true}
                                headStyle={{ background: "#17a2b8" }}
                            >
                                <span>
                                    <Button hidden={beneficiary.partnerId === null} 
                                        // onClick={} 
                                        type="primary" 
                                        style={{ background: "#00a65a", borderColor: "#00a65a", borderRadius:'4px' }} >
                                        {`${partner?.neighborhood.locality.district.code}/${partner?.nui}`}
                                    </Button>
                                </span><br />
                            </Card>
                        </Col>
                    </Row>

                </Card>
                <Card
                    title="Lista de Intervenções DREAMS"
                    extra={
                        <Space>
                            <Button onClick={() => onAddReference(true, beneficiary)} type='primary' icon={<ArrowUpOutlined />} danger >
                                Referir Beneficiária
                            </Button>
                            <Button onClick={onAddIntervention} type="primary" icon={<PlusOutlined />} >
                                Adicionar Serviço Dreams
                            </Button>
                        </Space>
                    }
                >
                    <Table
                        rowKey={( record? ) => `${record.id.subServiceId}${record.id.date}`}
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
                    onClose={showCloseConfirm}
                    visible={visible}
                    maskClosable={false}
                    getContainer={false}
                    style={{ position: 'absolute' }}
                    height={440}
                    footer={
                        <Space>
                            <Button onClick={showCloseConfirm}>Cancelar</Button>
                            <Button htmlType="submit" onClick={() => onSubmit(selectedIntervention)} type="primary">
                                Salvar
                            </Button>
                        </Space>
                    }
                    footerStyle={{ textAlign: 'right' }}
                >
                    {isAdd ? <Form form={form} layout="vertical" onFinish={() => onSubmit(selectedIntervention)}> <InterventionForm record={selectedIntervention} beneficiary={beneficiary} /></Form> :
                        <ViewIntervention record={selectedBeneficiary} beneficiary={beneficiary} />
                    }
                </Drawer>
            </div>
        </>
    );
}

const ViewBeneficiary = ({ beneficiary, modalVisible, handleModalVisible , handleModalRefVisible, user}) => {

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
            width={1000}
            centered
            destroyOnClose
            title={` Dados de Registo do Beneficiário`}
            visible={modalVisible}
            maskClosable={false}
            onOk={okHandle}
            onCancel={() => showCloseConfirm()}
        >
            
            <ViewBenefiaryPanel beneficiary={beneficiary} columns={undefined} handleModalVisible={handleModalVisible} handleModalRefVisible={handleModalRefVisible} user={user} />

        </Modal>

    );
}
export default ViewBeneficiary;

function async(id: any) {
    throw new Error('Function not implemented.');
}
