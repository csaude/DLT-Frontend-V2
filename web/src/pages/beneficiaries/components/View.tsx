import React, { Fragment, useEffect, useState } from 'react'
import { Modal, Card, Row, Col, Image, Table, Button } from 'antd';
import { SearchOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import emblema from '../../../assets/emblema.png';
import moment from 'moment';


const ViewBeneficiary = ({beneficiary, modalVisible, handleAdd, handleModalVisible}) => {

    const okHandle = () => {
        handleAdd("test");
    }

    const columns = [
        { title: 'Data', dataIndex: 'date', key: 'date',
            render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        { title: 'Serviço', dataIndex: 'subService.service.name', key: 'serv' },
        { title: 'Intervenções', dataIndex: 'subService.service', key: 'inter' },
        { title: 'Ponto de Entrada', dataIndex: 'entryPoint', key: 'entryPoint' },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record) => (
              <Fragment>
                <Button type="primary" icon={<EyeOutlined />} >
                </Button>
              </Fragment>
            ),
        },
    ];

    return (

        <Modal
            width="950px"
            destroyOnClose
            title={` Dados de Registo do Beneficiário: ${beneficiary?.name}`}
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
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
                    rowKey="subService.id"
                    columns={columns}
                    dataSource={beneficiary?.interventions}
                />
            </Card>
            
        </Modal>

    );
}
export default ViewBeneficiary;