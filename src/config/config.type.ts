import { AppConfig } from './app.config';
import { DatabaseConfig } from './database.config';

export type GlobalConfig = {
    app: AppConfig;
    database: DatabaseConfig;
};
