import React, { Fragment, useEffect, useState } from 'react';
import { Badge, Button, Steps, Row, Col, Input, message, Space, Form, Tabs, Modal, DatePicker, Checkbox, Select, Radio, Divider } from 'antd';
import './index.css';
import StepDadosPessoais from './StepDadosPessoaisParceiro';
import StepVulnerabilidadesGerais from './StepVulnerabilidadesGeraisParceiro';
import { add } from '@app/utils/beneficiary';
import moment from 'moment';
import { stringify } from 'qs';

const { Option } = Select;
const { Step } = Steps;

const BeneficiaryPartnerForm = ({ form, beneficiary, modalVisible, handleAdd, handleModalVisible }: any) => {

    const [current, setCurrent] = useState(0);
    const [firstStepValues, setFirstStepValues] = useState();

    const next = () => {
        
        form.validateFields().then(async (values) => {

            const inc = current + 1;
            setCurrent(inc);
            setFirstStepValues(values);
        }).catch(error => {

        });


    }

    const prev = () => {
        const inc = current - 1;
        setCurrent(inc);
    }
    const okHandle = () => {
        handleAdd("test");
        handleModalVisible(false);
    }

    const onSubmit = async () => {
        
        handleAdd(firstStepValues,"0")
        //TODO: Perform action only if above instruction succeeds
        handleModalVisible(false);
    }

    const steps = [
        {
            title: 'Dados Pessoais',
            content: <StepDadosPessoais form={form} beneficiary={beneficiary} />,
        },
        {
            title: 'Critérios de Eligibilidade Gerais',
            content: <StepVulnerabilidadesGerais form={form} beneficiary={beneficiary} />,
        }
    ];

    return (
        <>
            <Modal
                width={1100}
                bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}
                centered
                destroyOnClose
                title={` Registo de Parceiro de Beneficiária`}
                visible={modalVisible}
                onCancel={() => handleModalVisible(false)}
                footer={<div className="steps-action">
                    {(current === 0) && (
                        <Button type="primary" onClick={() => next()}>
                            Próximo
                        </Button>
                    )}
                    {(current === 1) && (
                        <Button style={{ marginLeft: 8 }} onClick={() => prev()}>
                            Anterior
                        </Button>
                    )}
                    {(current === 1) && (
                        <Button type="primary" onClick={() => onSubmit()}>
                            Salvar
                        </Button>
                    )}

                </div>}
            >
                <div>
                    <Form form={form} layout="vertical">

                        <Steps current={current}>
                            {steps.map(item => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                        <div className="steps-content">{steps[current].content}</div>
                    </Form>
                </div>
            </Modal>
        </>
    );
}
export default BeneficiaryPartnerForm;