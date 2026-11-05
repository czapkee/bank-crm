import { Id } from '../decorators/shared/id.decorator.js'

import type { AssignReportInput } from '@org/shared-types'

export class AssignReportDto implements AssignReportInput {
  @Id(false)
  assignedToId?: string
}
