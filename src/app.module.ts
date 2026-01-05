import { DynamicModule, Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { Environment } from './constants/app.constant';

@Module({
    imports: [ApiModule],
    controllers: [],
    providers: [],
})
export class AppModule {
    static forRoot(env: Environment): DynamicModule {
        return {
            module: AppModule,
            imports: [
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
            ],
        };
    }
}
