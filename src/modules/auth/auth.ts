// src/auth.ts
import { betterAuth } from 'better-auth';
import { typeormAdapter } from '@hedystia/better-auth-typeorm';
import { DataSource } from 'typeorm';
import { bearer } from 'better-auth/plugins';

// We configure a direct DataSource using your exact Docker configuration.
// This allows the Better Auth CLI to connect cleanly during generation.
const cliDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres-docker',
    password: 'postgres-docker',
    database: 'ultimate-nestjs',
});

export const getAuth = (dataSource: DataSource) => {
    return betterAuth({
        plugins: [bearer()],
        baseURL: process.env.BETTER_AUTH_URL,
        secret: process.env.BETTER_AUTH_SECRET,
        emailAndPassword: {
            enabled: true,
        },
        session: {
            expiresIn: 60 * 60 * 24 * 7, // 7 days
            updateAge: 60 * 60 * 24, // 1 day
            cookieCache: {
                enabled: true,
                maxAge: 5 * 60, // 5 minutes
                strategy: 'jwt', // Switches cache validation to follow standard JWT specifications
            },
        },

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        database: typeormAdapter(dataSource as any, {
            outputDir: './src/modules/auth',
            entitiesDir: './src/modules/auth/entities',
            migrationsDir: './src/modules/auth/temp-migrations',
        }),
    });
};

// We still export a default "auth" instance using the CLI datasource
// so the CLI command "npx auth generate" continues to work automatically.
export const auth = getAuth(cliDataSource);
