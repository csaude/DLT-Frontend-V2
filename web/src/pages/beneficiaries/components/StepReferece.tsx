import React, { useEffect, useState } from "react";
import { Row, Col, Input, Form, DatePicker, Select, Radio } from "antd";
import "./index.css";
import { allPartnersByTypeDistrict } from "@app/utils/partners";
import { allUsersByUsAndOrganization, queryByUserId } from "@app/utils/users";
import { allUsByType } from "@app/utils/uSanitaria";
import { queryByCreated } from "@app/utils/reference";
import { COUNSELOR, MENTOR, NURSE, SUPERVISOR } from "@app/utils/contants";
import { useSelector } from "react-redux";
import moment from "moment";
import { getEntryPoint } from "@app/models/User";
import { queryLocalitiesByDistricts } from "@app/utils/locality";

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
  const [entryPoint, setEntryPoint] = useState<any>([]);
  const [currentYear, setCurrentYear] = useState<any>(undefined);
  const [entryPoints, setEntryPoints] = useState<any>([]);
  const [localities, setLocalities] = useState<any>([]);
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
  const userId = localStorage.getItem("user");
  const referers = useSelector((state: any) => state.user.referers);
  const sortedReferes = referers.sort((u1, u2) =>
    (u1.name + u1.surname).localeCompare(u2.name + u2.surname)
  );

  useEffect(() => {
    const fetchData = async () => {
      const loggedUser = await queryByUserId(localStorage.user);
      const payload = {
        districts: [
          beneficiary
            ? beneficiary?.locality?.district?.id
            : reference.beneficiaries?.locality?.district?.id,
        ],
      };

      const entryPoint = getEntryPoint(loggedUser.entryPoint);
      const currentYear = moment(new Date()).format("YY");

      setEntryPoint(entryPoint);
      setCurrentYear(currentYear);

      const localities =
        loggedUser?.localities.length > 0
          ? loggedUser?.localities
          : await queryLocalitiesByDistricts(payload);

      setLocalities(localities);

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
        const refCode = form.getFieldValue("referenceCode");
        if (!refCode) {
          form.setFieldsValue({
            referenceCode: entryPoint + "-PP-MM-" + currentYear,
          });
        }
      } else {
        const regUser = await queryByUserId(reference?.createdBy);
        form.setFieldsValue({
          createdBy: regUser?.name + " " + regUser?.surname,
        });
        form.setFieldsValue({ referenceNote: reference.referenceNote });
        form.setFieldsValue({ referenceCode: reference.referenceCode });

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
          : localities.map((i) => i.id),
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
    const organization = form.getFieldValue("partner_id");
    const payload = {
      usId: Number(value),
      organizationId: Number(organization),
    };
    const data = await allUsersByUsAndOrganization(payload);
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
            rules={[
              { required: reference?.status != 1, message: "Obrigatório" },
            ]}
          >
            <Input placeholder="Nota Referência" disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="beneficiary_id"
            label="NUI de Beneficiário"
            rules={[
              { required: reference?.status != 1, message: "Obrigatório" },
            ]}
            initialValue={
              reference === undefined
                ? beneficiary?.nui
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
            rules={[
              { required: reference?.status != 1, message: "Obrigatório" },
            ]}
            // initialValue={userId}
            initialValue={
              reference === undefined
                ? ""
                : reference?.referredBy?.id.toString()
            }
          >
            <Select
              disabled={reference?.status == 1}
              placeholder="Seleccione o Referente"
            >
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
            rules={[
              { required: reference?.status != 1, message: "Obrigatório" },
            ]}
            initialValue={
              reference === undefined ? "" : reference?.referTo.toString()
            }
          >
            <Radio.Group
              disabled={reference?.status == 1}
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
            rules={[
              { required: reference?.status != 1, message: "Obrigatório" },
            ]}
            initialValue={reference === undefined ? "" : reference?.bookNumber}
          >
            <Input
              disabled={reference?.status == 1}
              placeholder="Nº do Livro"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="referenceCode"
            label={
              "Cód. Ref. Livro (PE:" +
              entryPoint +
              "; Pág.; Mês:01-12, Ano:" +
              (currentYear - 1) +
              "-" +
              currentYear +
              ")"
            }
            rules={[
              { required: reference?.status != 1, message: "Obrigatório" },
              {
                validator(rule, value) {
                  return new Promise((resolve, reject) => {
                    const splittedRefCode = value.split("-");
                    if (splittedRefCode.length != 4) {
                      reject("Formato incorrecto");
                    } else if (
                      !["US", "CM", "ES"].includes(splittedRefCode[0])
                    ) {
                      reject("Ponto de entrada incorrecto");
                    } else if (
                      splittedRefCode[1].localeCompare("01") < 0 ||
                      splittedRefCode[1].localeCompare("99") > 0
                    ) {
                      reject("Número de página incorrecto");
                    } else if (
                      splittedRefCode[2].localeCompare("01") < 0 ||
                      splittedRefCode[2].localeCompare("12") > 0
                    ) {
                      reject("Mês incorrecto");
                    } else if (
                      splittedRefCode[3].localeCompare(
                        Number(currentYear) - 1
                      ) < 0 ||
                      splittedRefCode[3].localeCompare(currentYear) > 0
                    ) {
                      reject("Ano incorrecto");
                    } else {
                      resolve("");
                    }
                  });
                },
              },
            ]}
            initialValue={
              reference === undefined ? "" : reference?.referenceCode
            }
          >
            <Input
              disabled={reference?.status == 1}
              placeholder="Ex: PE-NºPag-Mês-Ano"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            name="serviceType"
            label="Tipo de Serviço"
            rules={[
              { required: reference?.status != 1, message: "Obrigatório" },
            ]}
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
              disabled={!serviceTypeEnabled || reference?.status == 1}
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
            rules={[
              { required: reference?.status != 1, message: "Obrigatório" },
            ]}
            initialValue={
              reference === undefined
                ? undefined
                : reference?.notifyTo?.partners?.id.toString()
            }
          >
            <Select
              placeholder="Organização"
              disabled={partners === undefined || reference?.status == 1}
            >
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
            rules={[
              { required: reference?.status != 1, message: "Obrigatório" },
            ]}
            initialValue={
              reference === undefined ? undefined : reference?.us?.id.toString()
            }
          >
            <Select
              placeholder="Seleccione o Local"
              onChange={onChangeUs}
              disabled={us === undefined || reference?.status == 1}
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
            rules={[
              { required: reference?.status != 1, message: "Obrigatório" },
            ]}
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
            rules={[
              { required: reference?.status != 1, message: "Obrigatório" },
            ]}
            initialValue={
              reference === undefined ? "" : reference?.notifyTo?.id.toString()
            }
          >
            <Select
              placeholder="Notificar ao"
              disabled={users === undefined || reference?.status == 1}
            >
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
            <TextArea
              disabled={reference?.status == 1}
              rows={2}
              placeholder="Observações"
              maxLength={600}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={8}>
          <Form.Item
            name="status"
            label="Estado"
            rules={[
              { required: reference?.status != 1, message: "Obrigatório" },
            ]}
            initialValue={
              reference === undefined ? "0" : reference?.status?.toString()
            }
          >
            <Select
              disabled={!statusEnabled || reference?.status == 1}
              onChange={onChangeStatus}
            >
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
            rules={[
              {
                required: reference?.status != 1 && cancelReasonEnabled,
                message: "Obrigatório",
              },
            ]}
            initialValue={
              reference === undefined ? "" : reference?.cancelReason?.toString()
            }
          >
            <Select
              placeholder="Motivo Cancelamento"
              disabled={!cancelReasonEnabled || reference?.status == 1}
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
            rules={[
              {
                required: reference?.status != 1 && otherReasonEnabled,
                message: "Obrigatório",
              },
            ]}
            initialValue={reference === undefined ? "" : reference?.otherReason}
          >
            <TextArea
              rows={2}
              placeholder="Motivo"
              maxLength={600}
              disabled={!otherReasonEnabled || reference?.status == 1}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};
export default StepReference;
