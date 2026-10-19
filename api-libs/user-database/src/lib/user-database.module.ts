import { Module } from '@nestjs/common';

import { UserDatabaseService } from './user-database.service';

@Module({
	providers: [UserDatabaseService],
	exports: [UserDatabaseService],
})
export class UserDatabaseModule {}
