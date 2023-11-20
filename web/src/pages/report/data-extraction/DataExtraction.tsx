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
  countNewlyEnrolledAgywAndServices,
  getNewlyEnrolledAgywAndServicesReportGenerated,
  getFileDownloaded,
  geNewlyEnrolledAgywAndServicesSummaryReportGenerated,
} from "@app/utils/report";
import { Title as AppTitle } from "@app/components";
import LoadingModal from "@app/components/modal/LoadingModal";
const { Option } = Select;
const { Title } = Typography;

const DataExtraction = () => {
  const [loggedUser, setLogguedUser] = useState<any>(undefined);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [selectedProvinces, setSelectedProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any>(undefined);
  const [selectedDistricts, setSelectedDistricts] = useState<any[]>([]);
  const [initialDate, setInitialDate] = useState<any>();
  const [finalDate, setFinalDate] = useState<any>();
  const [form] = Form.useForm();
  const [dataLoading, setDataLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>(0);
  const [extraOption, setExtraOption] = useState(0);
  const [currentDistrict, setCurrentDistrict] = useState<any>();
  const [nextIndex, setNextIndex] = useState(1);
  const RequiredFieldMessage = "Obrigatório!";
  const pageSize = 250000;
  const created = moment().format("YYYYMMDD_hhmmss");
  const username = localStorage.getItem("username");

  const districtsIds = selectedDistricts.map((district) => {
    return district.id;
  });

  const extraOptions = [
    { id: 1, name: "Novas RAMJ, Vulnerabilidades e Serviços" },
    {
      id: 2,
      name: "Sumário de Novas RAMJ, Vulnerabilidades e Serviços",
    },
    // { id: 3, name: "To be IMplemented" },
    // {
    //   id: 4,
    //   name: "Sumário To Bem Implemeted",
    // },
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
      const distrs = districts.filter((item) =>
        values.includes(item.id.toString())
      );
      setSelectedDistricts(distrs);
    }
  };

  const getTotalNewlyEnrolledAgywAndServices = async () => {
    const totalNewlyEnrolledAgywAndServices =
      await countNewlyEnrolledAgywAndServices(
        districtsIds,
        initialDate,
        finalDate
      );
    const lastPage = Math.ceil(totalNewlyEnrolledAgywAndServices[0] / pageSize);
    setLastPage(lastPage);
  };

  const onChangeExtraOption = async (option) => {
    setDataLoading(true);
    setCurrentPage(0);
    setExtraOption(option);
    if (option == 1) {
      getTotalNewlyEnrolledAgywAndServices().then(() => setDataLoading(false));
    } else if (option == 3) {
      console.log("to Be Implemented, for another report");
    } else if (option == 2 || option != 4) {
      setDataLoading(false);
    } else {
      toast.error("Por favor selecione o tipo de extração");
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDistricts && initialDate && finalDate && extraOption !== 0) {
      onChangeExtraOption(extraOption);
    }
  }, [selectedDistricts, initialDate, finalDate, extraOption]);

  useEffect(() => {
    if (currentPage != 0 && lastPage != 0 && currentPage < lastPage) {
      if (extraOption == 1) {
        generateExcelNewlyEnrolledAgywAndServicesReport(currentPage); // Iterar
      } else if (extraOption == 3) {
        console.log("3. To Be Implemented");
      }
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentDistrict != undefined) {
      if (extraOption == 2) {
        generateExcelNewlyEnrolledAgywAndServicesSummaryReport(currentDistrict); // Iterar
      } else if (extraOption == 4) {
        console.log("3. Other Summary, To Be Implemented");
      }
    }
  }, [currentDistrict]);

  const handleGenerateXLSXReport = (i) => {
    if (
      selectedProvinces.length < 1 ||
      selectedDistricts.length < 1 ||
      initialDate === undefined ||
      finalDate === undefined
    ) {
      toast.error("Por favor selecione os filtros para relatorio");
    } else {
      if (extraOption == 1) {
        generateExcelNewlyEnrolledAgywAndServicesReport(i); // Iterar
      } else if (extraOption == 2) {
        generateExcelNewlyEnrolledAgywAndServicesSummaryReport(i);
      } else if (extraOption == 3) {
        console.log("3. To Be Implemented");
      } else if (extraOption == 4) {
        console.log("4. Summary To Be Implemented");
      } else {
        setDataLoading(false);
        toast.error("Por favor selecione o tipo de extração");
      }
    }
  };

  const generateExcelNewlyEnrolledAgywAndServicesReport = async (pageIndex) => {
    setDataLoading(true);
    try {
      const response = await getNewlyEnrolledAgywAndServicesReportGenerated(
        selectedProvinces[0].name,
        districtsIds,
        initialDate,
        finalDate,
        pageIndex,
        pageSize,
        username
      );
      await downloadFile(response);
      setCurrentPage(currentPage + 1);
      setDataLoading(false);
    } catch (error) {
      console.error("Error downloading the Excel report", error);
    }
  };

  const downloadFile = async (filePath) => {
    await getFileDownloaded(filePath)
      .then((response) => {
        const filename = filePath.substring(filePath.lastIndexOf("/") + 1);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading file: ", error);
      });
  };

  const generateExcelNewlyEnrolledAgywAndServicesSummaryReport = async (
    currentDistrictIndex
  ) => {
    setDataLoading(true);
    try {
      const response =
        await geNewlyEnrolledAgywAndServicesSummaryReportGenerated(
          selectedProvinces[0].name,
          districtsIds[currentDistrictIndex],
          initialDate,
          finalDate,
          currentPage,
          nextIndex,
          username
        );
      if (response.fileSize > 0) {
        await downloadFile(response.fileName);
        setCurrentPage(currentPage + 1);
        setNextIndex(response.nextIndex);
      }
      setCurrentDistrict(currentDistrictIndex + 1);
      setDataLoading(false);
    } catch (error) {
      console.error("Error downloading the Excel report", error);
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
          EXTRAÇÃO DE DADOS
        </Title>
        <Card
          title="Parâmetros da extração"
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
                          setInitialDate(e?.toDate().getTime());
                        }}
                      />
                    </Space>
                  </Form.Item>

                  <Form.Item name="finalDate" label="Data Final">
                    <Space direction="vertical">
                      <DatePicker
                        onChange={(e) => {
                          setFinalDate(e?.toDate().getTime());
                        }}
                      />
                    </Space>
                  </Form.Item>

                  <Form.Item
                    name="Extração"
                    label="Extração"
                    rules={[{ required: true, message: RequiredFieldMessage }]}
                  >
                    <Select
                      placeholder="Seleccione a Extração Que Pretende"
                      onChange={onChangeExtraOption}
                    >
                      {extraOptions?.map((item) => (
                        <Option key={item.id}>{item.name}</Option>
                      ))}
                    </Select>
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
      {<LoadingModal modalVisible={dataLoading} />}
    </Fragment>
  );
};

export default DataExtraction;
