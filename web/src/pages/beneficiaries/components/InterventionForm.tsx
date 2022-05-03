import React, { Fragment, useEffect, useState } from 'react'
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Space, Radio } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const areaServicos = [{"id":1,"name": "Serviços Clinicos"},{"id":2,"name": "Serviços Comunitarios"}];
const options = [
  { label: 'US', value: 'US' },
  { label: 'CM', value: 'CM' },
  { label: 'ES', value: 'ES' },
];

const InterventionForm = () => {
    const [services, setServices] = React.useState();
    const [interventions, setInterventions] = React.useState();

/*
    useEffect(() => {

      const fetchData = async () => {
        const data = await query();
        setBeneficiaries(data);
      } 
  
      fetchData().catch(error => console.log(error));
  
    }, []);
*/

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
                  name="service"
                  label="Serviço *"
                  rules={[{ required: true, message: 'Please enter url' }]}
                >
                  <Select placeholder="Select Serviço" onChange={onChangeAreaServiço}>
                        {areaServicos.map(item => (
                            <Option key={item.id}>{item.name}</Option>
                        ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="subservice"
                  label="Sub-Serviço/Intervenção"
                  rules={[{ required: true, message: 'Please enter url' }]}
                >
                  <Select placeholder="Select Sub Serviço" onChange={onChangeAreaServiço}>
                        {areaServicos.map(item => (
                            <Option key={item.id}>{item.name}</Option>
                        ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  name="entryPoint"
                  label="Ponto de Entrada *"
                  rules={[{ required: true, message: 'Please select an owner' }]}
                >
                  <Radio.Group
                    options={options}
                    defaultValue='US'
                    optionType="button"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="location"
                  label="Localização *"
                  rules={[{ required: true, message: 'Please choose the type' }]}
                >
                  <Select placeholder="Select Localização" onChange={onChangeAreaServiço}>
                        {areaServicos.map(item => (
                            <Option key={item.id}>{item.name}</Option>
                        ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="dataBeneficio"
                  label="Data Benefício *"
                  rules={[{ required: true, message: 'Please select an owner' }]}
                >
                  <DatePicker style={{width: '100%'}} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  name="provider"
                  label="Provedor do Serviço"
                  rules={[{ required: true, message: 'Nome do Provedor do Serviço' }]}
                >
                  <Input placeholder="Nome do Provedor do Serviço" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="outros"
                  label="Outras Observações"
                  rules={[{ required: true, message: 'Please ' }]}
                >
                  <TextArea rows={2} placeholder="Insira as Observações" maxLength={6} />
                </Form.Item>
              </Col>
            </Row>
           
          </Form>
    );
}

export default InterventionForm;