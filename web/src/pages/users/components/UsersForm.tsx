import { Modal, Form, Input, Select } from 'antd';
import React, { Fragment, useEffect, useState } from 'react'

const FormItem = Form.Item;

const UsersForm = ({beneficiary, modalVisible, handleAdd, handleModalVisible}) => {

    const okHandle = () => {
        handleAdd("test");
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
            
           
            
        </Modal>
    );
}
export default UsersForm;