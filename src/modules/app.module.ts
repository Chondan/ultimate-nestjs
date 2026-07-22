import { DynamicModule, Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '../config/database/database.config';
import { Environment } from '../constants/app.constant';
import appConfig from '../config/app/app.config';
import { PostgresqlModule } from './db/postgresql/postgresql.module';
import { AuthModule } from './auth/auth.module';

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
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [appConfig, databaseConfig],
                    envFilePath: env === Environment.Local ? [`./env/.env.${env}`] : [],
                    ignoreEnvFile: env !== Environment.Local,
                }),

                AuthModule,

                // Inject our database infrastructure layers
                PostgresqlModule,

                // Feature Modules
                ApiModule,
            ],
        };
    }
}
