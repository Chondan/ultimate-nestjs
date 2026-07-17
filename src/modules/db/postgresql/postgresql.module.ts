import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalConfig } from '@src/config/config.type';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService<GlobalConfig>) => ({
                type: 'postgres',
                host: configService.get('database.DATABASE_HOST', { infer: true }),
                port: configService.get('database.DATABASE_PORT', { infer: true }),
                username: configService.get('database.DATABASE_USERNAME', { infer: true }),
                password: configService.get('database.DATABASE_PASSWORD', { infer: true }),
                database: configService.get('database.DATABASE_NAME', { infer: true }),
                autoLoadEntities: true,
                synchronize: false,
                // Using string check or node_env approach since Env enum might not be here
                logging: process.env.NODE_ENV === 'development',
                ssl: configService.get('database.DATABASE_SSL', { infer: true }) ? { rejectUnauthorized: false } : false,
            }),
        }),
    ],
    exports: [TypeOrmModule],
})
export class PostgresqlModule {}
