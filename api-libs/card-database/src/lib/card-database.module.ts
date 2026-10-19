import { Module } from '@nestjs/common';

import { CardDatabaseService } from './card-database.service';

@Module({
	providers: [CardDatabaseService],
	exports: [CardDatabaseService],
})
export class OrgAuthDatabaseModule {}
