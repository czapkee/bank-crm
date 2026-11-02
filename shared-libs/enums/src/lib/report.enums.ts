export enum ReportStatus {
  IN_PROCESS = 'IN_PROCESS',
  ON_CONTROL = 'ON_CONTROL',
  TAKE_ON_TASK = 'TAKE_ON_TASK',
  RETURNED_TO_INIT = 'RETURNED_TO_INIT',
  RETURNED_TO_WORK = 'RETURNED_TO_WORK',
  CLOSED = 'CLOSED',
}

export const REPORT_STATUSES_TO_GRPC: Record<ReportStatus, number> = {
  [ReportStatus.IN_PROCESS]: 0,
  [ReportStatus.ON_CONTROL]: 1,
  [ReportStatus.TAKE_ON_TASK]: 2,
  [ReportStatus.RETURNED_TO_INIT]: 3,
  [ReportStatus.RETURNED_TO_WORK]: 4,
  [ReportStatus.CLOSED]: 5,
};

export const GRPC_TO_REPORT_STATUSES: Record<number, ReportStatus> = {
  0: ReportStatus.IN_PROCESS,
  1: ReportStatus.ON_CONTROL,
  2: ReportStatus.TAKE_ON_TASK,
  3: ReportStatus.RETURNED_TO_INIT,
  4: ReportStatus.RETURNED_TO_WORK,
  5: ReportStatus.CLOSED,
};

export enum ReportFeedback {
  PHONE_NUMBER = 'PHONE_NUMBER',
  EMAIL = 'EMAIL',
  NOT_REQUIRED = 'NOT_REQUIRED',
  OTHER = 'OTHER',
}

export const REPORT_FEEDBACKS_TO_GRPC: Record<ReportFeedback, number> = {
  [ReportFeedback.PHONE_NUMBER]: 0,
  [ReportFeedback.EMAIL]: 1,
  [ReportFeedback.NOT_REQUIRED]: 2,
  [ReportFeedback.OTHER]: 3,
};

export const GRPC_TO_REPORT_FEEDBACKS: Record<number, ReportFeedback> = {
  0: ReportFeedback.PHONE_NUMBER,
  1: ReportFeedback.EMAIL,
  2: ReportFeedback.NOT_REQUIRED,
  3: ReportFeedback.OTHER,
};

export enum ReportPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export const REPORT_PRIORITIES_TO_GRPC: Record<ReportPriority, number> = {
  [ReportPriority.LOW]: 0,
  [ReportPriority.MEDIUM]: 1,
  [ReportPriority.HIGH]: 2,
  [ReportPriority.CRITICAL]: 3,
};

export const GRPC_TO_REPORT_PRIORITIES: Record<number, ReportPriority> = {
  0: ReportPriority.LOW,
  1: ReportPriority.MEDIUM,
  2: ReportPriority.HIGH,
  3: ReportPriority.CRITICAL,
};
