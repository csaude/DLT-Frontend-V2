import React, { Fragment } from "react";
import { Card, Col, Form, Row, Typography, Image, Space } from "antd";
import dreams from "../../assets/dreams.png";
import { Title as AppTitle } from "@app/components";

const { Title } = Typography;

const Documents = () => {
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
          Documentos Programáticos
        </Title>

        <Card headStyle={{ color: "#17a2b8" }} style={{ color: "#17a2b8" }}>
          <div style={{}}>
            <Form layout="vertical">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="version"
                    label="Ligação para os Documentos Programáticos"
                  >
                    <Space direction="vertical">
                      <a
                        href="https://helpdeskmoz.sis.org.mz/portal/pt/kb/dlt"
                        rel="noreferrer"
                        target="_blank"
                      >
                        Faça um clique aqui para aceder aos Documentos
                        Programáticos
                      </a>
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

export default Documents;
