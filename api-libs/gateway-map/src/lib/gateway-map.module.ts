import { Global, Module } from '@nestjs/common'

import { CardGatewayMapService } from './card-map.service.js'
import { LogGatewayMapService } from './log-map.service.js'
import { PaymentGatewayMapService } from './payment-map.service.js'
import { ReportGatewayMapService } from './report-map.service.js'
import { ThemeGatewayMapService } from './theme-map.service.js'
import { UserGatewayMapService } from './user-map.service.js'

const SERVICES = [
  UserGatewayMapService,
  CardGatewayMapService,
  PaymentGatewayMapService,
  LogGatewayMapService,
  ReportGatewayMapService,
  ThemeGatewayMapService,
]

@Global()
@Module({
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class GatewayMapModule {}
