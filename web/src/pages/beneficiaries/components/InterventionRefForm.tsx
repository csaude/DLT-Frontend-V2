import React, { Fragment, useEffect, useState } from 'react'
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Space, Radio } from 'antd';
import { queryByType, querySubServiceByService } from '@app/utils/service'

const { Option } = Select;
const { TextArea } = Input;

const areaServicos = [{ "id": 'CLINIC', "name": "Serviços Clinicos" }, { "id": 'COMMUNITY', "name": "Serviços Comunitários" }];

const InterventionRefForm = (record: any) => {
    const [services, setServices] = React.useState<any>(undefined);
    const [interventions, setInterventions] = React.useState<any>(undefined);
    const form = Form.useFormInstance();
    const selectedIntervention = record.record;
    const service = selectedIntervention?.subServices === undefined? selectedIntervention?.services : selectedIntervention?.subServices.service;
  
    useEffect(() => {


      const fetchServices = async () => {
        const data = await queryByType(service.serviceType === '1'? 'CLINIC' : 'COMMUNITY');
        setServices(data);
      }

      const fetchSubServices = async () => {
        const data = await querySubServiceByService(service.id);
        setInterventions(data);
      }

      if(selectedIntervention !== undefined){
        fetchServices().catch(error => console.log(error));

        fetchSubServices().catch(error => console.log(error));  
      }
    
    }, []);

    const onChangeAreaServiço = async (value:any) => {
        const data = await queryByType(value);
        setServices(data);
    }

    return (
      
          <>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  name="areaServicos"
                  label="Área de Serviços"
                  rules={[{ required: true, message: 'Obrigatório' }]}
                  initialValue={service?.serviceType===undefined? undefined : service?.serviceType === '1'? 'CLINIC' : 'COMMUNITY'}
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
                  label="Serviço Referido"
                  rules={[{ required: true, message: 'Obrigatório' }]}
                  initialValue={selectedIntervention===undefined? undefined : selectedIntervention?.subServices?.service.id+''}
                >
                  <Select placeholder="Select Serviço" disabled={services === undefined}>
                        {services?.map(item => (
                            <Option key={item.id}>{item.name}</Option>
                        ))}
                  </Select>
                </Form.Item>
              </Col>
              
              <Col span={8}>
                <Form.Item
                  name="outros"
                  label="Observações"
                  initialValue={selectedIntervention?.remarks}
                >
                  <TextArea rows={2} placeholder="Insira as Observações" maxLength={50} />
                </Form.Item>
              </Col>
            </Row>
          </>    
    );
}

export default InterventionRefForm;