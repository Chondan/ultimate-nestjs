import { AppConfig } from './app/app.config';
import { DatabaseConfig } from './database/database.config';

export type GlobalConfig = {
    app: AppConfig;
    database: DatabaseConfig;
};
