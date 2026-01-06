/* eslint-disable indent */
import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { createConfigLoader } from '../utils/create-config';

const CONFIG_PREFIX = 'app';

export class AppConfig {
    @IsNotEmpty()
    APP_NAME: string;

    @IsInt()
    @Min(0)
    @Max(65535)
    @IsNotEmpty()
    APP_PORT: number;

    @IsOptional()
    APP_CORS_ORIGIN: string;
}

export default createConfigLoader(CONFIG_PREFIX, AppConfig, () => {
    return {
        APP_NAME: process.env.APP_NAME as string,
        APP_PORT: parseInt(process.env.APP_PORT as string, 10),
        APP_CORS_ORIGIN: getCorsOrigin(process.env.APP_CORS_ORIGIN as string),
    };
});

/**
 * Processes a raw CORS string into a NestJS compatible origin array.
 */
function getCorsOrigin(corsOrigin: string): string[] | boolean | string {
    // 1. Handle explicit booleans or wildcards
    if (corsOrigin === 'true') return true;
    if (!corsOrigin || corsOrigin === 'false') return false;
    if (corsOrigin === '*') return '*';

    // 2. Split string and clean whitespace
    const rawOrigins = corsOrigin.split(',').map((o) => o.trim());

    // 3. Use a Set to store unique origins and their variations
    const originsSet = new Set<string>();

    rawOrigins.forEach((origin) => {
        originsSet.add(origin);

        // Expand Localhost: http://localhost:3000 -> http://127.0.0.1:3000
        if (origin.startsWith('http://localhost')) {
            originsSet.add(origin.replace('http://localhost', 'http://127.0.0.1'));
        }

        // Expand Production: https://domain.com -> https://www.domain.com
        // Only add 'www' if it's a standard web protocol and doesn't already have it
        if (origin.startsWith('https://') && !origin.includes('://www.')) {
            originsSet.add(origin.replace('https://', 'https://www.'));
        }
    });

    return Array.from(originsSet);
}
