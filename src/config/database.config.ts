/* eslint-disable indent */
import { registerAs } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';
import { validateConfig } from './validate-config';

const CONFIG_PREFIX = 'database';
type DatabaseConfig = {
    host: string;
    port: number;
    username: string;
    password: string;
};

class DatabaseConfigValidator {
    @IsNotEmpty()
    DATABASE_HOST: string;
    @IsNotEmpty()
    DATABASE_PORT: number;
    @IsNotEmpty()
    DATABASE_USERNAME: string;
    @IsNotEmpty()
    DATABASE_PASSWORD: string;
}

function getConfig(): DatabaseConfig {
    return {
        host: process.env.DATABASE_HOST || '',
        port: parseInt(process.env.DATABASE_PORT || '', 10),
        username: process.env.DATABASE_USERNAME || '',
        password: process.env.DATABASE_PASSWORD || '',
    };
}

export default registerAs<DatabaseConfig>(CONFIG_PREFIX, () => {
    console.info(`Registering DatabaseConfig from environment variables`);
    validateConfig(process.env, DatabaseConfigValidator);
    return getConfig();
});
