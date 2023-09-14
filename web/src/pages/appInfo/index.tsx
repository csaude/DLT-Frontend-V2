import React, { Fragment } from "react";
import { Card, Col, Form, Row, Typography, Image, Space } from "antd";
import dreams from "../../assets/dreams.png";
import { Title as AppTitle } from "@app/components";
import data from "./release.json";

const { Title } = Typography;

const AppInfo = () => {
  return (
    <Fragment>
      <AppTitle />
      <Card>
        <div style={{ textAlign: "center" }}>
          <Image
            width={150}
            preview={false}
            src={dreams}
            style={{ marginBottom: "10px" }}
          />
        </div>
        <Title
          level={3}
          style={{
            marginBottom: "10px",
            textAlign: "center",
            color: "#17a2b8",
          }}
        >
          Informações do aplicativo
        </Title>

        <Card headStyle={{ color: "#17a2b8" }} style={{ color: "#17a2b8" }}>
          <div style={{}}>
            <Form layout="vertical">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item name="version" label="Número da versão">
                    <Space direction="vertical">{data.release?.version} </Space>
                  </Form.Item>
                  <Form.Item name="date" label="Data da versão">
                    <Space direction="vertical">{data.release?.date} </Space>
                  </Form.Item>
                  <Form.Item name="changelog" label="Registro de alterações">
                    <Space direction="vertical">
                      {data.release.changelogs?.map((item) => (
                        <p key={item.id}>
                          {"-"} {item.changelog}{" "}
                        </p>
                      ))}
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Card>
      </Card>
    </Fragment>
  );
};

export default AppInfo;
