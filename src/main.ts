import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';
import { Environment } from './constants/app.constant';
import { ConfigService } from '@nestjs/config';
import { GlobalConfig } from './config/global.config';
import helmet from 'helmet';

const env = () => {
    if (!process.env.NODE_ENV || !Object.values(Environment).includes(process.env.NODE_ENV as Environment)) {
        console.info(`Invalid NODE_ENV: ${process.env.NODE_ENV}`);
        console.info(`Falling back to NODE_NEV: ${Environment.Local}`);
        return Environment.Local;
    }

    return process.env.NODE_ENV;
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule.forRoot(env() as Environment));
    const configService = app.get(ConfigService<GlobalConfig>);

    /**
     * Helmet Security Middleware:
     * Configures Content Security Policy (CSP) headers to mitigate XSS and data injection attacks.
     * This directive ensures the browser only executes scripts/resources originating from the 'self' domain,
     * blocking any malicious inline or third-party scripts not explicitly allow-listed.
     */
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ['self'],
                    scriptSrc: ['self'],
                },
            },
        }),
    );

    /**
     * Sets a global route prefix for all API endpoints (e.g., /api/user).
     * The 'health' endpoint is excluded to allow load balancers or orchestrators (like Kubernetes)
     * to perform connectivity checks at the root level without the 'api' prefix.
     */
    app.setGlobalPrefix('api', {
        exclude: [{ path: 'health', method: RequestMethod.GET }],
    });

    await app.listen(configService.getOrThrow('app.PORT', { infer: true }));
    console.info(`Starting app with "${env()}" environment`);
    console.info(`Application is running on: "${await app.getUrl()}"`);
}

void bootstrap();
