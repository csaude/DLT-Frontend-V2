import React from "react";
import { Alert, Space, Spin } from "antd";
import './styles.css'

const Spinner: React.FC = () => (
  <Space direction="vertical" style={{ width: "100%" }}>    
    <Space>
      <Spin tip="Loading" size="large">
        <div className="content" />
      </Spin>
    </Space>   
  </Space>
);

export default Spinner;
