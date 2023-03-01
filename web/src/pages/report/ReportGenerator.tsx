import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function generateXlsReport(currentUserName) {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = currentUserName;
  workbook.lastModifiedBy = currentUserName;
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();
  // Set workbook dates to 1904 date system
  workbook.properties.date1904 = true;
  // Force workbook calculation on load
  workbook.calcProperties.fullCalcOnLoad = true;
  workbook.views = [
    {
      x: 0,
      y: 9,
      width: 10000,
      height: 20000,
      firstSheet: 0,
      activeTab: 1,
      visibility: "visible",
    },
  ];
  const worksheet = workbook.addWorksheet("PEPFAR_MER_2.6_AGYW");

  // Add column headers and define column keys and widths
  // Note: these column structures are a workbook-building convenience only,
  // apart from the column width, they will not be fully persisted.
  worksheet.mergeCells("A1:A8");
  worksheet.mergeCells("B1:B8");
  worksheet.mergeCells("C1:C8");

  /** Top Bar, linhas 1 e 2 */
  worksheet.mergeCells("D1:CJ2");
  const d1 = worksheet.getCell("D1");
  d1.value =
    "AGYW_PREV: Number of active DREAMS beneficiaries that have started or completed any DREAMS service/intervention";

  /***Total  */
  worksheet.mergeCells("D3:D8");
  const d3 = worksheet.getCell("D3");
  d3.value = "Total";

  /** linha 3 */
  worksheet.mergeCells("E3:X3");
  const x3 = worksheet.getCell("X3");
  x3.value =
    "Beneficiaries that have fully completed the DREAMS primary package of services/interventions but no additional services/interventions";

  worksheet.mergeCells("Y3:AR3");
  const y3 = worksheet.getCell("Y3");
  y3.value =
    "Beneficiaries that have fully completed the DREAMS primary package of services/interventions AND at least one secondary service/intervention";

  worksheet.mergeCells("AS3:BL3");
  const as3 = worksheet.getCell("AS3");
  as3.value =
    "Beneficiaries that have completed at least one DREAMS service/intervention but not the full primary package";

  worksheet.mergeCells("BM3:CF3");
  const bm3 = worksheet.getCell("BM3");
  bm3.value =
    "Beneficiaries that have started a DREAMS service/intervention but have not yet completed it";

  /** linha 4 */
  worksheet.mergeCells("E4:X4");
  const e4 = worksheet.getCell("E4");
  e4.value = "Enrollment Time / Age";

  worksheet.mergeCells("Y4:AR4");
  const y4 = worksheet.getCell("Y4");
  y4.value = "Enrollment Time / Age";

  worksheet.mergeCells("AS4:BL4");
  const as4 = worksheet.getCell("AS4");
  as4.value = "Enrollment Time / Age";

  worksheet.mergeCells("BM4:CF4");
  const cf4 = worksheet.getCell("CF4");
  cf4.value = "Enrollment Time / Age";

  /** linhas 5 e 6 */
  worksheet.mergeCells("E5:I6");
  const es5 = worksheet.getCell("E5");
  es5.value = "0-6";

  worksheet.mergeCells("J5:N6");
  const j5 = worksheet.getCell("J5");
  j5.value = "7-12";

  worksheet.mergeCells("O5:S6");
  const o5 = worksheet.getCell("O5");
  o5.value = "13-24";

  worksheet.mergeCells("T5:X6");
  const t5 = worksheet.getCell("T5");
  t5.value = "25+ months";

  worksheet.mergeCells("Y5:AC6");
  const y5 = worksheet.getCell("Y5");
  y5.value = "0-6";

  worksheet.mergeCells("AD5:AH6");
  const ad5 = worksheet.getCell("AD5");
  ad5.value = "7-12";

  worksheet.mergeCells("AI5:AM6");
  const ai5 = worksheet.getCell("AI5");
  ai5.value = "13-24";

  worksheet.mergeCells("AN5:AR6");
  const an5 = worksheet.getCell("AN5");
  an5.value = "25+ months";

  worksheet.mergeCells("AS5:AW6");
  const aw5 = worksheet.getCell("AS5");
  aw5.value = "0-6";

  worksheet.mergeCells("AX5:BB6");
  const ax5 = worksheet.getCell("AX5");
  ax5.value = "7-12";

  worksheet.mergeCells("BC5:BG6");
  const bc5 = worksheet.getCell("BC5");
  bc5.value = "13-24";

  worksheet.mergeCells("BH5:BL6");
  const bh5 = worksheet.getCell("BH5");
  bh5.value = "25+ months";

  worksheet.mergeCells("BM5:BQ6");
  const bm5 = worksheet.getCell("BM5");
  bm5.value = "0-6";

  worksheet.mergeCells("BR5:BV6");
  const br5 = worksheet.getCell("BR5");
  br5.value = "7-12";

  worksheet.mergeCells("BW5:CA6");
  const bw5 = worksheet.getCell("BW5");
  bw5.value = "13-24";

  worksheet.mergeCells("CB5:CF6");
  const cb5 = worksheet.getCell("CB5");
  cb5.value = "25+ months";

  /***Violence Prevention Service Type  */
  worksheet.mergeCells("CG3:CG8");
  const cg3 = worksheet.getCell("CG3");
  cg3.value = "Violence Prevention Service Type";

  worksheet.mergeCells("CH3:CH8");
  const ch3 = worksheet.getCell("CH3");
  ch3.value = "Education Support Service Type";

  worksheet.mergeCells("CI3:CI8");
  const ci3 = worksheet.getCell("CI3");
  ci3.value = "Comprehensive Economic Strenghtening";

  worksheet.mergeCells("CJ3:CJ8");
  const cj3 = worksheet.getCell("CJ3");
  cj3.value = "Data Check";

  worksheet.columns = [
    { header: "Reporting_Period", key: "reporting_period", width: 10 },
    { header: "NameProvince", key: "name_province", width: 32 },
    { header: "District", key: "district", width: 10, outlineLevel: 1 },
  ];

  // Add a couple of Rows by key-value, after the last current row, using the column keys
  worksheet.addRow({
    reporting_period: 71,
    name_province: 53,
    district: 55,
  });

  workbook.xlsx.writeBuffer().then(function (buffer) {
    // done
    // console.log(workbook.xlsx);
    // console.log(buffer);

    const blob = new Blob([buffer], { type: "applicationi/xlsx" });
    saveAs(blob, "myexcel.xlsx");
  });
}
