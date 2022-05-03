import React, { Fragment, useEffect, useState } from 'react'
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Space } from 'antd';

const { Option } = Select;

const areaServicos = [{"id":1,"name": "Serviços Clinicos"},{"id":2,"name": "Serviços Comunitarios"}];

const InterventionForm = () => {
    const [services, setServices] = React.useState();
    const [interventions, setInterventions] = React.useState();

    const onChangeAreaServiço = (value:any) => {
        console.log(value);
    };

    return (
        <Form layout="vertical" hideRequiredMark>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  name="areaServicos"
                  label="Área de Serviços *"
                  rules={[{ required: true, message: 'This field is required' }]}
                >
                    <Select placeholder="Select Area Serviço" onChange={onChangeAreaServiço}>
                        {areaServicos.map(item => (
                            <Option key={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="url"
                  label="Url"
                  rules={[{ required: true, message: 'Please enter url' }]}
                >
                  
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="url"
                  label="Url"
                  rules={[{ required: true, message: 'Please enter url' }]}
                >
                  
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="owner"
                  label="Owner"
                  rules={[{ required: true, message: 'Please select an owner' }]}
                >
                  
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Type"
                  rules={[{ required: true, message: 'Please choose the type' }]}
                >
                  
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="approver"
                  label="Approver"
                  rules={[{ required: true, message: 'Please choose the approver' }]}
                >
                  
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dateTime"
                  label="DateTime"
                  rules={[{ required: true, message: 'Please choose the dateTime' }]}
                >
                  
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: 'please enter url description',
                    },
                  ]}
                >
                  
                </Form.Item>
              </Col>
            </Row>
          </Form>
    );
}

export default InterventionForm;