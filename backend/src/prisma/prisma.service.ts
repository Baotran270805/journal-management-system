import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { readFileSync } from 'node:fs';

import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    const useSsl = config.get<string>('DATABASE_SSL') === 'true';

    const adapter = new PrismaMariaDb({
      host: config.getOrThrow<string>('DATABASE_HOST'),
      port: Number(config.getOrThrow<string>('DATABASE_PORT')),
      user: config.getOrThrow<string>('DATABASE_USER'),
      password: config.getOrThrow<string>('DATABASE_PASSWORD'),
      database: config.getOrThrow<string>('DATABASE_NAME'),

      connectionLimit: 5,

      // Local MySQL của chúng ta cần tùy chọn này.
      allowPublicKeyRetrieval: !useSsl,

      ...(useSsl
        ? {
            ssl: {
              ca: [
                readFileSync(
                  config.getOrThrow<string>('DATABASE_CA_PATH'),
                  'utf8',
                ),
              ],
              rejectUnauthorized: true,
            },
          }
        : {}),
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}