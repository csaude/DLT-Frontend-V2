
import React from 'react';
import { Card } from 'antd';

const appTitle = () =>  {

    return (

        <Card bordered={false} style={{ marginBottom: '10px', textAlign: "center", fontWeight: "bold", color: "#17a2b8" }} >
            Sistema de Registo e Acompanhamento de Beneficiárias do Programa DREAMS
        </Card>
    );
};

export default  appTitle;