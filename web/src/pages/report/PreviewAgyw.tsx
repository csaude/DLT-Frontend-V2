import { Collapse } from "antd";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useLocation } from "react-router-dom";
const { Panel } = Collapse;

const PreviewAgyw = () => {
  const { state }: any = useLocation();
  const { provinces, districts, initialDate, finalDate } = state; // Read values passed on state

  let currentProvinceId: any;

  const onChange = (key) => {
    console.log(key);
  };

  interface DataType {
    key: string;
    range_10_14: string;
    range_15_19: string;
    range_20_24: string;
    range_25_29: string;
    subTotal: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "10-14",
      dataIndex: "range_10_14",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "15-19",
      className: "column-money",
      dataIndex: "range_15_19",
    },
    {
      title: "20-24",
      dataIndex: "range_20_24",
    },
    {
      title: "25-29",
      dataIndex: "range_25_29",
    },
    {
      title: "SUB-TOTAL",
      dataIndex: "subTotal",
    },
  ];

  const data: DataType[] = [
    {
      key: "1",
      range_10_14: "5",
      range_15_19: "6",
      range_20_24: "9",
      range_25_29: "3",
      subTotal: "1",
    },
    {
      key: "2",
      range_10_14: "9",
      range_15_19: "5",
      range_20_24: "4",
      range_25_29: "7",
      subTotal: "45",
    },
    {
      key: "3",
      range_10_14: "7",
      range_15_19: "4",
      range_20_24: "2",
      range_25_29: "94",
      subTotal: "45",
    },
    {
      key: "4",
      range_10_14: "7",
      range_15_19: "8",
      range_20_24: "3",
      range_25_29: "41",
      subTotal: "45",
    },
  ];

  return (
    <>
      <p>Data Inicial: {initialDate}</p>
      <p>Data final: {finalDate}</p>
      <Collapse onChange={onChange}>
        {provinces.map((item) => {
          currentProvinceId = item.id;
          return (
            <Panel header={item.name} key={item.id}>
              <Collapse defaultActiveKey={item.id}>
                {districts.map((item) => {
                  if (item.province.id === currentProvinceId) {
                    return (
                      <Panel header={item.name} key={item.id}>
                        <p>Distrito: {item.name}</p>
                        <p>RESUMO DISTRITAL</p>
                        <p>Total de Adolescentes e Jovens Registados: 2</p>
                        <p>
                          Total de Adolescentes e Jovens do Sexo Feminino: 2
                        </p>
                        <p>
                          Total de Adolescentes e Jovens do Sexo Masculino: 0
                        </p>
                        <p>Total de Beneficiárias no Indicador AGYW_PREV: 0</p>

                        <Table
                          columns={columns}
                          dataSource={data}
                          bordered
                          title={() =>
                            "Beneficiaries that have fully completed the DREAMS primary package of services/interventions but no additional services/interventions: 0  "
                          }
                        />
                        <Table
                          columns={columns}
                          dataSource={data}
                          bordered
                          title={() =>
                            "Beneficiaries that have fully completed the DREAMS primary package of services/interventions AND at least one secondary service/intervention: 0  "
                          }
                        />
                        <Table
                          columns={columns}
                          dataSource={data}
                          bordered
                          title={() =>
                            "Beneficiaries that have completed at least one DREAMS service/intervention but not the full primary package: 0  "
                          }
                        />
                        <Table
                          columns={columns}
                          dataSource={data}
                          bordered
                          title={() =>
                            "Beneficiaries that have started a DREAMS service/intervention but have not yet completed it: 0  "
                          }
                        />
                        <Table
                          columns={columns}
                          dataSource={data}
                          bordered
                          title={() =>
                            "Number of AGYW enrolled in DREAMS that completed an evidence-based intervention focused on preventing violence within the reporting period: 0  "
                          }
                        />
                        <Table
                          columns={columns}
                          dataSource={data}
                          bordered
                          title={() =>
                            "Number of AGYW enrolled in DREAMS that received educational support to remain in, advance, and/or rematriculate in school within the reporting period: 0  "
                          }
                        />
                        <Table
                          columns={columns}
                          dataSource={data}
                          bordered
                          title={() =>
                            "Number of AGYW ages 15-24 years enrolled in DREAMS that completed a comprehensive economic strengthening intervention within the reporting period: 0  "
                          }
                        />
                      </Panel>
                    );
                  }
                })}
              </Collapse>
            </Panel>
          );
        })}
      </Collapse>
    </>
  );
};
export default PreviewAgyw;
