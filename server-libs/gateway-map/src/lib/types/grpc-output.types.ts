import type {
  CardOutput,
  CardPaginationOutput,
  EmployeePaginationOutput,
  EmployeeUserEntity,
  LogOutput,
  PaginatedCardsOutput,
  PaginatedEmployeesOutput,
  PaginatedLogsOutput,
  PaginatedPaymentsOutput,
  PaginatedReportsOutput,
  PaymentOutput,
  PaymentPaginationOutput,
  ReportListOutput,
  ReportOutput,
  ReportPaginationOutput,
} from '@org/shared-types'

export type GrpcEmployeeUserEntity = Omit<EmployeeUserEntity, 'role'> & {
  role: number
}

export type GrpcEmployeePaginationOutput = Omit<EmployeePaginationOutput, 'role'> & {
  role?: number
}

export type GrpcPaginatedEmployeesOutput = Omit<PaginatedEmployeesOutput, 'pagination' | 'employees'> & {
  pagination: GrpcEmployeePaginationOutput
  employees: GrpcEmployeeUserEntity[]
}

export type GrpcCardOutput = Omit<CardOutput, 'status'> & {
  status: number
}

export type GrpcCardPaginationOutput = Omit<CardPaginationOutput, 'status'> & {
  status?: number
}

export type GrpcPaginatedCardsOutput = Omit<PaginatedCardsOutput, 'pagination' | 'cards'> & {
  pagination: GrpcCardPaginationOutput
  cards: GrpcCardOutput[]
}

export type GrpcPaymentOutput = Omit<PaymentOutput, 'status' | 'reference'> & {
  status: number
  reference: number
}

export type GrpcPaymentPaginationOutput = Omit<PaymentPaginationOutput, 'status' | 'reference'> & {
  status?: number
  reference?: number
}

export type GrpcPaginatedPaymentsOutput = Omit<PaginatedPaymentsOutput, 'pagination' | 'payments'> & {
  pagination: GrpcPaymentPaginationOutput
  payments: GrpcPaymentOutput[]
}

export type GrpcLogOutput = Omit<LogOutput, 'data'> & {
  data: string | null
}

export type GrpcPaginatedLogsOutput = Omit<PaginatedLogsOutput, 'logs'> & {
  logs: GrpcLogOutput[]
}

export type GrpcReportListOutput = Omit<ReportListOutput, 'status' | 'feedbackType' | 'priority'> & {
  status: number
  feedbackType: number
  priority: number
}

export type GrpcReportOutput = Omit<ReportOutput, 'status' | 'feedbackType' | 'priority'> & {
  status: number
  feedbackType: number
  priority: number
}

export type GrpcReportPaginationOutput = Omit<
  ReportPaginationOutput,
  'status' | 'feedbackType' | 'priority'
> & {
  status?: number
  feedbackType?: number
  priority?: number
}

export type GrpcPaginatedReportsOutput = Omit<PaginatedReportsOutput, 'pagination' | 'reports'> & {
  pagination: GrpcReportPaginationOutput
  reports: GrpcReportListOutput[]
}
