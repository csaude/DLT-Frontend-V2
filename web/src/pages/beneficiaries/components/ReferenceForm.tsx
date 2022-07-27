import React, { Fragment, useEffect, useState } from 'react'
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Space, Radio } from 'antd';
import { queryByType, querySubServiceByService } from '@app/utils/service'
import { allUs } from '@app/utils/uSanitaria'
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const areaServicos = [{ "id": 'CLINIC', "name": "Clinico" }, { "id": 'COMMUNITY', "name": "Comunitario" }];
const options = [
  { label: 'US', value: '1' },
  { label: 'CM', value: '2' },
  { label: 'ES', value: '3' },
];

const ReferenceForm = (record: any) => {
    const [services, setServices] = React.useState<any>(undefined);
    const [interventions, setInterventions] = React.useState<any>(undefined);
    const [us, setUs] = React.useState<any>(undefined);
    const form = Form.useFormInstance();
    const selectedIntervention = record.record;
    const serviceType = selectedIntervention?.subServices?.service.serviceType;

    const selectedReference = record.record;
    let userId = localStorage.getItem('user');
    console.log(selectedReference);
  
    const selectedOption = options?.filter(o => o.value === selectedIntervention?.entryPoint+'').map(filteredOption => (filteredOption.value))[0];

    useEffect(() => {

      const fetchData = async () => {
        const data = await allUs();
        setUs(data);
      } 

      const fetchServices = async () => {
        const data = await queryByType(serviceType === '1'? 'CLINIC' : 'COMMUNITY');
        setServices(data);
      }

      const fetchSubServices = async () => {
        const data = await querySubServiceByService(selectedIntervention?.subServices?.service.id);
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
                  name="reference_note"
                  label="Nota Referência"
                  rules={[{ required: true, message: 'Nota Referência' }]}
                  initialValue={selectedReference?.reference_note}
                >
                  <Input placeholder="Nota Referência" disabled/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="beneficiary_id"
                  label="Nº de Beneficiário"
                  rules={[{ required: true, message: 'Nº de Beneficiário' }]}
                  initialValue={selectedReference?.nui}
                >
                  <Input placeholder="Nº de Beneficiário" disabled/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="refer_to"
                  label="Referente"
                  rules={[{ required: true, message: 'Referente' }]}
                  initialValue={userId}
                >
                  <Input placeholder="Referente" disabled/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  name="service_type"
                  label="Referir Para"
                  rules={[{ required: true, message: 'Please select an owner' }]}
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
                  name="provider"
                  label="Nº do Livro"
                  rules={[{ required: true, message: 'Nº do Livro' }]}
                  initialValue={selectedIntervention?.provider}
                >
                  <Input placeholder="Nº do Livro" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="provider"
                  label="Código de Referência no livro"
                  rules={[{ required: true, message: 'Código de Referência no livro' }]}
                  initialValue={selectedIntervention?.provider}
                >
                  <Input placeholder="Código de Referência no livro" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  name="areaServicos"
                  label="Tipo de Serviço"
                  rules={[{ required: true, message: 'Tipo de Serviço' }]}
                  initialValue={serviceType===undefined? undefined : serviceType === '1'? 'CLINIC' : 'COMMUNITY'}
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
                  label="Organização"
                  rules={[{ required: true, message: 'Organização' }]}
                  initialValue={selectedIntervention===undefined? undefined : selectedIntervention?.subServices?.service.id+''}
                >
                  <Select placeholder="Organização" onChange={onChangeServices} disabled={services === undefined}>
                        {services?.map(item => (
                            <Option key={item.id}>{item.name}</Option>
                        ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="subservice"
                  label="Local"
                  rules={[{ required: true, message: 'Local' }]}
                  initialValue={selectedIntervention===undefined? undefined : selectedIntervention?.subServices?.id+''}
                >
                  <Select placeholder="Local" disabled={interventions === undefined} value={undefined}>
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
                  name="subservice"
                  label="Notificar ao"
                  rules={[{ required: true, message: 'Notificar ao' }]}
                  initialValue={selectedIntervention===undefined? undefined : selectedIntervention?.subServices?.id+''}
                >
                  <Select placeholder="Notificar ao" disabled={interventions === undefined} value={undefined}>
                        {interventions?.map(item => (
                            <Option key={item.id}>{item.name}</Option>
                        ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="outros"
                  label="Observações"
                  rules={[{ required: true, message: 'Please ' }]}
                  initialValue={selectedIntervention?.remarks}
                >
                  <TextArea rows={2} placeholder="Observações" maxLength={6} />
                </Form.Item>
              </Col>
            </Row>
            </>
    
    );
}

export default ReferenceForm;