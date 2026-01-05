import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';
import { Environment } from './constants/app.constant';
import { ConfigService } from '@nestjs/config';
import { GlobalConfig } from './config/global.config';

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

    app.setGlobalPrefix('api', {
        exclude: [{ path: 'health', method: RequestMethod.GET }],
    });

    await app.listen(configService.getOrThrow('app.PORT', { infer: true }));
    console.info(`Starting app with "${env()}" environment`);
    console.info(`Application is running on: "${await app.getUrl()}"`);
}

void bootstrap();
