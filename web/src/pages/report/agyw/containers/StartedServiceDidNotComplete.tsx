import React, { Fragment, useEffect, useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { loadBeneficiariesIds } from "@app/store/reducers/report";
import { useNavigate } from "react-router-dom";
import {
  getAgywPrevBeneficiariesReportGenerated,
  getFileDownloaded,
} from "@app/utils/report";
import LoadingModal from "@app/components/modal/LoadingModal";

const StartedServiceDidNotComplete = ({ districtId }) => {
  const responseData = useSelector((state: any) => state.report.agyw);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const beneficiariesIdsSelector: [] = useSelector(
    (state: any) => state?.report.ids
  );
  const [dataLoading, setDataLoading] = useState(false);
  const username = localStorage.getItem("username");

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
    responseData[districtId]["started-service-did-not-complete"].total;

  const startedServiceDidNotComplete =
    responseData[districtId]["started-service-did-not-complete"].totals;

  const arrTotals = Object.keys(startedServiceDidNotComplete).map((key) => ({
    key,
    value: startedServiceDidNotComplete[key],
  }));

  const time_1 = arrTotals.filter((item) => item.key == enrollmentTime_0_6);
  const totals1 = time_1[0];

  const ages_10_14_time_1 = totals1?.value[ages_10_14];
  const ages_15_19_time_1 = totals1?.value[ages_15_19];
  const ages_20_24_time_1 = totals1?.value[ages_20_24];
  const ages_25_29_time_1 = totals1?.value[ages_25_29];
  const subTotal_time_1 = totals1?.value[subtotal];

  const time_2 = arrTotals.filter((item) => item.key == enrollmentTime_7_12);
  const totals2 = time_2[0];

  const ages_10_14_time_2 = totals2?.value[ages_10_14];
  const ages_15_19_time_2 = totals2?.value[ages_15_19];
  const ages_20_24_time_2 = totals2?.value[ages_20_24];
  const ages_25_29_time_2 = totals2?.value[ages_25_29];
  const subTotal_time_2 = totals2?.value[subtotal];

  const time_3 = arrTotals.filter((item) => item.key == enrollmentTime_13_24);
  const totals3 = time_3[0];

  const ages_10_14_time_3 = totals3?.value[ages_10_14];
  const ages_15_19_time_3 = totals3?.value[ages_15_19];
  const ages_20_24_time_3 = totals3?.value[ages_20_24];
  const ages_25_29_time_3 = totals3?.value[ages_25_29];
  const subTotal_time_3 = totals3?.value[subtotal];

  const time_4 = arrTotals.filter((item) => item.key == enrollmentTime_25_plus);
  const totals4 = time_4[0];

  const ages_10_14_time_4 = totals4?.value[ages_10_14];
  const ages_15_19_time_4 = totals4?.value[ages_15_19];
  const ages_20_24_time_4 = totals4?.value[ages_20_24];
  const ages_25_29_time_4 = totals4?.value[ages_25_29];
  const subTotal_time_4 = totals4?.value[subtotal];

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
      render: (text, record) => {
        if (text > 0)
          return (
            <a
              style={{
                textDecoration: "underline",
                color: "blue",
              }}
              onClick={(e) =>
                handleOnFilteredClick(e, record.enrollmentTime, "9-14", text)
              }
              onContextMenu={(e) =>
                handleOnFilteredClick(e, record.enrollmentTime, "9-14", text)
              }
              onMouseDown={(e) =>
                handleOnFilteredClick(e, record.enrollmentTime, "9-14", text)
              }
            >
              {text}
            </a>
          );
        else return <span>{text}</span>;
      },
    },
    {
      title: "15-19",
      className: "column-money",
      dataIndex: "range_15_19",
      render: (text, record) => {
        if (text > 0)
          return (
            <a
              style={{
                textDecoration: "underline",
                color: "blue",
              }}
              onClick={(e) =>
                handleOnFilteredClick(e, record.enrollmentTime, "15-19", text)
              }
              onContextMenu={(e) =>
                handleOnFilteredClick(e, record.enrollmentTime, "15-19", text)
              }
              onMouseDown={(e) =>
                handleOnFilteredClick(e, record.enrollmentTime, "15-19", text)
              }
            >
              {text}
            </a>
          );
        else return <span>{text}</span>;
      },
    },
    {
      title: "20-24",
      dataIndex: "range_20_24",
      render: (text, record) => {
        if (text > 0)
          return (
            <a
              style={{
                textDecoration: "underline",
                color: "blue",
              }}
              onClick={(e) =>
                handleOnFilteredClick(e, record.enrollmentTime, "20-24", text)
              }
              onContextMenu={(e) =>
                handleOnFilteredClick(e, record.enrollmentTime, "20-24", text)
              }
              onMouseDown={(e) =>
                handleOnFilteredClick(e, record.enrollmentTime, "20-24", text)
              }
            >
              {text}
            </a>
          );
        else return <span>{text}</span>;
      },
    },
    {
      title: "25-29",
      dataIndex: "range_25_29",
      render: (text, record) => {
        if (text > 0)
          return (
            <a
              style={{
                textDecoration: "underline",
                color: "blue",
              }}
              onClick={(e) =>
                handleOnFilteredClick(e, record.enrollmentTime, "25-29", text)
              }
              onContextMenu={(e) =>
                handleOnFilteredClick(e, record.enrollmentTime, "25-29", text)
              }
              onMouseDown={(e) =>
                handleOnFilteredClick(e, record.enrollmentTime, "25-29", text)
              }
            >
              {text}
            </a>
          );
        else return <span>{text}</span>;
      },
    },
    {
      title: "SUB-TOTAL",
      dataIndex: "subTotal",
      render: (text, record) => {
        if (text > 0)
          <a
            style={{
              textDecoration: "underline",
              color: "blue",
            }}
            onClick={(e) =>
              handleOnSubTotalClick(e, record.enrollmentTime, text)
            }
            onContextMenu={(e) =>
              handleOnSubTotalClick(e, record.enrollmentTime, text)
            }
            onMouseDown={(e) =>
              handleOnSubTotalClick(e, record.enrollmentTime, text)
            }
          >
            {text}
          </a>;
        else return <span>{text}</span>;
      },
    },
  ];

  const data: DataType[] = [
    {
      key: "61",
      enrollmentTime: enrollmentTime_0_6,
      range_10_14: ages_10_14_time_1,
      range_15_19: ages_15_19_time_1,
      range_20_24: ages_20_24_time_1,
      range_25_29: ages_25_29_time_1,
      subTotal: subTotal_time_1,
    },
    {
      key: "62",
      enrollmentTime: enrollmentTime_7_12,
      range_10_14: ages_10_14_time_2,
      range_15_19: ages_15_19_time_2,
      range_20_24: ages_20_24_time_2,
      range_25_29: ages_25_29_time_2,
      subTotal: subTotal_time_2,
    },
    {
      key: "63",
      enrollmentTime: enrollmentTime_13_24,
      range_10_14: ages_10_14_time_3,
      range_15_19: ages_15_19_time_3,
      range_20_24: ages_20_24_time_3,
      range_25_29: ages_25_29_time_3,
      subTotal: subTotal_time_3,
    },
    {
      key: "64",
      enrollmentTime: enrollmentTime_25_plus,
      range_10_14: ages_10_14_time_4,
      range_15_19: ages_15_19_time_4,
      range_20_24: ages_20_24_time_4,
      range_25_29: ages_25_29_time_4,
      subTotal: subTotal_time_4,
    },
  ];

  const title =
    "Beneficiaries that have started a DREAMS service/intervention but have not yet completed it";
  const title_pt =
    "Beneficiárias que iniciaram um serviço/intervenção do DREAMS mas não o completaram";

  const beneficiaries =
    responseData[districtId]["started-service-did-not-complete"].beneficiaries;

  const arrBeneficiaries = Object.keys(beneficiaries).map((key) => ({
    key,
    value: beneficiaries[key],
  }));

  function extractElements(data) {
    const elements: string[] = [];

    data.forEach((item) => {
      Object.values(item.value).forEach((value) => {
        if (Array.isArray(value)) {
          elements.push(...value);
        }
      });
    });

    return elements;
  }

  const handleOnCLick = (e) => {
    const elements = extractElements(arrBeneficiaries);

    if (e.button === 0) {
      dispatch(
        loadBeneficiariesIds({ ids: elements, title: title_pt, total: total })
      );
      console.log("Left click");
      navigate("/viewAgyw");
    } else {
      console.log("Right click");
      e.preventDefault();
      if (e.type !== "contextmenu") handleGenerateXLSXReport(elements);
    }
  };

  function filterByAgeRange(data, param) {
    if (Object.prototype.hasOwnProperty.call(data.value, param)) {
      return data.value[param];
    } else {
      // Return empty array if the param does not exist
      return [];
    }
  }

  function extractFilteredElements(
    data: any,
    enrollmentTime: string,
    ageRange: string
  ): number[] {
    let elements: number[] = [];
    Object.keys(data).forEach((currentEnrollmentTime) => {
      if (enrollmentTime == data[currentEnrollmentTime].key) {
        const ageRanges = data[currentEnrollmentTime];
        elements = filterByAgeRange(ageRanges, ageRange);
      }
    });
    return elements;
  }

  const handleOnFilteredClick = (
    e,
    enrollmentTime: string,
    ageRange: string,
    total: number
  ) => {
    const elements = extractFilteredElements(
      arrBeneficiaries,
      enrollmentTime,
      ageRange
    );

    if (e.button === 0) {
      dispatch(
        loadBeneficiariesIds({
          ids: elements,
          title: title_pt,
          total: total,
        })
      );
      console.log("Left click");
      navigate("/viewAgyw");
    } else {
      console.log("Right click");
      e.preventDefault();
      if (e.type !== "contextmenu") handleGenerateXLSXReport(elements);
    }
  };

  function extractSubTotalElements(
    data: any,
    enrollmentTime: string
  ): number[] {
    const elements: any = [];
    Object.keys(data).forEach((currentEnrollmentTime) => {
      if (enrollmentTime == data[currentEnrollmentTime].key) {
        const ageRanges = data[currentEnrollmentTime];
        for (const key in ageRanges.value) {
          elements.push(...ageRanges.value[key]);
        }
      }
    });
    return elements;
  }

  const handleOnSubTotalClick = (e, enrollmentTime: string, total: number) => {
    const elements = extractSubTotalElements(arrBeneficiaries, enrollmentTime);

    if (e.button === 0) {
      dispatch(
        loadBeneficiariesIds({
          ids: elements,
          title: title_pt,
          total: total,
        })
      );
      console.log("Left click");
      navigate("/viewAgyw");
    } else {
      console.log("Right click");
      e.preventDefault();
      if (e.type !== "contextmenu") handleGenerateXLSXReport(elements);
    }
  };

  async function handleGenerateXLSXReport(beneficiariesIds) {
    setDataLoading(true);
    try {
      const response = await getAgywPrevBeneficiariesReportGenerated(
        beneficiariesIds,
        username
      );
      await downloadFile(response.data);
      setDataLoading(false);
    } catch (error) {
      setDataLoading(false);
      console.error("Error downloading the Excel report", error);
    }
  }

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

  useEffect(() => {
    const disableContextMenu = (event) => event.preventDefault();
    document.addEventListener("contextmenu", disableContextMenu);

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
    };
  }, []);

  return (
    <Fragment>
      {responseData != undefined && (
        <Table
          columns={columns}
          dataSource={data}
          bordered
          title={() => (
            <React.Fragment>
              {title}:{" "}
              {total > 0 ? (
                <a
                  style={{
                    textDecoration: "underline",
                    color: "blue",
                  }}
                  onClick={(e) => handleOnCLick(e)}
                  onContextMenu={(e) => handleOnCLick(e)}
                  onMouseDown={(e) => handleOnCLick(e)}
                >
                  {total}
                </a>
              ) : (
                total
              )}
            </React.Fragment>
          )}
          pagination={false}
        />
      )}
      {<LoadingModal modalVisible={dataLoading} />}
    </Fragment>
  );
};

StartedServiceDidNotComplete.propTypes = {
  districtId: PropTypes.number.isRequired,
};

export default StartedServiceDidNotComplete;
