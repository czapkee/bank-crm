import { ReportContent } from '../decorators/report/content.decorator.js'
import { FeedbackContact } from '../decorators/report/feedback-contact.decorator.js'
import { ReportFeedbackField } from '../decorators/report/report-feedback.decorator.js'
import { ReportPriorityField } from '../decorators/report/report-priority.decorator.js'
import { ReportStatusField } from '../decorators/report/report-status.decorator.js'
import { ReportTitle } from '../decorators/report/title.decorator.js'
import { Id } from '../decorators/shared/id.decorator.js'

import type { ReportStatus, ReportFeedback, ReportPriority } from '@org/enums'
import type { UpdateReportInput } from '@org/shared-types'

export class UpdateReportDto implements UpdateReportInput {
  @ReportTitle(false)
  title?: string

  @ReportContent(false)
  content?: string

  @FeedbackContact()
  feedbackContact?: string

  @Id(false)
  themeId?: string

  @ReportStatusField(false)
  status?: ReportStatus

  @ReportFeedbackField(false)
  feedbackType?: ReportFeedback

  @ReportPriorityField(false)
  priority?: ReportPriority

  @Id(false)
  assignedToId?: string
}
