import React, { Fragment, useEffect, useState } from 'react'
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Space, Radio } from 'antd';
import { queryByType, querySubServiceByService } from '@app/utils/service'
import { allUs } from '@app/utils/uSanitaria'
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const areaServicos = [{ "id": 'CLINIC', "name": "Serviços Clinicos" }, { "id": 'COMMUNITY', "name": "Serviços Comunitarios" }];
const options = [
  { label: 'US', value: '1' },
  { label: 'CM', value: '2' },
  { label: 'ES', value: '3' },
];

const InterventionForm = (record: any) => {
    const [services, setServices] = React.useState<any>(undefined);
    const [interventions, setInterventions] = React.useState<any>(undefined);
    const [us, setUs] = React.useState<any>(undefined);
    const form = Form.useFormInstance();
    const selectedIntervention = record.record;
    const service = selectedIntervention?.subServices === undefined? selectedIntervention?.services : selectedIntervention?.subServices.service;
  
    const selectedOption = options?.filter(o => o.value === selectedIntervention?.entryPoint+'').map(filteredOption => (filteredOption.value))[0];

    const RequiredFieldMessage = "Obrigatório!";

    useEffect(() => {

      const fetchData = async () => {
        const data = await allUs();
        setUs(data);
      } 

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
  
      fetchData().catch(error => console.log(error));
  
    }, []);


    const onChangeAreaServiço = async (value:any) => {
        const data = await queryByType(value);
        setServices(data);
    }

    const onChangeServices = async (value: any) => {

      const data = await querySubServiceByService(value);
      setInterventions(data);
    }

    const fetchData = async () => {
      const data = await allUs();
      setUs(data);
    }

    return (
      
          <>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  name="areaServicos"
                  label="Área de Serviços"
                  rules={[{ required: true, message: RequiredFieldMessage}]}
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
                  label="Serviço"
                  rules={[{ required: true, message: RequiredFieldMessage }]}
                  initialValue={selectedIntervention===undefined? undefined : selectedIntervention?.subServices?.service.id+''}
                >
                  <Select placeholder="Select Serviço" onChange={onChangeServices} disabled={services === undefined}>
                        {services?.map(item => (
                            <Option key={item.id}>{item.name}</Option>
                        ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="subservice"
                  label="Sub-Serviço/Intervenção"
                  rules={[{ required: true, message: RequiredFieldMessage }]}
                  initialValue={selectedIntervention===undefined? undefined : selectedIntervention?.subServices?.id+''}
                >
                  <Select placeholder="Select Sub Serviço" disabled={interventions === undefined} value={undefined}>
                        {interventions?.map(item => (
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
                  label="Ponto de Entrada"
                  rules={[{ required: true, message: RequiredFieldMessage }]}
                  initialValue={selectedOption}
                >
                  <Radio.Group
                    options={options}
                    optionType="button"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="location"
                  label="Localização"
                  rules={[{ required: true, message: RequiredFieldMessage }]}
                  initialValue={selectedIntervention === undefined? undefined : selectedIntervention?.us?.id+''}
                >
                  <Select placeholder="Selecione Localização">
                        {us?.map(item => (
                            <Option key={item.id}>{item.name}</Option>
                        ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="dataBeneficio"
                  label="Data de Provisão do Serviço"
                  rules={[{ required: true, message: RequiredFieldMessage }]}
                  initialValue={selectedIntervention === undefined? undefined : moment(selectedIntervention?.id.date,'YYYY-MM-DD')}
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
                  rules={[{ required: true, message: RequiredFieldMessage }]}
                  initialValue={selectedIntervention?.provider}
                >
                  <Input placeholder="Nome do Provedor do Serviço" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="outros"
                  label="Outras Observações"
                  initialValue={selectedIntervention?.remarks}
                >
                  <TextArea rows={2} placeholder="Insira as Observações" maxLength={50} />
                </Form.Item>
              </Col>
            </Row>
            </>
    
    );
}

export default InterventionForm;