/* eslint-disable indent */
import { registerAs } from '@nestjs/config';
import { Environment } from 'src/constants/app.constant';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { validateConfig } from './validate-config';

const CONFIG_PREFIX = 'app';

type AppConfig = {
    nodeEnv: string;
    port: number;
};

class AppConfigValidator {
    @IsOptional()
    @IsEnum(Environment)
    NODE_ENV: typeof Environment;

    @IsInt()
    @Min(0)
    @Max(65535)
    @IsNotEmpty()
    PORT: number;
}

function getConfig(): AppConfig {
    const defaultPort = '4000';

    return {
        nodeEnv: process.env.NODE_ENV || Environment.Local,
        port: parseInt(process.env.PORT || defaultPort, 10),
    };
}

export default registerAs<AppConfig>(CONFIG_PREFIX, () => {
    console.info(`Registering AppConfig from environment variables`);
    validateConfig(process.env, AppConfigValidator);
    return getConfig();
});
