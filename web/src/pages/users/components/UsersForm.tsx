import { Modal, message, Form, Input, InputNumber, Select, Button, Col, Row, DatePicker, Space, Radio, Divider, Checkbox } from 'antd';
import React, { Fragment, useEffect, useState } from 'react'
import { allPartners, allPartnersByDistricts } from '@app/utils/partners';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { allProfiles } from '@app/utils/profiles';
import { allUs } from '@app/utils/uSanitaria';
import { allProvinces, queryDistrictsByProvinces, queryLocalitiesByDistricts, queryUsByLocalities } from '@app/utils/locality';
import { ok } from 'assert';
import { ADMIN, COUNSELOR, DONOR, MANAGER, MENTOR, MNE, NURSE, SUPERVISOR } from '@app/utils/contants';
import { profile } from 'console';
import { validate } from 'uuid';
import { useSelector } from 'react-redux';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

const UsersForm = ({ form, user, modalVisible, handleModalVisible, handleAdd }) => {
    const [partners, setPartners] = useState<any>([]);
    const [allPartners1, setAllPartners] = useState<any>([]);
    const [profiles, setProfiles] = useState<any>([]);
    const [provinces, setProvinces] = useState<any>([]);
    const [districts, setDistricts] = useState<any>(undefined);
    const [localities, setLocalities] = useState<any>(undefined);
    const [us, setUs] = useState<any>(undefined);
    const [selectMode, setSelectMode] = useState<any>();
    const [localityMode, setLocalityMode] = useState<any>();
    const [isRequired, setRequired] = useState<any>(false);
    const [dataSelection, setDataSelection] = useState<any>({ entryPoint: undefined, profile: undefined, locality: undefined });
    const [usByLocality, setUsByLocality] = useState<any>(undefined);
    const [isEntryPointRequired,setEntryPointRequired] =useState(false);
    const [isUsVisible, setUsVisible] = useState(true);
    const [isNeighborhoodVisible, setNeighborhoodVisible] = useState(true);

    const RequiredFieldMessage = "Obrigatório!";

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    useEffect(() => {
        const fetchData = async () => {

            const dataPartners = await allPartners();
            const dataProfiles = await allProfiles();
            const dataProvinces = await allProvinces();

            setPartners(dataPartners);
            setAllPartners(dataPartners);
            setProfiles(dataProfiles);
            setProvinces(dataProvinces);

            if (user) {
                onChangeProfile(user.profiles.id);
            }else {
                setDistricts(undefined);
                setLocalities(undefined);
                setUs(undefined);
            }
        };

        const fetchDistricts = async () => {
            if (user && user.provinces.length > 0) {
                const pIds = user.provinces.map(item => {
                    return item.id + ''
                });
                const dataDistricts = await queryDistrictsByProvinces({ provinces: pIds });
                setDistricts(dataDistricts);
            }
        };

        const fetchLocalities = async () => {
            if (user && user.districts.length > 0) {
                const dIds = user.districts.map(item => {
                    return item.id + ''
                });
                const dataLocalities = await queryLocalitiesByDistricts({ districts: dIds });
                setLocalities(dataLocalities);
            }
        };

        const fetchUs = async () => {
            if (user && user.localities.length > 0) {
                const lIds = user.localities.map(item => {
                    return item.id + ''
                });
                const dataUs = await queryUsByLocalities({ localities: lIds });
                setUs(dataUs);
            }
        };

        fetchData().catch(error => console.log(error));
        fetchDistricts().catch(error => console.log(error));
        fetchLocalities().catch(error => console.log(error));
        fetchUs().catch(error => console.log(error));

        // fetchData().catch(error => console.log(error));

    }, [user,modalVisible]);

    const onChangeProvinces = async (values: any) => {
        if (values.length > 0) {
            const dataDistricts = await queryDistrictsByProvinces({ provinces: Array.isArray(values) ? values : [values] });
            setDistricts(dataDistricts);
        }
        else {
            setDistricts(undefined);
        }
        setLocalities(undefined);
        setPartners(allPartners1);
        setUs(undefined);

        form.setFieldsValue({ districts: [] });
        form.setFieldsValue({ localities: [] });
        form.setFieldsValue({ partners: [] });
        form.setFieldsValue({ us: [] });
    }

    const onChangeDistricts = async (values: any) => {
        if (values.length > 0) {
            const dataLocalities = await queryLocalitiesByDistricts({ districts: Array.isArray(values) ? values : [values] });
            setLocalities(dataLocalities);

            const partners = await allPartnersByDistricts({ districts: Array.isArray(values) ? values : [values] })
            setPartners(partners);
        } else {
            setLocalities(undefined);
            setPartners(allPartners1);
            setUs(undefined);
        }

        form.setFieldsValue({ localities: [] });
        form.setFieldsValue({ partners: [] });
        form.setFieldsValue({ us: [] });
    }

    const onChangeLocalities = async (values: any) => {
        if (values.length > 0) {
            const dataUs = await queryUsByLocalities({ localities: Array.isArray(values) ? values : [values] });
            setUs(dataUs);
            setUsByLocality(dataUs);
        } else {
            setUs(undefined);
        }

        form.setFieldsValue({ us: [] });

        onChangeDataSelection("locality", values)
    }

    const onChangePartner = async (values: any) => {
        let locality = form.getFieldValue('localities')
        if (dataSelection.profile == SUPERVISOR && locality) {
            const partner = partners.filter(p => p.id == values)[0];
            let entryPoints = ["1", "2", "3"];
            if (partner.partnerType == "1"){
                entryPoints = ["1", "3"];
            } else {
                entryPoints = ["2", "3"];
            }
            setNeighborhoodVisible(partner.partnerType != "1");
            setUsVisible(partner.partnerType != "2");
            const us = usByLocality?.filter(item => entryPoints.includes(item.usType.entryPoint));
            setUs(us);
        }
        form.setFieldsValue({ entryPoint: undefined });
        form.setFieldsValue({ us: undefined });
    }

    const onChangeProfile = async (values: any) => {
        if (values == MNE || values == DONOR || values == ADMIN) { 
            setSelectMode("multiple");
            setLocalityMode("multiple");
            setRequired(false);
        } else if (values == SUPERVISOR) { 
            setSelectMode("");
            setLocalityMode("multiple");
            setRequired(true);

        } else {
            setSelectMode("");
            setLocalityMode("");
            setRequired(true);
        }
        
        setUsVisible(values != MENTOR);
        setNeighborhoodVisible(values != NURSE && values != COUNSELOR);
        onChangeDataSelection("profile", values);

        let localities = form.getFieldValue('localities');
        if (localities && localities.length > 0) {
            const dataUs = usByLocality? usByLocality : await queryUsByLocalities({ localities: localities });
            let entryPoints = ["1", "2", "3"];

            if (values == MENTOR) { 
                entryPoints = ["2", "3"];
            } else if (values == NURSE || values == COUNSELOR) {
                entryPoints = ["1", "3"];
            }
            const us = dataUs?.filter(item => entryPoints.includes(item.usType.entryPoint));
            setUs(us);
        }

        let districts = form.getFieldValue('districts');
        if (districts && districts.length > 0) {
            const partners = await allPartnersByDistricts({ districts: districts })
            setPartners(partners);
        }
    }

    const onChangeDataSelection = (name: string, value: any) => {
        setDataSelection({ ...dataSelection, [name]: value })
    }

    const showCloseConfirm = () => {
        confirm({
        title: 'Deseja fechar este formulário?',
        icon: <ExclamationCircleFilled />,
        okText: 'Sim',
        okType: 'danger',
        cancelText: 'Não',
        onOk() {
            handleModalVisible();
        },
        onCancel() {
        },
        });
    };

    useEffect(() => {
        if (dataSelection.profile !== undefined
            && dataSelection.locality !== undefined) {

            form.setFieldsValue({ us: [] });
            let entryPoints = ["1", "2", "3"];

            if (dataSelection.profile == MENTOR) { 
                entryPoints = ["2", "3"];
            } else if (dataSelection.profile == NURSE || dataSelection.profile == COUNSELOR) {
                entryPoints = ["1", "3"];
            }
            const us = usByLocality?.filter(item => entryPoints.includes(item.usType.entryPoint));
            setUs(us);
        }

        if (dataSelection?.profile == MENTOR || dataSelection?.profile == NURSE || dataSelection.profile == MANAGER) {
            setEntryPointRequired(true)
        }else{
            setEntryPointRequired(false)
        }

    }, [dataSelection])

    // const role = useSelector((state: any) => state.auth?.currentUser.role);

    return (
        <Modal
            width={1200}
            centered
            destroyOnClose
            title='Dados de Registo do Utilizador'
            open={modalVisible}
            onCancel={() => showCloseConfirm()}
            maskClosable={false}
            footer={[
                <Button key="Cancel" onClick={() => showCloseConfirm()} >
                    Cancelar
                </Button>,
                <Button key="OK" onClick={handleAdd} type="primary">
                    Salvar
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item
                            name="surname"
                            label="Apelido"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={user?.surname}
                        >
                            <Input placeholder="Insira o Apelido" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Nome"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={user?.name}
                        >
                            <Input placeholder="Insira o Nome" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item
                            name="email"
                            label="Email (Próprio ou do Supervisor)"
                            initialValue={user?.email}
                            rules={[{ required: true, type: 'email', message: 'O email inserido não é válido!' }]}
                        >
                            <Input placeholder="Insira o Email" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={user?.username}
                        >
                            <Input placeholder="Insira o Username" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="profiles"
                            label="Perfil"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={user?.profiles.id.toString()}
                        >
                            <Select onChange={onChangeProfile} placeholder="Seleccione o Perfil">
                                {profiles?.map(item => (
                                    <Option key={item.id}>{item.description}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item
                            name="phoneNumber"
                            label="Número de Telemóvel"
                            initialValue={user?.phoneNumber ? Number(user?.phoneNumber) : user?.phoneNumber}
                            rules={[{ type: 'number', min: 820000000, max: 999999999, message: 'O numero inserido não é válido!' }]}
                        >
                            <InputNumber prefix="+258  " style={{ width: '100%', }} placeholder="Insira o Telemóvel" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="phoneNumber2"
                            label="Número de Telemóvel (Alternativo)"
                            rules={[{ type: 'number', min: 820000000, max: 999999999, message: 'O numero inserido não é válido!' }]}
                            initialValue={user?.phoneNumber2 ? Number(user?.phoneNumber2) : user?.phoneNumber2}
                        >
                            <InputNumber prefix="+258  " style={{ width: '100%', }} placeholder="Insira o Telemóvel" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item
                            name="provinces"
                            label="Províncias"
                            rules={[{ required: isRequired, message: RequiredFieldMessage }]}
                            initialValue={user?.provinces.map(item => { return item.id.toString() })}
                        >
                            <Select mode={selectMode} placeholder="Seleccione a(s) Província(s)"
                                onChange={onChangeProvinces}
                            >
                                {provinces?.map(item => (
                                    <Option key={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="districts"
                            label="Distritos"
                            rules={[{ required: isRequired, message: RequiredFieldMessage }]}
                            initialValue={user?.districts.map(item => { return item.id.toString() })}
                        >
                            <Select mode={selectMode}
                                placeholder="Seleccione  o(s) Distrito(s)"
                                disabled={districts == undefined}
                                onChange={onChangeDistricts}
                            >
                                {districts?.map(item => (
                                    <Option key={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="localities"
                            label="Postos Administrativos"
                            rules={[{ required: isRequired, message: RequiredFieldMessage }]}
                            initialValue={user?.localities.map(item => { return item.id.toString() })}
                        >
                            <Select mode={localityMode}
                                placeholder="Seleccione a(s) Localidade(s)"
                                disabled={localities == undefined}
                                onChange={onChangeLocalities}
                            >
                                {localities?.map(item => (
                                    <Option key={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item
                            name="partners"
                            label="Organização"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={user?.partners?.id?.toString()}
                        >
                            <Select placeholder="Seleccione a Organização" onChange={onChangePartner}>
                                {partners?.map(item => (
                                    <Option key={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="entryPoint"
                            label="Ponto de Entrada"
                            rules={[{ required: isEntryPointRequired, message: RequiredFieldMessage }]}
                            initialValue={user?.entryPoint}
                        >
                            <Select placeholder="Seleccione o Ponto de Entrada" onChange={(value) => { onChangeDataSelection("entryPoint", value) }} >
                                {isUsVisible && <Option key="1">{"Unidade Sanitária"}</Option>}
                                {isNeighborhoodVisible && <Option key="2">{"Comunidade"}</Option>}
                                <Option key="3">{"Escola"}</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="us"
                            label="Locais"
                            initialValue={user?.us.map(item => { return item.id.toString() })}
                        >
                            <Select mode="multiple"
                                showSearch
                                placeholder="Seleccione o(s) Local(is)"
                                disabled={us == undefined}
                                optionFilterProp="children"
                            >
                                {us?.map(item => (
                                    <Option key={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item
                            name="status"
                            label="Estado"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            style={{ textAlign: 'left' }}
                            initialValue='1'
                        >
                            <Radio.Group buttonStyle="solid">
                                <Radio.Button value="1">Activo</Radio.Button>
                                <Radio.Button value="0">Inactivo</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>

            </Form>

        </Modal>
    );
}
export default UsersForm;