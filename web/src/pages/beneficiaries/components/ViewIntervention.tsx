import { Card, Col, Row } from 'antd';
import moment from 'moment';
import React, { useState } from 'react'
import { Button } from 'react-bootstrap';

export default function ViewBenefiaryPanel({record, beneficiary}){
    
    return (
        <Card
            bordered={false} //headStyle={{background:"#17a2b8"}}
            bodyStyle={{margin:0, marginBottom:"20px",padding:0}}
            >
                <Row gutter={16}>
                    <Col className="gutter-row" span={4}>
                    </Col>
                    <Col className="gutter-row" span={16}>
                            <Card
                                title={`${beneficiary.name} ${beneficiary.surname}`}
                                bordered={true}
                                headStyle={{background:"#17a2b8"}}
                                bodyStyle={{paddingLeft:"10px", paddingRight:"10px", textAlign:"left"}}
                            >
                                <Row gutter={8}>
                                    <Col className="gutter-row" style={{background:"#f3f4f5", fontWeight:"bold"}} span={12}>Área de Serviço</Col>
                                    <Col className="gutter-row" style={{background:"#f3f4f5"}} span={12}>{record?.subServices?.service.serviceType==0? 'Serviços Clínicos' : 'Serviços Comunitários'}</Col>
                                </Row>
                                <Row gutter={8}>
                                    <Col className="gutter-row" style={{fontWeight:"bold"}} span={12}>Serviço</Col>
                                    <Col className="gutter-row" span={12}>{record?.subServices?.service.name}</Col>
                                </Row>
                                <Row gutter={8} >
                                    <Col className="gutter-row" span={12} style={{background:"#f3f4f5", fontWeight:"bold"}}>Sub-Serviço/Intervenção</Col>
                                    <Col className="gutter-row" style={{background:"#f3f4f5"}} span={12}>{record?.subServices?.name}</Col>
                                </Row>
                                <Row gutter={8}>
                                    <Col className="gutter-row" style={{fontWeight:"bold"}} span={12}>Código do Beneficiário</Col>
                                    <Col className="gutter-row" span={12}>{beneficiary?.nui}</Col>
                                </Row>
                                <Row gutter={8} >
                                    <Col className="gutter-row" span={12} style={{background:"#f3f4f5", fontWeight:"bold"}}>Data Benefício</Col>
                                    <Col className="gutter-row" style={{background:"#f3f4f5"}} span={12}>{moment(record?.date).format('YYYY-MM-DD')}</Col>
                                </Row>
                                
                            </Card>
                    </Col>
                    <Col className="gutter-row" span={4}>
                    </Col>
                </Row>
                     
            </Card>
    );
}