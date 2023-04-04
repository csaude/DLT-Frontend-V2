import React, { useEffect, useState, useRef } from 'react'
import { Form, Button, Col, Row, Input, Select, DatePicker, Space, Radio, Divider } from 'antd';
import { querySubServiceByService } from '@app/utils/service'
import { allUsByType } from '@app/utils/uSanitaria'
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { allUsesByUs } from '@app/utils/users';
import { useSelector } from 'react-redux';


const { Option } = Select;
const { TextArea } = Input;

const areaServicos = [{ "id": 'CLINIC', "name": "Serviços Clinicos" }, { "id": 'COMMUNITY', "name": "Serviços Comunitarios" }];
const options = [
  { label: 'US', value: '1' },
  { label: 'CM', value: '2' },
  { label: 'ES', value: '3' },
];

const ReferenceInterventionForm = ({ form, reference, refServices }: any) => {
  const [interventions, setInterventions] = React.useState<any>(undefined);
  const [us, setUs] = React.useState<any>(undefined);
  const [selectedIntervention, setSelectedIntervention] = useState<any>(undefined);
  const inputRef = useRef<any>(null);
  const [users, setUsers] = React.useState<any>([]);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [prevRefService, setPrevRefService] = useState<any>()
  const [refService, setRefService] = useState<any>('')
  const index = useSelector((state:any)=>state.referenceIntervention.index)

  const RequiredFieldMessage = "Obrigatório!";


  useEffect(() => {
    const fetchData = async () => {
      onChangeEntryPoint(reference.referTo);
    }   
    form.setFieldsValue({ entryPoint: reference.referTo });
    form.setFieldsValue({ location: reference.us? reference.us?.id + '' : undefined });
    form.setFieldsValue({ provider: reference.notifyTo?.username });
    form.setFieldsValue({ outros: refServices[index-1]?.description });
   
    onChangeUs(reference.us?.id);

    fetchData().catch(error => console.log(error));

    setIsLoading(true); 
    
  }, []);

  useEffect(() => {     
      onChangeServices(refServices[index]?.services?.id).catch(error => console.log(error));
      form.setFieldsValue({ subservice: ''});  
      form.setFieldsValue({ areaServicos: refServices[index]?.services?.serviceType === '1' ? 'CLINIC' : 'COMMUNITY' });
      form.setFieldsValue({ service: refServices[index]?.services?.id + ''  });
      form.setFieldsValue({ outros: refServices[index-1]?.description });
  },[index])

  const onChangeServices = async (value: any) => {
    const data = await querySubServiceByService(value);
    setInterventions(data);
  }

  const onChangeSubservice = async (value: any) => {
    const intervention = interventions.filter(item=>item.id==value)
    setSelectedIntervention(intervention[0])
  }

  const onChangeEntryPoint = async (e: any) => {
    
    var payload = {
      typeId: e?.target?.value === undefined ? e : e?.target?.value,
      localityId: reference.notifyTo?.localities[0].id
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
          <Select placeholder="Select Area Serviço"  disabled>
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
          initialValue={refService}
        >
          <Select placeholder="Select Serviço" onChange={onChangeServices} >
            {refServices?.map((item) => (
              <Option key={item.services.id}>{item.services.name}</Option>
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
          <Select placeholder="Select Sub Serviço" disabled={interventions === undefined} value={undefined} onChange={onChangeSubservice}>
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