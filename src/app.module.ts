import { DynamicModule, Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { Environment } from './constants/app.constant';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalConfig } from './config/config.type';

@Module({
    imports: [],
    controllers: [],
    providers: [],
})
export class AppModule {
    static forRoot(env: Environment): DynamicModule {
        return {
            module: AppModule,
            imports: [
                ApiModule,
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [appConfig, databaseConfig],
                    envFilePath: [`./env/${env}/common.env`, `./env/${env}/database.env`],
                    /**
                     * If true, ConfigModule will skip looking for .env files on disk and
                     * rely strictly on OS-level environment variables (ideal for Production/Docker).
                     */
                    ignoreEnvFile: env === Environment.Production,
                }),
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

                        // Best Practice: Load entities automatically
                        autoLoadEntities: true,
                        // ⚠️ Set to false in production to prevent data loss
                        synchronize: false,
                        // Recommended for PostgreSQL performance
                        logging: env === Environment.Development,
                        ssl: configService.get('database.DATABASE_SSL', { infer: true }) ? { rejectUnauthorized: false } : false,
                    }),
                }),
            ],
        };
    }
}
