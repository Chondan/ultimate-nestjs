/* eslint-disable indent */
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { createConfigLoader } from './utils/create-config';

const CONFIG_PREFIX = 'app';

export class AppConfig {
    @IsInt()
    @Min(0)
    @Max(65535)
    @IsNotEmpty()
    PORT: number;

    @IsNotEmpty()
    APP_NAME: string;
}

export default createConfigLoader(CONFIG_PREFIX, AppConfig, () => {
    return {
        PORT: parseInt(process.env.PORT as string, 10),
        APP_NAME: process.env.APP_NAME as string,
    };
});
