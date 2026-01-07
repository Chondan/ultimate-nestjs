import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import {
    ClassSerializerInterceptor,
    HttpStatus,
    RequestMethod,
    UnprocessableEntityException,
    ValidationPipe,
} from '@nestjs/common';
import { Environment } from './constants/app.constant';
import { ConfigService } from '@nestjs/config';
import { GlobalConfig } from './config/config.type';
import helmet from 'helmet';
import { ValidationError } from 'class-validator';

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
                    defaultSrc: ['"self"'],
                    scriptSrc: ['"self"'],
                },
            },
        }),
    );

    /**
     * Configures Cross-Origin Resource Sharing (CORS).
     * - origin: Restricts access to trusted domains defined in configuration.
     * - methods: Explicitly allow-lists standard RESTful HTTP verbs.
     * - allowedHeaders: Defines valid request headers to prevent unauthorized metadata injection.
     * - credentials: Allows the server to accept cookies and Authorization headers from the client.
     */
    app.enableCors({
        origin: configService.getOrThrow('app.APP_CORS_ORIGIN', {
            infer: true,
        }),
        methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        credentials: true,
    });

    /**
     * Sets a global route prefix for all API endpoints (e.g., /api/user).
     * The 'health' endpoint is excluded to allow load balancers or orchestrators (like Kubernetes)
     * to perform connectivity checks at the root level without the 'api' prefix.
     */
    app.setGlobalPrefix('api', {
        exclude: [{ path: 'health', method: RequestMethod.GET }],
    });

    /**
     * Enable global response transformation to apply @Exclude()/@Expose() decorators
     * ref: https://docs.nestjs.com/techniques/serialization
     */
    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

    /**
     * Global Validation Configuration
     * - transform: Automatically coerces types (e.g., string to number)
     * - whitelist: Strips properties without decorators
     * - forbidNonWhitelisted: Rejects requests with extra properties
     * - exceptionFactory: Recursively maps ValidationErrors into a nested
     * tree structure for better frontend error handling (supports Arrays/Objects).
     */
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: false,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            exceptionFactory: (errors: ValidationError[]) => {
                const formatError = (error: ValidationError) => {
                    // 1. If it has children, it's a nested array/object
                    if (error.children && error.children.length > 0) {
                        return {
                            property: error.property,
                            // Map through children to find specific indices or nested fields
                            nested: error.children.map((child): { property: string; errors?: string[]; nested?: any[] } =>
                                formatError(child),
                            ),
                        };
                    }

                    // 2. If no children, it's a standard field error
                    return {
                        property: error.property,
                        errors: Object.values(error.constraints || {}),
                    };
                };

                const result = errors.map((error) => formatError(error));
                return new UnprocessableEntityException(result);
            },
        }),
    );

    await app.listen(configService.getOrThrow('app.APP_PORT', { infer: true }));
    console.info(`Starting app with "${env()}" environment`);
    console.info(`Application is running on: "${await app.getUrl()}"`);
}

void bootstrap();
