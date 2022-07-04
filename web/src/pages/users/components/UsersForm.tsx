import { Modal, message, Form, Input, Select, Button, Col, Row, DatePicker, Space, Radio, Divider, Checkbox } from 'antd';
import React, { Fragment, useEffect, useState } from 'react'
import { allPartners } from '@app/utils/partners';
import { allProfiles } from '@app/utils/profiles';
import { allUs } from '@app/utils/uSanitaria';
import { allProvinces, queryDistrictsByProvinces, queryLocalitiesByDistricts } from '@app/utils/locality';
import { ok } from 'assert';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const UsersForm = ({ form, user, modalVisible, handleModalVisible, handleAdd }) => {
    const [partners, setPartners] = useState<any>([]);
    const [profiles, setProfiles] = useState<any>([]);
    const [us, setUs] = useState<any>([]);
    const [provinces, setProvinces] = useState<any>([]);
    const [districts, setDistricts] = useState<any>(undefined);
    const [localities, setLocalities] = useState<any>(undefined);

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
            const dataUs = await allUs();
            const dataProvinces = await allProvinces();

            setPartners(dataPartners);
            setProfiles(dataProfiles);
            setProvinces(dataProvinces);
            //setlocalityList(dataLocality);
            setUs(dataUs);
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


        fetchData().catch(error => console.log(error));
        fetchDistricts().catch(error => console.log(error));
        fetchLocalities().catch(error => console.log(error));

    }, [user]);

    const onChangeProvinces = async (values: any) => {
        //console.log(values); // ['1','5']
        if (values.length > 0) {
            const dataDistricts = await queryDistrictsByProvinces({ provinces: values });
            setDistricts(dataDistricts);
        }
    }

    const onChangeDistricts = async (values: any) => {
        if (values.length > 0) {
            const dataLocalities = await queryLocalitiesByDistricts({ districts: values });
            setLocalities(dataLocalities);
        }

    }

    return (
        <Modal
            width={1200}
            centered
            destroyOnClose
            title='Dados de Registo do Utilizador'
            visible={modalVisible}
            footer={[
                <Button key="Cancel" onClick={() => handleModalVisible()} >
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
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email (Próprio ou do Supervisor)"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={user?.email}
                        >
                            <Input placeholder="Insira o Email" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={user?.username}
                        >
                            <Input placeholder="Insira o Username" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item
                            name="phoneNumber"
                            label="Número de Telemóvel"
                            initialValue={user?.phoneNumber}
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                        >
                            <Input placeholder="Insira o Telemóvel" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="phoneNumber2"
                            label="Número de Telemóvel (Alternativo)"
                            initialValue={user?.phoneNumber2}
                        >
                            <Input placeholder="Insira o Telemóvel" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item
                            name="provinces"
                            label="Províncias"
                            initialValue={user?.provinces.map(item => { return item.id.toString() })}
                        >
                            <Select mode="multiple" placeholder="Seleccione a(s) Província(s)"
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
                            initialValue={user?.districts.map(item => { return item.id.toString() })}
                        >
                            <Select mode="multiple"
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
                            label="Localidades"
                            initialValue={user?.localities.map(item => { return item.id.toString() })}
                        >
                            <Select mode="multiple"
                                placeholder="Seleccione a(s) Localidade(s)"
                                disabled={localities == undefined}
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
                            label="Parceiro"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={user?.partners.id.toString()}
                        >
                            <Select placeholder="Seleccione o Parceiro">
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
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={user?.entryPoint}
                        >
                            <Select placeholder="Seleccione o Ponto de Entrada" >
                                <Option key="1">{"Unidade Sanitaria"}</Option>
                                <Option key="2">{"Escola"}</Option>
                                <Option key="3">{"Comunidade"}</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="us"
                            label="US"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={user?.us.id.toString()}
                        >
                            <Select placeholder="Seleccione a US">
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
                            name="profiles"
                            label="Perfil"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={user?.profiles.id.toString()}
                        >
                            <Select placeholder="Seleccione o Perfil">
                                {profiles?.map(item => (
                                    <Option key={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
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