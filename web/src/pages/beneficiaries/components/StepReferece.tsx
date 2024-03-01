import React, { useEffect, useState } from "react";
import { Row, Col, Input, Form, DatePicker, Select, Radio } from "antd";
import "./index.css";
import { allPartnersByTypeDistrict } from "@app/utils/partners";
import { allUsersByUs, queryByUserId } from "@app/utils/users";
import { allUsByType } from "@app/utils/uSanitaria";
import { queryByCreated } from "@app/utils/reference";
import { COUNSELOR, MENTOR, NURSE, SUPERVISOR } from "@app/utils/contants";
import { useSelector } from "react-redux";
import moment from "moment";
import { getEntryPoint } from "@app/models/User";

const { Option } = Select;
const { TextArea } = Input;

const StepReference = ({
  form,
  beneficiary,
  reference,
  firstStepValues,
}: any) => {
  const [partners, setPartners] = React.useState<any>();
  const [users, setUsers] = React.useState<any>([]);
  const [us, setUs] = React.useState<any>();
  const [loggedUser, setLoggedUser] = useState<any>(undefined);
  const [entryPoint, setEntryPoint] = useState<any>([]);
  const [entryPoints, setEntryPoints] = useState<any>([]);
  const [serviceTypes, setServiceTypes] = useState<any>([]);
  const [serviceTypeEnabled, setServiceTypeEnabled] = useState(false);
  const [status, setStatus] = useState<any>([]);
  const [cancelReasons, setCancelReasons] = useState<any>([]);
  const [statusEnabled, setStatusEnabled] = useState(false);
  const [cancelReasonEnabled, setCancelReasonEnabled] = useState(false);
  const [otherReasonEnabled, setOtherReasonEnabled] = useState(false);
  const [stepValues, setStepValues] = useState(
    reference ? reference : firstStepValues
  );
  const selectedReference = beneficiary;
  const userId = localStorage.getItem("user");
  const referers = useSelector((state: any) => state.user.referers);
  const sortedReferes = referers.sort((u1, u2) =>
    (u1.name + u1.surname).localeCompare(u2.name + u2.surname)
  );

  useEffect(() => {
    const fetchData = async () => {
      const loggedUser = await queryByUserId(localStorage.user);

      setLoggedUser(loggedUser);

      setStatus([
        { value: "0", label: "Activo" },
        { value: "3", label: "Cancelado" },
      ]);
      if (reference === undefined) {
        form.setFieldsValue({
          referenceNote:
            "REFDR" +
            String(userId).padStart(4, "0") +
            String(beneficiary.district.province.id) +
            String((await queryByCreated(userId)) + 1).padStart(4, "0"),
        });
        form.setFieldsValue({
          referredBy: [SUPERVISOR, MENTOR, NURSE, COUNSELOR].includes(
            loggedUser.profiles.id
          )
            ? userId
            : "",
        });
      } else {
        const regUser = await queryByUserId(reference?.createdBy);
        form.setFieldsValue({
          createdBy: regUser?.name + " " + regUser?.surname,
        });
        form.setFieldsValue({ referenceNote: reference.referenceNote });

        setStatusEnabled(
          reference.userCreated === userId ||
            ![MENTOR, NURSE, COUNSELOR].includes(loggedUser.profiles.id)
        );
      }

      const partnerType = loggedUser.partners.partnerType;

      if (partnerType === "1") {
        if (loggedUser.entryPoint === "1") {
          setEntryPoints([
            { value: "2", label: "CM" },
            { value: "3", label: "ES" },
          ]);
        } else {
          setEntryPoints([
            { value: "1", label: "US" },
            { value: "2", label: "CM" },
            { value: "3", label: "ES" },
          ]);
        }
      } else if (partnerType === "2") {
        setEntryPoints([
          { value: "1", label: "US" },
          { value: "3", label: "ES" },
        ]);
      } else {
        setEntryPoints([
          { value: "1", label: "US" },
          { value: "2", label: "CM" },
          { value: "3", label: "ES" },
        ]);
      }

      setEntryPoint(getEntryPoint(loggedUser.entryPoint));
    };

    fetchData().catch((error) => console.log(error));

    const orgType = form.getFieldValue("serviceType");
    const refer = form.getFieldValue("referTo");
    const status = form.getFieldValue("status");
    const cancelReason = form.getFieldValue("cancelReason");
    if (refer !== "" && refer !== undefined) {
      onChangeEntryPoint(refer);
    }
    if (orgType !== "" && orgType !== undefined) {
      onChangeTipoServico(orgType);
    }
    if (status !== undefined) {
      onChangeStatus(status);
    }
    if (cancelReason !== undefined) {
      onChangeCancelReason(cancelReason);
    }
  }, []);

  useEffect(() => {
    const loc = form.getFieldValue("local");
    if (loc) {
      onChangeUs(loc);
    }
  }, []);

  const onChangeTipoServico = async (value: any) => {
    const payload = {
      type: value,
      districtId:
        reference !== undefined
          ? reference?.beneficiaries?.locality?.district?.id
          : beneficiary?.locality?.district?.id,
    };
    const data = await allPartnersByTypeDistrict(payload);
    setPartners(data);
  };

  const onChangeEntryPoint = async (e: any) => {
    const type = e?.target?.value === undefined ? e : e?.target?.value;
    const payload = {
      typeId: type,
      localitiesIds:
        reference !== undefined
          ? reference.notifyTo?.localities.map((i) => i.id)
          : loggedUser?.localities?.map((i) => i.id),
    };
    const data = await allUsByType(payload);
    setUs(data);

    // Limpeza dos campos ao alterar o ponto de entrada
    if (stepValues === undefined) {
      form.setFieldsValue({ local: "" });
      form.setFieldsValue({ partner_id: "" });
      form.setFieldsValue({ notifyTo: "" });
      form.setFieldsValue({ serviceType: undefined });
      setUsers([]);
    }

    setStepValues(undefined);

    const value = e.target?.value;

    if (e === "1" || value === "1") {
      setServiceTypes([{ id: "CLINIC", name: "Clínico" }]);
      form.setFieldsValue({ serviceType: "CLINIC" });
      onChangeTipoServico("CLINIC");
      setServiceTypeEnabled(false);
    } else if (e === "2" || value === "2") {
      setServiceTypes([{ id: "COMMUNITY", name: "Comunitário" }]);
      form.setFieldsValue({ serviceType: "COMMUNITY" });
      onChangeTipoServico("COMMUNITY");
      setServiceTypeEnabled(false);
    } else {
      setServiceTypes([
        { id: "CLINIC", name: "Clínico" },
        { id: "COMMUNITY", name: "Comunitário" },
      ]);
      onChangeTipoServico(type === "1" ? "CLINIC" : "COMMUNITY");
      setServiceTypeEnabled(true);
    }
  };

  const onChangeUs = async (value: any) => {
    const data = await allUsersByUs(value);
    const sortedUsers = data.sort((u1, u2) =>
      (u1.name + u1.surname).localeCompare(u2.name + u2.surname)
    );
    setUsers(sortedUsers);
  };

  const onChangeStatus = async (e: any) => {
    if (e === "0") {
      setCancelReasons([]);
      setCancelReasonEnabled(false);
      form.setFieldsValue({ cancelReason: undefined });
    } else {
      setCancelReasons([
        { id: "1", name: "Serviço nã provido nos últimos 6 meses" },
        { id: "2", name: "Beneficiária não encontrada" },
        { id: "3", name: "Abandono" },
        { id: "4", name: "Beneficiária recusou o serviço" },
        { id: "5", name: "Outro Motivo" },
      ]);
      setCancelReasonEnabled(true);
    }
  };

  const onChangeCancelReason = async (e: any) => {
    if (e === "5") {
      setOtherReasonEnabled(true);
    } else {
      setOtherReasonEnabled(false);
      form.setFieldsValue({ otherReason: undefined });
    }
  };

  return (
    <>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            name="referenceNote"
            label="Nota Referência"
            rules={[{ required: true, message: "Obrigatório" }]}
          >
            <Input placeholder="Nota Referência" disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="beneficiary_id"
            label="NUI de Beneficiário"
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={
              reference === undefined
                ? selectedReference?.nui
                : reference?.beneficiaries?.nui
            }
          >
            <Input placeholder="Nº de Beneficiário" disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="referredBy"
            label="Referente"
            rules={[{ required: true, message: "Obrigatório" }]}
            // initialValue={userId}
            initialValue={
              reference === undefined
                ? ""
                : reference?.referredBy?.id.toString()
            }
          >
            <Select placeholder="Seleccione o Referente">
              {sortedReferes?.map((item) => (
                <Option key={item.id}>{item.name + " " + item.surname}</Option>
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
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={
              reference === undefined ? "" : reference?.referTo.toString()
            }
          >
            <Radio.Group
              onChange={onChangeEntryPoint}
              options={entryPoints}
              optionType="button"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="bookNumber"
            label="Nº do Livro"
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={reference === undefined ? "" : reference?.bookNumber}
          >
            <Input placeholder="Nº do Livro" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="referenceCode"
            label={
              "Cód. Ref. Livro (PE:" +
              entryPoint +
              "; Pág.; Mês:1-12, Ano:23-99)"
            }
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={
              reference === undefined ? "" : reference?.referenceCode
            }
          >
            <Input placeholder="Ex: PE-NºPag-Mês-Ano" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            name="serviceType"
            label="Tipo de Serviço"
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={
              reference === undefined
                ? undefined
                : reference?.serviceType === "1"
                ? "CLINIC"
                : "COMMUNITY"
            }
          >
            <Select
              placeholder="Seleccione o Tipo de Serviço"
              onChange={onChangeTipoServico}
              disabled={!serviceTypeEnabled}
            >
              {serviceTypes.map((item) => (
                <Option key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="partner_id"
            label="Organização"
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={
              reference === undefined
                ? undefined
                : reference?.notifyTo?.partners?.name
            }
          >
            <Select placeholder="Organização" disabled={partners === undefined}>
              {partners?.map((item) => (
                <Option key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="local"
            label="Local"
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={
              reference === undefined ? undefined : reference?.us?.id.toString()
            }
          >
            <Select
              placeholder="Seleccione o Local"
              onChange={onChangeUs}
              disabled={us === undefined}
            >
              {us?.map((item) => (
                <Option key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            name="date"
            label="Data Emissão"
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={
              reference === undefined
                ? undefined
                : moment(reference.date, "YYYY-MM-DD")
            }
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(d) => !d || d.isAfter(moment(new Date()))}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="notifyTo"
            label="Notificar ao"
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={
              reference === undefined ? "" : reference?.notifyTo?.id.toString()
            }
          >
            <Select placeholder="Notificar ao" disabled={users === undefined}>
              {users?.map((item) => (
                <Option key={item.id}>{item.name + " " + item.surname}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
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
            rules={[{ required: true, message: "Obrigatório" }]}
            initialValue={
              reference === undefined ? "0" : reference?.status?.toString()
            }
          >
            <Select disabled={!statusEnabled} onChange={onChangeStatus}>
              {status?.map((item) => (
                <Option key={item.value}>{item.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="cancelReason"
            label="Motivo de Cancelamento"
            rules={[{ required: cancelReasonEnabled, message: "Obrigatório" }]}
            initialValue={
              reference === undefined ? "" : reference?.cancelReason?.toString()
            }
          >
            <Select
              placeholder="Motivo Cancelamento"
              disabled={!cancelReasonEnabled}
              onChange={onChangeCancelReason}
            >
              {cancelReasons?.map((item) => (
                <Option key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="otherReason"
            label="Outro Motivo"
            rules={[{ required: otherReasonEnabled, message: "Obrigatório" }]}
            initialValue={reference === undefined ? "" : reference?.otherReason}
          >
            <TextArea
              rows={2}
              placeholder="Motivo"
              maxLength={600}
              disabled={!otherReasonEnabled}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};
export default StepReference;
