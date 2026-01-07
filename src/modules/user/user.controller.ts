import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserDto } from 'src/modules/user/dto/user.dto';
import { EntityToDtoInterceptor } from 'src/interceptors/entity-to-dto.interceptor';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() user: CreateUserDto) {
        return this.userService.create(user);
    }

    @Post('/bulk')
    createMany(@Body() users: CreateUserDto[]) {
        return this.userService.createMany(users);
    }

    @Get('/')
    @UseInterceptors(new EntityToDtoInterceptor(UserDto))
    async findAll(): Promise<UserDto[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    @UseInterceptors(new EntityToDtoInterceptor(UserDto))
    async findOne(@Param('id') id: number): Promise<UserDto | null> {
        return this.userService.findOne(id);
    }

    @Delete('/remove/:id')
    remove(@Param('id') id: number) {
        return this.userService.remove(id);
    }
}
