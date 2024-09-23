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
          Detalhes da Aplicação
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
                  <Form.Item name="changelog" label="Registo de alterações">
                    <Space direction="vertical">
                      <ul>
                        {data.release.changelogs?.map((item) => (
                          <>
                            <li key={item.id}>
                              <b>{item.changelog}</b>
                            </li>
                            <ul>
                              {item.items?.map((i) => (
                                <>
                                  <li key={i.id}>{i.item}</li>
                                  <ul>
                                    {i.subitems?.map((si) => (
                                      <>
                                        <li key={si.id}>{si.subitem}</li>
                                        <ul>
                                          {si.subsubitems?.map((ssi) => (
                                            <>
                                              <li key={ssi.id}>
                                                {ssi.subsubitem}
                                              </li>
                                            </>
                                          ))}
                                        </ul>
                                      </>
                                    ))}
                                  </ul>
                                </>
                              ))}
                            </ul>
                          </>
                        ))}
                      </ul>
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
