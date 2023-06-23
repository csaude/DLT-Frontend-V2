import React, { useEffect, useState } from "react";
import { Button, Steps, Form, Modal } from "antd";
import "./index.css";
import { ExclamationCircleFilled } from "@ant-design/icons";
import StepReference from "./StepReferece";
import StepReferenceService from "./StepReferenceService";
import { queryCount as beneficiaryQueryCount } from "../../../utils/beneficiary";
import { queryCount as referenceQueryCount } from "../../../utils/reference";
import { query as queryUser } from "../../../utils/users";
import { useDispatch } from "react-redux";

import { getBeneficiariesTotal } from "@app/store/actions/beneficiary";

import { getReferencesTotal } from "@app/store/actions/reference";
import { getInterventionsCount } from "@app/store/actions/interventions";
import { getUserParams } from "@app/models/Utils";

const { Step } = Steps;
const { confirm } = Modal;

const FormReference = ({
  form,
  beneficiary,
  reference,
  modalVisible,
  handleAdd,
  handleUpdate,
  handleModalRefVisible,
  addStatus,
  handleRefServicesList,
}: any) => {
  const [current, setCurrent] = useState(0);
  const [firstStepValues, setFirstStepValues] = useState<any>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!modalVisible) {
      setCurrent(0);
      form.resetFields();
    }
  }, [modalVisible]);

  const next = () => {
    form
      .validateFields()
      .then(async (values) => {
        const inc = current + 1;
        setCurrent(inc);
        setFirstStepValues(values);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const prev = () => {
    const inc = current - 1;
    setCurrent(inc);
  };

  const onClose = () => {
    form.resetFields();
    if (current > 0) {
      const inc = current - 1;
      setCurrent(inc);
    }
    handleModalRefVisible(false);
  };

  const getTotals = async () => {
    const user = await queryUser(localStorage.user);
    const beneficiaryTotal = await beneficiaryQueryCount(getUserParams(user));
    const referenceTotal = await referenceQueryCount(user.id);

    dispatch(getBeneficiariesTotal(beneficiaryTotal));
    dispatch(getReferencesTotal(referenceTotal));
    dispatch(getInterventionsCount());
  };

  const onSubmit = async () => {
    handleAdd(firstStepValues);

    if (addStatus) {
      const inc = current - 1;
      setCurrent(inc);
      form.resetFields();
      handleModalRefVisible(false);
    }

    getTotals().catch((err) => console.log(err));
  };

  const showCloseConfirm = () => {
    confirm({
      title: "Deseja fechar este formulário?",
      icon: <ExclamationCircleFilled />,
      okText: "Sim",
      okType: "danger",
      cancelText: "Não",
      onOk() {
        onClose();
      },
      onCancel() {
        /**Its OK */
      },
    });
  };

  const onUpdate = async () => {
    handleUpdate(firstStepValues, beneficiary);
  };

  const steps = [
    {
      title: "Referir Beneficiario",
      content: (
        <StepReference
          form={form}
          beneficiary={beneficiary}
          reference={reference}
          firstStepValues={firstStepValues}
        />
      ),
    },
    {
      title: " Solicitar Intervenções ",
      content: (
        <StepReferenceService
          form={form}
          reference={reference}
          beneficiary={beneficiary}
          handleRefServicesList={handleRefServicesList}
          firstStepValues={firstStepValues}
        />
      ),
    },
  ];

  return (
    <>
      <Modal
        width={1100}
        bodyStyle={{ overflowY: "auto", maxHeight: "calc(100vh - 300px)" }}
        centered
        destroyOnClose
        title={" Referências Dreams"}
        open={modalVisible}
        maskClosable={false}
        onCancel={() => showCloseConfirm()}
        footer={
          <div className="steps-action">
            <Button key="Cancel" onClick={() => showCloseConfirm()}>
              Cancelar
            </Button>
            {current > 0 &&
              (beneficiary != undefined || reference != undefined) && (
                <Button style={{ marginLeft: 8 }} onClick={() => prev()}>
                  Anterior
                </Button>
              )}
            {current === 0 &&
              (beneficiary != undefined || reference != undefined) && (
                <Button type="primary" onClick={() => next()}>
                  Próximo
                </Button>
              )}
            {current === 1 &&
              (beneficiary != undefined || reference != undefined) &&
              (reference != undefined ? (
                <Button type="primary" onClick={() => onUpdate()}>
                  Actualizar
                </Button>
              ) : (
                <Button type="primary" onClick={() => onSubmit()}>
                  Salvar
                </Button>
              ))}
          </div>
        }
      >
        <div>
          <Form form={form} layout="vertical">
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
export default FormReference;
