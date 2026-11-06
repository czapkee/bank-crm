import { ReportFeedbackField } from '../decorators/report/report-feedback.decorator.js'
import { ReportPriorityField } from '../decorators/report/report-priority.decorator.js'
import { ReportStatusField } from '../decorators/report/report-status.decorator.js'
import { DateField } from '../decorators/shared/date.decorator.js'
import { Id } from '../decorators/shared/id.decorator.js'
import { BasePaginationDto } from '../shared/pagination-base.dto.js'

import type { ReportStatus, ReportFeedback, ReportPriority } from '@org/enums'
import type { ReportPaginationInput } from '@org/shared-types'

export class ReportPaginationDto extends BasePaginationDto implements ReportPaginationInput {
  @Id(false)
  userId?: string

  @Id(false)
  assignedToId?: string

  @Id(false)
  themeId?: string

  @ReportStatusField(false)
  status?: ReportStatus

  @ReportFeedbackField(false)
  feedbackType?: ReportFeedback

  @ReportPriorityField(false)
  priority?: ReportPriority

  @DateField()
  dateFrom?: Date

  @DateField()
  dateTo?: Date
}
