import React, { useEffect, useState } from 'react';
import { Steps, Row, Col, Input, InputNumber, Form, DatePicker, Checkbox, Select, Radio, Divider, SelectProps } from 'antd';
import { allProvinces, queryDistrictsByProvinces, queryLocalitiesByDistricts, queryNeighborhoodsByLocalities } from '@app/utils/locality';
import './index.css';
import moment from 'moment';
import { query } from '@app/utils/users';
import { calculateAge, getMaxDate, getMinDate } from '@app/models/Utils';
import { allUsByType } from '@app/utils/uSanitaria';
import { ADMIN, MNE, SUPERVISOR } from '@app/utils/contants';
import { useSelector } from 'react-redux';

const { Option } = Select;
const { Step } = Steps;

const StepDadosPessoais = ({ form, beneficiary }: any) => {
    const [isDateRequired, setIsDateRequired] = useState<any>(true);
    const [isDateSet, setIsDateSet] = useState<any>(beneficiary === undefined ? false : true);
    const [user, setUser] = useState<any>(undefined);
    const [provinces, setProvinces] = useState<any>([]);
    const [districts, setDistricts] = useState<any>([]);
    const [localities, setLocalities] = useState<any>([]);
    const [neighborhoods, setNeighborhoods] = useState<any>([]);
    const [us, setUs] = useState<any>([]);
    const [age, setAge] = useState<any>(undefined);
    const [birthDate, setBirthDate] = useState<any>(undefined);
    const [visibleName, setVisibleName] = useState<any>(true);

    let userEntryPoint = localStorage.getItem('entryPoint');

    const RequiredFieldMessage = "Obrigatório!";
    const Idades = ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];

    useEffect(() => {
        const fetchData = async () => {
            const fieldAge = form.getFieldValue('age');
            if (beneficiary === undefined) {
                const fieldEntryPoint = form.getFieldValue('entry_point');
                form.setFieldsValue({entry_point: fieldEntryPoint ? fieldEntryPoint : userEntryPoint});
                setAge(fieldAge);
            } else {
                setAge(fieldAge ? fieldAge : calculateAge(beneficiary.dateOfBirth)+'');
            }

            const loggedUser = await query(localStorage.user);
            let dataProvinces;

            if (loggedUser.profiles.id === ADMIN || loggedUser.profiles.id === MNE || loggedUser.profiles.id === SUPERVISOR) {
                setVisibleName(false);
            }

            if (loggedUser.provinces.length > 0) {
                dataProvinces = loggedUser.provinces;
                if (loggedUser.provinces.length === 1) {
                    form.setFieldsValue({ province: loggedUser.provinces[0].id.toString() });
                }
            } else {
                dataProvinces = await allProvinces();
            }

            setUser(loggedUser);
            setProvinces(dataProvinces);

            let dataDistricts;
            let dataLocalities;

            if (loggedUser.districts.length > 0) {
                dataDistricts = loggedUser.districts;
                setDistricts(dataDistricts)
                if (loggedUser.districts.length === 1) {
                    form.setFieldsValue({ district: loggedUser.districts[0].id.toString() });
                }
            } else {
                let province = form.getFieldValue('province');
                if (province !== '' && province !== undefined) {
                    onChangeProvinces(province);
                }
            }

            if (loggedUser.localities.length > 0) {
                dataLocalities = loggedUser.localities;
                setLocalities(dataLocalities);

                if (dataLocalities.length === 1) {
                    const dataNeighborhood = await queryNeighborhoodsByLocalities({ localities: [dataLocalities[0].id] });
                    setNeighborhoods(dataNeighborhood);
                    
                    form.setFieldsValue({ locality: loggedUser.localities[0].id.toString() });
                    let entryPoint = form.getFieldValue('entry_point');
                    onChangeEntryPoint(entryPoint);
                }
            } else {
                let district = form.getFieldValue('district');
                let locality = form.getFieldValue('locality');
                let entryPoint = form.getFieldValue('entry_point');

                if (district !== '' && district !== undefined) {
                    onChangeDistricts(district);
                }

                if (locality !== '' && locality !== undefined) {
                    onChangeLocality(locality);
                }

                if (entryPoint !== '' && entryPoint !== undefined) {
                    onChangeEntryPoint(entryPoint);
                }
            }
        };

        fetchData().catch(error => console.log(error));
    }, [beneficiary]);

    const onChangeProvinces = async (values: any) => {
        if (user?.districts.length > 0) {
            setDistricts(user.districts);
        } else {
            const dataDistricts = await queryDistrictsByProvinces({ provinces: [values + ""] });
            setDistricts(dataDistricts);
        }
    }

    const onChangeDistricts = async (values: any) => {
        if (user?.localities.length > 0) {
            setLocalities(user.localities);
        } else {
            const dataLocalities = await queryLocalitiesByDistricts({ districts: [values + ""] });
            setLocalities(dataLocalities);
        }
    }

    const onChangeLocality = async (values: any) => {
        if (values.length > 0) {
            const dataNeighborhood = await queryNeighborhoodsByLocalities({ localities: [values + ""] });
            setNeighborhoods(dataNeighborhood);

            let entryPoint = form.getFieldValue('entry_point');
            if (entryPoint !== '' && entryPoint !== undefined) {
                var payload = {
                    typeId: entryPoint,
                    localityId: values
                }
                const data = await allUsByType(payload);
                setUs(data);
            }
        }
    }

    const onChangeEntryPoint = async (e: any) => {
        let locality = user?.localities.length === 1? user.localities[0].id : form.getFieldValue('locality');
        if (locality !== '' && locality !== undefined) {
            var payload = {
                typeId: e?.target?.value === undefined ? e : e?.target?.value,
                localityId: locality
            }
            const data = await allUsByType(payload);
            setUs(data);
        }
    }

    const onChangeCheckbox = (e) => {
        setIsDateRequired(!e.target.checked);
    }

    const onChangeBirthDate = (value: any) => {
        if (value != undefined) {
            setAge(calculateAge(value) + '');
        } else {
            setAge(undefined);
        }

        value === null ? setIsDateSet(false) : setIsDateSet(true);
    }

    const onChangeName = (e) => {

        const result = e.target.value.replace(/[^a-zA-Z_-àáâãèéêìíòóõúçÀÁÂÃÈÉÊÌÍÒÓÕÚÇ]/gi, '');
        form.setFieldsValue({ name: result });
    }

    const onChangeSurname = (e) => {

        const result = e.target.value.replace(/[^a-zA-Z_-àáâãèéêìíòóõúçÀÁÂÃÈÉÊÌÍÒÓÕÚÇ\s]/gi, '');
        form.setFieldsValue({ surname: result });
    }

    const IdadeSelect: React.FC<SelectProps> = ({ value, onChange, defaultValue }: SelectProps) => {

        const onchangeAge = (value: any) => {
            if (value === undefined) {
                setBirthDate(undefined);
                setAge(undefined);
                setIsDateSet(false);
            } else {
                var today = new Date();
                var birthYear = today.getFullYear() - value;
                var birthDate = new Date(birthYear + "/01/01");
                setBirthDate(birthDate);
                setAge(value);
                setIsDateSet(true);
            }
        }

        useEffect(() => {
            if (age != undefined) {
                form.setFieldsValue({
                    age: age
                });
            }

            if (birthDate != undefined) {
                form.setFieldsValue({
                    date_of_birth: moment(birthDate, 'YYYY-MM-DD')
                });
            }

        }, [age, birthDate]);

        return (
            <Select allowClear disabled={isDateRequired} onChange={onchangeAge} value={age} placeholder="Seleccione a Idade" >
                {Idades.map(item => (
                    <Option key={item} value={item}>{item}</Option>
                ))}
            </Select>
        );
    }

    const role = useSelector((state: any) => state.auth?.currentUser.role);
    const isUsVisible = role !== "MENTORA" ? true : false;

    return (
        <>
            <Row gutter={24} hidden={beneficiary === undefined}>
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="nui"
                        label="Código do Pareceiro (NUI)"
                        style={{ textAlign: 'left' }}
                        initialValue={beneficiary?.nui}
                    >
                        <Input disabled={true} style={{ fontWeight: "bold", color: "#17a2b8" }} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16} hidden={beneficiary !== undefined && visibleName}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="surname"
                        label="Apelido"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        initialValue={beneficiary?.surname}
                    >
                        <Input placeholder="Insira o apelido" onChange={e => { onChangeSurname(e); }} />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="name"
                        label="Nome"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        initialValue={beneficiary?.name}
                    >
                        <Input placeholder="Insira o nome" onChange={e => { onChangeName(e); }} />
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
                                initialValue={birthDate ? moment(birthDate, 'YYYY-MM-DD') : beneficiary ? moment(beneficiary?.dateOfBirth, 'YYYY-MM-DD') : ''}
                            >
                                <DatePicker
                                    defaultPickerValue={moment(getMaxDate(), 'YYYY-MM-DD')}
                                    inputReadOnly={true}
                                    disabled={!isDateRequired}
                                    onChange={onChangeBirthDate}
                                    style={{ width: '100%' }}
                                    placeholder="Selecione a data"
                                    disabledDate={d => !d || d.isAfter(getMaxDate()) || d.isSameOrBefore(getMinDate())}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={14}>
                            <Checkbox style={{ marginTop: '30px' }} onChange={onChangeCheckbox} disabled={isDateSet} >
                                <span style={{ color: '#008d4c', fontWeight: 'normal' }}>
                                    Não Conhece a Data de Nascimento
                                </span>
                            </Checkbox>
                        </Col>
                    </Row>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="age"
                        label="Idade (em anos)"
                        rules={[{ required: !isDateRequired, message: RequiredFieldMessage }]}
                    >
                        <IdadeSelect />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="nationality"
                        label="Nacionalidade"
                        initialValue={beneficiary ? beneficiary?.nationality + '' : '1'}
                    >
                        <Select placeholder="Seleccione a Nacionalidade" >
                            <Option key='1'>{"Moçambicana"}</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                    <Form.Item
                        name="enrollment_date"
                        label="Data Inscrição"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        initialValue={beneficiary && beneficiary.enrollmentDate ? moment(beneficiary?.enrollmentDate, 'YYYY-MM-DD') : ''}
                    >
                        <DatePicker
                            inputReadOnly={true}
                            style={{ width: '100%' }}
                            placeholder="Selecione a data"
                            disabledDate={d => !d || d.isAfter(new Date()) || d.isSameOrBefore("2017/01/01")}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16} hidden={localities.length === 1} >
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="province"
                        label="Provincia"
                        rules={[{ required: localities.length !== 1, message: RequiredFieldMessage }]}
                        initialValue={beneficiary?.district.province.id.toString()}
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
                        rules={[{ required: localities.length !== 1, message: RequiredFieldMessage }]}
                        initialValue={beneficiary?.district.id.toString()}
                    >
                        <Select placeholder="Seleccione o Distrito"
                            disabled={districts.length == 0 && beneficiary == undefined}
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
                        rules={[{ required: localities.length !== 1, message: RequiredFieldMessage }]}
                        initialValue={beneficiary?.locality?.id.toString()}
                    >
                        <Select placeholder="Seleccione o Posto Administrativo"
                            disabled={localities.length == 0 && beneficiary == undefined}
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
                <Col className="gutter-row" span={8}>
                    <Form.Item
                        name="entry_point"
                        label="Ponto de Entrada"
                        rules={[{ required: true, message: RequiredFieldMessage }]}
                        style={{ textAlign: 'left' }}
                        initialValue={beneficiary?.entryPoint}
                    >
                        <Radio.Group buttonStyle="solid" onChange={onChangeEntryPoint} >
                            {isUsVisible && <Radio.Button value="1">US</Radio.Button>}
                            <Radio.Button value="2">CM</Radio.Button>
                            <Radio.Button value="3">ES</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="us"
                        label="Local de Registo"
                        rules={[{ required: user?.us.length !== 1, message: RequiredFieldMessage }]}
                        initialValue={beneficiary?.us.id.toString()}
                    >
                        <Select
                            placeholder="Seleccione o Local"
                            disabled={us.length == 0 && beneficiary == undefined}
                        >
                            {us?.map(item => (
                                <Option key={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Divider></Divider>
            <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="nick_name"
                        label="Alcunha"
                        initialValue={beneficiary?.nickName}
                    >
                        <Input placeholder="Insira a alcunha" />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="address"
                        label="Endereço (Ponto de Referência)"
                        initialValue={beneficiary?.address}
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
                        initialValue={beneficiary?.phoneNumber ? Number(beneficiary?.phoneNumber) : beneficiary?.phoneNumber}
                        rules={[{ type: 'number', min: 10000001, max: 999999999, message: 'O numero inserido não é válido!' }]}
                    >
                        <InputNumber prefix="+258  " style={{ width: '100%', }} placeholder="Insira o Telemóvel" />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        name="e_mail"
                        label="E-mail"
                        initialValue={beneficiary?.email}
                        rules={[{ type: 'email', message: 'O email inserido não é válido!' }]}
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
                        initialValue={beneficiary?.neighborhood.id.toString()}
                    >
                        <Select placeholder="Seleccione o Bairro"
                            disabled={neighborhoods == undefined && beneficiary == undefined}
                        >
                            {neighborhoods?.map(item => (
                                <Option key={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
}
export default StepDadosPessoais;