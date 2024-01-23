export interface BackendErrorResponse {
  response: {
    error: string;
    status: number;
    headers: Record<string, unknown>;
  };
  request: {
    query: string;
    variables: Record<string, unknown>;
  };
}

export interface ParsedErrorDetail {
  detail: string;
  status: number;
  title: string;
}
