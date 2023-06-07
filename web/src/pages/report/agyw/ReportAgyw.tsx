import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, DatePicker, Form, Row, Select, Space } from "antd";
import { queryAll } from "@app/utils/province";
import { queryDistrictsByProvinces } from "@app/utils/locality";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { generateXlsReport } from "./ReportGenerator";
import { useSelector, useDispatch } from "react-redux";
import { agywPrevQuery } from "@app/utils/report";
import { loadAgywData } from "@app/store/reducers/report";
const { Option } = Select;

const ReportAgyw = () => {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [selectedProvinces, setSelectedProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any>(undefined);
  const [selectedDistricts, setSelectedDistricts] = useState<any[]>([]);
  const [initialDate, setInitialDate] = useState<any>();
  const [finalDate, setFinalDate] = useState<any>();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const RequiredFieldMessage = "Obrigatório!";
  const userSelector = useSelector((state: any) => state?.auth);
  const currentUserName = userSelector.currentUser.name;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const provinces = await queryAll();
      setProvinces(provinces);
    };

    fetchData().catch((error) => console.log(error));
  }, []);

  const onChangeProvinces = async (values: any) => {
    if (values.length > 0) {
      const provs = provinces.filter((item) =>
        values.includes(item.id.toString())
      );
      setSelectedProvinces(provs);
      const dataDistricts = await queryDistrictsByProvinces({
        provinces: Array.isArray(values) ? values : [values],
      });
      setDistricts(dataDistricts);
    } else {
      setDistricts(undefined);
    }

    form.setFieldsValue({ districts: [] });
  };

  const onChangeDistricts = async (values: any) => {
    if (values.length > 0) {
      const distrs = districts.filter((item) =>
        values.includes(item.id.toString())
      );
      setSelectedDistricts(distrs);
    }
  };

  const handleFetchData = async () => {
    if (
      selectedProvinces.length < 1 ||
      selectedDistricts.length < 1 ||
      initialDate === undefined ||
      finalDate === undefined
    ) {
      toast.error("Por favor selecione os filtros para relatorio");
    } else {
      const districtsIds = selectedDistricts.map((district) => {
        return district.id;
      });
      const startDate = moment(initialDate).format("YYYY-MM-DD");
      const endDate = moment(finalDate).format("YYYY-MM-DD");

      const responseData = await agywPrevQuery(
        districtsIds,
        startDate,
        endDate
      );

      dispatch(loadAgywData(responseData));
      navigate("/previewAgyw", {
        state: {
          provinces: selectedProvinces,
          districts: selectedDistricts,
          initialDate: moment(initialDate).format("YYYY-MM-DD"),
          finalDate: moment(finalDate).format("YYYY-MM-DD"),
        },
      });
    }
  };

  const handleGenerateXLSXReport = () => {
    const districtsIds = selectedDistricts.map((dist) => {
      return dist.id;
    });
    const startDate = moment(initialDate).format("YYYY-MM-DD");
    const endDate = moment(finalDate).format("YYYY-MM-DD");
    generateXlsReport(
      currentUserName,
      districtsIds,
      startDate,
      endDate,
      selectedDistricts
    );
  };

  return (
    <Fragment>
      <Form form={form} layout="vertical">
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              name="provinces"
              label="Provincias"
              rules={[{ required: true, message: RequiredFieldMessage }]}
            >
              <Select
                mode="multiple"
                placeholder="Seleccione as Províncias"
                onChange={onChangeProvinces}
              >
                {provinces?.map((item) => (
                  <Option key={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="districts"
              label="Distritos"
              rules={[{ required: true, message: RequiredFieldMessage }]}
            >
              <Select
                mode="multiple"
                disabled={districts == undefined}
                onChange={onChangeDistricts}
              >
                {districts?.map((item) => (
                  <Option key={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="initialDate" label="Data Inicial">
              <Space direction="vertical">
                <DatePicker
                  onChange={(e) => {
                    setInitialDate(e);
                  }}
                />
              </Space>
            </Form.Item>

            <Form.Item name="finalDate" label="Data Final">
              <Space direction="vertical">
                <DatePicker
                  onChange={(e) => {
                    setFinalDate(e);
                  }}
                />
              </Space>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={handleFetchData}
              >
                Preview
              </Button>
              <Button onClick={handleGenerateXLSXReport}>Download</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
};

export default ReportAgyw;
