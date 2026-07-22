import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalConfig } from '@src/config/config.type';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            // 1. useFactory only returns the connection configuration object, NOT the connection itself.
            useFactory: (configService: ConfigService<GlobalConfig>) => ({
                type: 'postgres',
                host: configService.get('database.DATABASE_HOST', { infer: true }),
                port: configService.get('database.DATABASE_PORT', { infer: true }),
                username: configService.get('database.DATABASE_USERNAME', { infer: true }),
                password: configService.get('database.DATABASE_PASSWORD', { infer: true }),
                database: configService.get('database.DATABASE_NAME', { infer: true }),
                autoLoadEntities: true,
                synchronize: false,
                logging: process.env.NODE_ENV === 'development',
                ssl: configService.get('database.DATABASE_SSL', { infer: true }) ? { rejectUnauthorized: false } : false,
            }),
            // 2. Under the hood, TypeOrmModule.forRootAsync reads your config, boots the connection,
            // and registers the active connection in NestJS under the token "DataSource".
        }),
    ],
    // 3. Exporting TypeOrmModule exposes that "DataSource" provider globally.
    // This allows other modules (like AuthModule) to safely request "inject: [DataSource]".
    exports: [TypeOrmModule],
})
export class PostgresqlModule {}
