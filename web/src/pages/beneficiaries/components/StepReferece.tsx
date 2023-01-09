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

const StepReference = ({ form, beneficiary, reference }: any) => {

  const [partners, setPartners] = React.useState<any>();
  const [users, setUsers] = React.useState<any>();
  const [referers, setReferers] = React.useState<any>(undefined);
  const [us, setUs] = React.useState<any>();
  const [entryPoints, setEntryPoints] = useState<any>([]);
  const [entryPointEnabled, setEntryPointEnabled] = useState(true);
  const [serviceTypes, setServiceTypes] = useState<any>([]);
  const [serviceTypeEnabled, setServiceTypeEnabled] = useState(false);
  const [status, setStatus] = useState<any>([]);
  const [cancelReasons, setCancelReasons] = useState<any>([]);
  const [statusEnabled, setStatusEnabled] = useState(false);
  const [cancelReasonEnabled, setCancelReasonEnabled] = useState(false);
  const [otherReasonEnabled, setOtherReasonEnabled] = useState(false);
  const selectedReference = beneficiary;
  let userId = localStorage.getItem('user');

  useEffect(() => {

    const fetchData = async () => {
      const loggedUser = await query(localStorage.user);

      var payload = {
        profiles: '3,4,5,6',
        userId: Number(userId)
      }

      const referers = await allUsersByProfilesAndUser(payload);
      setReferers(referers);

      setStatus([{ value: '0', label: "Activo" }, { value: '3', label: "Cancelado" }]);
      if (reference === undefined) {
        form.setFieldsValue({ referenceNote: 
                              ('REFDR' + String(userId).padStart(3, '0') + String(beneficiary.locality.district.province.id) + String(((await queryByCreated(localStorage.user))?.length)+ 1).padStart(3, '0'))
                            });
        form.setFieldsValue({ referredBy: [3,4,5,6].includes(loggedUser.profiles.id)? localStorage.user : '' });
      } else {
        const regUser = await query(reference?.createdBy);
        form.setFieldsValue({ createdBy: regUser?.name + ' ' + regUser?.surname });
        form.setFieldsValue({ referenceNote: reference.referenceNote});

        setStatusEnabled(reference.userCreated === userId || ![4,5].includes(loggedUser.profiles.id));
      }

      const partnerType = loggedUser.partners.partnerType;

      if (loggedUser.entryPoint === "3") {
          setEntryPoints([{ value: '1', label: "US" }, { value: '2', label: "CM" }, { value: '3', label: "ES" }]);
      } else if (partnerType === "1") {
          setEntryPoints([{ value: '2', label: "CM" }, { value: '3', label: "ES" }]);
      } else if (partnerType === "2") {
          setEntryPoints([{ value: '1', label: "US" }]);
          form.setFieldsValue({ referTo: '1' });
          onChangeEntryPoint('1');
          onChangeTipoServico('CLINIC');
          setEntryPointEnabled(false);
      } else {
          setEntryPoints([{ value: '1', label: "US" }, { value: '2', label: "CM" }, { value: '3', label: "ES" }]);
      }
    }

    fetchData().catch(error => console.log(error));

    let orgType = form.getFieldValue('serviceType');
    let refer = form.getFieldValue('referTo');
    let status = form.getFieldValue('status');
    let cancelReason = form.getFieldValue('cancelReason');
    if (refer !== '' && refer !== undefined) {

      onChangeEntryPoint(refer);
    }
    if (orgType !== '' && orgType !== undefined) {
      onChangeTipoServico(orgType);
    }
    if (status !== undefined) {
      onChangeStatus(status);
    }
    if (cancelReason !== undefined) {
      onChangeCancelReason(cancelReason)
    }

  }, []);

  useEffect(() => {
    let loc = form.getFieldValue('local');
    if (loc) {
      onChangeUs(loc);
    }

  }, []);

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

    // FIXME: Rever a limpeza dos campos ao alterar o ponto de entrada
    // if (reference === undefined) {
    //   form.setFieldsValue({ local: '' });
    //   form.setFieldsValue({ partner_id: '' });
    //   form.setFieldsValue({ notifyTo: '' });
    //   setUsers(undefined);
    // }

    const value = e.target?.value;

    if (e === '1' || value === '1') {
        setServiceTypes([{ "id": 'CLINIC', "name": "Clínico" }]);
        form.setFieldsValue({ serviceType: 'CLINIC' });
        onChangeTipoServico('CLINIC');
        setServiceTypeEnabled(false);
    } else if (e === '2' || value === '2') {
        setServiceTypes([{ "id": 'COMMUNITY', "name": "Comunitário" }]);
        form.setFieldsValue({ serviceType: 'COMMUNITY' });
        onChangeTipoServico('COMMUNITY');
        setServiceTypeEnabled(false);
    } else {
        setServiceTypes([{ "id": 'CLINIC', "name": "Clínico" }, { "id": 'COMMUNITY', "name": "Comunitário" }]);
        // form.setFieldsValue({ serviceType: '' });
        // setPartners(undefined);
        setServiceTypeEnabled(true);
    }
  }

  const onChangeUs = async (value: any) => {
    const data = await allUsesByUs(value);
    setUsers(data);
  }

  const onChangeStatus =async (e:any) => {
    if (e === '0') {
      setCancelReasons([]);
      setCancelReasonEnabled(false);
      form.setFieldsValue({ cancelReason: undefined });
    } else {
      setCancelReasons([{ "id": '1', "name": "Serviço nã provido nos últimos 6 meses" }, 
                       { "id": '2', "name": "Beneficiária não encontrada" }, 
                       { "id": '3', "name": "Abandono" },
                       { "id": '4', "name": "Beneficiária recusou o serviço" },
                       { "id": '5', "name": "Outro Motivo" }
                      ]);
      setCancelReasonEnabled(true);
    }
  }

  const onChangeCancelReason =async (e:any) => {
    console.log(e);
    if (e === '5') {
      setOtherReasonEnabled(true);
    } else {
      setOtherReasonEnabled(false);
      form.setFieldsValue({ otherReason: undefined });
    }   
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
            initialValue={reference === undefined ? "" : reference?.referredBy?.id.toString()}
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
            initialValue={reference === undefined ? "" : reference?.referTo.toString()}
          >
            <Radio.Group onChange={onChangeEntryPoint}
              options={entryPoints}
              disabled={!entryPointEnabled}
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
            <Select placeholder="Seleccione o Tipo de Serviço" onChange={onChangeTipoServico} disabled={!serviceTypeEnabled}>
              {serviceTypes.map(item => (
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
            initialValue={reference === undefined ? undefined : reference?.us.id.toString()}
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
            initialValue={reference === undefined ? "" : reference?.users?.id.toString()}
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
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            name="status"
            label="Estado"
            rules={[{ required: true, message: 'Obrigatório' }]}
            initialValue={reference === undefined ? "0" : reference?.status?.toString()}
          >
            <Select disabled={!statusEnabled} onChange={onChangeStatus}>
              {status?.map(item => (
                <Option key={item.value}>{item.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="cancelReason"
            label="Motivo de Cancelamento"
            rules={[{ required: cancelReasonEnabled, message: 'Obrigatório' }]}
            initialValue={reference === undefined ? "" : reference?.cancelReason?.toString()}
          >
            <Select placeholder="Motivo Cancelamento" disabled={!cancelReasonEnabled} onChange={onChangeCancelReason}>
              {cancelReasons?.map(item => (
                <Option key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="otherReason"
            label="Outro Motivo"
            rules={[{ required: otherReasonEnabled, message: 'Obrigatório' }]}
            initialValue={reference === undefined ? "" : reference?.otherReason}
          >
            <TextArea rows={2} placeholder="Motivo" maxLength={600} disabled={!otherReasonEnabled} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
export default StepReference;
