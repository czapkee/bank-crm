import { Module } from '@nestjs/common';
import { CardFeatureModule } from '@org/card-feature';

@Module({
  imports: [CardFeatureModule],
})
export class AppModule {}
