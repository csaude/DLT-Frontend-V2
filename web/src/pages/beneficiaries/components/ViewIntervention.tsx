import { Card, Col, Row } from 'antd';
import moment from 'moment';
import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

export default function ViewBenefiaryPanel({record, beneficiary}){
    const userSelector = useSelector((state: any) => state?.user);

    const getUsernames = (userId) =>{
        const currentNames = userSelector?.users?.map(item => {if(item[0]==userId){
            return item[1] 
        }})
        return currentNames
    }
    
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
                                    <Col className="gutter-row" style={{background:"#f3f4f5"}} span={12}>{moment(record?.id.date).format('YYYY-MM-DD')}</Col>
                                </Row>
                                <Row gutter={8} >
                                    <Col className="gutter-row" span={12} style={{fontWeight:"bold"}} >Criado por</Col>
                                    <Col className="gutter-row" span={12}>{getUsernames(record?.createdBy)}</Col>
                                </Row>
                                <Row gutter={8} >
                                    <Col className="gutter-row" span={12} style={{background:"#f3f4f5", fontWeight:"bold"}}>Actualizado por</Col>
                                    <Col className="gutter-row" style={{background:"#f3f4f5"}} span={12}>{record?.updatedBy !== null ? getUsernames(record?.updatedBy) : 'N/A'}</Col>
                                </Row>
                                <Row gutter={8} >
                                    <Col className="gutter-row" span={12} style={{fontWeight:"bold"}} >Data Criação</Col>
                                    <Col className="gutter-row" span={12}>{moment(record?.dateCreated).format('YYYY-MM-DD')}</Col>
                                </Row>
                                <Row gutter={8} >
                                    <Col className="gutter-row" span={12} style={{background:"#f3f4f5", fontWeight:"bold"}}>Data Actualização</Col>
                                    <Col className="gutter-row" style={{background:"#f3f4f5"}} span={12}>{record?.dateUpdated !==null ? moment(record?.dateUpdated).format('YYYY-MM-DD') : 'N/Aget'}</Col>
                                </Row>
                                
                            </Card>
                    </Col>
                    <Col className="gutter-row" span={4}>
                    </Col>
                </Row>
                     
            </Card>
    );
}