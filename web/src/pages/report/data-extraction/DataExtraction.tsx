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
  getNewlyEnrolledAgywAndServices,
  countNewlyEnrolledAgywAndServices,
} from "@app/utils/report";
import { Title as AppTitle } from "@app/components";
import LoadingModal from "@app/components/modal/LoadingModal";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
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
  const [lastPage, setLastPage] = useState<number>(0);
  const RequiredFieldMessage = "Obrigatório!";
  const pageSize = 1000;
  const districtsIds = selectedDistricts.map((district) => {
    return district.id;
  });

  useEffect(() => {
    if (
      initialDate != undefined &&
      finalDate != undefined &&
      districts != undefined
    ) {
      setDataLoading(true);

      const getNewErrolmentsTotal = async () => {
        const totalNewlyEnrolledAgywAndServices =
          await countNewlyEnrolledAgywAndServices(
            districtsIds,
            initialDate,
            finalDate
          );
        const lastPage = Math.ceil(
          totalNewlyEnrolledAgywAndServices[0] / pageSize
        );
        setLastPage(lastPage);
        setDataLoading(false);
      };
      getNewErrolmentsTotal().catch((error) => {
        setDataLoading(false);
        console.log(error);
      });
    }
  }, [initialDate, finalDate, selectedDistricts]);

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

    fetchData().catch((error) => console.log(error));
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

  const handleGenerateXLSXReport = () => {
    if (
      selectedProvinces.length < 1 ||
      selectedDistricts.length < 1 ||
      initialDate === undefined ||
      finalDate === undefined
    ) {
      toast.error("Por favor selecione os filtros para relatorio");
    } else {
      generateXlsReport();
    }
  };

  const generateXlsReport = async () => {
    console.log("On Export XLS");

    try {
      setDataLoading(true);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(
        "DLT2.0_NOVAS_RAMJ_ VULNERABILIDADES_E_SERVICOS"
      );

      const headers = [
        "#",
        "Província",
        "Distrito",
        "Onde Mora",
        "Ponto de Entrada",
        "Organização",
        "Data de Registo",
        "Registado Por",
        "Data da Última Actualização",
        "Actualizado Por",
        "NUI",
        "Sexo",
        "Idade (Registo)",
        "Idade (Actual)",
        "Faixa Etária (Registo)",
        "Faixa Etária (Actual)",
        "Data de Nascimento",
        "Beneficiaria DREAMS ?",
        "Com quem Mora",
        "Sustenta a Casa",
        "É Orfã",
        "Vai à escola",
        "Tem Deficiência",
        "Tipo de Deficiência",
        "Já foi casada",
        "Já esteve grávida",
        "Tem filhos",
        "Está Grávida ou a Amamentar",
        "Trabalha",
        "Já fez teste de HIV",
        "Área de Serviço",
        "Serviço",
        "Sub-Serviço",
        "Pacote de Serviço",
        "Ponto de Entrada de Serviço",
        "Localização do Serviço",
        "Data do Serviço",
        "Provedor do Serviço",
        "Outras Observações",
        "Status",
      ];

      const headerRow = worksheet.getRow(1);
      headers.forEach((header, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.value = header;
        cell.font = { bold: true };
      });

      let sequence = 1;

      for (let i = 0; i < lastPage; i++) {
        const responseData = await getNewlyEnrolledAgywAndServices(
          districtsIds,
          initialDate,
          finalDate,
          i,
          pageSize
        );
        responseData.forEach((report) => {
          const values = [
            sequence,
            report[0],
            report[1],
            report[2],
            report[3],
            report[4],
            report[5],
            report[6],
            report[7],
            report[8],
            report[9],
            report[10],
            report[11],
            report[12],
            report[13],
            report[14],
            report[15],
            report[16],
            report[17],
            report[18],
            report[19],
            report[20],
            report[21],
            report[22],
            report[23],
            report[24],
            report[25],
            report[26],
            report[27],
            report[28],
            report[29],
            report[30],
            report[31],
            report[32],
            report[33],
            report[34],
            report[35],
            report[36],
            report[37],
            report[38],
            report[39],
          ];
          sequence++;
          worksheet.addRow(values);
        });
      }

      const created = moment().format("YYYYMMDD_hhmmss");
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(
        blob,
        `DLT2.0_NOVAS_RAMJ_ VULNERABILIDADES_E_SERVICOS_${created}.xlsx`
      );

      setDataLoading(false);
    } catch (error) {
      // Handle any errors that occur during report generation
      console.error("Error generating XLSX report:", error);
      setDataLoading(false);
      // Display an error message using your preferred method (e.g., toast.error)
      toast.error("An error occurred during report generation.");
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
                    name="provinces"
                    label="Provincias"
                    rules={[{ required: true, message: RequiredFieldMessage }]}
                  >
                    <Select
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

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={handleGenerateXLSXReport}
                    >
                      Extrair novas RAMJ vulnerabilidades e servicos
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
