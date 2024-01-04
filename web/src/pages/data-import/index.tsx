import React, { useState } from "react";
import { Card, Button, Form, Input, Row, Col } from "antd";
import { Title } from "@app/components";
import { addFromDevice } from "@app/utils/sync";

const DataImport: React.FC = () => {
  const [data, setData] = useState<any>();
  const [completed, setCompleted] = useState<any>({
    beneficiaries: false,
    beneficiariesInterventions: false,
    references: false,
    referenceServices: false,
  });
  const username = localStorage.getItem("username");

  const handleChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");

    fileReader.onload = (e: any) => {
      console.log("----file result---", e?.target?.result);
      setData(JSON.parse(e?.target?.result));
    };
  };

  const synchronize = async () => {
    await addFromDevice(data, username);
  };

  const handleSaveData = (e) => {
    e.preventDefault();
    synchronize();
  };

  return (
    <>
      <Title />
      <Card
        title="Importação de dados do dispositivo"
        bordered={false}
        headStyle={{ color: "#17a2b8" }}
      >
        <Row gutter={16}>
          <Col className="gutter-row">
            <Form.Item name="filename" label="">
              <Input
                type="file"
                accept=".json,application/json"
                placeholder="Seleciona o ficheiro json"
                onChange={handleChange}
              />
            </Form.Item>
          </Col>

          <Col className="gutter-row" span={12}>
            <Button type="primary" onClick={handleSaveData}>
              Executar Importação
            </Button>
          </Col>
        </Row>

        {/* {<LoadingModal modalVisible={completed} />} */}
      </Card>
    </>
  );
};
export default DataImport;
