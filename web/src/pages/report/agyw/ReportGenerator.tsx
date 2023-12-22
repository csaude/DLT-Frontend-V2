import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";
import { agywPrevQuery } from "../../../utils/report";

export async function generateXlsReport(
  currentUserName: string,
  districtsIds: any[],
  startDate: moment.MomentInput,
  endDate: moment.MomentInput,
  districts: any[]
) {
  const responseData = await agywPrevQuery(districtsIds, startDate, endDate);

  const ages_10_14 = "9-14";
  const ages_15_19 = "15-19";
  const ages_20_24 = "20-24";
  const ages_25_29 = "25-29";
  const subtotal = "Subtotal";

  const enrollmentTime_0_6 = "0-6";
  const enrollmentTime_7_12 = "7-12";
  const enrollmentTime_13_24 = "13-24";
  const enrollmentTime_25_plus = "25+";

  const formatCell = (cell: ExcelJS.Cell, color: string) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: color },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  };

  const workbook = new ExcelJS.Workbook();

  workbook.creator = currentUserName;
  workbook.lastModifiedBy = currentUserName;
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();
  workbook.properties.date1904 = true;
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
  const worksheet = workbook.addWorksheet("PEPFAR_MER_2.7_AGYW");

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
  formatCell(d1, "8B008B");
  d1.alignment = { vertical: "middle", horizontal: "center" };
  d1.value =
    "AGYW_PREV: Number of active DREAMS beneficiaries that have started or completed any DREAMS service/intervention";

  /***Total  */
  worksheet.mergeCells("D3:D8");
  const d3 = worksheet.getCell("D3");
  formatCell(d3, "8B008B");
  d3.alignment = { vertical: "middle", horizontal: "center" };
  d3.value = "Total";

  /** linha 3 */
  worksheet.mergeCells("E3:X3");
  const x3 = worksheet.getCell("X3");
  formatCell(x3, "8B008B");
  x3.alignment = { vertical: "middle", horizontal: "center" };
  x3.value =
    "Beneficiaries that have fully completed the DREAMS primary package of services/interventions but no additional services/interventions";

  worksheet.mergeCells("Y3:AR3");
  const y3 = worksheet.getCell("Y3");
  formatCell(y3, "8B008B");
  y3.alignment = { vertical: "middle", horizontal: "center" };
  y3.value =
    "Beneficiaries that have fully completed the DREAMS primary package of services/interventions AND at least one secondary service/intervention";

  worksheet.mergeCells("AS3:BL3");
  const as3 = worksheet.getCell("AS3");
  formatCell(as3, "8B008B");
  as3.alignment = { vertical: "middle", horizontal: "center" };
  as3.value =
    "Beneficiaries that have completed at least one DREAMS service/intervention but not the full primary package";

  worksheet.mergeCells("BM3:CF3");
  const bm3 = worksheet.getCell("BM3");
  formatCell(bm3, "8B008B");
  bm3.alignment = { vertical: "middle", horizontal: "center" };
  bm3.value =
    "Beneficiaries that have started a DREAMS service/intervention but have not yet completed it";

  /** linha 4 */
  worksheet.mergeCells("E4:X4");
  const e4 = worksheet.getCell("E4");
  formatCell(e4, "D3D3D3");
  e4.alignment = { vertical: "middle", horizontal: "center" };
  e4.value = "Enrollment Time / Age";

  worksheet.mergeCells("Y4:AR4");
  const y4 = worksheet.getCell("Y4");
  formatCell(y4, "D3D3D3");
  y4.alignment = { vertical: "middle", horizontal: "center" };
  y4.value = "Enrollment Time / Age";

  worksheet.mergeCells("AS4:BL4");
  const as4 = worksheet.getCell("AS4");
  formatCell(as4, "D3D3D3");
  as4.alignment = { vertical: "middle", horizontal: "center" };
  as4.value = "Enrollment Time / Age";

  worksheet.mergeCells("BM4:CF4");
  const cf4 = worksheet.getCell("CF4");
  formatCell(cf4, "D3D3D3");
  cf4.alignment = { vertical: "middle", horizontal: "center" };
  cf4.value = "Enrollment Time / Age";

  /** linhas 5 e 6 */
  worksheet.mergeCells("E5:I6");
  const es5 = worksheet.getCell("E5");
  formatCell(es5, "D3D3D3");
  es5.alignment = { vertical: "middle", horizontal: "center" };
  es5.value = enrollmentTime_0_6;

  worksheet.mergeCells("J5:N6");
  const j5 = worksheet.getCell("J5");
  formatCell(j5, "D3D3D3");
  j5.alignment = { vertical: "middle", horizontal: "center" };
  j5.value = enrollmentTime_7_12;

  worksheet.mergeCells("O5:S6");
  const o5 = worksheet.getCell("O5");
  formatCell(o5, "D3D3D3");
  o5.alignment = { vertical: "middle", horizontal: "center" };
  o5.value = enrollmentTime_13_24;

  worksheet.mergeCells("T5:X6");
  const t5 = worksheet.getCell("T5");
  formatCell(t5, "D3D3D3");
  t5.alignment = { vertical: "middle", horizontal: "center" };
  t5.value = "25+ months";

  worksheet.mergeCells("Y5:AC6");
  const y5 = worksheet.getCell("Y5");
  formatCell(y5, "D3D3D3");
  y5.alignment = { vertical: "middle", horizontal: "center" };
  y5.value = enrollmentTime_0_6;

  worksheet.mergeCells("AD5:AH6");
  const ad5 = worksheet.getCell("AD5");
  formatCell(ad5, "D3D3D3");
  ad5.alignment = { vertical: "middle", horizontal: "center" };
  ad5.value = enrollmentTime_7_12;

  worksheet.mergeCells("AI5:AM6");
  const ai5 = worksheet.getCell("AI5");
  formatCell(ai5, "D3D3D3");
  ai5.alignment = { vertical: "middle", horizontal: "center" };
  ai5.value = enrollmentTime_13_24;

  worksheet.mergeCells("AN5:AR6");
  const an5 = worksheet.getCell("AN5");
  formatCell(an5, "D3D3D3");
  an5.alignment = { vertical: "middle", horizontal: "center" };
  an5.value = "25+ months";

  worksheet.mergeCells("AS5:AW6");
  const aw5 = worksheet.getCell("AS5");
  formatCell(aw5, "D3D3D3");
  aw5.alignment = { vertical: "middle", horizontal: "center" };
  aw5.value = enrollmentTime_0_6;

  worksheet.mergeCells("AX5:BB6");
  const ax5 = worksheet.getCell("AX5");
  formatCell(ax5, "D3D3D3");
  ax5.alignment = { vertical: "middle", horizontal: "center" };
  aw5.value = enrollmentTime_0_6;
  ax5.value = enrollmentTime_7_12;

  worksheet.mergeCells("BC5:BG6");
  const bc5 = worksheet.getCell("BC5");
  formatCell(bc5, "D3D3D3");
  bc5.alignment = { vertical: "middle", horizontal: "center" };
  bc5.value = enrollmentTime_13_24;

  worksheet.mergeCells("BH5:BL6");
  const bh5 = worksheet.getCell("BH5");
  formatCell(bh5, "D3D3D3");
  bh5.alignment = { vertical: "middle", horizontal: "center" };
  bh5.value = "25+ months";

  worksheet.mergeCells("BM5:BQ6");
  const bm5 = worksheet.getCell("BM5");
  formatCell(bm5, "D3D3D3");
  bm5.alignment = { vertical: "middle", horizontal: "center" };
  bm5.value = enrollmentTime_0_6;

  worksheet.mergeCells("BR5:BV6");
  const br5 = worksheet.getCell("BR5");
  formatCell(br5, "D3D3D3");
  br5.alignment = { vertical: "middle", horizontal: "center" };
  br5.value = enrollmentTime_7_12;

  worksheet.mergeCells("BW5:CA6");
  const bw5 = worksheet.getCell("BW5");
  formatCell(bw5, "D3D3D3");
  bw5.alignment = { vertical: "middle", horizontal: "center" };
  bw5.value = enrollmentTime_13_24;

  worksheet.mergeCells("CB5:CF6");
  const cb5 = worksheet.getCell("CB5");
  formatCell(cb5, "D3D3D3");
  cb5.alignment = { vertical: "middle", horizontal: "center" };
  cb5.value = "25+ months";

  /***Violence Prevention Service Type  */
  worksheet.mergeCells("CG3:CG8");
  const cg3 = worksheet.getCell("CG3");
  formatCell(cg3, "FF69B4");
  cg3.alignment = { vertical: "middle", horizontal: "center" };
  cg3.value = "Violence Prevention Service Type";

  worksheet.mergeCells("CH3:CH8");
  const ch3 = worksheet.getCell("CH3");
  formatCell(ch3, "FF69B4");
  ch3.alignment = { vertical: "middle", horizontal: "center" };
  ch3.value = "Education Support Service Type";

  worksheet.mergeCells("CI3:CI8");
  const ci3 = worksheet.getCell("CI3");
  formatCell(ci3, "FF69B4");
  ci3.alignment = { vertical: "middle", horizontal: "center" };
  ci3.value = "Comprehensive Economic Strenghtening";

  worksheet.mergeCells("CJ3:CJ8");
  const cj3 = worksheet.getCell("CJ3");
  formatCell(cj3, "FFFF00");
  cj3.alignment = { vertical: "middle", horizontal: "center" };
  cj3.value = "Data Check";

  /** Linhas 7 e 8 */
  worksheet.mergeCells("E7:E8");
  const e7 = worksheet.getCell("E7");
  formatCell(e7, "E4A0F7");
  e7.alignment = { vertical: "middle", horizontal: "center" };
  e7.value = "10-14";

  worksheet.mergeCells("F7:F8");
  const f7 = worksheet.getCell("F7");
  formatCell(f7, "E4A0F7");
  f7.alignment = { vertical: "middle", horizontal: "center" };
  f7.value = ages_15_19;

  worksheet.mergeCells("G7:G8");
  const g7 = worksheet.getCell("G7");
  formatCell(g7, "E4A0F7");
  g7.alignment = { vertical: "middle", horizontal: "center" };
  g7.value = ages_20_24;

  worksheet.mergeCells("H7:H8");
  const h7 = worksheet.getCell("H7");
  formatCell(h7, "E4A0F7");
  h7.alignment = { vertical: "middle", horizontal: "center" };
  h7.value = ages_25_29;

  worksheet.mergeCells("I7:I8");
  const i7 = worksheet.getCell("I7");
  formatCell(i7, "FF69B4");
  i7.alignment = { vertical: "middle", horizontal: "center" };
  i7.value = "Subtotal";

  worksheet.mergeCells("J7:J8");
  const j7 = worksheet.getCell("J7");
  formatCell(j7, "E4A0F7");
  j7.alignment = { vertical: "middle", horizontal: "center" };
  j7.value = "10-14";

  worksheet.mergeCells("K7:K8");
  const k7 = worksheet.getCell("K7");
  formatCell(k7, "E4A0F7");
  k7.alignment = { vertical: "middle", horizontal: "center" };
  k7.value = ages_15_19;

  worksheet.mergeCells("L7:L8");
  const l7 = worksheet.getCell("L7");
  formatCell(l7, "E4A0F7");
  l7.alignment = { vertical: "middle", horizontal: "center" };
  l7.value = ages_20_24;

  worksheet.mergeCells("M7:M8");
  const m7 = worksheet.getCell("M7");
  formatCell(m7, "E4A0F7");
  m7.alignment = { vertical: "middle", horizontal: "center" };
  m7.value = ages_25_29;

  worksheet.mergeCells("N7:N8");
  const n7 = worksheet.getCell("N7");
  formatCell(n7, "FF69B4");
  n7.alignment = { vertical: "middle", horizontal: "center" };
  n7.value = "Subtotal";

  worksheet.mergeCells("O7:O8");
  const o7 = worksheet.getCell("O7");
  formatCell(o7, "E4A0F7");
  o7.alignment = { vertical: "middle", horizontal: "center" };
  o7.value = "10-14";

  worksheet.mergeCells("P7:P8");
  const p7 = worksheet.getCell("P7");
  formatCell(p7, "E4A0F7");
  p7.alignment = { vertical: "middle", horizontal: "center" };
  p7.value = ages_15_19;

  worksheet.mergeCells("Q7:Q8");
  const q7 = worksheet.getCell("Q7");
  formatCell(q7, "E4A0F7");
  q7.alignment = { vertical: "middle", horizontal: "center" };
  q7.value = ages_20_24;

  worksheet.mergeCells("R7:R8");
  const r7 = worksheet.getCell("R7");
  formatCell(r7, "E4A0F7");
  r7.alignment = { vertical: "middle", horizontal: "center" };
  r7.value = ages_25_29;

  worksheet.mergeCells("S7:S8");
  const s7 = worksheet.getCell("S7");
  formatCell(s7, "FF69B4");
  s7.alignment = { vertical: "middle", horizontal: "center" };
  s7.value = "Subtotal";

  worksheet.mergeCells("T7:T8");
  const t7 = worksheet.getCell("T7");
  formatCell(t7, "E4A0F7");
  t7.alignment = { vertical: "middle", horizontal: "center" };
  t7.value = "10-14";

  worksheet.mergeCells("U7:U8");
  const u7 = worksheet.getCell("U7");
  formatCell(u7, "E4A0F7");
  u7.alignment = { vertical: "middle", horizontal: "center" };
  u7.value = ages_15_19;

  worksheet.mergeCells("V7:V8");
  const v7 = worksheet.getCell("V7");
  formatCell(v7, "E4A0F7");
  v7.alignment = { vertical: "middle", horizontal: "center" };
  v7.value = ages_20_24;

  worksheet.mergeCells("W7:W8");
  const w7 = worksheet.getCell("W7");
  formatCell(w7, "E4A0F7");
  w7.alignment = { vertical: "middle", horizontal: "center" };
  w7.value = ages_25_29;

  worksheet.mergeCells("X7:X8");
  const x7 = worksheet.getCell("X7");
  formatCell(x7, "FF69B4");
  x7.alignment = { vertical: "middle", horizontal: "center" };
  x7.value = "Subtotal";

  worksheet.mergeCells("Y7:Y8");
  const y7 = worksheet.getCell("Y7");
  formatCell(y7, "E4A0F7");
  y7.alignment = { vertical: "middle", horizontal: "center" };
  y7.value = "10-14";

  worksheet.mergeCells("Z7:Z8");
  const z7 = worksheet.getCell("Z7");
  formatCell(z7, "E4A0F7");
  z7.alignment = { vertical: "middle", horizontal: "center" };
  z7.value = ages_15_19;

  worksheet.mergeCells("AA7:AA8");
  const aa7 = worksheet.getCell("AA7");
  formatCell(aa7, "E4A0F7");
  aa7.alignment = { vertical: "middle", horizontal: "center" };
  aa7.value = ages_20_24;

  worksheet.mergeCells("AB7:AB8");
  const ab7 = worksheet.getCell("AB7");
  formatCell(ab7, "E4A0F7");
  ab7.alignment = { vertical: "middle", horizontal: "center" };
  ab7.value = ages_25_29;

  worksheet.mergeCells("AC7:AC8");
  const ac7 = worksheet.getCell("AC7");
  formatCell(ac7, "FF69B4");
  ac7.alignment = { vertical: "middle", horizontal: "center" };
  ac7.value = "Subtotal";

  worksheet.mergeCells("AD7:AD8");
  const ad7 = worksheet.getCell("AD7");
  formatCell(ad7, "E4A0F7");
  ad7.alignment = { vertical: "middle", horizontal: "center" };
  ad7.value = "10-14";

  worksheet.mergeCells("AE7:AE8");
  const ae7 = worksheet.getCell("AE7");
  formatCell(ae7, "E4A0F7");
  ae7.alignment = { vertical: "middle", horizontal: "center" };
  ae7.value = ages_15_19;

  worksheet.mergeCells("AF7:AF8");
  const af7 = worksheet.getCell("AF7");
  formatCell(af7, "E4A0F7");
  af7.alignment = { vertical: "middle", horizontal: "center" };
  af7.value = ages_20_24;

  worksheet.mergeCells("AG7:AG8");
  const ag7 = worksheet.getCell("AG7");
  formatCell(ag7, "E4A0F7");
  ag7.alignment = { vertical: "middle", horizontal: "center" };
  ag7.value = ages_25_29;

  worksheet.mergeCells("AH7:AH8");
  const ah7 = worksheet.getCell("AH7");
  formatCell(ah7, "FF69B4");
  ah7.alignment = { vertical: "middle", horizontal: "center" };
  ah7.value = "Subtotal";

  worksheet.mergeCells("AI7:AI8");
  const ai7 = worksheet.getCell("AI7");
  formatCell(ai7, "E4A0F7");
  ai7.alignment = { vertical: "middle", horizontal: "center" };
  ai7.value = "10-14";

  worksheet.mergeCells("AJ7:AJ8");
  const aj7 = worksheet.getCell("AJ7");
  formatCell(aj7, "E4A0F7");
  aj7.alignment = { vertical: "middle", horizontal: "center" };
  aj7.value = ages_15_19;

  worksheet.mergeCells("AK7:AK8");
  const ak7 = worksheet.getCell("AK7");
  formatCell(ak7, "E4A0F7");
  ak7.alignment = { vertical: "middle", horizontal: "center" };
  ak7.value = ages_20_24;

  worksheet.mergeCells("AL7:AL8");
  const al7 = worksheet.getCell("AL7");
  formatCell(al7, "E4A0F7");
  al7.alignment = { vertical: "middle", horizontal: "center" };
  al7.value = ages_25_29;

  worksheet.mergeCells("AM7:AM8");
  const am7 = worksheet.getCell("AM7");
  formatCell(am7, "FF69B4");
  am7.alignment = { vertical: "middle", horizontal: "center" };
  am7.value = "Subtotal";

  worksheet.mergeCells("AN7:AN8");
  const an7 = worksheet.getCell("AN7");
  formatCell(an7, "E4A0F7");
  an7.alignment = { vertical: "middle", horizontal: "center" };
  an7.value = "10-14";

  worksheet.mergeCells("AO7:AO8");
  const ao7 = worksheet.getCell("AO7");
  formatCell(ao7, "E4A0F7");
  ao7.alignment = { vertical: "middle", horizontal: "center" };
  ao7.value = ages_15_19;

  worksheet.mergeCells("AP7:AP8");
  const ap7 = worksheet.getCell("AP7");
  formatCell(ap7, "E4A0F7");
  ap7.alignment = { vertical: "middle", horizontal: "center" };
  ap7.value = ages_20_24;

  worksheet.mergeCells("AQ7:AQ8");
  const aq7 = worksheet.getCell("AQ7");
  formatCell(aq7, "E4A0F7");
  aq7.alignment = { vertical: "middle", horizontal: "center" };
  aq7.value = ages_25_29;

  worksheet.mergeCells("AR7:AR8");
  const ar7 = worksheet.getCell("AR7");
  formatCell(ar7, "FF69B4");
  ar7.alignment = { vertical: "middle", horizontal: "center" };
  ar7.value = "Subtotal";

  worksheet.mergeCells("AS7:AS8");
  const as7 = worksheet.getCell("AS7");
  formatCell(as7, "E4A0F7");
  as7.alignment = { vertical: "middle", horizontal: "center" };
  as7.value = "10-14";

  worksheet.mergeCells("AT7:AT8");
  const at7 = worksheet.getCell("AT7");
  formatCell(at7, "E4A0F7");
  at7.alignment = { vertical: "middle", horizontal: "center" };
  at7.value = ages_15_19;

  worksheet.mergeCells("AU7:AU8");
  const au7 = worksheet.getCell("AU7");
  formatCell(au7, "E4A0F7");
  au7.alignment = { vertical: "middle", horizontal: "center" };
  au7.value = ages_20_24;

  worksheet.mergeCells("AV7:AV8");
  const av7 = worksheet.getCell("AV7");
  formatCell(av7, "E4A0F7");
  av7.alignment = { vertical: "middle", horizontal: "center" };
  av7.value = ages_25_29;

  worksheet.mergeCells("AW7:AW8");
  const aw7 = worksheet.getCell("AW7");
  formatCell(aw7, "FF69B4");
  aw7.alignment = { vertical: "middle", horizontal: "center" };
  aw7.value = "Subtotal";

  worksheet.mergeCells("AX7:AX8");
  const ax7 = worksheet.getCell("AX7");
  formatCell(ax7, "E4A0F7");
  ax7.alignment = { vertical: "middle", horizontal: "center" };
  ax7.value = "10-14";

  worksheet.mergeCells("AY7:AY8");
  const ay7 = worksheet.getCell("AY7");
  formatCell(ay7, "E4A0F7");
  ay7.alignment = { vertical: "middle", horizontal: "center" };
  ay7.value = ages_15_19;

  worksheet.mergeCells("AZ7:AZ8");
  const az7 = worksheet.getCell("AZ7");
  formatCell(az7, "E4A0F7");
  az7.alignment = { vertical: "middle", horizontal: "center" };
  az7.value = ages_20_24;

  worksheet.mergeCells("BA7:BA8");
  const ba7 = worksheet.getCell("BA7");
  formatCell(ba7, "E4A0F7");
  ba7.alignment = { vertical: "middle", horizontal: "center" };
  ba7.value = ages_25_29;

  worksheet.mergeCells("BB7:BB8");
  const bb7 = worksheet.getCell("BB7");
  formatCell(bb7, "FF69B4");
  bb7.alignment = { vertical: "middle", horizontal: "center" };
  bb7.value = "Subtotal";

  worksheet.mergeCells("BC7:BC8");
  const bc7 = worksheet.getCell("BC7");
  formatCell(bc7, "E4A0F7");
  bc7.alignment = { vertical: "middle", horizontal: "center" };
  bc7.value = "10-14";

  worksheet.mergeCells("BD7:BD8");
  const bd7 = worksheet.getCell("BD7");
  formatCell(bd7, "E4A0F7");
  bd7.alignment = { vertical: "middle", horizontal: "center" };
  bd7.value = ages_15_19;

  worksheet.mergeCells("BE7:BE8");
  const be7 = worksheet.getCell("BE7");
  formatCell(be7, "E4A0F7");
  be7.alignment = { vertical: "middle", horizontal: "center" };
  be7.value = ages_20_24;

  worksheet.mergeCells("BF7:BF8");
  const bf7 = worksheet.getCell("BF7");
  formatCell(bf7, "E4A0F7");
  bf7.alignment = { vertical: "middle", horizontal: "center" };
  bf7.value = ages_25_29;

  worksheet.mergeCells("BG7:BG8");
  const bg7 = worksheet.getCell("BG7");
  formatCell(bg7, "FF69B4");
  bg7.alignment = { vertical: "middle", horizontal: "center" };
  bg7.value = "Subtotal";

  worksheet.mergeCells("BH7:BH8");
  const bh7 = worksheet.getCell("BH7");
  formatCell(bh7, "E4A0F7");
  bh7.alignment = { vertical: "middle", horizontal: "center" };
  bh7.value = "10-14";

  worksheet.mergeCells("BI7:BI8");
  const bi7 = worksheet.getCell("BI7");
  formatCell(bi7, "E4A0F7");
  bi7.alignment = { vertical: "middle", horizontal: "center" };
  bi7.value = ages_15_19;

  worksheet.mergeCells("BJ7:BJ8");
  const bj7 = worksheet.getCell("BJ7");
  formatCell(bj7, "E4A0F7");
  bj7.alignment = { vertical: "middle", horizontal: "center" };
  bj7.value = ages_20_24;

  worksheet.mergeCells("BK7:BK8");
  const bk7 = worksheet.getCell("BK7");
  formatCell(bk7, "E4A0F7");
  bk7.alignment = { vertical: "middle", horizontal: "center" };
  bk7.value = ages_25_29;

  worksheet.mergeCells("BL7:BL8");
  const bl7 = worksheet.getCell("BL7");
  formatCell(bl7, "FF69B4");
  bl7.alignment = { vertical: "middle", horizontal: "center" };
  bl7.value = "Subtotal";

  worksheet.mergeCells("BM7:BM8");
  const bm7 = worksheet.getCell("BM7");
  formatCell(bm7, "E4A0F7");
  bm7.alignment = { vertical: "middle", horizontal: "center" };
  bm7.value = "10-14";

  worksheet.mergeCells("BN7:BN8");
  const bn7 = worksheet.getCell("BN7");
  formatCell(bn7, "E4A0F7");
  bn7.alignment = { vertical: "middle", horizontal: "center" };
  bn7.value = ages_15_19;

  worksheet.mergeCells("BO7:BO8");
  const bo7 = worksheet.getCell("BO7");
  formatCell(bo7, "E4A0F7");
  bo7.alignment = { vertical: "middle", horizontal: "center" };
  bo7.value = ages_20_24;

  worksheet.mergeCells("BP7:BP8");
  const bp7 = worksheet.getCell("BP7");
  formatCell(bp7, "E4A0F7");
  bp7.alignment = { vertical: "middle", horizontal: "center" };
  bp7.value = ages_25_29;

  worksheet.mergeCells("BQ7:BQ8");
  const bq7 = worksheet.getCell("BQ7");
  formatCell(bq7, "FF69B4");
  bq7.alignment = { vertical: "middle", horizontal: "center" };
  bq7.value = "Subtotal";

  worksheet.mergeCells("BR7:BR8");
  const br7 = worksheet.getCell("BR7");
  formatCell(br7, "E4A0F7");
  br7.alignment = { vertical: "middle", horizontal: "center" };
  br7.value = "10-14";

  worksheet.mergeCells("BS7:BS8");
  const bs7 = worksheet.getCell("BS7");
  formatCell(bs7, "E4A0F7");
  bs7.alignment = { vertical: "middle", horizontal: "center" };
  bs7.value = ages_15_19;

  worksheet.mergeCells("BT7:BT8");
  const bt7 = worksheet.getCell("BT7");
  formatCell(bt7, "E4A0F7");
  bt7.alignment = { vertical: "middle", horizontal: "center" };
  bt7.value = ages_20_24;

  worksheet.mergeCells("BU7:BU8");
  const bu7 = worksheet.getCell("BU7");
  formatCell(bu7, "E4A0F7");
  bu7.alignment = { vertical: "middle", horizontal: "center" };
  bu7.value = ages_25_29;

  worksheet.mergeCells("BV7:BV8");
  const bv7 = worksheet.getCell("BV7");
  formatCell(bv7, "FF69B4");
  bv7.alignment = { vertical: "middle", horizontal: "center" };
  bv7.value = "Subtotal";

  worksheet.mergeCells("BW7:BW8");
  const bw7 = worksheet.getCell("BW7");
  formatCell(bw7, "E4A0F7");
  bw7.alignment = { vertical: "middle", horizontal: "center" };
  bw7.value = "10-14";

  worksheet.mergeCells("BX7:BX8");
  const bx7 = worksheet.getCell("BX7");
  formatCell(bx7, "E4A0F7");
  bx7.alignment = { vertical: "middle", horizontal: "center" };
  bx7.value = ages_15_19;

  worksheet.mergeCells("BY7:BY8");
  const by7 = worksheet.getCell("BY7");
  formatCell(by7, "E4A0F7");
  by7.alignment = { vertical: "middle", horizontal: "center" };
  by7.value = ages_20_24;

  worksheet.mergeCells("BZ7:BZ8");
  const bz7 = worksheet.getCell("BZ7");
  formatCell(bz7, "E4A0F7");
  bz7.alignment = { vertical: "middle", horizontal: "center" };
  bz7.value = ages_25_29;

  worksheet.mergeCells("CA7:CA8");
  const ca7 = worksheet.getCell("CA7");
  formatCell(ca7, "FF69B4");
  ca7.alignment = { vertical: "middle", horizontal: "center" };
  ca7.value = "Subtotal";

  worksheet.mergeCells("CB7:CB8");
  const cb7 = worksheet.getCell("CB7");
  formatCell(cb7, "E4A0F7");
  cb7.alignment = { vertical: "middle", horizontal: "center" };
  cb7.value = "10-14";

  worksheet.mergeCells("CC7:CC8");
  const cc7 = worksheet.getCell("CC7");
  formatCell(cc7, "E4A0F7");
  cc7.alignment = { vertical: "middle", horizontal: "center" };
  cc7.value = ages_15_19;

  worksheet.mergeCells("CD7:CD8");
  const cd7 = worksheet.getCell("CD7");
  formatCell(cd7, "E4A0F7");
  cd7.alignment = { vertical: "middle", horizontal: "center" };
  cd7.value = ages_20_24;

  worksheet.mergeCells("CE7:CE8");
  const ce7 = worksheet.getCell("CE7");
  formatCell(ce7, "E4A0F7");
  ce7.alignment = { vertical: "middle", horizontal: "center" };
  ce7.value = ages_25_29;

  worksheet.mergeCells("CF7:CF8");
  const cf7 = worksheet.getCell("CF7");
  formatCell(cf7, "FF69B4");
  cf7.alignment = { vertical: "middle", horizontal: "center" };
  cf7.value = "Subtotal";

  const findByAge = (totals: { key?: string; value: any }, age: string) => {
    if (age == ages_10_14) {
      return totals.value[ages_10_14];
    } else if (age == ages_15_19) {
      return totals.value[ages_15_19];
    } else if (age == ages_20_24) {
      return totals.value[ages_20_24];
    } else if (age == ages_25_29) {
      return totals.value[ages_25_29];
    } else if (age == subtotal) {
      return totals.value[subtotal];
    }
  };

  const getDistrictNameById = (id: any) => {
    const result = districts.filter((item: { id: any }) => item.id == id);
    return result[0];
  };
  const dataCheck = () => {
    /**Its OK */
  };

  districtsIds.map((districtsId: string | number) => {
    const completedOnlyPrimaryPackage =
      responseData[districtsId]["completed-only-primary-package"].totals;
    const completedPrimaryPackageAndSecondaryService =
      responseData[districtsId][
        "completed-primary-package-and-secondary-service"
      ].totals;
    const completeAtLeastOnePrimaryService =
      responseData[districtsId]["completed-service-not-primary-package"].totals;
    const startedServiceDidNotComplete =
      responseData[districtsId]["started-service-did-not-complete"].totals;

    const completedSocialEconomicApproaches =
      responseData[districtsId]["completed-social-economic-approaches"];
    const completedViolenceService =
      responseData[districtsId]["completed-violence-service"];
    const hadSchoolAllowance =
      responseData[districtsId]["had-school-allowance"];

    const allDisaggregationsTotal =
      responseData[districtsId]["all-disaggregations-total"].total;

    const completePrimaryServiceNoAditional = (
      enrollmentTime: any,
      param: any
    ) => {
      const arrTotals = Object.keys(completedOnlyPrimaryPackage).map((key) => ({
        key,
        value: completedOnlyPrimaryPackage[key],
      }));

      let resultTotal: string | undefined;

      if (enrollmentTime == enrollmentTime_0_6) {
        const totalsByEnroll = arrTotals.filter(
          (item) => item.key == enrollmentTime_0_6
        );
        resultTotal = findByAge(totalsByEnroll[0], param);
      } else if (enrollmentTime == enrollmentTime_7_12) {
        const totalsByEnroll = arrTotals.filter(
          (item) => item.key == enrollmentTime_7_12
        );
        resultTotal = findByAge(totalsByEnroll[0], param);
      } else if (enrollmentTime == enrollmentTime_13_24) {
        const totalsByEnroll = arrTotals.filter(
          (item) => item.key == enrollmentTime_13_24
        );
        resultTotal = findByAge(totalsByEnroll[0], param);
      } else if (enrollmentTime == enrollmentTime_25_plus) {
        const totalsByEnroll = arrTotals.filter(
          (item) => item.key == enrollmentTime_25_plus
        );
        resultTotal = findByAge(totalsByEnroll[0], param);
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
      let resultTotal: string | undefined;

      if (enrollmentTime == enrollmentTime_0_6) {
        const totalsByEnroll = arrTotals.filter(
          (item) => item.key == enrollmentTime_0_6
        );
        resultTotal = findByAge(totalsByEnroll[0], param);
      } else if (enrollmentTime == enrollmentTime_7_12) {
        const totalsByEnroll = arrTotals.filter(
          (item) => item.key == enrollmentTime_7_12
        );
        resultTotal = findByAge(totalsByEnroll[0], param);
      } else if (enrollmentTime == enrollmentTime_13_24) {
        const totalsByEnroll = arrTotals.filter(
          (item) => item.key == enrollmentTime_13_24
        );
        resultTotal = findByAge(totalsByEnroll[0], param);
      } else if (enrollmentTime == enrollmentTime_25_plus) {
        const totalsByEnroll = arrTotals.filter(
          (item) => item.key == enrollmentTime_25_plus
        );
        resultTotal = findByAge(totalsByEnroll[0], param);
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
      let resultTotal: string | undefined;

      if (enrollmentTime == enrollmentTime_0_6) {
        const totalsByEnroll = arrTotals.filter(
          (item) => item.key == enrollmentTime_0_6
        );
        resultTotal = findByAge(totalsByEnroll[0], param);
      } else if (enrollmentTime == enrollmentTime_7_12) {
        const totalsByEnroll = arrTotals.filter(
          (item) => item.key == enrollmentTime_7_12
        );
        resultTotal = findByAge(totalsByEnroll[0], param);
      } else if (enrollmentTime == enrollmentTime_13_24) {
        const totalsByEnroll = arrTotals.filter(
          (item) => item.key == enrollmentTime_13_24
        );
        resultTotal = findByAge(totalsByEnroll[0], param);
      } else if (enrollmentTime == enrollmentTime_25_plus) {
        const totalsByEnroll = arrTotals.filter(
          (item) => item.key == enrollmentTime_25_plus
        );
        resultTotal = findByAge(totalsByEnroll[0], param);
      }

      return resultTotal;
    };

    const startedServiceNotYetCompleted = (enrollmentTime: any, param: any) => {
      const arrTotals = Object.keys(startedServiceDidNotComplete).map(
        (key) => ({
          key,
          value: startedServiceDidNotComplete[key],
        })
      );
      let resultTotal: string | undefined;

      if (enrollmentTime == enrollmentTime_0_6) {
        const totalsByEnroll = arrTotals.filter(
          (item) => item.key == enrollmentTime_0_6
        );
        resultTotal = findByAge(totalsByEnroll[0], param);
      } else if (enrollmentTime == enrollmentTime_7_12) {
        const totalsByEnroll = arrTotals.filter(
          (item) => item.key == enrollmentTime_7_12
        );
        resultTotal = findByAge(totalsByEnroll[0], param);
      } else if (enrollmentTime == enrollmentTime_13_24) {
        const totalsByEnroll = arrTotals.filter(
          (item) => item.key == enrollmentTime_13_24
        );
        resultTotal = findByAge(totalsByEnroll[0], param);
      } else if (enrollmentTime == enrollmentTime_25_plus) {
        const totalsByEnroll = arrTotals.filter(
          (item) => item.key == enrollmentTime_25_plus
        );
        resultTotal = findByAge(totalsByEnroll[0], param);
      }

      return resultTotal;
    };

    const values: any = [];

    values[1] =
      moment(startDate).format("YYYY-MM-DD") +
      " - " +
      moment(endDate).format("YYYY-MM-DD");
    values[2] = getDistrictNameById(districtsId).province.name;
    values[3] = getDistrictNameById(districtsId).name;
    values[4] = allDisaggregationsTotal;

    /** Beneficiaries that have fully completed the DREAMS primary package of services/interventions but no additional services/interventions */
    let cell = 5;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_0_6,
      ages_10_14
    );
    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_0_6,
      ages_15_19
    );
    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_0_6,
      ages_20_24
    );
    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_0_6,
      ages_25_29
    );
    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_0_6,
      subtotal
    );

    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_7_12,
      ages_10_14
    );
    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_7_12,
      ages_15_19
    );
    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_7_12,
      ages_20_24
    );
    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_7_12,
      ages_25_29
    );
    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_7_12,
      subtotal
    );

    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_13_24,
      ages_10_14
    );
    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_13_24,
      ages_15_19
    );
    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_13_24,
      ages_20_24
    );
    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_13_24,
      ages_25_29
    );
    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_13_24,
      subtotal
    );

    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_25_plus,
      ages_10_14
    );
    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_25_plus,
      ages_15_19
    );
    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_25_plus,
      ages_20_24
    );
    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_25_plus,
      ages_25_29
    );
    cell = cell + 1;
    values[cell] = completePrimaryServiceNoAditional(
      enrollmentTime_25_plus,
      subtotal
    );

    /* Beneficiaries that have fully completed the DREAMS primary package of services/interventions AND at least one secondary service/intervention */
    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_0_6,
      ages_10_14
    );
    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_0_6,
      ages_15_19
    );
    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_0_6,
      ages_20_24
    );
    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_0_6,
      ages_25_29
    );
    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_0_6,
      subtotal
    );

    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_7_12,
      ages_10_14
    );
    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_7_12,
      ages_15_19
    );
    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_7_12,
      ages_20_24
    );
    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_7_12,
      ages_25_29
    );
    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_7_12,
      subtotal
    );

    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_13_24,
      ages_10_14
    );
    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_13_24,
      ages_15_19
    );
    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_13_24,
      ages_20_24
    );
    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_13_24,
      ages_25_29
    );
    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_13_24,
      subtotal
    );

    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_25_plus,
      ages_10_14
    );
    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_25_plus,
      ages_15_19
    );
    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_25_plus,
      ages_20_24
    );
    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_25_plus,
      ages_25_29
    );
    cell = cell + 1;
    values[cell] = completePrimaryAndAtleastOneSecondary(
      enrollmentTime_25_plus,
      subtotal
    );

    /* Beneficiaries that have completed at least one DREAMS service/intervention but not the full primary package */
    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_0_6,
      ages_10_14
    );
    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_0_6,
      ages_15_19
    );
    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_0_6,
      ages_20_24
    );
    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_0_6,
      ages_25_29
    );
    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_0_6,
      subtotal
    );

    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_7_12,
      ages_10_14
    );
    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_7_12,
      ages_15_19
    );
    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_7_12,
      ages_20_24
    );
    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_7_12,
      ages_25_29
    );
    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_7_12,
      subtotal
    );

    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_13_24,
      ages_10_14
    );
    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_13_24,
      ages_15_19
    );
    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_13_24,
      ages_20_24
    );
    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_13_24,
      ages_25_29
    );
    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_13_24,
      subtotal
    );

    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_25_plus,
      ages_10_14
    );
    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_25_plus,
      ages_15_19
    );
    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_25_plus,
      ages_20_24
    );
    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_25_plus,
      ages_25_29
    );
    cell = cell + 1;
    values[cell] = completeAtLeastOnePrimaryServiceNotFull(
      enrollmentTime_25_plus,
      subtotal
    );

    /* Beneficiaries that have started a DREAMS service/intervention but have not yet completed it */
    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_0_6,
      ages_10_14
    );
    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_0_6,
      ages_15_19
    );
    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_0_6,
      ages_20_24
    );
    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_0_6,
      ages_25_29
    );
    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(enrollmentTime_0_6, subtotal);

    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_7_12,
      ages_10_14
    );
    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_7_12,
      ages_15_19
    );
    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_7_12,
      ages_20_24
    );
    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_7_12,
      ages_25_29
    );
    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(enrollmentTime_7_12, subtotal);

    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_13_24,
      ages_10_14
    );
    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_13_24,
      ages_15_19
    );
    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_13_24,
      ages_20_24
    );
    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_13_24,
      ages_25_29
    );
    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_13_24,
      subtotal
    );

    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_25_plus,
      ages_10_14
    );
    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_25_plus,
      ages_15_19
    );
    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_25_plus,
      ages_20_24
    );
    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_25_plus,
      ages_25_29
    );
    cell = cell + 1;
    values[cell] = startedServiceNotYetCompleted(
      enrollmentTime_25_plus,
      subtotal
    );

    cell = cell + 1;
    values[cell] = completedViolenceService.total;
    cell = cell + 1;
    values[cell] = hadSchoolAllowance.total;
    cell = cell + 1;
    values[cell] = completedSocialEconomicApproaches.total;
    cell = cell + 1;
    values[cell] = dataCheck();

    worksheet.addRow(values);
  });

  const created = moment(new Date()).format("YYYYMMDD_hhmmss");

  workbook.xlsx.writeBuffer().then(function (buffer) {
    const blob = new Blob([buffer], { type: "applicationi/xlsx" });
    saveAs(
      blob,
      "PEPFAR_MER_2.7_AGYW_PREV_Semi-Annual_Indicator_" + created + ".xls"
    );
  });
}
