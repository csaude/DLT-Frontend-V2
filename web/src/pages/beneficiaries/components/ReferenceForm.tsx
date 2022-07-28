import React, { Fragment, useEffect, useState } from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Space, Radio } from 'antd';
import {allPartners} from '@app/utils/partners';
import { queryByType, querySubServiceByService } from '@app/utils/service';
import { allUs } from '@app/utils/uSanitaria';

const { Option } = Select;
const { TextArea } = Input;

const areaServicos = [{ "id": '1', "name": "Clínico" }, { "id": '2', "name": "Comunitário" }];
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

    const [partners, setPartners] = React.useState<any>(undefined);
    const selectedReference = record.record;
    const partner_type = selectedReference?.serviceType;
    let userId = localStorage.getItem('user');
  
    const selectedOption = options?.filter(o => o.value === selectedIntervention?.service_type+'').map(filteredOption => (filteredOption.value))[0];

    useEffect(() => {

      const fetchData = async () => {
        const data = await allUs();
        setUs(data);
      } 

      const fetchPartners = async () => {
        const data = await allPartners();
        setPartners(data);
      }

      const fetchServices = async () => {
        const data = await queryByType(serviceType === '1'? '1' : '2');
        setServices(data);
      }

      const fetchSubServices = async () => {
        const data = await querySubServiceByService(selectedIntervention?.subServices?.service.id);
        setInterventions(data);
      }

      if(selectedIntervention !== undefined){
        fetchServices().catch(error => console.log(error));

        fetchSubServices().catch(error => console.log(error)); 

        fetchPartners().catch(error => console.log(error)); 
      }
  
      fetchData().catch(error => console.log(error));
  
    }, []);


    const onChangeTipoServiço = async (value:any) => {
        const data = await allPartners(value);
        setPartners(data);
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
                  rules={[{ required: true, message: 'Obrigatório' }]}
                  initialValue={selectedReference?.reference_note}
                >
                  <Input placeholder="Nota Referência" disabled/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="beneficiary_id"
                  label="Nº de Beneficiário"
                  rules={[{ required: true, message: 'Obrigatório' }]}
                  initialValue={selectedReference?.nui}
                >
                  <Input placeholder="Nº de Beneficiário" disabled/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="refer_to"
                  label="Referente"
                  rules={[{ required: true, message: 'Obrigatório' }]}
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
                  rules={[{ required: true, message: 'Obrigatório' }]}
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
                  name="book_number"
                  label="Nº do Livro"
                  rules={[{ required: true, message: 'Obrigatório' }]}
                  initialValue={selectedReference?.book_number}
                >
                  <Input placeholder="Nº do Livro" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="reference_code"
                  label="Código de Referência no livro"
                  rules={[{ required: true, message: 'Obrigatório' }]}
                  initialValue={selectedReference?.reference_code}
                >
                  <Input placeholder="Código de Referência no livro" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  name="org_type"
                  label="Tipo de Serviço"
                  rules={[{ required: true, message: 'Obrigatório' }]}
                  initialValue={serviceType===undefined? undefined : serviceType === '1'? '1' : '2'}
                >
                    <Select placeholder="Seleccione o Tipo de Serviço" onChange={onChangeTipoServiço}>
                        {areaServicos.map(item => (
                            <Option key={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="partner_id"
                  label="Organização"
                  rules={[{ required: true, message: 'Obrigatório' }]}
                  initialValue={selectedReference===undefined? undefined : selectedReference?.serviceType+''}
                >
                  <Select placeholder="Organização" onChange={onChangeServices} disabled={partners === undefined}>
                        {partners?.map(item => (
                            <Option key={item.id}>{item.name}</Option>
                        ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="local"
                  label="Local"
                  rules={[{ required: true, message: 'Obrigatório' }]}
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
                  name="notify_to"
                  label="Notificar ao"
                  rules={[{ required: true, message: 'Obrigatório' }]}
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
                  name="remarks"
                  label="Observações"
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