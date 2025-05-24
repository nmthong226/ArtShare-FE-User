import api from "@/api/baseApi";

export enum ReportTargetType {
  POST = "POST",
  BLOG = "BLOG",
  COMMENT = "COMMENT",
  USER = "USER",
}

export interface CreateReportDto {
  target_id: number;
  target_type: ReportTargetType;
  reason: string;
  user_id?: string;
  target_url: string;
}

export enum ViewTab {
  ALL = "all",
  USER = "user",
  POST = "post",
  BLOG = "blog",
  COMMENT = "comment",
}

/**
 * Payload for fetching reports by tab.
 */
export interface ViewReportsDto {
  tab?: ViewTab;
  skip?: number;
  take?: number;
}

/**
 * A user summary included on each report.
 */
export interface ReporterSummary {
  id: string;
  username: string;
}

/**
 * Representation of a report returned by the API.
 */
export interface Report {
  id: number;
  reporter_id: string;
  moderator_id?: string;
  target_id: number;
  target_type: ReportTargetType;
  reason: string;
  status: string;
  created_at: string;
  updated_at?: string;
  resolved_at?: string;
  resolution_comment?: string;
  reporter: ReporterSummary;
  moderator?: ReporterSummary;
}

/**
 * Submit a new report.
 */
export async function submitReport(
  dto: CreateReportDto,
): Promise<{ message: string; reportId: number }> {
  const response = await api.post<{ message: string; reportId: number }>(
    "/reports",
    dto,
  );
  return response.data;
}

export async function getPendingReports(
  skip?: number,
  take?: number,
): Promise<Report[]> {
  const response = await api.get<Report[]>("/reports/pending", {
    params: { skip, take },
  });
  return response.data;
}

/**
 * Fetch reports filtered by tab (all, user, post, blog, comment).
 */
export async function viewReports(dto: ViewReportsDto): Promise<Report[]> {
  const response = await api.post<Report[]>("/reports/view", dto);
  return response.data;
}

export async function updateReportStatus(
  reportId: number,
  status: string,
): Promise<Report> {
  const resp = await api.patch<Report>(`/reports/${reportId}/status`, {
    status,
  });
  return resp.data;
}

export interface ResolveReportDto {
  resolve_date: string;
  resolution_comment?: string;
}

export async function resolveReport(
  reportId: number,
  dto: ResolveReportDto,
): Promise<Report> {
  const response = await api.patch<Report>(`/reports/${reportId}/resolve`, dto);
  return response.data;
}
