import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import moment, { months } from "moment";
import { agywPrevQuery } from "../../utils/report";

export async function generateXlsReport(
  currentUserName,
  districtsIds,
  startDate,
  endDate,
  districts
) {
  const data = await agywPrevQuery(districtsIds, startDate, endDate);

  const ages_10_14 = "9-14";
  const ages_15_19 = "15-19";
  const ages_20_24 = "20-24";
  const ages_25_29 = "25-29";
  const subtotal = "Subtotal";

  const months_0_6 = "0-6";
  const months_7_12 = "7-12";
  const months_13_24 = "13-24";
  const months_25_plus = "25+";

  const completedOnlyPrimaryPackage =
    data[7]["completed-only-primary-package"].totals;
  const completedPrimaryPackageAndSecondaryService =
    data[7]["completed-primary-package-and-secondary-service"].totals;
  const completeAtLeastOnePrimaryService =
    data[7]["completed-service-not-primary-package"].totals;
  const startedServiceDidNotComplete =
    data[7]["started-service-did-not-complete"].totals;
  const completedSocialEconomicApproaches =
    data[7]["completed-social-economic-approaches"];
  const completedViolenceService = data[7]["completed-violence-service"];
  const hadSchoolAllowance = data[7]["had-school-allowance"];

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
      y: 0,
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
  const a1 = worksheet.getCell("A1");
  a1.alignment = { vertical: "middle", horizontal: "center" };
  a1.value = "Reporting_Period";

  worksheet.mergeCells("B1:B8");
  const b1 = worksheet.getCell("B1");
  b1.alignment = { vertical: "middle", horizontal: "center" };
  b1.value = "NameProvince";

  worksheet.mergeCells("C1:C8");
  const c1 = worksheet.getCell("C1");
  c1.alignment = { vertical: "middle", horizontal: "center" };
  c1.value = "District";

  /** Top Bar, linhas 1 e 2 */
  worksheet.mergeCells("D1:CJ2");
  const d1 = worksheet.getCell("D1");
  d1.alignment = { vertical: "middle", horizontal: "center" };
  d1.value =
    "AGYW_PREV: Number of active DREAMS beneficiaries that have started or completed any DREAMS service/intervention";

  /***Total  */
  worksheet.mergeCells("D3:D8");
  const d3 = worksheet.getCell("D3");
  d3.alignment = { vertical: "middle", horizontal: "center" };
  d3.value = "Total";

  /** linha 3 */
  worksheet.mergeCells("E3:X3");
  const x3 = worksheet.getCell("X3");
  x3.alignment = { vertical: "middle", horizontal: "center" };
  x3.value =
    "Beneficiaries that have fully completed the DREAMS primary package of services/interventions but no additional services/interventions";

  worksheet.mergeCells("Y3:AR3");
  const y3 = worksheet.getCell("Y3");
  y3.alignment = { vertical: "middle", horizontal: "center" };
  y3.value =
    "Beneficiaries that have fully completed the DREAMS primary package of services/interventions AND at least one secondary service/intervention";

  worksheet.mergeCells("AS3:BL3");
  const as3 = worksheet.getCell("AS3");
  as3.alignment = { vertical: "middle", horizontal: "center" };
  as3.value =
    "Beneficiaries that have completed at least one DREAMS service/intervention but not the full primary package";

  worksheet.mergeCells("BM3:CF3");
  const bm3 = worksheet.getCell("BM3");
  bm3.alignment = { vertical: "middle", horizontal: "center" };
  bm3.value =
    "Beneficiaries that have started a DREAMS service/intervention but have not yet completed it";

  /** linha 4 */
  worksheet.mergeCells("E4:X4");
  const e4 = worksheet.getCell("E4");
  e4.alignment = { vertical: "middle", horizontal: "center" };
  e4.value = "Enrollment Time / Age";

  worksheet.mergeCells("Y4:AR4");
  const y4 = worksheet.getCell("Y4");
  y4.alignment = { vertical: "middle", horizontal: "center" };
  y4.value = "Enrollment Time / Age";

  worksheet.mergeCells("AS4:BL4");
  const as4 = worksheet.getCell("AS4");
  as4.alignment = { vertical: "middle", horizontal: "center" };
  as4.value = "Enrollment Time / Age";

  worksheet.mergeCells("BM4:CF4");
  const cf4 = worksheet.getCell("CF4");
  cf4.alignment = { vertical: "middle", horizontal: "center" };
  cf4.value = "Enrollment Time / Age";

  /** linhas 5 e 6 */
  worksheet.mergeCells("E5:I6");
  const es5 = worksheet.getCell("E5");
  es5.alignment = { vertical: "middle", horizontal: "center" };
  es5.value = months_0_6;

  worksheet.mergeCells("J5:N6");
  const j5 = worksheet.getCell("J5");
  j5.alignment = { vertical: "middle", horizontal: "center" };
  j5.value = months_7_12;

  worksheet.mergeCells("O5:S6");
  const o5 = worksheet.getCell("O5");
  o5.alignment = { vertical: "middle", horizontal: "center" };
  o5.value = months_13_24;

  worksheet.mergeCells("T5:X6");
  const t5 = worksheet.getCell("T5");
  t5.alignment = { vertical: "middle", horizontal: "center" };
  t5.value = "25+ months";

  worksheet.mergeCells("Y5:AC6");
  const y5 = worksheet.getCell("Y5");
  y5.alignment = { vertical: "middle", horizontal: "center" };
  y5.value = months_0_6;

  worksheet.mergeCells("AD5:AH6");
  const ad5 = worksheet.getCell("AD5");
  ad5.alignment = { vertical: "middle", horizontal: "center" };
  ad5.value = months_7_12;

  worksheet.mergeCells("AI5:AM6");
  const ai5 = worksheet.getCell("AI5");
  ai5.alignment = { vertical: "middle", horizontal: "center" };
  ai5.value = months_13_24;

  worksheet.mergeCells("AN5:AR6");
  const an5 = worksheet.getCell("AN5");
  an5.alignment = { vertical: "middle", horizontal: "center" };
  an5.value = "25+ months";

  worksheet.mergeCells("AS5:AW6");
  const aw5 = worksheet.getCell("AS5");
  aw5.alignment = { vertical: "middle", horizontal: "center" };
  aw5.value = months_0_6;

  worksheet.mergeCells("AX5:BB6");
  const ax5 = worksheet.getCell("AX5");
  ax5.alignment = { vertical: "middle", horizontal: "center" };
  aw5.value = months_0_6;
  ax5.value = months_7_12;

  worksheet.mergeCells("BC5:BG6");
  const bc5 = worksheet.getCell("BC5");
  bc5.alignment = { vertical: "middle", horizontal: "center" };
  bc5.value = months_13_24;

  worksheet.mergeCells("BH5:BL6");
  const bh5 = worksheet.getCell("BH5");
  bh5.alignment = { vertical: "middle", horizontal: "center" };
  bh5.value = "25+ months";

  worksheet.mergeCells("BM5:BQ6");
  const bm5 = worksheet.getCell("BM5");
  bm5.alignment = { vertical: "middle", horizontal: "center" };
  bm5.value = months_0_6;

  worksheet.mergeCells("BR5:BV6");
  const br5 = worksheet.getCell("BR5");
  br5.alignment = { vertical: "middle", horizontal: "center" };
  br5.value = months_7_12;

  worksheet.mergeCells("BW5:CA6");
  const bw5 = worksheet.getCell("BW5");
  bw5.alignment = { vertical: "middle", horizontal: "center" };
  bw5.value = months_13_24;

  worksheet.mergeCells("CB5:CF6");
  const cb5 = worksheet.getCell("CB5");
  cb5.alignment = { vertical: "middle", horizontal: "center" };
  cb5.value = "25+ months";

  /***Violence Prevention Service Type  */
  worksheet.mergeCells("CG3:CG8");
  const cg3 = worksheet.getCell("CG3");
  cg3.alignment = { vertical: "middle", horizontal: "center" };
  cg3.value = "Violence Prevention Service Type";

  worksheet.mergeCells("CH3:CH8");
  const ch3 = worksheet.getCell("CH3");
  ch3.alignment = { vertical: "middle", horizontal: "center" };
  ch3.value = "Education Support Service Type";

  worksheet.mergeCells("CI3:CI8");
  const ci3 = worksheet.getCell("CI3");
  ci3.alignment = { vertical: "middle", horizontal: "center" };
  ci3.value = "Comprehensive Economic Strenghtening";

  worksheet.mergeCells("CJ3:CJ8");
  const cj3 = worksheet.getCell("CJ3");
  cj3.alignment = { vertical: "middle", horizontal: "center" };
  cj3.value = "Data Check";

  /** Linhas 7 e 8 */
  worksheet.mergeCells("E7:E8");
  const e7 = worksheet.getCell("E7");
  e7.alignment = { vertical: "middle", horizontal: "center" };
  e7.value = "10-14";

  worksheet.mergeCells("F7:F8");
  const f7 = worksheet.getCell("F7");
  f7.alignment = { vertical: "middle", horizontal: "center" };
  f7.value = ages_15_19;

  worksheet.mergeCells("G7:G8");
  const g7 = worksheet.getCell("G7");
  g7.alignment = { vertical: "middle", horizontal: "center" };
  g7.value = ages_20_24;

  worksheet.mergeCells("H7:H8");
  const h7 = worksheet.getCell("H7");
  h7.alignment = { vertical: "middle", horizontal: "center" };
  h7.value = ages_25_29;

  worksheet.mergeCells("I7:I8");
  const i7 = worksheet.getCell("I7");
  i7.alignment = { vertical: "middle", horizontal: "center" };
  i7.value = "Subtotal";

  worksheet.mergeCells("J7:J8");
  const j7 = worksheet.getCell("J7");
  j7.alignment = { vertical: "middle", horizontal: "center" };
  j7.value = "10-14";

  worksheet.mergeCells("K7:K8");
  const k7 = worksheet.getCell("K7");
  k7.alignment = { vertical: "middle", horizontal: "center" };
  k7.value = ages_15_19;

  worksheet.mergeCells("L7:L8");
  const l7 = worksheet.getCell("L7");
  l7.alignment = { vertical: "middle", horizontal: "center" };
  l7.value = ages_20_24;

  worksheet.mergeCells("M7:M8");
  const m7 = worksheet.getCell("M7");
  m7.alignment = { vertical: "middle", horizontal: "center" };
  m7.value = ages_25_29;

  worksheet.mergeCells("N7:N8");
  const n7 = worksheet.getCell("N7");
  n7.alignment = { vertical: "middle", horizontal: "center" };
  n7.value = "Subtotal";

  worksheet.mergeCells("O7:O8");
  const o7 = worksheet.getCell("O7");
  o7.alignment = { vertical: "middle", horizontal: "center" };
  o7.value = "10-14";

  worksheet.mergeCells("P7:P8");
  const p7 = worksheet.getCell("P7");
  p7.alignment = { vertical: "middle", horizontal: "center" };
  p7.value = ages_15_19;

  worksheet.mergeCells("Q7:Q8");
  const q7 = worksheet.getCell("Q7");
  q7.alignment = { vertical: "middle", horizontal: "center" };
  q7.value = ages_20_24;

  worksheet.mergeCells("R7:R8");
  const r7 = worksheet.getCell("R7");
  r7.alignment = { vertical: "middle", horizontal: "center" };
  r7.value = ages_25_29;

  worksheet.mergeCells("S7:S8");
  const s7 = worksheet.getCell("S7");
  s7.alignment = { vertical: "middle", horizontal: "center" };
  s7.value = "Subtotal";

  worksheet.mergeCells("T7:T8");
  const t7 = worksheet.getCell("T7");
  t7.alignment = { vertical: "middle", horizontal: "center" };
  t7.value = "10-14";

  worksheet.mergeCells("U7:U8");
  const u7 = worksheet.getCell("U7");
  u7.alignment = { vertical: "middle", horizontal: "center" };
  u7.value = ages_15_19;

  worksheet.mergeCells("V7:V8");
  const v7 = worksheet.getCell("V7");
  v7.alignment = { vertical: "middle", horizontal: "center" };
  v7.value = ages_20_24;

  worksheet.mergeCells("W7:W8");
  const w7 = worksheet.getCell("W7");
  w7.alignment = { vertical: "middle", horizontal: "center" };
  w7.value = ages_25_29;

  worksheet.mergeCells("X7:X8");
  const x7 = worksheet.getCell("X7");
  x7.alignment = { vertical: "middle", horizontal: "center" };
  x7.value = "Subtotal";

  worksheet.mergeCells("Y7:Y8");
  const y7 = worksheet.getCell("Y7");
  y7.alignment = { vertical: "middle", horizontal: "center" };
  y7.value = "10-14";

  worksheet.mergeCells("Z7:Z8");
  const z7 = worksheet.getCell("Z7");
  z7.alignment = { vertical: "middle", horizontal: "center" };
  z7.value = ages_15_19;

  worksheet.mergeCells("AA7:AA8");
  const aa7 = worksheet.getCell("AA7");
  aa7.alignment = { vertical: "middle", horizontal: "center" };
  aa7.value = ages_20_24;

  worksheet.mergeCells("AB7:AB8");
  const ab7 = worksheet.getCell("AB7");
  aa7.alignment = { vertical: "middle", horizontal: "center" };
  ab7.value = ages_25_29;

  worksheet.mergeCells("AC7:AC8");
  const ac7 = worksheet.getCell("AC7");
  ac7.alignment = { vertical: "middle", horizontal: "center" };
  ac7.value = "Subtotal";

  worksheet.mergeCells("AD7:AD8");
  const ad7 = worksheet.getCell("AD7");
  ad7.alignment = { vertical: "middle", horizontal: "center" };
  ad7.value = "10-14";

  worksheet.mergeCells("AE7:AE8");
  const ae7 = worksheet.getCell("AE7");
  ae7.alignment = { vertical: "middle", horizontal: "center" };
  ae7.value = ages_15_19;

  worksheet.mergeCells("AF7:AF8");
  const af7 = worksheet.getCell("AF7");
  af7.alignment = { vertical: "middle", horizontal: "center" };
  af7.value = ages_20_24;

  worksheet.mergeCells("AG7:AG8");
  const ag7 = worksheet.getCell("AG7");
  ag7.alignment = { vertical: "middle", horizontal: "center" };
  ag7.value = ages_25_29;

  worksheet.mergeCells("AH7:AH8");
  const ah7 = worksheet.getCell("AH7");
  ah7.alignment = { vertical: "middle", horizontal: "center" };
  ah7.value = "Subtotal";

  worksheet.mergeCells("AI7:AI8");
  const ai7 = worksheet.getCell("AI7");
  ai7.alignment = { vertical: "middle", horizontal: "center" };
  ai7.value = "10-14";

  worksheet.mergeCells("AJ7:AJ8");
  const aj7 = worksheet.getCell("AJ7");
  aj7.alignment = { vertical: "middle", horizontal: "center" };
  aj7.value = ages_15_19;

  worksheet.mergeCells("AK7:AK8");
  const ak7 = worksheet.getCell("AK7");
  ak7.alignment = { vertical: "middle", horizontal: "center" };
  ak7.value = ages_20_24;

  worksheet.mergeCells("AL7:AL8");
  const al7 = worksheet.getCell("AL7");
  al7.alignment = { vertical: "middle", horizontal: "center" };
  al7.value = ages_25_29;

  worksheet.mergeCells("AM7:AM8");
  const am7 = worksheet.getCell("AM7");
  am7.alignment = { vertical: "middle", horizontal: "center" };
  am7.value = "Subtotal";

  worksheet.mergeCells("AN7:AN8");
  const an7 = worksheet.getCell("AN7");
  an7.alignment = { vertical: "middle", horizontal: "center" };
  an7.value = "10-14";

  worksheet.mergeCells("AO7:AO8");
  const ao7 = worksheet.getCell("AO7");
  ao7.alignment = { vertical: "middle", horizontal: "center" };
  ao7.value = ages_15_19;

  worksheet.mergeCells("AP7:AP8");
  const ap7 = worksheet.getCell("AP7");
  ap7.alignment = { vertical: "middle", horizontal: "center" };
  ap7.value = ages_20_24;

  worksheet.mergeCells("AQ7:AQ8");
  const aq7 = worksheet.getCell("AQ7");
  aq7.alignment = { vertical: "middle", horizontal: "center" };
  aq7.value = ages_25_29;

  worksheet.mergeCells("AR7:AR8");
  const ar7 = worksheet.getCell("AR7");
  ar7.alignment = { vertical: "middle", horizontal: "center" };
  ar7.value = "Subtotal";

  worksheet.mergeCells("AS7:AS8");
  const as7 = worksheet.getCell("AS7");
  as7.alignment = { vertical: "middle", horizontal: "center" };
  as7.value = "10-14";

  worksheet.mergeCells("AT7:AT8");
  const at7 = worksheet.getCell("AT7");
  at7.alignment = { vertical: "middle", horizontal: "center" };
  at7.value = ages_15_19;

  worksheet.mergeCells("AU7:AU8");
  const au7 = worksheet.getCell("AU7");
  au7.alignment = { vertical: "middle", horizontal: "center" };
  au7.value = ages_20_24;

  worksheet.mergeCells("AV7:AV8");
  const av7 = worksheet.getCell("AV7");
  av7.alignment = { vertical: "middle", horizontal: "center" };
  av7.value = ages_25_29;

  worksheet.mergeCells("AW7:AW8");
  const aw7 = worksheet.getCell("AW7");
  aw7.alignment = { vertical: "middle", horizontal: "center" };
  aw7.value = "Subtotal";

  worksheet.mergeCells("AX7:AX8");
  const ax7 = worksheet.getCell("AX7");
  ax7.alignment = { vertical: "middle", horizontal: "center" };
  ax7.value = "10-14";

  worksheet.mergeCells("AY7:AY8");
  const ay7 = worksheet.getCell("AY7");
  ay7.alignment = { vertical: "middle", horizontal: "center" };
  ay7.value = ages_15_19;

  worksheet.mergeCells("AZ7:AZ8");
  const az7 = worksheet.getCell("AZ7");
  az7.alignment = { vertical: "middle", horizontal: "center" };
  az7.value = ages_20_24;

  worksheet.mergeCells("BA7:BA8");
  const ba7 = worksheet.getCell("BA7");
  ba7.alignment = { vertical: "middle", horizontal: "center" };
  ba7.value = ages_25_29;

  worksheet.mergeCells("BB7:BB8");
  const bb7 = worksheet.getCell("BB7");
  bb7.alignment = { vertical: "middle", horizontal: "center" };
  bb7.value = "Subtotal";

  worksheet.mergeCells("BC7:BC8");
  const bc7 = worksheet.getCell("BC7");
  bc7.alignment = { vertical: "middle", horizontal: "center" };
  bc7.value = "10-14";

  worksheet.mergeCells("BD7:BD8");
  const bd7 = worksheet.getCell("BD7");
  bd7.alignment = { vertical: "middle", horizontal: "center" };
  bd7.value = ages_15_19;

  worksheet.mergeCells("BE7:BE8");
  const be7 = worksheet.getCell("BE7");
  be7.alignment = { vertical: "middle", horizontal: "center" };
  be7.value = ages_20_24;

  worksheet.mergeCells("BF7:BF8");
  const bf7 = worksheet.getCell("BF7");
  bf7.alignment = { vertical: "middle", horizontal: "center" };
  bf7.value = ages_25_29;

  worksheet.mergeCells("BG7:BG8");
  const bg7 = worksheet.getCell("BG7");
  bg7.alignment = { vertical: "middle", horizontal: "center" };
  bg7.value = "Subtotal";

  worksheet.mergeCells("BH7:BH8");
  const bh7 = worksheet.getCell("BH7");
  bh7.alignment = { vertical: "middle", horizontal: "center" };
  bh7.value = "10-14";

  worksheet.mergeCells("BI7:BI8");
  const bi7 = worksheet.getCell("BI7");
  bi7.alignment = { vertical: "middle", horizontal: "center" };
  bi7.value = ages_15_19;

  worksheet.mergeCells("BJ7:BJ8");
  const bj7 = worksheet.getCell("BJ7");
  bj7.alignment = { vertical: "middle", horizontal: "center" };
  bj7.value = ages_20_24;

  worksheet.mergeCells("BK7:BK8");
  const bk7 = worksheet.getCell("BK7");
  bk7.alignment = { vertical: "middle", horizontal: "center" };
  bk7.value = ages_25_29;

  worksheet.mergeCells("BL7:BL8");
  const bl7 = worksheet.getCell("BL7");
  bl7.alignment = { vertical: "middle", horizontal: "center" };
  bl7.value = "Subtotal";

  worksheet.mergeCells("BM7:BM8");
  const bm7 = worksheet.getCell("BM7");
  bm7.alignment = { vertical: "middle", horizontal: "center" };
  bm7.value = "10-14";

  worksheet.mergeCells("BN7:BN8");
  const bn7 = worksheet.getCell("BN7");
  bn7.alignment = { vertical: "middle", horizontal: "center" };
  bn7.value = ages_15_19;

  worksheet.mergeCells("BO7:BO8");
  const bo7 = worksheet.getCell("BO7");
  bo7.alignment = { vertical: "middle", horizontal: "center" };
  bo7.value = ages_20_24;

  worksheet.mergeCells("BP7:BP8");
  const bp7 = worksheet.getCell("BP7");
  bp7.alignment = { vertical: "middle", horizontal: "center" };
  bp7.value = ages_25_29;

  worksheet.mergeCells("BQ7:BQ8");
  const bq7 = worksheet.getCell("BQ7");
  bq7.alignment = { vertical: "middle", horizontal: "center" };
  bq7.value = "Subtotal";

  worksheet.mergeCells("BR7:BR8");
  const br7 = worksheet.getCell("BR7");
  br7.alignment = { vertical: "middle", horizontal: "center" };
  br7.value = "10-14";

  worksheet.mergeCells("BS7:BS8");
  const bs7 = worksheet.getCell("BS7");
  bs7.alignment = { vertical: "middle", horizontal: "center" };
  bs7.value = ages_15_19;

  worksheet.mergeCells("BT7:BT8");
  const bt7 = worksheet.getCell("BT7");
  bt7.alignment = { vertical: "middle", horizontal: "center" };
  bt7.value = ages_20_24;

  worksheet.mergeCells("BU7:BU8");
  const bu7 = worksheet.getCell("BU7");
  bu7.alignment = { vertical: "middle", horizontal: "center" };
  bu7.value = ages_25_29;

  worksheet.mergeCells("BV7:BV8");
  const bv7 = worksheet.getCell("BV7");
  bv7.alignment = { vertical: "middle", horizontal: "center" };
  bv7.value = "Subtotal";

  worksheet.mergeCells("BW7:BW8");
  const bw7 = worksheet.getCell("BW7");
  bw7.alignment = { vertical: "middle", horizontal: "center" };
  bw7.value = "10-14";

  worksheet.mergeCells("BX7:BX8");
  const bx7 = worksheet.getCell("BX7");
  bx7.alignment = { vertical: "middle", horizontal: "center" };
  bx7.value = ages_15_19;

  worksheet.mergeCells("BY7:BY8");
  const by7 = worksheet.getCell("BY7");
  by7.alignment = { vertical: "middle", horizontal: "center" };
  by7.value = ages_20_24;

  worksheet.mergeCells("BZ7:BZ8");
  const bz7 = worksheet.getCell("BZ7");
  bz7.alignment = { vertical: "middle", horizontal: "center" };
  bz7.value = ages_25_29;

  worksheet.mergeCells("CA7:CA8");
  const ca7 = worksheet.getCell("CA7");
  ca7.alignment = { vertical: "middle", horizontal: "center" };
  ca7.value = "Subtotal";

  worksheet.mergeCells("CB7:CB8");
  const cb7 = worksheet.getCell("CB7");
  cb7.alignment = { vertical: "middle", horizontal: "center" };
  cb7.value = "10-14";

  worksheet.mergeCells("CC7:CC8");
  const cc7 = worksheet.getCell("CC7");
  cc7.alignment = { vertical: "middle", horizontal: "center" };
  cc7.value = ages_15_19;

  worksheet.mergeCells("CD7:CD8");
  const cd7 = worksheet.getCell("CD7");
  cd7.alignment = { vertical: "middle", horizontal: "center" };
  cd7.value = ages_20_24;

  worksheet.mergeCells("CE7:CE8");
  const ce7 = worksheet.getCell("CE7");
  ce7.alignment = { vertical: "middle", horizontal: "center" };
  ce7.value = ages_25_29;

  worksheet.mergeCells("CF7:CF8");
  const cf7 = worksheet.getCell("CF7");
  cf7.alignment = { vertical: "middle", horizontal: "center" };
  cf7.value = "Subtotal";

  const findByEnrollmentTime = (byAge, enrollmentTime) => {
    if ((enrollmentTime = months_0_6)) {
      return "" + byAge.value[months_0_6];
    } else if (enrollmentTime == months_7_12) {
      return "" + byAge.value[months_7_12];
    } else if (enrollmentTime == months_13_24) {
      return "" + byAge.value[months_13_24];
    } else if (enrollmentTime == months_25_plus) {
      return "" + byAge.value[months_25_plus];
    }
  };

  const completePrimaryServiceNoAditional = (
    enrollmentTime: any,
    param: any
  ) => {
    const arrTotals = Object.keys(completedOnlyPrimaryPackage).map((key) => ({
      key,
      value: completedOnlyPrimaryPackage[key],
    }));
    let resultTotal;

    if (param == ages_10_14) {
      const benefByAges = arrTotals.filter((item) => item.key === ages_10_14);
      resultTotal = findByEnrollmentTime(benefByAges[0], enrollmentTime);
    } else if (param == ages_15_19) {
      const benefByAges = arrTotals.filter((item) => item.key === ages_15_19);
      resultTotal = findByEnrollmentTime(benefByAges[0], enrollmentTime);
    } else if (param == ages_20_24) {
      const benefByAges = arrTotals.filter((item) => item.key === ages_20_24);
      resultTotal = findByEnrollmentTime(benefByAges[0], enrollmentTime);
    } else if (param == ages_25_29) {
      const benefByAges = arrTotals.filter((item) => item.key === ages_25_29);
      resultTotal = findByEnrollmentTime(benefByAges[0], enrollmentTime);
    }

    return resultTotal;
  };

  const completePrimaryAndAtleastOneSecondary = (
    enrollmentTime: any,
    param: any
  ) => {
    const arrTotals = Object.keys(
      completedPrimaryPackageAndSecondaryService
    ).map((key) => ({
      key,
      value: completedPrimaryPackageAndSecondaryService[key],
    }));
    let resultTotal;

    if (param == ages_10_14) {
      const benefByAges = arrTotals.filter((item) => item.key === ages_10_14);
      resultTotal = findByEnrollmentTime(benefByAges[0], enrollmentTime);
    } else if (param == ages_15_19) {
      const benefByAges = arrTotals.filter((item) => item.key === ages_15_19);
      resultTotal = findByEnrollmentTime(benefByAges[0], enrollmentTime);
    } else if (param == ages_20_24) {
      const benefByAges = arrTotals.filter((item) => item.key === ages_20_24);
      resultTotal = findByEnrollmentTime(benefByAges[0], enrollmentTime);
    } else if (param == ages_25_29) {
      const benefByAges = arrTotals.filter((item) => item.key === ages_25_29);
      resultTotal = findByEnrollmentTime(benefByAges[0], enrollmentTime);
    }

    return resultTotal;
  };

  const completeAtLeastOnePrimaryServiceNotFull = (
    enrollmentTime: any,
    param: any
  ) => {
    const arrTotals = Object.keys(completeAtLeastOnePrimaryService).map(
      (key) => ({
        key,
        value: completeAtLeastOnePrimaryService[key],
      })
    );
    let resultTotal;

    if (param == ages_10_14) {
      const benefByAges = arrTotals.filter((item) => item.key === ages_10_14);
      resultTotal = findByEnrollmentTime(benefByAges[0], enrollmentTime);
    } else if (param == ages_15_19) {
      const benefByAges = arrTotals.filter((item) => item.key === ages_15_19);
      resultTotal = findByEnrollmentTime(benefByAges[0], enrollmentTime);
    } else if (param == ages_20_24) {
      const benefByAges = arrTotals.filter((item) => item.key === ages_20_24);
      resultTotal = findByEnrollmentTime(benefByAges[0], enrollmentTime);
    } else if (param == ages_25_29) {
      const benefByAges = arrTotals.filter((item) => item.key === ages_25_29);
      resultTotal = findByEnrollmentTime(benefByAges[0], enrollmentTime);
    }

    return resultTotal;
  };

  const startedServiceNotYetCompleted = (enrollmentTime: any, param: any) => {
    const arrTotals = Object.keys(startedServiceDidNotComplete).map((key) => ({
      key,
      value: startedServiceDidNotComplete[key],
    }));
    let resultTotal;

    if (param == ages_10_14) {
      const benefByAges = arrTotals.filter((item) => item.key === ages_10_14);
      resultTotal = findByEnrollmentTime(benefByAges[0], enrollmentTime);
    } else if (param == ages_15_19) {
      const benefByAges = arrTotals.filter((item) => item.key === ages_15_19);
      resultTotal = findByEnrollmentTime(benefByAges[0], enrollmentTime);
    } else if (param == ages_20_24) {
      const benefByAges = arrTotals.filter((item) => item.key === ages_20_24);
      resultTotal = findByEnrollmentTime(benefByAges[0], enrollmentTime);
    } else if (param == ages_25_29) {
      const benefByAges = arrTotals.filter((item) => item.key === ages_25_29);
      resultTotal = findByEnrollmentTime(benefByAges[0], enrollmentTime);
    }

    return resultTotal;
  };

  const violencePreventionServiceType = () => {
    return completedViolenceService.total;
  };
  const educationSupportServiceType = () => {
    return hadSchoolAllowance.total;
  };
  const comprehensiveEconomicStrenghtening = () => {
    return completedSocialEconomicApproaches.total;
  };

  const getDistrictNameById = (id) => {
    const result = districts.filter((item) => item.id == id);
    return result[0];
  };
  const dataCheck = () => {};

  const values: any = [];

  values[1] =
    moment(startDate).format("YYYY-MM-DD") +
    " - " +
    moment(endDate).format("YYYY-MM-DD");
  values[2] = getDistrictNameById(7).province.name;
  values[3] = getDistrictNameById(7).name;

  /** Beneficiaries that have fully completed the DREAMS primary package of services/interventions but no additional services/interventions */
  let cell = 5;
  values[cell] = completePrimaryServiceNoAditional(months_0_6, ages_10_14);
  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_0_6, ages_15_19);
  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_0_6, ages_20_24);
  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_0_6, ages_25_29);
  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_0_6, subtotal);

  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_7_12, ages_10_14);
  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_7_12, ages_15_19);
  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_7_12, ages_20_24);
  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_7_12, ages_25_29);
  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_7_12, subtotal);

  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_13_24, ages_10_14);
  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_13_24, ages_15_19);
  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_13_24, ages_20_24);
  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_13_24, ages_25_29);
  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_13_24, subtotal);

  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_25_plus, ages_10_14);
  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_25_plus, ages_15_19);
  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_25_plus, ages_20_24);
  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_25_plus, ages_25_29);
  cell = cell + 1;
  values[cell] = completePrimaryServiceNoAditional(months_25_plus, subtotal);

  /* Beneficiaries that have fully completed the DREAMS primary package of services/interventions AND at least one secondary service/intervention */
  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(months_0_6, ages_10_14);
  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(months_0_6, ages_15_19);
  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(months_0_6, ages_20_24);
  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(months_0_6, ages_25_29);
  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(months_0_6, subtotal);

  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(months_7_12, ages_10_14);
  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(months_7_12, ages_15_19);
  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(months_7_12, ages_20_24);
  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(months_7_12, ages_25_29);
  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(months_7_12, subtotal);

  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(
    months_13_24,
    ages_10_14
  );
  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(
    months_13_24,
    ages_15_19
  );
  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(
    months_13_24,
    ages_20_24
  );
  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(
    months_13_24,
    ages_25_29
  );
  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(months_13_24, subtotal);

  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(
    months_25_plus,
    ages_10_14
  );
  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(
    months_25_plus,
    ages_15_19
  );
  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(
    months_25_plus,
    ages_20_24
  );
  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(
    months_25_plus,
    ages_25_29
  );
  cell = cell + 1;
  values[cell] = completePrimaryAndAtleastOneSecondary(
    months_25_plus,
    subtotal
  );

  /* Beneficiaries that have completed at least one DREAMS service/intervention but not the full primary package */
  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_0_6,
    ages_10_14
  );
  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_0_6,
    ages_15_19
  );
  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_0_6,
    ages_20_24
  );
  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_0_6,
    ages_25_29
  );
  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(months_0_6, subtotal);

  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_7_12,
    ages_10_14
  );
  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_7_12,
    ages_15_19
  );
  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_7_12,
    ages_20_24
  );
  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_7_12,
    ages_25_29
  );
  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(months_7_12, subtotal);

  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_13_24,
    ages_10_14
  );
  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_13_24,
    ages_15_19
  );
  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_13_24,
    ages_20_24
  );
  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_13_24,
    ages_25_29
  );
  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_13_24,
    subtotal
  );

  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_25_plus,
    ages_10_14
  );
  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_25_plus,
    ages_15_19
  );
  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_25_plus,
    ages_20_24
  );
  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_25_plus,
    ages_25_29
  );
  cell = cell + 1;
  values[cell] = completeAtLeastOnePrimaryServiceNotFull(
    months_25_plus,
    subtotal
  );

  /* Beneficiaries that have started a DREAMS service/intervention but have not yet completed it */
  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_0_6, ages_10_14);
  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_0_6, ages_15_19);
  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_0_6, ages_20_24);
  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_0_6, ages_25_29);
  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_0_6, subtotal);

  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_7_12, ages_10_14);
  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_7_12, ages_15_19);
  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_7_12, ages_20_24);
  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_7_12, ages_25_29);
  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_7_12, subtotal);

  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_13_24, ages_10_14);
  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_13_24, ages_15_19);
  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_13_24, ages_20_24);
  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_13_24, ages_25_29);
  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_13_24, subtotal);

  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_25_plus, ages_10_14);
  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_25_plus, ages_15_19);
  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_25_plus, ages_20_24);
  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_25_plus, ages_25_29);
  cell = cell + 1;
  values[cell] = startedServiceNotYetCompleted(months_25_plus, subtotal);

  cell = cell + 1;
  values[cell] = violencePreventionServiceType();
  cell = cell + 1;
  values[cell] = educationSupportServiceType();
  cell = cell + 1;
  values[cell] = comprehensiveEconomicStrenghtening();
  cell = cell + 1;
  values[cell] = dataCheck();

  worksheet.addRow(values);

  workbook.xlsx.writeBuffer().then(function (buffer) {
    // done
    // console.log(workbook.xlsx);
    // console.log(buffer);

    const blob = new Blob([buffer], { type: "applicationi/xlsx" });
    saveAs(blob, "PEPFAR_MER_2.6_AGYW_PREV.xlsx");
  });
}
