import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Space, Radio, Divider } from 'antd';
import { queryByType, querySubServiceByService } from '@app/utils/service'
import { allUs, allUsByType } from '@app/utils/uSanitaria'
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { query, userById, allUsesByUs } from '@app/utils/users';


const { Option } = Select;
const { TextArea } = Input;

const areaServicos = [{ "id": 'CLINIC', "name": "Serviços Clinicos" }, { "id": 'COMMUNITY', "name": "Serviços Comunitarios" }];
const options = [
  { label: 'US', value: '1' },
  { label: 'CM', value: '2' },
  { label: 'ES', value: '3' },
];
let index = 0;

const ReferenceInterventionForm = ({ form, reference, record, beneficiary }: any) => {
  const [services, setServices] = React.useState<any>(undefined);
  const [interventions, setInterventions] = React.useState<any>(undefined);
  const [us, setUs] = React.useState<any>(undefined);
  const selectedIntervention = record;
  const service = selectedIntervention?.services;
  const inputRef = useRef<any>(null);
  const [users, setUsers] = React.useState<any>([]);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const RequiredFieldMessage = "Obrigatório!";

  useEffect(() => {

    const fetchData = async () => {
      const data = await allUs();
      setUs(data);
    }

    const fetchServices = async () => {
      const data = await queryByType(service.serviceType === '1' ? 'CLINIC' : 'COMMUNITY');
      setServices(data);
    }

    const fetchSubServices = async () => {
      const data = await querySubServiceByService(service.id);
      setInterventions(data);
    }

    if (selectedIntervention !== undefined) {
      form.setFieldsValue({ areaServicos: service.serviceType === '1' ? 'CLINIC' : 'COMMUNITY' });
      form.setFieldsValue({ service: service?.id + '' });
      form.setFieldsValue({ entryPoint: reference.referTo });
      form.setFieldsValue({ location: reference.us.id + '' });
      form.setFieldsValue({ provider: reference.users.username });
      onChangeUs(reference.us.id);

      fetchServices().catch(error => console.log(error));

      fetchSubServices().catch(error => console.log(error));
    }

    fetchData().catch(error => console.log(error));

    setIsLoading(true);

  }, [selectedIntervention]);

  const onChangeAreaServiço = async (value: any) => {
    const data = await queryByType(value);
    setServices(data);
  }

  const onChangeServices = async (value: any) => {
    const data = await querySubServiceByService(value);
    setInterventions(data);
  }

  const onChangeEntryPoint = async (e: any) => {

    var payload = {
      typeId: e?.target?.value === undefined ? e : e?.target?.value,
      localityId: beneficiary?.neighborhood?.locality?.id
    }
    const data = await allUsByType(payload);
    setUs(data);

    if (!isLoading) {
      form.setFieldsValue({location: ''});
      form.setFieldsValue({provider: ''});
    }
  }

  const onChangeUs = async (value: any) => {
    const data = await allUsesByUs(value);
    setUsers(data);

    if (!isLoading) {
      form.setFieldsValue({provider: ''});
    }

    setIsLoading(false);
  }

  const onNameChange = (event) => {
    setName(event.target.value);
  }
  const addItem = (e) => {
    e.preventDefault();
    if (name !== undefined || name !== '') {
      const newItem = { username: name };
      setUsers([...users, newItem]);

    }
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <><Row gutter={8}>
      <Col span={8}>
        <Form.Item
          name="areaServicos"
          label="Área de Serviços"
          rules={[{ required: true, message: RequiredFieldMessage }]}
        >
          <Select placeholder="Select Area Serviço" onChange={onChangeAreaServiço} disabled>
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
        >
          <Select placeholder="Select Serviço" onChange={onChangeServices} disabled>
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
          >
            <Radio.Group
              onChange={onChangeEntryPoint}
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
          >
            <Select placeholder="Select Localização" onChange={onChangeUs}>
              {us?.map(item => (
                <Option key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="dataBeneficio"
            label="Data Benefício"
            rules={[{ required: true, message: RequiredFieldMessage }]}
            initialValue={moment(new Date(),'YYYY-MM-DD')}
          >
            <DatePicker style={{ width: '100%' }} defaultPickerValue={moment(new Date(),'YYYY-MM-DD')} disabledDate={d => !d || d.isAfter(moment(new Date()))} />

          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            name="provider"
            label="Provedor do Serviço"
            rules={[{ required: true, message: RequiredFieldMessage }]}
          >
            <Select
              showSearch
              style={{
                width: 300,
              }}
              placeholder="Nome do Provedor do Serviço"
              optionFilterProp="children"
              filterOption={(input, option: any) => option.children.includes(input)}
              filterSort={(optionA, optionB) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
              }
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider
                    style={{
                      margin: '8px 0',
                    }}
                  />
                  <Space
                    style={{
                      padding: '0 8px 4px',
                    }}
                  >
                    <Input
                      placeholder="Provedor"
                      ref={inputRef}
                      value={name}
                      onChange={onNameChange}
                    />
                    <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                      Outro
                    </Button>
                  </Space>
                </>
              )}
            >
              {users.map((item) => (
                <Option key={item.username}>{item.name+' '+item.surname}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="outros"
            label="Outras Observações"
            initialValue={selectedIntervention?.description}
          >
            <TextArea rows={2} placeholder="Insira as Observações" maxLength={50} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
export default ReferenceInterventionForm;