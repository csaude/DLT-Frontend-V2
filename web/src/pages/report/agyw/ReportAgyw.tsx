import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Space,
  Typography,
  Image,
} from "antd";
import { query } from "@app/utils/users";
import { queryAll } from "@app/utils/province";
import { queryDistrictsByProvinces } from "@app/utils/locality";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import dreams from "../../../assets/dreams.png";

import { generateXlsReport } from "./ReportGenerator";
import { useSelector, useDispatch } from "react-redux";
import { agywPrevQuery } from "@app/utils/report";
import { serviceAgesBandsQuery } from "@app/utils/report";
import { loadAgywData, loadServiceAgebands } from "@app/store/reducers/report";
import { Title as AppTitle } from "@app/components";
import LoadingModal from "@app/components/modal/LoadingModal";
import { useSelectAll } from "@app/hooks/useSelectAll";
const { Option } = Select;
const { Title } = Typography;

const ReportAgyw = () => {
  const [loggedUser, setLogguedUser] = useState<any>(undefined);
  const [allProvinces, setAllProvinces] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [selectedProvinces, setSelectedProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any>(undefined);
  const [selectedDistricts, setSelectedDistricts] = useState<any[]>([]);
  const [reportType, setReportType] = useState();
  const [initialDate, setInitialDate] = useState<any>();
  const [finalDate, setFinalDate] = useState<any>();
  const [form] = Form.useForm();
  const [dataLoading, setDataLoading] = useState(false);
  const navigate = useNavigate();
  const RequiredFieldMessage = "Obrigatório!";
  const userSelector = useSelector((state: any) => state?.auth);
  const currentUserName = userSelector.currentUser.name;
  const dispatch = useDispatch();

  const reportOptions = [
    {
      id: 1,
      name: "Completo",
    },
    {
      id: 2,
      name: "Simplificado",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const loggedUser = await query(localStorage.user);
      let provinces;
      if (loggedUser.provinces.length > 0) {
        provinces = loggedUser.provinces;
      } else {
        provinces = await queryAll();
      }
      const sortedProvinces = provinces.sort((prov1, prov2) =>
        prov1.name.localeCompare(prov2.name)
      );
      setLogguedUser(loggedUser);
      setAllProvinces(sortedProvinces);
    };

    fetchData().catch((error) => console.log(error));
  }, []);

  const onChangeReportOption = async (option) => {
    if (option != reportType) {
      if (option == 1) {
        setProvinces(allProvinces);
      } else if (option == 2) {
        setProvinces(allProvinces.filter((p) => p.id == 10));
      } else {
        setProvinces([]);
      }
      setReportType(option);

      form.setFieldsValue({ provinces: [] });
      form.setFieldsValue({ districts: [] });
      setDistricts(undefined);
    }
  };

  const onChangeProvinces = async (values: any) => {
    if (values.length > 0) {
      const provs = provinces.filter((item) => values.includes(item.id));
      setSelectedProvinces(provs);
      form.setFieldsValue({ provinces: values });
      let dataDistricts;
      if (loggedUser.districts.length > 0) {
        dataDistricts = loggedUser.districts.filter((d) =>
          values.includes(d.province.id)
        );
      } else {
        dataDistricts = await queryDistrictsByProvinces({
          provinces: Array.isArray(values) ? values : [values],
        });
      }
      if (reportType == 2) {
        dataDistricts = dataDistricts.filter((d) => [44, 45].includes(d.id));
      }
      const sortedDistricts = dataDistricts.sort((dist1, dist2) =>
        dist1.name.localeCompare(dist2.name)
      );
      setDistricts(sortedDistricts);
    } else {
      setDistricts(undefined);
    }

    form.setFieldsValue({ districts: [] });
  };

  const onChangeDistricts = async (values: any) => {
    if (values.length > 0) {
      const distrs = districts.filter((item) => values.includes(item.id));
      const sortedDistricts = distrs.sort(
        (dist1, dist2) =>
          dist1.province.id - dist2.province.id ||
          dist1.name.localeCompare(dist2.name)
      );
      setSelectedDistricts(sortedDistricts);
      form.setFieldsValue({ districts: values });
    }
  };

  const selectProvinces = useSelectAll({
    showSelectAll: true,
    onChange: onChangeProvinces,
    options: provinces.map((province) => {
      return {
        label: province.name,
        value: province.id,
      };
    }),
  });

  const selectDistricts = useSelectAll({
    showSelectAll: true,
    onChange: onChangeDistricts,
    options: districts?.map((district) => {
      return {
        label: district.name,
        value: district.id,
      };
    }),
  });

  const handleFetchData = async () => {
    if (
      selectedProvinces.length < 1 ||
      selectedDistricts.length < 1 ||
      initialDate === undefined ||
      finalDate === undefined
    ) {
      toast.error("Por favor selecione os filtros para relatorio");
    } else {
      setDataLoading(true);
      const districtsIds = selectedDistricts.map((district) => {
        return district.id;
      });
      const startDate = moment(initialDate).format("YYYY-MM-DD");
      const endDate = moment(finalDate).format("YYYY-MM-DD");

      const responseData = await agywPrevQuery(
        districtsIds,
        startDate,
        endDate,
        reportType
      );

      const responseServiceAgesBands = await serviceAgesBandsQuery();

      dispatch(loadAgywData(responseData));
      dispatch(loadServiceAgebands(responseServiceAgesBands));

      navigate("/previewAgyw", {
        state: {
          provinces: selectedProvinces,
          districts: selectedDistricts,
          initialDate: moment(initialDate).format("YYYY-MM-DD"),
          finalDate: moment(finalDate).format("YYYY-MM-DD"),
        },
      });
      setDataLoading(false);
    }
  };

  const handleGenerateXLSXReport = async () => {
    if (
      selectedProvinces.length < 1 ||
      selectedDistricts.length < 1 ||
      initialDate === undefined ||
      finalDate === undefined
    ) {
      toast.error("Por favor selecione os filtros para relatorio");
    } else {
      setDataLoading(true);
      const districtsIds = selectedDistricts.map((dist) => {
        return dist.id;
      });
      const startDate = moment(initialDate).format("YYYY-MM-DD");
      const endDate = moment(finalDate).format("YYYY-MM-DD");
      await generateXlsReport(
        currentUserName,
        districtsIds,
        startDate,
        endDate,
        selectedDistricts,
        reportType
      );
      setDataLoading(false);
    }
  };

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
          PEPFAR MER 2.8 Indicador Semi-Annual AGYW_PREV
        </Title>
        <Card
          title="Parâmetros do Indicador AGYW_PREV "
          bordered={false}
          headStyle={{ color: "#17a2b8" }}
          style={{ color: "#17a2b8", marginLeft: "35%", marginRight: "20%" }}
        >
          <div style={{}}>
            <Form form={form} layout="vertical">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="reportType"
                    label="Tipo de Relatório"
                    rules={[{ required: true, message: RequiredFieldMessage }]}
                  >
                    <Select
                      placeholder="Seleccione o Tipo de Relatório"
                      onChange={onChangeReportOption}
                      allowClear
                    >
                      {reportOptions?.map((item) => (
                        <Option key={item.id}>{item.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="provinces"
                    label="Provincias"
                    rules={[{ required: true, message: RequiredFieldMessage }]}
                  >
                    <Select
                      mode="multiple"
                      disabled={provinces.length == 0}
                      placeholder="Seleccione as Províncias"
                      {...selectProvinces}
                      allowClear
                    />
                  </Form.Item>

                  <Form.Item
                    name="districts"
                    label="Distritos"
                    rules={[{ required: true, message: RequiredFieldMessage }]}
                  >
                    <Select
                      mode="multiple"
                      disabled={districts == undefined}
                      placeholder="Seleccione os Distritos"
                      {...selectDistricts}
                      allowClear
                    />
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

                  <Form.Item wrapperCol={{ offset: 12, span: 16 }}>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={handleFetchData}
                      >
                        Preview
                      </Button>
                      <Button type="default" onClick={handleGenerateXLSXReport}>
                        Download
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Card>
      </Card>
      {<LoadingModal modalVisible={dataLoading} />}
    </Fragment>
  );
};

export default ReportAgyw;
