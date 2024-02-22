import { download, select } from "./crud";

export async function agywPrevQuery(
  districts?: any,
  startDate?: any,
  endDate?: any
) {
  const url = `/api/agyw-prev?districts=${districts}&startDate=${startDate}&endDate=${endDate}`;
  const res = await select(url);
  return res;
}

export async function serviceAgesBandsQuery() {
  const url = "/api/service-agebands";
  const res = await select(url);
  return res;
}

export async function countNewlyEnrolledAgywAndServices(
  districts?: any,
  startDate?: any,
  endDate?: any
) {
  const url = `/api/agyw-prev/countNewlyEnrolledAgywAndServices?districts=${districts}&startDate=${startDate}&endDate=${endDate}`;
  const res = await select(url);
  return res;
}

export async function getNewlyEnrolledAgywAndServicesReportGenerated(
  province?: string,
  districts?: any,
  startDate?: any,
  endDate?: any,
  pageIndex?: any,
  pageSize?: any,
  username?: any
) {
  const url = `/api/agyw-prev/getNewlyEnrolledAgywAndServices?province=${province}&districts=${districts}&startDate=${startDate}&endDate=${endDate}&pageIndex=${pageIndex}&pageSize=${pageSize}&username=${username}`;
  const res = await select(url);
  return res;
}

export async function getFileDownloaded(filePath?: any) {
  const url = `/api/agyw-prev/downloadFile?filePath=${filePath}`;
  const res = await download(url);
  return res;
}

export async function geNewlyEnrolledAgywAndServicesSummaryReportGenerated(
  province?: string,
  districts?: any,
  startDate?: any,
  endDate?: any,
  pageIndex?: any,
  pageSize?: any,
  username?: any
) {
  const url = `/api/agyw-prev/getNewlyEnrolledAgywAndServicesSummary?province=${province}&districts=${districts}&startDate=${startDate}&endDate=${endDate}&pageIndex=${pageIndex}&pageSize=${pageSize}&username=${username}`;
  const res = await select(url);
  return res;
}

export async function countBeneficiariesVulnerabilitiesAndServices(
  districts?: any,
  startDate?: any,
  endDate?: any
) {
  const url = `/api/agyw-prev/countBeneficiariesVulnerabilitiesAndServices?districts=${districts}&startDate=${startDate}&endDate=${endDate}`;
  const res = await select(url);
  return res;
}

export async function getBeneficiariesVulnerabilitiesAndServicesReportGenerated(
  province?: string,
  districts?: any,
  startDate?: any,
  endDate?: any,
  pageIndex?: any,
  pageSize?: any,
  username?: any
) {
  const url = `/api/agyw-prev/getBeneficiariesVulnerabilitiesAndServices?province=${province}&districts=${districts}&startDate=${startDate}&endDate=${endDate}&pageIndex=${pageIndex}&pageSize=${pageSize}&username=${username}`;
  const res = await select(url);
  return res;
}

export async function getBeneficiariesVulnerabilitiesAndServicesSummaryReportGenerated(
  province?: string,
  districts?: any,
  startDate?: any,
  endDate?: any,
  pageIndex?: any,
  pageSize?: any,
  username?: any
) {
  const url = `/api/agyw-prev/getBeneficiariesVulnerabilitiesAndServicesSummary?province=${province}&districts=${districts}&startDate=${startDate}&endDate=${endDate}&pageIndex=${pageIndex}&pageSize=${pageSize}&username=${username}`;
  const res = await select(url);
  return res;
}
