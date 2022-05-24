import React, { Fragment, useEffect, useState } from 'react';
import { Badge, Button, Steps, Row, Col, Input, message, Space, Form, Tabs, Modal, DatePicker, Checkbox, Select, Radio, Divider } from 'antd';
import './index.css';
import StepDadosPessoais from './StepDadosPessoais';
const { Option } = Select;
const { Step } = Steps;

const BeneficiaryForm = ({ form, modalVisible, handleAdd, handleModalVisible }: any) => {

    const [current, setCurrent] = useState(0);


    const next = () => {

        form.validateFields().then(async (values) => {
            console.log("NEXT: ", values);
            const inc = current + 1;
            setCurrent(inc);
        })
            .catch(error => {

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

    const onSubmit = () => {

    }


    const steps = [
        {
            title: 'Dados Pessoais',
            content: <StepDadosPessoais form={form} />,
        },
        {
            title: 'Vulnerabilidades',
            content: 'Second-content',
        },
    ];

    return (
        <>
            <Modal
                width={1000}
                bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}
                centered
                destroyOnClose
                title={` Registo de Beneficiário`}
                visible={modalVisible}
                onCancel={() => handleModalVisible(false)}
                footer={<div className="steps-action">
                    {current > 0 && (
                        <Button style={{ marginLeft: 8 }} onClick={() => prev()}>
                            Previous
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={() => onSubmit()}>
                            Done
                        </Button>
                    )}

                </div>}
            >
                <div>
                    <Steps current={current}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </Steps>
                    <div className="steps-content">{steps[current].content}</div>

                </div>
            </Modal>
        </>
    );
}
export default BeneficiaryForm;