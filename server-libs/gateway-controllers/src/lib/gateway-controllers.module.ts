import { join } from 'path'

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices'
import { workspaceRoot } from 'nx/src/utils/workspace-root'

import { CARD_CONTROLLERS } from './card/main.js'
import { LOG_CONTROLLERS } from './log/main.js'
import { REPORT_CONTROLLERS } from './report/main.js'
import { USER_CONTROLLERS } from './user/main.js'

const SERVICES = [
  { name: 'USER', env: 'BANK_CRM_USER_GRPC_URL', url: 'localhost:5001' },
  { name: 'CARD', env: 'BANK_CRM_CARD_GRPC_URL', url: 'localhost:5002' },
  { name: 'LOG', env: 'BANK_CRM_LOG_GRPC_URL', url: 'localhost:5003' },
  { name: 'REPORT', env: 'BANK_CRM_REPORT_GRPC_URL', url: 'localhost:5004' },
]

@Module({
  imports: [
    ClientsModule.registerAsync(
      SERVICES.map((service) => ({
        name: `${service.name}_CLIENT`,
        imports: [ConfigModule],
        useFactory: (config: ConfigService): GrpcOptions => ({
          transport: Transport.GRPC,
          options: {
            url: config.get<string>(service.env, service.url),
            package: service.name.toLowerCase(),
            protoPath: join(workspaceRoot, `proto/${service.name.toLowerCase()}.proto`),
            loader: {
              includeDirs: [join(workspaceRoot, 'proto')],
            },
          },
        }),
        inject: [ConfigService],
      })),
    ),
  ],
  controllers: [
    ...USER_CONTROLLERS,
    ...CARD_CONTROLLERS,
    ...LOG_CONTROLLERS,
    ...REPORT_CONTROLLERS,
  ],
})
export class GatewayControllersModule {}
