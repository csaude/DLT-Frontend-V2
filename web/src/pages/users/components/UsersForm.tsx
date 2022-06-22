import { Modal, Form, Input, Select, Button, Col, Row, DatePicker, Space, Radio } from 'antd';
import React, { Fragment, useEffect, useState } from 'react'
import { allPartners } from '@app/utils/partners';
import { allProfiles } from '@app/utils/profiles';
import { allUs } from '@app/utils/uSanitaria';
import { allProvinces, queryDistrictsByProvinces, queryLocalitiesByDistricts } from '@app/utils/locality';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const UsersForm = ({ form, user, modalVisible, handleModalVisible }) => {
    const [partners, setPartners] = useState<any>([]);
    const [profiles, setProfiles] = useState<any>([]);
    const [us, setUs] = useState<any>([]);
    const [provinces, setProvinces] = useState<any>([]);
    const [districts, setDistricts] = useState<any>(undefined);
    const [localities, setLocalities] = useState<any>(undefined);

    const RequiredFieldMessage = "Campo é Obrigatório!";
    const okHandle = () => {
        //handleAdd("test");
    }

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
        }

        fetchData().catch(error => console.log(error));

    }, []);

    const onChangeProvinces = async (values: any) => {
        // console.log(values); // ['1','5']
        const dataDistricts = await queryDistrictsByProvinces({ provinces: values });
        setDistricts(dataDistricts);
    }

    const onChangeDistricts = async (values: any) => {
        const dataLocalities = await queryLocalitiesByDistricts({ districts: values });
        setLocalities(dataLocalities);
    }

    return (
        <Modal
            width={1200}
            centered
            destroyOnClose
            title='Dados de Registo do Utilizador'
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
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
                            label="Email (Proprio ou de Supervisor)"
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
                            label="Numero de Telemóvel"
                            initialValue={user?.phoneNumber}
                        >
                            <Input placeholder="Insira o Telemóvel" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="phoneNumber2"
                            label="Numero de Telemóvel (Alternativo)"
                            initialValue={user?.phoneNumber2}
                        >
                            <Input placeholder="Insira o Telemóvel" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item
                            name="partners"
                            label="Parceiro"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={user?.partners.id}
                        >
                            <Select placeholder="Select Parceiro">
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
                            initialValue={user?.us.id}
                        >
                            <Select placeholder="Select US">
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
                            name="provinces"
                            label="Provincias"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                        // initialValue={user?.profiles.id}
                        >
                            <Select mode="multiple" placeholder="Seleccione Provincias"
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
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                        // initialValue={user?.profiles.id}
                        >
                            <Select mode="multiple" placeholder="Seleccione Distritos" disabled={districts == undefined}
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
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                        // initialValue={user?.profiles.id}
                        >
                            <Select mode="multiple" placeholder="Seleccione Provincias"
                                disabled={localities == undefined}>
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
                            name="profiles"
                            label="Perfil"
                            rules={[{ required: true, message: RequiredFieldMessage }]}
                            initialValue={user?.profiles.id}
                        >
                            <Select placeholder="Select Perfil">
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
                        >
                            <Radio.Group defaultValue="1" buttonStyle="solid">
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