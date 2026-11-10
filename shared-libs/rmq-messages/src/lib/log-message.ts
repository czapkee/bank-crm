export interface LogMessage {
  service: string;
  entity?: string;
  method: string;
  action: string;
  userId?: string;
  data?: unknown;
  userAgent?: string;
}
