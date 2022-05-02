import React, { Fragment, useEffect, useState } from 'react'
import { Modal, Card, Row, Col, Image, Table, Button, Drawer } from 'antd';
import { SearchOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import emblema from '../../../assets/emblema.png';
import moment from 'moment';
import { getEntryPoint } from '@app/models/User'
import 'antd/dist/antd.css';

import '../styles.css'

export function ViewBenefiaryPanel({beneficiary, columns}){
    const [visible, setVisible] = useState<boolean>(false);

    const showDrawer = () => {
        setVisible(true);
    };
    
    const onClose = () => {
        setVisible(false);
    };
    const interventionColumns = columns === undefined ?
        [
            { title: 'Data', 
                dataIndex: 'date', 
                key: 'date',
                render: (val: string) => <span>{moment(val).format('YYYY-MM-DD')}</span>,
            },
            { title: 'Serviço', 
                dataIndex: '', 
                key: 'service',
                render: (text, record)  => record.subService.service.name,
            },
            { title: 'Intervenções', 
                dataIndex: '', 
                key: 'intervention',
                render: (text, record)  => record.subService.name,
            },
            { title: 'Ponto de Entrada', 
                dataIndex: '', 
                key: 'entryPoint',
                render: (text, record)  => getEntryPoint(record.entryPoint),
            },
            {
                title: 'Action',
                dataIndex: '',
                key: 'x',
                render: (text, record) => (
                <Fragment>
                    <Button type="primary" icon={<EyeOutlined />} onClick={showDrawer} >
                    </Button>
                </Fragment>
                ),
            },
        ] : columns;

    return (
        <>
        <div className="site-drawer-render-in-current-wrapper">
            <Card
                //title={` Dados de Registo do Beneficiário: DREAMS1 DREAMS2 ${beneficiary?.name}`}
                bordered={false} //headStyle={{background:"#17a2b8"}}
                bodyStyle={{margin:0, marginBottom:"20px",padding:0}}
                >
                    <Row gutter={16}>
                        <Col className="gutter-row" span={8}>
                            <Card
                               
                            >
                                <div style={{textAlign:"center"}}>
                                    <Image 
                                        width={50}
                                        preview={false}
                                        src={emblema}
                                    /><br/>
                                    <span>República de Moçambique</span><br/>
                                    <span>Ministério da Saúde</span><br/>
                                    <span>Serviços de Saúde Reprodutiva</span><br/>
                                    <span>de Adolescente e Jovens</span><br/>
                                    <span style={{fontWeight:"bold", color:"#17a2b8"}}>
                                        {beneficiary?.nui}</span><br/>
                                    <span style={{fontWeight:"bold", textTransform:"uppercase"}}>
                                        {`${beneficiary?.name} ${beneficiary?.surname}`}</span><br/><br/>
                                    <span>Ponto de Referencia:</span><br/>
                                    <span>{beneficiary?.entryPoint}</span><br/>
                                </div>
                            </Card>
                            
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <Card
                                title="Dados Gerais"
                                bordered={true}
                                headStyle={{background:"#17a2b8"}}
                                bodyStyle={{paddingLeft:"10px", paddingRight:"10px", height:"244px"}}
                            >
                                <Row gutter={8}>
                                    <Col className="gutter-row" style={{background:"#f3f4f5"}} span={12}>Nacionalidade</Col>
                                    <Col className="gutter-row" style={{background:"#f3f4f5"}} span={12}>Mozambique</Col>
                                </Row>
                                <Row gutter={8} >
                                    <Col className="gutter-row" span={12}>Província</Col>
                                    <Col className="gutter-row" span={12}>{beneficiary?.neighborhood.locality.district.province.name}</Col>
                                </Row>
                                <Row gutter={8}>
                                    <Col className="gutter-row" style={{background:"#f3f4f5"}} span={12}>Distrito</Col>
                                    <Col className="gutter-row" style={{background:"#f3f4f5"}} span={12}>{beneficiary?.neighborhood.locality.district.name}</Col>
                                </Row>
                                <Row gutter={8} >
                                    <Col className="gutter-row" span={12}>Idade</Col>
                                    <Col className="gutter-row" span={12}>{beneficiary?.grade}</Col>
                                </Row>
                                <Row gutter={8}>
                                    <Col className="gutter-row" style={{background:"#f3f4f5"}} span={12}>Sexo</Col>
                                    <Col className="gutter-row" style={{background:"#f3f4f5"}} span={12}>{beneficiary?.gender === 1 ? 'M':'F'}</Col>
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
                                headStyle={{background:"#f2dede"}}

                            >
                                <span>MZ</span><br/>
                                <span>{`${beneficiary?.neighborhood.description}`}</span><br/>
                                <span>{beneficiary?.phoneNumber}</span><br/>
                            </Card>
                        </Col>
                    </Row>
                     
            </Card>
            <Card
                title="Lista de Intervenções DREAMS"
            >
                <Table
                    rowKey="dateCreated"
                    pagination={false}
                    columns={interventionColumns}
                    dataSource={beneficiary?.interventions}
                    bordered

                />
            </Card>
            <Drawer
                title="Basic Drawer"
                placement="top"
                closable={false}
                onClose={onClose}
                visible={visible}
                getContainer={false}
                style={{ position: 'absolute' }}
                >
                <p>Some contents...</p>
            </Drawer>
        </div>
        </>
    );
}

const ViewBeneficiary = ({beneficiary, modalVisible, handleAdd, handleModalVisible}) => {

    const okHandle = () => {
        handleAdd("test");
    }

    
    return (

        <Modal
            width={1200}
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