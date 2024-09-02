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
import moment from "moment";
import dreams from "../../../assets/dreams.png";

import {
  getBeneficiariesWithoutPrimaryPackageCompletedReportGenerated,
  getFileDownloaded,
} from "@app/utils/report";
import { Title as AppTitle } from "@app/components";
import LoadingModal from "@app/components/modal/LoadingModal";
import { useSelectAll } from "@app/hooks/useSelectAll";
const { Option } = Select;
const { Title } = Typography;

const BenefWithoutPrimeryPackageCompleted = () => {
  const [loggedUser, setLogguedUser] = useState<any>(undefined);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [selectedProvinces, setSelectedProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any>(undefined);
  const [selectedDistricts, setSelectedDistricts] = useState<any[]>([]);
  const [initialDate, setInitialDate] = useState<any>();
  const [finalDate, setFinalDate] = useState<any>();
  const [form] = Form.useForm();
  const [dataLoading, setDataLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>(0);
  const RequiredFieldMessage = "Obrigatório!";
  const pageSize = 1000000;
  const username = localStorage.getItem("username");
  const maxDate = moment(initialDate).add(12, "months");

  const disabledDate = (current) => {
    return current && current > maxDate;
  };

  const districtsIds = selectedDistricts.map((district) => {
    return district.id;
  });

  useEffect(() => {
    const fetchData = async () => {
      const loggedUser = await query(localStorage.user);
      let provinces;
      if (loggedUser.provinces.length > 0) {
        provinces = loggedUser.provinces;
      } else {
        provinces = await queryAll();
      }
      setLogguedUser(loggedUser);
      setProvinces(provinces);
    };

    fetchData().catch((error) => console.error(error));
  }, []);

  const onChangeProvinces = async (values: any) => {
    if (values.length > 0) {
      const provs = provinces.filter((item) =>
        values.includes(item.id.toString())
      );
      setSelectedProvinces(provs);
      let dataDistricts;
      if (loggedUser.districts.length > 0) {
        dataDistricts = loggedUser.districts.filter((d) =>
          values.includes(d.province.id.toString())
        );
      } else {
        dataDistricts = await queryDistrictsByProvinces({
          provinces: Array.isArray(values) ? values : [values],
        });
      }
      setDistricts(dataDistricts);
    } else {
      setDistricts(undefined);
    }

    form.setFieldsValue({ districts: [] });
  };

  const onChangeDistricts = async (values: any) => {
    if (values.length > 0) {
      const distrs = districts.filter((item) => values.includes(item.id));
      setSelectedDistricts(distrs);
      form.setFieldsValue({ districts: values });
    }
  };

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

  useEffect(() => {
    if (currentPage != 0 && lastPage != 0 && currentPage < lastPage) {
      generateExcelBenefWithoutPPCompleted(currentPage); // Iterar
    }
  }, [selectedDistricts]);

  const handleGenerateXLSXReport = (i) => {
    setLoadingMessage("Extraindo... Por favor aguarde");
    if (
      selectedProvinces.length < 1 ||
      selectedDistricts.length < 1 ||
      initialDate === undefined ||
      finalDate === undefined
    ) {
      toast.error(
        "Para extratir por favor selecione os filtros para relatorio"
      );
    } else {
      generateExcelBenefWithoutPPCompleted(i);
    }
  };

  const generateExcelBenefWithoutPPCompleted = async (i: any) => {
    setDataLoading(true);
    try {
      const response =
        await getBeneficiariesWithoutPrimaryPackageCompletedReportGenerated(
          selectedProvinces[0].name,
          districtsIds,
          initialDate,
          finalDate,
          username
        );
      await downloadFile(response);
      setCurrentPage(currentPage + 1);
      setDataLoading(false);
    } catch (error) {
      setDataLoading(false);
      console.error("Error downloading the Excel report", error);
    }
  };

  const downloadFile = async (filePath) => {
    try {
      setDataLoading(true);
      const response = await getFileDownloaded(filePath);

      const filename = filePath.substring(filePath.lastIndexOf("/") + 1);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setDataLoading(false);
      console.error("Error downloading file: ", error);
    }
  };

  const onChangeInitialDate = (e) => {
    setInitialDate(e?.toDate().getTime());
  };

  const onChangeFInalDate = (e) => {
    setFinalDate(e?.toDate().getTime());
    setCurrentPage(0);
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
          Lista de Acompanhamento de Completude de Pacote Primário
        </Title>
        <Card
          title="Parâmetros"
          bordered={false}
          headStyle={{ color: "#17a2b8" }}
          style={{ color: "#17a2b8", marginLeft: "35%", marginRight: "20%" }}
        >
          <div style={{}}>
            <Form form={form} layout="vertical">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="province"
                    label="Provincia"
                    rules={[{ required: true, message: RequiredFieldMessage }]}
                  >
                    <Select
                      placeholder="Seleccione a Província"
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
                      placeholder="Seleccione os Distritos"
                      {...selectDistricts}
                      allowClear
                    />
                  </Form.Item>

                  <Form.Item
                    name="initialDate"
                    label="Data Inicial"
                    rules={[{ required: true, message: RequiredFieldMessage }]}
                  >
                    <Space direction="vertical">
                      <DatePicker
                        inputReadOnly
                        onChange={onChangeInitialDate}
                      />
                    </Space>
                  </Form.Item>

                  <Form.Item
                    name="finalDate"
                    label="Data Final"
                    rules={[{ required: true, message: RequiredFieldMessage }]}
                  >
                    <Space direction="vertical">
                      <DatePicker
                        inputReadOnly
                        disabledDate={disabledDate}
                        disabled={initialDate == undefined}
                        onChange={onChangeFInalDate}
                      />
                    </Space>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={() => handleGenerateXLSXReport(0)}
                    >
                      Extrair
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Card>
      </Card>
      {<LoadingModal modalVisible={dataLoading} message={loadingMessage} />}
    </Fragment>
  );
};

export default BenefWithoutPrimeryPackageCompleted;
