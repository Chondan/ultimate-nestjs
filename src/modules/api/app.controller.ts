import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as config from '@nestjs/config';
import { GlobalConfig } from 'src/config/config.type';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly configService: config.ConfigService<GlobalConfig>,
    ) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
