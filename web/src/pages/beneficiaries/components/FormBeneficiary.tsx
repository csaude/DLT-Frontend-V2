import React, { useEffect, useRef, useState } from "react";
import { Button, Steps, message, Form, Modal, Space } from "antd";
import "./index.css";
import { ExclamationCircleFilled } from "@ant-design/icons";
import StepDadosPessoais from "./StepDadosPessoais";
import StepVulnerabilidadesGerais from "./StepVulnerabilidadesGerais";
import StepVulnerabilidadesEspecificas from "./StepVulnerabilidadesEspecificas";
import {
  add,
  edit,
  findByNameAndDateOfBirthAndLocality,
} from "@app/utils/beneficiary";
import moment from "moment";

const { Step } = Steps;
const { confirm } = Modal;

const BeneficiaryForm = ({
  form,
  beneficiary,
  beneficiaries,
  modalVisible,
  handleAddBeneficiary,
  handleUpdateBeneficiary,
  handleModalVisible,
  handleRegisterAnExistingBeneficiary,
  isEditMode,
  allowDataEntry,
}: any) => {
  const [current, setCurrent] = useState(0);
  const [firstStepValues, setFirstStepValues] = useState();
  const [secondStepValues, setSecondStepValues] = useState();
  const [isExistingBeneficiary, setExistingBeneficiary] = useState(false);
  const [beneficiaryState, setBeneficiaryState] = useState<any>();
  const [ignoreExisting, setIgnoreExisting] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!beneficiary) {
      setBeneficiaryState(undefined);
    } else {
      setBeneficiaryState(beneficiary);
    }
  }, []);

  useEffect(() => {
    if (!modalVisible) {
      setCurrent(0);
    }
    setIgnoreExisting(false);
  }, [modalVisible]);

  const next = () => {
    form
      .validateFields()
      .then(async (values) => {
        let beneficiaries = [];

        if (values?.["name"] && !ignoreExisting) {
          const myMoment: any = values?.["date_of_birth"];
          beneficiaries = await findByNameAndDateOfBirthAndLocality(
            values?.["name"],
            myMoment?.valueOf(),
            values?.["locality"]
          );
        }

        if (
          beneficiaries.length > 0 &&
          !beneficiaryState?.nui &&
          !isEditMode &&
          !ignoreExisting
        ) {
          setExistingBeneficiary(true);
          setBeneficiaryState(beneficiaries[0]);
        } else {
          const inc = current + 1;
          setCurrent(inc);
          current === 0
            ? setFirstStepValues(values)
            : setSecondStepValues(values);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const prev = () => {
    const inc = current - 1;
    setCurrent(inc);
  };

  const onSubmit = async () => {
    if (buttonRef.current && !buttonRef.current.disabled) {
      buttonRef.current.disabled = true;
      handleAdd(firstStepValues);
    }
  };

  const handleAdd = (values: any) => {
    form
      .validateFields()
      .then(async (vblts) => {
        setSecondStepValues(vblts);

        const ben: any = beneficiary
          ? beneficiary
          : {
              /**Its OK*/
            };
        ben.surname = values.surname;
        ben.name = values.name;
        ben.nickName = values.nick_name;
        ben.dateOfBirth = moment(values.date_of_birth).format("YYYY-MM-DD");
        ben.age = values.age;
        ben.gender = "2";
        ben.address = values.address;
        ben.email = values.e_mail;
        ben.phoneNumber = values.phone_number;
        ben.enrollmentDate = values.enrollment_date;
        ben.nationality = values.nationality;
        ben.entryPoint = values.entry_point;
        ben.neighborhood = { id: values.neighbourhood_id };
        ben.locality = values.locality;
        ben.district = values.district;
        ben.partnerNUI = values.partner_nui;
        ben.vbltDeficiencyType = vblts.vblt_deficiency_type;
        ben.vbltHouseSustainer = vblts.vblt_house_sustainer;
        ben.vbltIsDeficient = vblts.vblt_is_deficient;
        ben.vbltIsStudent = vblts.vblt_is_student;
        ben.vbltLivesWith = vblts.vblt_lives_with?.toString();
        ben.vbltMarriedBefore = vblts.vblt_married_before;
        ben.vbltSchoolGrade = vblts.vblt_school_grade;
        ben.vbltSchoolName = vblts.vblt_school_name;
        ben.vbltIdp = vblts.vblt_idp;
        ben.vbltTestedHiv = vblts.vblt_tested_hiv;
        ben.status = "1";

        const us = values.us;

        ben.createdBy = localStorage.user;
        ben.partners = { id: localStorage.organization };
        ben.us = { id: us === undefined ? localStorage.us : us };
        ben.dateCreated = new Date();

        const { data } = await add(ben);
        handleAddBeneficiary(data);

        const inc = current + 1;
        setCurrent(inc);

        message.success({
          content: "Registado com Sucesso!",
          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });
      })
      .catch(() => {
        message.error({
          content: "Não foi possivel Registrar a Beneficiária!",
          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });
        if (buttonRef.current) {
          buttonRef.current.disabled = false;
        }
      });
  };

  const handleUpdate = (firstStepValues, secondStepValues) => {
    form
      .validateFields()
      .then(async (values) => {
        beneficiary.surname = firstStepValues.surname;
        beneficiary.name = firstStepValues.name;
        beneficiary.nickName = firstStepValues.nick_name;
        beneficiary.dateOfBirth = moment(firstStepValues.date_of_birth).format(
          "YYYY-MM-DD"
        );
        beneficiary.age = firstStepValues.age;
        beneficiary.address = firstStepValues.address;
        beneficiary.email = firstStepValues.e_mail;
        beneficiary.phoneNumber = firstStepValues.phone_number;
        beneficiary.enrollmentDate = firstStepValues.enrollment_date;
        beneficiary.nationality = firstStepValues.nationality;
        beneficiary.entryPoint = firstStepValues.entry_point;
        beneficiary.neighborhood = { id: firstStepValues.neighbourhood_id };
        beneficiary.locality = firstStepValues.locality;
        beneficiary.district = firstStepValues.district;
        beneficiary.partnerNUI = firstStepValues.partner_nui;
        beneficiary.vbltDeficiencyType = secondStepValues.vblt_deficiency_type;
        beneficiary.vbltHouseSustainer = secondStepValues.vblt_house_sustainer;
        beneficiary.vbltIsDeficient = secondStepValues.vblt_is_deficient;
        beneficiary.vbltIsStudent = secondStepValues.vblt_is_student;
        beneficiary.vbltLivesWith = secondStepValues.vblt_lives_with.toString();
        beneficiary.vbltMarriedBefore = secondStepValues.vblt_married_before;
        beneficiary.vbltSchoolGrade = secondStepValues.vblt_school_grade;
        beneficiary.vbltSchoolName = secondStepValues.vblt_school_name;
        beneficiary.vbltIdp = secondStepValues.vblt_idp;
        beneficiary.vbltTestedHiv = secondStepValues.vblt_tested_hiv;
        beneficiary.vbltSexuallyActive = values.vblt_sexually_active;
        beneficiary.vbltPregnantOrHasChildren =
          values.vblt_pregnant_or_has_children;
        beneficiary.vbltMultiplePartners = values.vblt_multiple_partners;
        beneficiary.vbltTraffickingVictim = values.vblt_trafficking_victim;
        beneficiary.vbltSexualExploitation = values.vblt_sexual_exploitation;
        beneficiary.vbltSexploitationTime = values.vblt_sexploitation_time;
        beneficiary.vbltVbgVictim = values.vblt_vbg_victim;
        beneficiary.vbltVbgType = values.vblt_vbg_type;
        beneficiary.vbltVbgTime = values.vblt_vbg_time;
        beneficiary.vbltAlcoholDrugsUse = values.vblt_alcohol_drugs_use;
        beneficiary.vbltStiHistory = values.vblt_sti_history;
        beneficiary.vbltSexWorker = values.vblt_sex_worker;
        beneficiary.updatedBy = localStorage.user;
        beneficiary.dateUpdated = new Date();

        const us = firstStepValues.us;
        if (us !== undefined) {
          beneficiary.us = us;
        }

        const { data } = await edit(beneficiary);
        handleUpdateBeneficiary(data);

        message.success({
          content: "Actualizado com Sucesso!",
          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });
      })
      .catch(() => {
        message.error({
          content: "Não foi possivel Actualizar a Beneficiária!",
          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });
      });
  };

  const onUpdate = async () => {
    handleUpdate(firstStepValues, secondStepValues);
    // TODO: Review these actions... date is not being persisted when included
    //setCurrent(0);
    // form.resetFields();
  };

  const showCloseConfirm = () => {
    confirm({
      title: "Deseja fechar este formulário?",
      icon: <ExclamationCircleFilled />,
      okText: "Sim",
      okType: "danger",
      cancelText: "Não",
      onOk() {
        handleModalVisible(false);
        setBeneficiaryState(undefined);
      },
      onCancel() {
        /**Its OK */
      },
    });
  };

  const steps = [
    {
      title: "Dados Pessoais",
      content: (
        <StepDadosPessoais
          form={form}
          beneficiary={beneficiaryState ? beneficiaryState : beneficiary}
          beneficiaries={beneficiaries}
        />
      ),
    },
    {
      title: "Critérios de Eligibilidade Gerais",
      content: (
        <StepVulnerabilidadesGerais
          form={form}
          beneficiary={beneficiaryState ? beneficiaryState : beneficiary}
        />
      ),
    },
    {
      title: " Critérios de Eligibilidade Específicos",
      content: (
        <StepVulnerabilidadesEspecificas
          form={form}
          beneficiary={beneficiaryState ? beneficiaryState : beneficiary}
          firstStepValues={firstStepValues}
        />
      ),
    },
  ];

  const onRegisterNewBeneficiary = () => {
    setExistingBeneficiary(false);
    handleModalVisible(true);
    setBeneficiaryState(undefined);
    setIgnoreExisting(true);
  };

  const onUpdateExistingBeneficiary = () => {
    setExistingBeneficiary(false);
    handleModalVisible(false);
    handleRegisterAnExistingBeneficiary(beneficiaryState);
  };

  const ConfirmationModal = () => {
    return (
      <>
        <Modal
          width={340}
          centered
          destroyOnClose
          visible={isExistingBeneficiary && !isEditMode}
          maskClosable={false}
          footer={null}
          closable={false}
        >
          <div>
            <Space direction="vertical" style={{ width: "100%" }}>
              <b>
                {`Já existe uma Beneficiária com as mesmas características, com o nui ${beneficiaryState?.nui}`}
              </b>
              <Space>
                <Button key="Cancel" onClick={onRegisterNewBeneficiary}>
                  Continuar Registo
                </Button>
                <Button
                  type="primary"
                  ref={buttonRef}
                  onClick={onUpdateExistingBeneficiary}
                >
                  Actualizar Existente
                </Button>
              </Space>
            </Space>
          </div>
        </Modal>
      </>
    );
  };

  return (
    <>
      {<ConfirmationModal />}
      <Modal
        width={1100}
        bodyStyle={{ overflowY: "auto", maxHeight: "calc(100vh - 300px)" }}
        centered
        destroyOnClose
        title={" Registo de Beneficiária"}
        visible={modalVisible}
        onCancel={() => showCloseConfirm()}
        maskClosable={false}
        footer={
          <div className="steps-action">
            <Button key="Cancel" onClick={() => showCloseConfirm()}>
              Cancelar
            </Button>
            {(current === 1 || (current === 2 && beneficiary != undefined)) && (
              <Button style={{ marginLeft: 8 }} onClick={() => prev()}>
                Anterior
              </Button>
            )}
            {(current < steps.length - 2 ||
              (current === 1 && beneficiary != undefined)) && (
              <Button type="primary" onClick={() => next()}>
                Próximo
              </Button>
            )}
            {current === steps.length - 2 && beneficiary === undefined && (
              <Button type="primary" ref={buttonRef} onClick={onSubmit}>
                Salvar
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                hidden={!allowDataEntry}
                onClick={() => onUpdate()}
              >
                Actualizar
              </Button>
            )}
          </div>
        }
      >
        <div>
          <Form id="steps-content-control" form={form} layout="vertical">
            <Steps current={current}>
              {steps.map((item) => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>
          </Form>
        </div>
      </Modal>
    </>
  );
};
export default BeneficiaryForm;
