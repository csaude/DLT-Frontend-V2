import React from "react";
import { Card } from "antd";

const appTitle = () => {
  return (
    <Card
      bordered={false}
      style={{
        marginBottom: "10px",
        textAlign: "center",
        fontWeight: "bold",
        color: "rgb(23, 162, 184)",
      }}
    >
      Sistema de Registo e Acompanhamento de Beneficiárias do Programa DREAMS
    </Card>
  );
};

export default appTitle;
