import React, { Fragment, useEffect, useState } from 'react';
import { Badge, Button, Steps, Row, Col, Input, message, InputNumber, Form, DatePicker, Checkbox, Select, Radio, Divider, SelectProps } from 'antd';
import './index.css';
import { allPartnersByType, allPartnersByTypeDistrict } from '@app/utils/partners';
import { query, userById, allUsesByUs, allUsersByProfilesAndUser } from '@app/utils/users';
import { allUs, allUsByType } from '@app/utils/uSanitaria';
import {queryByCreated} from '@app/utils/reference';

const { Option } = Select;
const { Step } = Steps;
const { TextArea } = Input;

const areaServicos = [{ "id": 'CLINIC', "name": "Clinico" }, { "id": 'COMMUNITY', "name": "Comunitário" }];
const options = [
  { label: 'US', value: '1' },
  { label: 'CM', value: '2' },
  { label: 'ES', value: '3' },
];

const StepReference = ({ form, beneficiary, reference }: any) => {

  const [partners, setPartners] = React.useState<any>();
  const [users, setUsers] = React.useState<any>();
  const [referers, setReferers] = React.useState<any>(undefined);
  const [user, setUser] = React.useState<any>();
  const [us, setUs] = React.useState<any>();
  const selectedReference = beneficiary;
  let userId = localStorage.getItem('user');

  useEffect(() => {

    const fetchData = async () => {
      const loggedUser = await query(localStorage.user);

      if (reference === undefined) {
        if([3,4,5,6].includes(loggedUser.profiles.id)) {
          // form.setFieldsValue({ createdBy: loggedUser?.name + ' ' + loggedUser?.surname });
          setUser(loggedUser);
          console.log(loggedUser);
        }
        form.setFieldsValue({ referenceNote: 
                              ('REFDR' + String(userId).padStart(3, '0') + (loggedUser?.provinces === undefined ? '0': loggedUser?.provinces[0]?.id) + String(((await queryByCreated(localStorage.user))?.length)+ 1).padStart(3, '0'))
                            });
      } else {
        const regUser = await query(reference?.createdBy);
        form.setFieldsValue({ createdBy: regUser?.name + ' ' + regUser?.surname });
        form.setFieldsValue({ referenceNote: reference.referenceNote});
      }

      var payload = {
        profiles: '3,4,5,6',
        userId: Number(userId)
      }

      const referers = await allUsersByProfilesAndUser(payload);
      setReferers(referers);

      console.log(referers);
    }

    fetchData().catch(error => console.log(error));

    let orgType = form.getFieldValue('serviceType');
    let refer = form.getFieldValue('referTo');
    if (refer !== '' && refer !== undefined) {

      onChangeEntryPoint(refer);
    }
    if (orgType !== '' && orgType !== undefined) {
      onChangeTipoServico(orgType);
    }

  }, []);

  useEffect(() => {

    let loc = form.getFieldValue('local');

    if (loc !== '' && loc !== undefined && us?.length > 0 && reference != undefined) {
      const usObj = us.filter(e => { return e.name === loc })[0];
      onChangeUs(usObj?.id);
    }

  }, [us]);

  const onChangeTipoServico = async (value: any) => {
    var payload = {
      type: value,
      districtId: reference !== undefined ? 
                                reference?.beneficiaries?.neighborhood?.locality?.district?.id :
                                beneficiary?.neighborhood?.locality?.district?.id
    }
    const data = await allPartnersByTypeDistrict(payload);
    setPartners(data);
  }

  const onChangeEntryPoint = async (e: any) => {
    var payload = {
      typeId: e?.target?.value === undefined ? e : e?.target?.value,
      localityId: reference !== undefined ? 
                                reference?.beneficiaries?.neighborhood?.locality?.id :
                                beneficiary?.neighborhood?.locality?.id
    }
    const data = await allUsByType(payload);
    setUs(data);
  }

  const onChangeUs = async (value: any) => {
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
          >

            <Input placeholder="Nota Referência" disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="beneficiary_id"
            label="NUI de Beneficiário"
            rules={[{ required: true, message: 'Obrigatório' }]}
            initialValue={reference === undefined ? selectedReference?.nui : reference?.beneficiaries?.nui}
          >
            <Input placeholder="Nº de Beneficiário" disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="referredBy"
            label="Referente"
            rules={[{ required: true, message: 'Obrigatório' }]}
            // initialValue={userId}
            initialValue={reference === undefined ? user?.id : reference?.referredBy}
          >
              <Select placeholder="Seleccione o Referente" >
                  {referers?.map(item => (
                      <Option key={item.id}>{item.name + ' ' + item.surname}</Option>
                  ))}
              </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            name="referTo"
            label="Referir Para"
            rules={[{ required: true, message: 'Obrigatório' }]}
            initialValue={reference === undefined ? "" : reference?.serviceType}
          >
            <Radio.Group onChange={onChangeEntryPoint}
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
            initialValue={reference === undefined ? "" : reference?.bookNumber}
          >
            <Input placeholder="Nº do Livro" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="referenceCode"
            label="Código de Referência no livro"
            rules={[{ required: true, message: 'Obrigatório' }]}
            initialValue={reference === undefined ? "" : reference?.referenceCode}
          >
            <Input placeholder='Ex: CM-08-001' />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            name="serviceType"
            label="Tipo de Serviço"
            rules={[{ required: true, message: 'Obrigatório' }]}
            initialValue={reference === undefined ? undefined : reference?.serviceType === '1' ? 'CLINIC' : 'COMMUNITY'}
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
            initialValue={reference === undefined ? undefined : reference?.users?.partners?.name}
          >
            <Select placeholder="Organização" disabled={partners === undefined}>
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
            initialValue={reference === undefined ? undefined : reference?.users?.us[0]?.name}
          >
            <Select placeholder="Seleccione o Local" onChange={onChangeUs} disabled={us === undefined}>
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
            initialValue={reference === undefined ? "" : reference?.users?.name + " " + reference?.users?.surname}
          >
            <Select placeholder="Notificar ao" disabled={users === undefined}>
              {users?.map(item => (
                <Option key={item.id}>{item.name + ' ' + item.surname}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            name="remarks"
            label="Observações"
            initialValue={reference === undefined ? "" : reference?.remarks}
          >
            <TextArea rows={2} placeholder="Observações" maxLength={600} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
export default StepReference;
