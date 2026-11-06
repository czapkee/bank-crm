import type {
  CardPaginationInput,
  ChangeCardStatusInput,
  ChangeEmployeeRoleInput,
  ChangePaymentStatusInput,
  ChangeReportStatusInput,
  CreateCardInput,
  CreateEmployeeInput,
  CreatePaymentInput,
  CreateReportInput,
  EmployeePaginationInput,
  PaymentPaginationInput,
  ReportPaginationInput,
  UpdateCardInput,
  UpdateEmployeeInput,
  UpdateMyReportInput,
  UpdateReportInput,
  WriteOffCardInput,
} from '@org/shared-types'

export type GrpcEmployeePaginationInput = Omit<EmployeePaginationInput, 'role'> & {
  role?: number
}

export type GrpcCreateEmployeeInput = Omit<CreateEmployeeInput, 'role'> & {
  role: number
}

export type GrpcUpdateEmployeeInput = Omit<UpdateEmployeeInput, 'role'> & {
  role?: number
}

export type GrpcChangeEmployeeRoleInput = Omit<ChangeEmployeeRoleInput, 'role'> & {
  role: number
}

export type GrpcCardPaginationInput = Omit<CardPaginationInput, 'status'> & {
  status?: number
}

export type GrpcCreateCardInput = Omit<CreateCardInput, 'status'> & {
  status?: number
}

export type GrpcUpdateCardInput = Omit<UpdateCardInput, 'status'> & {
  status?: number
}

export type GrpcChangeCardStatusInput = Omit<ChangeCardStatusInput, 'status'> & {
  status: number
}

export type GrpcPaymentPaginationInput = Omit<PaymentPaginationInput, 'status' | 'reference'> & {
  status?: number
  reference?: number
}

export type GrpcWriteOffCardInput = Omit<WriteOffCardInput, 'reference'> & {
  reference: number
}

export type GrpcCreatePaymentInput = Omit<CreatePaymentInput, 'status' | 'reference'> & {
  status?: number
  reference: number
}

export type GrpcChangePaymentStatusInput = Omit<ChangePaymentStatusInput, 'status'> & {
  status: number
}

export type GrpcReportPaginationInput = Omit<
  ReportPaginationInput,
  'status' | 'feedbackType' | 'priority'
> & {
  status?: number
  feedbackType?: number
  priority?: number
}

export type GrpcCreateReportInput = Omit<CreateReportInput, 'feedbackType'> & {
  feedbackType?: number
}

export type GrpcUpdateMyReportInput = Omit<UpdateMyReportInput, 'feedbackType'> & {
  feedbackType?: number
}

export type GrpcUpdateReportInput = Omit<
  UpdateReportInput,
  'status' | 'feedbackType' | 'priority'
> & {
  status?: number
  feedbackType?: number
  priority?: number
}

export type GrpcChangeReportStatusInput = Omit<ChangeReportStatusInput, 'status'> & {
  status: number
}
