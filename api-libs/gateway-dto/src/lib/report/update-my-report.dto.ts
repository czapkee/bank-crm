import { ReportContent } from '../decorators/report/content.decorator.js'
import { FeedbackContact } from '../decorators/report/feedback-contact.decorator.js'
import { ReportFeedbackField } from '../decorators/report/report-feedback.decorator.js'
import { ReportTitle } from '../decorators/report/title.decorator.js'
import { Id } from '../decorators/shared/id.decorator.js'

import type { ReportFeedback } from '@org/enums'
import type { UpdateMyReportInput } from '@org/shared-types'

export class UpdateMyReportDto implements UpdateMyReportInput {
  @ReportTitle(false)
  title?: string

  @ReportContent(false)
  content?: string

  @FeedbackContact()
  feedbackContact?: string

  @Id(false)
  themeId?: string

  @ReportFeedbackField(false)
  feedbackType?: ReportFeedback
}
