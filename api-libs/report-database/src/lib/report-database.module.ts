import { Module } from '@nestjs/common';

import { ReportDatabaseService } from './report-database.service';

@Module({
	providers: [ReportDatabaseService],
	exports: [ReportDatabaseService],
})
export class OrgReportDatabaseModule {}
