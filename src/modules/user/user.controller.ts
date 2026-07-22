import { Body, Controller, Delete, Get, Param, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { EntityToDtoInterceptor } from '@src/interceptors/entity-to-dto.interceptor';
import * as nestjsBetterAuth from '@thallesp/nestjs-better-auth';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/')
    @UseInterceptors(new EntityToDtoInterceptor(UserDto))
    async findAll(): Promise<UserDto[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    @UseInterceptors(new EntityToDtoInterceptor(UserDto))
    async findOne(@Param('id') id: string): Promise<UserDto | null> {
        return this.userService.findOne(id);
    }

    @Delete('/remove/:id')
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }

    @Get('/pets')
    async getPets() {}

    @Get('/me')
    getProfile(@nestjsBetterAuth.Session() session: nestjsBetterAuth.UserSession) {
        return { user: session.user };
    }
}
