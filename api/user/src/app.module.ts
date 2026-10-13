import { Module } from '@nestjs/common';
import { UserFeatureModule } from '@org/user-feature';

@Module({
  imports: [UserFeatureModule],
})
export class AppModule {}
