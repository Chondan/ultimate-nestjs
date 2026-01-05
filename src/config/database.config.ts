/* eslint-disable indent */
import { IsNotEmpty } from 'class-validator';
import { createConfigLoader } from './utils/create-config';

const CONFIG_PREFIX = 'database';

export class DatabaseConfig {
    @IsNotEmpty()
    DATABASE_HOST: string;
    @IsNotEmpty()
    DATABASE_PORT: number;
    @IsNotEmpty()
    DATABASE_USERNAME: string;
    @IsNotEmpty()
    DATABASE_PASSWORD: string;
}

export default createConfigLoader(CONFIG_PREFIX, DatabaseConfig, () => {
    return {
        DATABASE_HOST: process.env.DATABASE_HOST || '',
        DATABASE_PORT: parseInt(process.env.DATABASE_PORT || '', 10),
        DATABASE_USERNAME: process.env.DATABASE_USERNAME || '',
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '',
    };
});
