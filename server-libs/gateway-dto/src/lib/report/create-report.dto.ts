import { ReportContent } from '../decorators/report/content.decorator.js'
import { FeedbackContact } from '../decorators/report/feedback-contact.decorator.js'
import { ReportFeedbackField } from '../decorators/report/report-feedback.decorator.js'
import { ReportTitle } from '../decorators/report/title.decorator.js'
import { Id } from '../decorators/shared/id.decorator.js'

import type { ReportFeedback } from '@org/enums'
import type { CreateReportInput } from '@org/shared-types'

export class CreateReportDto implements CreateReportInput {
  @ReportTitle()
  title: string

  @ReportContent()
  content: string

  @FeedbackContact()
  feedbackContact?: string

  @Id(false)
  themeId?: string

  @ReportFeedbackField(false)
  feedbackType?: ReportFeedback
}
