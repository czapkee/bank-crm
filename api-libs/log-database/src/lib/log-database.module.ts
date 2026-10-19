import { Module } from '@nestjs/common';

import { LogDatabaseService } from './log-database.service';

@Module({
	providers: [LogDatabaseService],
	exports: [LogDatabaseService],
})
export class OrgLogDatabaseModule {}
