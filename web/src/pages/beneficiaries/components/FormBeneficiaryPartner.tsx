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

const BeneficiaryPartnerForm = ({ form, beneficiary, modalVisible, handleAddBeneficiary, handleModalVisible }: any) => {

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
        handleModalVisible(false);
    }

    const onSubmit = async () => {
        handleAdd(firstStepValues);
    }

    const handleAdd = (values:any) => {

        form.validateFields().then(async (vblts) => {

            const ben: any = beneficiary ? beneficiary : {};
            ben.surname = values.surname;
            ben.name = values.name;
            ben.nickName = values.nick_name;
            ben.dateOfBirth = moment(values.date_of_birth).format('YYYY-MM-DD');
            ben.age = values.age;
            ben.gender="1";
            ben.address = values.address;
            ben.email = values.e_mail;
            ben.phoneNumber = values.phone_number;
            ben.enrollmentDate = values.enrollment_date;
            ben.nationality = values.nationality;
            ben.entryPoint = values.entry_point;
            ben.neighborhood = { "id": values.neighbourhood_id };
            ben.partnerNUI = values.partner_nui;
            ben.vbltChildren = vblts.vblt_children;
            ben.vbltDeficiencyType = vblts.vblt_deficiency_type;
            ben.vbltHouseSustainer = vblts.vblt_house_sustainer;
            ben.vbltIsDeficient = vblts.vblt_is_deficient;
            ben.vbltIsEmployed = vblts.vblt_is_employed;
            ben.vbltIsOrphan = vblts.vblt_is_orphan;
            ben.vbltIsStudent = vblts.vblt_is_student;
            ben.vbltLivesWith = vblts.vblt_lives_with?.toString();
            ben.vbltMarriedBefore = vblts.vblt_married_before;
            ben.vbltPregnantBefore = vblts.vblt_pregnant_before;
            ben.vbltPregnantOrBreastfeeding = vblts.vblt_pregnant_or_breastfeeding;
            ben.vbltSchoolGrade = vblts.vblt_school_grade;
            ben.vbltSchoolName = vblts.vblt_school_name;
            ben.vbltTestedHiv = vblts.vblt_tested_hiv;
            ben.status="1";
            
            const us = values.us;

            ben.createdBy = localStorage.user;
            ben.partner = { "id": localStorage.organization };
            ben.organizationId = localStorage.organization;
            ben.us = { "id": us === undefined? localStorage.us : us };

            const { data } = await add(ben);
            handleAddBeneficiary(data);
            handleModalVisible(false);

            message.success({
                content: 'Registado com Sucesso!', className: 'custom-class',
                style: {
                    marginTop: '10vh',
                }
            });
        })
        .catch(error => {

            message.error({
                content: 'Não foi possivel Registrar a Beneficiária!', className: 'custom-class',
                style: {
                    marginTop: '10vh',
                }
            });
        });
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