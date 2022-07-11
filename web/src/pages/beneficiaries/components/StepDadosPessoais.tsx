import React, { Fragment, useEffect, useState } from 'react';
import { Badge, Button, Steps, Row, Col, Input, message, Space, Form, Tabs, Modal, DatePicker, Checkbox, Select, Radio, Divider } from 'antd';
import { allProvinces, queryDistrictsByProvinces, queryLocalitiesByDistricts, queryNeighborhoodsByLocalities } from '@app/utils/locality';
import './index.css';
const { Option } = Select;
const { Step } = Steps;

const StepDadosPessoais = ({ form, beneficiary }: any) => {
    const [isDateRequired, setIsDateRequired] = useState<any>(true);
    const [provinces, setProvinces] = useState<any>([]);
    const [districts, setDistricts] = useState<any>(undefined);
    const [localities, setLocalities] = useState<any>(undefined);
    const [neighborhoods, setNeighborhoods] = useState<any>(undefined);

    let userEntryPoint = localStorage.getItem('entryPoint');

    const RequiredFieldMessage = "Obrigatório!";
    const Idades = ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];

    useEffect(() => {
        const fetchData = async () => {

            const dataProvinces = await allProvinces();

            setProvinces(dataProvinces);
        };

        const fetchDistricts = async () => {
            if (beneficiary && beneficiary.province.length > 0) {
                const pIds = beneficiary.provinces.map(item => {
                    return item.id + ''
                });
                const dataDistricts = await queryDistrictsByProvinces({ provinces: pIds });
                setDistricts(dataDistricts);
            }
        };

        const fetchLocalities = async () => {
            if (beneficiary && beneficiary.district.length > 0) {
                const dIds = beneficiary.districts.map(item => {
                    return item.id + ''
                });
                const dataLocalities = await queryLocalitiesByDistricts({ districts: dIds });
                setLocalities(dataLocalities);
            }
        };


        fetchData().catch(error => console.log(error));
        fetchDistricts().catch(error => console.log(error));
        fetchLocalities().catch(error => console.log(error));

    }, [beneficiary]);

    const onChangeProvinces = async (values: any) => {
        if (values.length > 0) {
            const dataDistricts = await queryDistrictsByProvinces({ provinces: [values + ""] });
            setDistricts(dataDistricts);
        }
    }

    const onChangeDistricts = async (values: any) => {
        if (values.length > 0) {
            const dataLocalities = await queryLocalitiesByDistricts({ districts: [values + ""] });
            setLocalities(dataLocalities);
        }

    }

    const onChangeLocality = async (values: any) => {
        if (values.length > 0) {
            const dataNeighborhood = await queryNeighborhoodsByLocalities({ localities: [values + ""] });
            setNeighborhoods(dataNeighborhood);
        }

    }

    const onChangeCheckbox = (e) => {
        setIsDateRequired(!e.target.checked);
    }

    return (
        <>
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="surname"
                        label="Apelido"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                    >
                        <Input placeholder="Insira o apelido da Beneficiária" />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="name"
                        label="Nome"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                    >
                        <Input placeholder="Insira o nome da Beneficiária" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    <Row >
                        <Col span={10}>
                            <Form.Item
                                name="date_of_birth"
                                label="Data Nascimento"
                                rules={[{ required: isDateRequired, message: RequiredFieldMessage }]}
                            >
                                <DatePicker disabled={!isDateRequired} style={{ width: '100%' }} placeholder="Selecione a data" />
                            </Form.Item>
                        </Col>
                        <Col span={14}>
                            <Checkbox style={{ marginTop: '30px' }} onChange={onChangeCheckbox} > <span style={{ color: '#008d4c', fontWeight: 'normal' }}>Não Conhece a Data de Nascimento</span> </Checkbox>
                        </Col>
                    </Row>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="age"
                        label="Idade (em anos)"
                        rules={[{ required: !isDateRequired, message: RequiredFieldMessage }]}
                    >
                        <Select disabled={isDateRequired} placeholder="Seleccione a Idade" >
                            {Idades.map(item => (
                                <Option key={item}>{item}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="nationality"
                        label="Nacionalidade"
                    >
                        <Select placeholder="Seleccione a Nacionalidade" >
                            <Option key='1'>Moçambicana</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="province"
                        label="Provincia"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                    >
                        <Select placeholder="Seleccione a Provincia" onChange={onChangeProvinces}>
                            {provinces?.map(item => (
                                <Option key={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="district"
                        label="Distrito"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                    >
                        <Select placeholder="Seleccione o Distrito" 
                                disabled={districts == undefined}
                                onChange={onChangeDistricts}
                        >
                            {districts?.map(item => (
                                <Option key={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="locality"
                        label="Posto Administrativo"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                    >
                        <Select placeholder="Seleccione o Posto Administrativo" 
                            disabled={localities == undefined}
                            onChange={onChangeLocality}
                        >
                            {localities?.map(item => (
                                <Option key={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                {/* <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="gender"
                        label="Sexo"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                    >
                        <Radio.Group defaultValue="1" buttonStyle="solid">
                            <Radio.Button value="1">F</Radio.Button>
                            <Radio.Button value="0">M</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col> */}
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="entry_point"
                        label="Ponto de Entrada"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                    >
                        <Radio.Group defaultValue={userEntryPoint} buttonStyle="solid">
                            <Radio.Button value="1">US</Radio.Button>
                            <Radio.Button value="2">CM</Radio.Button>
                            <Radio.Button value="3">ES</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>
            <Divider></Divider>
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="nick_name"
                        label="Alcunha"
                    >
                        <Input placeholder="Insira a alcunha" />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="address"
                        label="Endereço (Ponto de Referência)"
                    >
                        <Input placeholder="Insira a morada" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="phone_number"
                        label="Telemóvel"
                    >
                        <Input placeholder="Insira o Telemóvel" />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="e_mail"
                        label="E-mail"
                    >
                        <Input placeholder="Insira o E-mail" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="neighbourhood_id"
                        label="Bairro"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                    >
                        <Select placeholder="Seleccione o Bairro"  
                            disabled={neighborhoods == undefined}
                        >
                            {neighborhoods?.map(item => (
                                <Option key={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            {/* <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                    >
                        <Radio.Group defaultValue="1" buttonStyle="solid">
                            <Radio.Button value="1">Activo</Radio.Button>
                            <Radio.Button value="0">Inactivo</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row> */}
        </>
    );
}
export default StepDadosPessoais;