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

export async function getNewlyEnrolledAgywAndServicesSummary(
  districts?: any,
  startDate?: any,
  endDate?: any,
  pageIndex?: any,
  pageSize?: any
) {
  const url = `/api/agyw-prev/getNewlyEnrolledAgywAndServicesSummary?districts=${districts}&startDate=${startDate}&endDate=${endDate}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
  const res = await select(url);
  return res;
}

export async function countNewlyEnrolledAgywAndServicesSummary(
  districts?: any,
  startDate?: any,
  endDate?: any
) {
  const url = `/api/agyw-prev/countNewlyEnrolledAgywAndServicesSummary?districts=${districts}&startDate=${startDate}&endDate=${endDate}`;
  const res = await select(url);
  return res;
}

export async function getNewlyEnrolledAgywAndServicesReportGenerated(
  districts?: any,
  startDate?: any,
  endDate?: any,
  pageIndex?: any,
  pageSize?: any
) {
  const url = `/api/agyw-prev/getNewlyEnrolledAgywAndServices?districts=${districts}&startDate=${startDate}&endDate=${endDate}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
  const res = await select(url);
  return res;
}

export async function getFileDownloaded(filePath?: any) {
  const url = `/api/agyw-prev/downloadFile?filePath=${filePath}`;
  const res = await download(url);
  return res;
}
