import React, { Fragment, useEffect, useState } from 'react';
import { Badge, Button, Steps, Row, Col, Input, message, Space, Form, Tabs, Modal, DatePicker, Checkbox, Select, Radio, Divider } from 'antd';
import './index.css';
import StepReference from './StepReferece';
import StepDadosPessoais from './StepDadosPessoais';
import StepVulnerabilidadesGerais from './StepVulnerabilidadesGerais';
import StepVulnerabilidadesEspecificas from './StepVulnerabilidadesEspecificas';
// import { add } from '@app/utils/beneficiary';
import { add } from '@app/utils/reference';
import moment from 'moment';
import { stringify } from 'qs';

const { Option } = Select;
const { Step } = Steps;

const FormReference = ({ form, beneficiary, modalVisible, handleAdd, handleUpdate, handleModalRefVisible }: any) => {

    const [current, setCurrent] = useState(0);
    const [firstStepValues, setFirstStepValues] = useState();
    const [secondStepValues, setSecondStepValues] = useState();

    const next = () => {
        
        form.validateFields().then(async (values) => {

            const inc = current + 1;
            setCurrent(inc);
            current === 0 ? setFirstStepValues(values) : setSecondStepValues(values);
        }).catch(error => {

        });


    }

    const prev = () => {
        const inc = current - 1;
        setCurrent(inc);
    }
    const okHandle = () => {
        handleAdd("test");
        handleModalRefVisible(false);
    }
    
    const onClose = () => {
        handleModalRefVisible(false, undefined);
    }

    const onSubmit = async () => {
        
        handleAdd(firstStepValues,"1")
        //TODO: Go to next page only if above instruction succeeds
        const inc = current + 1;
        setCurrent(inc);
    }

    const onUpdate = async () => {
        
        handleUpdate(firstStepValues, secondStepValues);
        // TODO: Perform actions only if above instruction succeeds
        // setCurrent(0);
        // form.resetFields();
    }

    const steps = [
        {
            title: 'Referir Beneficiario',
            content: <StepReference form={form} beneficiary={beneficiary} />,
        },
        {
            title: ' Intervenções Solicitadas ',
            content: <StepVulnerabilidadesGerais form={form} beneficiary={beneficiary} />,
        },
        {
            title: ' Critérios de Eligibilidade Específicos',
            content: <StepVulnerabilidadesEspecificas form={form} beneficiary={beneficiary} />,
        }
    ];

    return (
        <>
            <Modal
                width={1100}
                bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}
                centered
                destroyOnClose
                title={` Referências Dreams *`}
                visible={modalVisible}
                onCancel={() => handleModalRefVisible(false)}
                footer={<div className="steps-action">
                    {(current === 1 || (current === 2 && beneficiary != undefined)) && (
                        <Button style={{ marginLeft: 8 }} onClick={() => prev()}>
                            Anterior
                        </Button>
                    )}
                    {(current < steps.length - 2 || (current === 1 && beneficiary != undefined)) && (
                        <Button type="primary" onClick={() => next()}>
                            Próximo
                        </Button>
                    )}
                    {(current === steps.length - 2 && beneficiary === undefined)  && (
                        <Button type="primary" onClick={() => onSubmit()}>
                            Salvar
                        </Button>
                    )}
                    {(current === steps.length - 1) && (
                        <Button type="primary" onClick={() => onUpdate()}>
                            Actualizar
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
export default FormReference;