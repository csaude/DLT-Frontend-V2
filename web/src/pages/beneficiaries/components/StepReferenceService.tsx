import React, { Fragment, useEffect, useState } from 'react';
import { Badge, Button, Steps, Row, Col, Input, message, InputNumber, Form, DatePicker, Checkbox, Select, Radio, Divider, SelectProps, Card, Table, Typography, Space, Drawer } from 'antd';
import './index.css';
import moment from 'moment';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { query as queryUser } from '@app/utils/users';
import { query as queryBeneficiary } from "@app/utils/beneficiary";
import { query as beneficiaryInterventionQuery } from '../../../utils/beneficiaryIntervention';
import { queryByType } from '@app/utils/service'
import { MANAGER, MENTOR } from '@app/utils/contants';

const { Option } = Select;
const { Step } = Steps;
const { TextArea } = Input;

const { Text } = Typography;

const options = [
    { label: 'US', value: '1' },
    { label: 'CM', value: '2' },
    { label: 'ES', value: '3' },
];

const StepReferenceService = ({ form, reference, beneficiary, firstStepValues, handleRefServicesList }: any) => {

    const [user, setUser] = React.useState<any>();

    const [visible, setVisible] = useState<boolean>(false);
    const [services, setServices] = useState<any>([]);
    const [servicesList, setServicesList] = useState<any>();
    const [interventions, setInterventions] = useState<any>();
    const [selectedService, setSelectedService] = useState<any>();
    
    beneficiary = (reference !== undefined ? reference?.beneficiaries : beneficiary);

    const showDrawer = (record: any) => {

        setVisible(true);
    };

    useEffect(() => {

        const fetchData = async () => {
            const data1 = await queryBeneficiary(beneficiary.id);

            if (firstStepValues !== undefined ) {
                const getAllData = await queryByType(firstStepValues?.serviceType);
                setServicesList(getAllData);
            }


            if( reference !== undefined){
                const data = await queryUser(reference?.userCreated);
                setUser(data);

            } else{
                const data = await queryUser( localStorage.user);
                setUser(data);
            }
        }
        const fetchBeneficiariesInterventionses = async () => { 
             const benIntervs = await beneficiaryInterventionQuery(beneficiary?.id);
             setInterventions(benIntervs);
        }

        if( reference !== undefined){
            let referencesServiceses = reference?.referencesServiceses;

            if(referencesServiceses.length !==0){
                referencesServiceses.forEach(item => {
                    
                    var serv = services.filter((s) => s.servico.id === item.services.id);

                    if(serv.length ===0 || services.length === 0){
                        const service = ({ servico: item?.services, description: item?.description});
                        setServices(services => [...services, service]);
                    }
                    handleRefServicesList(services);
                });
            }

        }

        fetchData().catch(error => console.log(error));

        fetchBeneficiariesInterventionses().catch(err => console.log(err))

    }, [firstStepValues]);

    const onRemoveServico = (value: any) => {

        var serv = (services.filter((v, i) => i !== services.indexOf(value)));
        console.log(serv);
        handleRefServicesList(serv);
        setServices(serv);

        message.warning({
            content: value.servico.name + ' foi removido da lista de serviços a serem providos.', className: 'custom-class',
            style: {
                marginTop: '10vh',
            }
        });
    }

    const onAddService = () => {

        form.validateFields().then(async (values) => {

            var servOther = { servico: selectedService, description: form.getFieldValue('outros') };
            var serv = services.filter((s) => s.servico.id === servOther.servico.id);

            if(serv.length ===0 || services.length === 0){
                const newServices = [servOther, ...services];
    
                handleRefServicesList(newServices);
                setServices(newServices);
                
                message.success({
                    content: 'Adicionado com Sucesso!', className: 'custom-class',
                    style: {
                        marginTop: '10vh',
                    }
                });
            }else{
                message.error({
                    content: 'Já existe este Serviço!', className: 'custom-class',
                    style: {
                        marginTop: '10vh',
                    }
                });
            }

            setVisible(false);
            form.setFieldValue('outros', '');

        })
            .catch(error => {
                message.error({
                    content: 'Nenhum Serviço selecionado!', className: 'custom-class',
                    style: {
                        marginTop: '10vh',
                    }
                });
            });

        setSelectedService(undefined);
        form.setFieldValue('service', undefined);
    }

    const onChangeServico = async (value: any) => {
        let serv = servicesList.filter(item => { return item.id == value })[0];
        setSelectedService(serv);
    }

    const onClose = () => {
        setVisible(false);
        setSelectedService(undefined);
        form.setFieldValue('service', '');
        form.setFieldValue('outros', '');
    };

    const servicesColumns = [
        {
            title: '#',
            dataIndex: 'order',
            key: 'order',
            render: (text, record) => services.indexOf(record) + 1,
        },

        {
            title: 'Serviço',
            dataIndex: '',
            key: 'servico.id',
            render: (text, record) => record?.servico.name
            ,
        },
        {
            title: 'Acção',
            dataIndex: '',
            key: 'intervention',
            render: (text, record) =>
                <Button type='primary' icon={<DeleteFilled />} onClick={() => onRemoveServico(record)} danger>
                </Button>
            ,
        },
    ];

    const interventionColumns = [
        {
            title: 'Data',
            dataIndex: 'date',
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
            render: (text, record) => ((user?.profiles.id == MENTOR || user?.profiles.id == MANAGER && user?.partners.partnerType == 2) && record.subServices.service.id == 9)? '' : record.subServices.name,
        },
        {
            title: 'Atendido Por',
            dataIndex: '',
            key: 'provider',
            render: (text, record) => record.provider,
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
                                title={firstStepValues?.referenceNote + ' | ' + beneficiary?.neighborhood.locality.district.code + '/' + beneficiary?.nui}
                                bordered={true}
                                headStyle={{ background: "#17a2b8" }}
                                bodyStyle={{ paddingLeft: "10px", paddingRight: "10px", height: "120px" }}
                            >
                                <Row>
                                    <Col className="gutter-row" span={3}><b>Data de Registo</b></Col>
                                    <Col className="gutter-row" span={5}><b>Referente</b></Col>
                                    <Col className="gutter-row" span={3}><b>Contacto</b></Col>
                                    <Col className="gutter-row" span={3}><b>Nº do Livro</b></Col>
                                    <Col className="gutter-row" span={4}><b>Organização</b></Col>
                                    <Col className="gutter-row" span={3}><b>Cod. Referências</b></Col>
                                    <Col className="gutter-row" span={3}><b>Tipo Serviço</b></Col>
                                </Row>
                                <hr style={{
                                    background: 'gray',
                                    height: '1px',
                                }} />
                                <Row>
                                    <Col className="gutter-row" span={3}>{moment(firstStepValues?.dateCreated).format('YYYY-MM-DD HH:MM')}</Col>
                                    <Col className="gutter-row" span={5}>{ user?.name + ' ' + user?.surname }</Col>
                                    <Col className="gutter-row" span={3}>{ user?.phoneNumber }</Col>
                                    <Col className="gutter-row" span={3}>{firstStepValues?.bookNumber}</Col>
                                    <Col className="gutter-row" span={4}>{ user?.partners.name }</Col>
                                    <Col className="gutter-row" span={3}>{firstStepValues?.referenceCode}</Col>
                                    <Col className="gutter-row" span={3}>{firstStepValues?.serviceType == 'CLINIC' ? 'Serviços Clínicos' : 'Serviços Comunitários'}</Col>

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
                                headStyle={{ background: "#17a2b8" }}
                                bodyStyle={{ paddingLeft: "10px", paddingRight: "10px" }}
                                extra={
                                    <Button type="primary" onClick={() => showDrawer(user)} icon={<PlusOutlined />} style={{ background: "#00a65a", borderColor: "#00a65a", borderRadius:'4px' }} >
                                        Intervenção
                                    </Button>}
                            >
                                <Table
                                    rowKey={(record?) => `${record?.servico?.id}`}
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
                                headStyle={{ background: "#17a2b8" }}
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
                    title="Adicionar Serviço Dreams"
                    placement="top"
                    onClose={onClose}
                    visible={visible}
                    getContainer={false}
                    style={{ position: 'absolute' }}
                    extra={
                        <Space>
                            <Button onClick={onClose}>Cancelar</Button>
                            <Button htmlType="submit" onClick={() => onAddService()} type="primary">
                                Adicionar
                            </Button>
                        </Space>
                    }
                >
                    <>
                        <Row gutter={8}>
                            <Col span={8}>
                                <Form.Item
                                    name="service"
                                    label="Serviço Referido"
                                    rules={[{ required: true, message: 'Obrigatório' }]}
                                >
                                    <Select placeholder="Selecione um Serviço" onChange={onChangeServico}>
                                        {servicesList?.map(item => (
                                            <Option key={item.id}>{item.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    name="outros"
                                    label="Observações"
                                >
                                    <TextArea rows={2} placeholder="Insira as Observações" maxLength={50} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                </Drawer>
            </div>
        </>
    );
}
export default StepReferenceService;
