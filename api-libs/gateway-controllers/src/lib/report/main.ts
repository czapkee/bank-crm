import { ReportAdminController } from './report-admin.controller.js'
import { ReportController } from './report.controller.js'
import { ThemeAdminController } from './theme-admin.controller.js'
import { ThemeController } from './theme.controller.js'

export const REPORT_CONTROLLERS = [
  ReportController,
  ReportAdminController,
  ThemeController,
  ThemeAdminController,
]
