import { ReportStatusField } from '../decorators/report/report-status.decorator.js'

import type { ReportStatus } from '@org/enums'
import type { ChangeReportStatusInput } from '@org/shared-types'

export class ChangeReportStatusDto implements ChangeReportStatusInput {
  @ReportStatusField()
  status: ReportStatus
}
