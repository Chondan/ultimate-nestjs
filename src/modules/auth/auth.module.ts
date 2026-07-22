// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { DataSource } from 'typeorm';
import { getAuth } from './auth';
import { PostgresqlModule } from '../db/postgresql/postgresql.module';

@Module({
    imports: [
        BetterAuthModule.forRootAsync({
            imports: [PostgresqlModule],
            inject: [DataSource],
            useFactory: (dataSource: DataSource) => {
                return {
                    auth: getAuth(dataSource),
                    path: '/api/auth',
                };
            },
        }),
    ],
    exports: [BetterAuthModule],
})
export class AuthModule {}
