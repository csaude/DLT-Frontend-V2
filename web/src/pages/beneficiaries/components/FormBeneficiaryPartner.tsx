import React, { Fragment, useEffect, useState } from 'react';
import { Badge, Button, Steps, Row, Col, Input, message, Space, Form, Tabs, Modal, DatePicker, Checkbox, Select, Radio, Divider } from 'antd';
import './index.css';
import { ExclamationCircleFilled } from '@ant-design/icons';
import StepDadosPessoais from './StepDadosPessoaisParceiro';
import StepVulnerabilidadesGerais from './StepVulnerabilidadesGeraisParceiro';
import { add, edit } from '@app/utils/beneficiary';
import moment from 'moment';
import { stringify } from 'qs';

const { Option } = Select;
const { Step } = Steps;
const { confirm } = Modal;

const BeneficiaryPartnerForm = ({ form, beneficiary, modalVisible, handleAddBeneficiary, handleUpdateBeneficiary, handleModalVisible, handleViewModalVisible }: any) => {

    const [current, setCurrent] = useState(0);
    const [firstStepValues, setFirstStepValues] = useState();

    useEffect(() => { 
        if(!modalVisible){
            setCurrent(0);
        }
        
    }, [modalVisible]);

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
            ben.locality = values.locality;
            ben.district = values.district;
            ben.vbltChildren = vblts.vblt_children;
            ben.vbltDeficiencyType = vblts.vblt_deficiency_type;
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
            ben.partners = { "id": localStorage.organization };
            ben.us = { "id": us === undefined? localStorage.us : us };
            ben.dateCreated = new Date();

            const { data } = await add(ben);
            handleAddBeneficiary(data);
            handleModalVisible(false);
            handleViewModalVisible(true, data);

            message.success({
                content: 'Registado com Sucesso!', className: 'custom-class',
                style: {
                    marginTop: '10vh',
                }
            });
        })
        .catch(error => {
            message.error({
                content: 'Não foi possivel Registrar o Parceiro!', className: 'custom-class',
                style: {
                    marginTop: '10vh',
                }
            });
        });
    }

    const handleUpdate = (firstStepValues) => {
        form.validateFields().then(async (values) => {
            beneficiary.surname = firstStepValues.surname;
            beneficiary.name = firstStepValues.name;
            beneficiary.nickName = firstStepValues.nick_name;
            beneficiary.dateOfBirth = moment(firstStepValues.date_of_birth).format('YYYY-MM-DD');
            beneficiary.age = firstStepValues.age;
            beneficiary.address = firstStepValues.address;
            beneficiary.email = firstStepValues.e_mail;
            beneficiary.phoneNumber = firstStepValues.phone_number;
            beneficiary.enrollmentDate = firstStepValues.enrollment_date;
            beneficiary.nationality = firstStepValues.nationality;
            beneficiary.entryPoint = firstStepValues.entry_point;
            beneficiary.neighborhood = { "id": firstStepValues.neighbourhood_id };
            beneficiary.locality = firstStepValues.locality;
            beneficiary.district = firstStepValues.district;
            beneficiary.vbltDeficiencyType = values.vblt_deficiency_type;
            beneficiary.vbltIsDeficient = values.vblt_is_deficient;
            beneficiary.vbltIsOrphan = values.vblt_is_orphan;
            beneficiary.vbltIsStudent = values.vblt_is_student;
            beneficiary.vbltLivesWith = values.vblt_lives_with.toString();
            beneficiary.vbltSchoolGrade = values.vblt_school_grade;
            beneficiary.vbltSchoolName = values.vblt_school_name;
            beneficiary.updatedBy = localStorage.user;
            beneficiary.dateUpdated = new Date();

            const us = firstStepValues.us;
            if (us !== undefined) {
                beneficiary.us = us;
            }

            const { data } = await edit(beneficiary);
            handleUpdateBeneficiary(data);
            handleModalVisible(false);

            message.success({
                content: 'Actualizado com Sucesso!', className: 'custom-class',
                style: {
                    marginTop: '10vh',
                }
            });
        })
            .catch(error => {

                handleModalVisible(false);

                message.error({
                    content: 'Não foi possivel Actualizar o Parceiro!', className: 'custom-class',
                    style: {
                        marginTop: '10vh',
                    }
                });
            });
    };


    const onUpdate = async () => {
        handleUpdate(firstStepValues);
    }

    const showCloseConfirm = () => {
        confirm({
        title: 'Deseja fechar este formulário?',
        icon: <ExclamationCircleFilled />,
        okText: 'Sim',
        okType: 'danger',
        cancelText: 'Não',
        onOk() {
            handleModalVisible(false);
        },
        onCancel() {
        },
        });
    };

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
                onCancel={() => showCloseConfirm()}
                maskClosable={false}
                footer={<div className="steps-action">
                    <Button key="Cancel" onClick={() => showCloseConfirm()} >
                        Cancelar
                    </Button>
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
                        <Button type="primary" onClick={() => beneficiary? onUpdate() : onSubmit()}>
                            {beneficiary? 'Actualizar' : 'Salvar'}
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