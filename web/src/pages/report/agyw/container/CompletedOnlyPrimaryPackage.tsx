import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Fragment } from "react";
import { useSelector } from "react-redux";

const CompletedOnlyPrimaryPackage = ({ districtId }) => {
  const responseData = useSelector((state: any) => state.report.agyw);
  
  // const allDisaggregationsTotal =
  //   responseData[districtId]["all-disaggregations-total"];

  const ages_10_14 = "9-14";
  const ages_15_19 = "15-19";
  const ages_20_24 = "20-24";
  const ages_25_29 = "25-29";
  const subtotal = "Subtotal";

  const enrollmentTime_0_6 = "0-6";
  const enrollmentTime_7_12 = "7-12";
  const enrollmentTime_13_24 = "13-24";
  const enrollmentTime_25_plus = "25+";

    const total =
    responseData[districtId]["completed-only-primary-package"].total;

  const completedOnlyPrimaryPackage =
    responseData[districtId]["completed-only-primary-package"].totals;

  const arrTotals = Object.keys(completedOnlyPrimaryPackage).map((key) => ({
    key,
    value: completedOnlyPrimaryPackage[key],
  }));

  const time_1 = arrTotals.filter((item) => item.key == enrollmentTime_0_6);
  const totals1 = time_1[0];

  let ages_10_14_time_1 = totals1?.value[ages_10_14];
  let ages_15_19_time_1 = totals1?.value[ages_15_19];
  let ages_20_24_time_1 = totals1?.value[ages_20_24];
  let ages_25_29_time_1 = totals1?.value[ages_25_29];
  let subTotal_time_1 = totals1?.value[subtotal];

  const time_2 = arrTotals.filter((item) => item.key == enrollmentTime_7_12);
  const totals2 = time_2[0];

  let ages_10_14_time_2 = totals2?.value[ages_10_14];
  let ages_15_19_time_2 = totals2?.value[ages_15_19];
  let ages_20_24_time_2 = totals2?.value[ages_20_24];
  let ages_25_29_time_2 = totals2?.value[ages_25_29];
  let subTotal_time_2 = totals2?.value[subtotal];

  const time_3 = arrTotals.filter((item) => item.key == enrollmentTime_13_24);
  const totals3 = time_3[0];

  let ages_10_14_time_3 = totals3?.value[ages_10_14];
  let ages_15_19_time_3 = totals3?.value[ages_15_19];
  let ages_20_24_time_3 = totals3?.value[ages_20_24];
  let ages_25_29_time_3 = totals3?.value[ages_25_29];
  let subTotal_time_3 = totals3?.value[subtotal];

  const time_4 = arrTotals.filter((item) => item.key == enrollmentTime_25_plus);
  const totals4 = time_4[0];

  let ages_10_14_time_4 = totals4?.value[ages_10_14];
  let ages_15_19_time_4 = totals4?.value[ages_15_19];
  let ages_20_24_time_4 = totals4?.value[ages_20_24];
  let ages_25_29_time_4 = totals4?.value[ages_25_29];
  let subTotal_time_4 = totals4?.value[subtotal];

  interface DataType {
    key: string;
    enrollmentTime: string;
    range_10_14: string;
    range_15_19: string;
    range_20_24: string;
    range_25_29: string;
    subTotal: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Tempo de registo como beneficiário DREAMS (em Meses)",
      dataIndex: "enrollmentTime",
    },
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
      enrollmentTime: enrollmentTime_0_6,
      range_10_14: ages_10_14_time_1,
      range_15_19: ages_15_19_time_1,
      range_20_24: ages_20_24_time_1,
      range_25_29: ages_25_29_time_1,
      subTotal: subTotal_time_1,
    },
    {
      key: "2",
      enrollmentTime: enrollmentTime_7_12,
      range_10_14: ages_10_14_time_2,
      range_15_19: ages_15_19_time_2,
      range_20_24: ages_20_24_time_2,
      range_25_29: ages_25_29_time_2,
      subTotal: subTotal_time_2,
    },
    {
      key: "3",
      enrollmentTime: enrollmentTime_13_24,
      range_10_14: ages_10_14_time_3,
      range_15_19: ages_15_19_time_3,
      range_20_24: ages_20_24_time_3,
      range_25_29: ages_25_29_time_3,
      subTotal: subTotal_time_3,
    },
    {
      key: "4",
      enrollmentTime: enrollmentTime_25_plus,
      range_10_14: ages_10_14_time_4,
      range_15_19: ages_15_19_time_4,
      range_20_24: ages_20_24_time_4,
      range_25_29: ages_25_29_time_4,
      subTotal: subTotal_time_4,
    },
  ];

  return (
    <Fragment>
      {responseData != undefined && (
        <Table
          columns={columns}
          dataSource={data}
          bordered
          title={() =>
            `Beneficiaries that have fully completed the DREAMS primary package of services/interventions but no additional services/interventions: ${total}  `
          }
          pagination={false}
        />
      )}
    </Fragment>
  );
};

export default CompletedOnlyPrimaryPackage;
