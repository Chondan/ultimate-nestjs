import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from 'src/modules/user/models/user.dto';
import { EntityToDtoInterceptor } from 'src/interceptors/entity-to-dto.interceptor';
import { CreateBulkUserDto, CreateUserDto } from './models/create-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @UseInterceptors(new EntityToDtoInterceptor(UserDto))
    create(@Body() user: CreateUserDto) {
        return this.userService.create(user);
    }

    @Post('/bulk')
    createMany(@Body() createBulkUserDto: CreateBulkUserDto): Promise<void> {
        return this.userService.createMany(createBulkUserDto.users);
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
