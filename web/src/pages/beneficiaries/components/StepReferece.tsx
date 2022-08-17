import React, { Fragment, useEffect, useState } from 'react';
import { Badge, Button, Steps, Row, Col, Input, message, InputNumber, Form, DatePicker, Checkbox, Select, Radio, Divider, SelectProps } from 'antd';
import './index.css';
import { allPartnersByType} from '@app/utils/partners';
import { query, userById, allUsesByUs } from '@app/utils/users';
import { allUs } from '@app/utils/uSanitaria';

const { Option } = Select;
const { Step } = Steps;
const { TextArea } = Input;

const areaServicos = [{ "id": 'CLINIC', "name": "Clinico" }, { "id": 'COMMUNITY', "name": "Comunitários" }];
const options = [
  { label: 'US', value: '1' },
  { label: 'CM', value: '2' },
  { label: 'ES', value: '3' },
];

const StepReference = ({ form, beneficiary }: any) => {

    // const selectedIntervention = beneficiary;
    // const serviceType = selectedIntervention?.subServices?.service.serviceType;

    const [partners, setPartners] = React.useState<any>();
    const [users, setUsers] = React.useState<any>();
    const [user, setUser] = React.useState<any>();
    const [us, setUs] = React.useState<any>();
    const selectedReference = beneficiary;
    const partner_type = selectedReference?.serviceType;
    let userId = localStorage.getItem('user');

    // const selectedOption = options?.filter(o => o.value === serviceType?.service_type+'').map(filteredOption => (filteredOption.value))[0];
   
    useEffect(() => {

        const fetchData = async () => {
          const loggedUser = await query(localStorage.user);
          form.setFieldsValue({createdBy: loggedUser?.name+' '+loggedUser?.surname});
          
          setUser(loggedUser);
        }   
  
        fetchData().catch(error => console.log(error));

        let orgType = form.getFieldValue('serviceType');
        let org = form.getFieldValue('partner_id');
        let loc = form.getFieldValue('local');

        if(orgType !== '' && orgType !== undefined){
          onChangeTipoServico(form.getFieldValue('serviceType'));
        }
        if(org !== '' && org !== undefined){
          onChangeOrganization(form.getFieldValue('partner_id'));
        }
        if(loc !== '' && loc !== undefined){
          onChangeUs(form.getFieldValue('local'));
        }
    
      }, []); 
      
      const getNotaRef = () => {
        return 'REFDR' + String(userId).padStart(3, '0') + '0' + String(500 + 1).padStart(3, '0');
    }

    const getUser = async () => {
      const data = await userById(userId);
      setUser(data);
      const name = user?.name;
      return name;
  }
      
      const onChangeTipoServico = async (value:any) => {
          const data = await allPartnersByType(value);
          setPartners(data);
      }
      
      const onChangeOrganization = async (value:any) => {
        const data = await allUs(value);
        setUs(data);
      }
  
      const onChangeUs = async (value:any) => {
        const data = await allUsesByUs(value);
        setUsers(data);
      }
    
    return (
        <>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  name="referenceNote"
                  label="Nota Referência"
                  rules={[{ required: true, message: 'Obrigatório' }]}
                  initialValue={getNotaRef()}
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
                  name="createdBy"
                  label="Referente"
                  rules={[{ required: true, message: 'Obrigatório' }]}
                >    
                  <Input placeholder="Referente" disabled/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  name="referTo"
                  label="Referir Para"
                  rules={[{ required: true, message: 'Obrigatório' }]}
                  // initialValue={selectedOption}
                >
                  <Radio.Group
                    options={options}
                    optionType="button"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="bookNumber"
                  label="Nº do Livro"
                  rules={[{ required: true, message: 'Obrigatório' }]}
                  // initialValue={selectedReference?.book_number}
                >
                  <Input placeholder="Nº do Livro" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="referenceCode"
                  label="Código de Referência no livro"
                  rules={[{ required: true, message: 'Obrigatório' }]}
                  // initialValue={selectedReference?.reference_code}
                >
                  <Input placeholder="Código de Referência no livro" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  name="serviceType"
                  label="Tipo de Serviço"
                  rules={[{ required: true, message: 'Obrigatório' }]}
                  // initialValue={serviceType===undefined? undefined : serviceType === '1'? 'CLINIC' : 'COMMUNITY'}
                >
                    <Select placeholder="Seleccione o Tipo de Serviço" onChange={onChangeTipoServico}>
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
                  // initialValue={partner_type===undefined? undefined : partner_type === '1'? 'CLINIC' : 'COMMUNITY'}
                >
                  <Select placeholder="Organização" onChange={onChangeOrganization} disabled={partners === undefined}>
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
                  // initialValue={selectedIntervention===undefined? undefined : selectedIntervention?.subServices?.id+''}
                >
                  <Select placeholder="Local" onChange={onChangeUs}  disabled={us === undefined}>
                        {us?.map(item => (
                            <Option key={item.id}>{item.name}</Option>
                        ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  name="notifyTo"
                  label="Notificar ao"
                  rules={[{ required: true, message: 'Obrigatório' }]}
                  // initialValue={selectedIntervention===undefined? undefined : selectedIntervention?.subServices?.id+''}
                >
                  <Select placeholder="Notificar ao" disabled={users === undefined}>
                        {users?.map(item => (
                            <Option key={item.id}>{item.name}</Option>
                        ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="remarks"
                  label="Observações"
                  // initialValue={selectedIntervention?.remarks}
                >
                  <TextArea rows={2} placeholder="Observações" maxLength={6} />
                </Form.Item>
              </Col>
            </Row>
            </>
    );
}
export default StepReference;