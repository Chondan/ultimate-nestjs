import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/model/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() user: User) {
        return this.userService.create(user);
    }

    @Post('/bulk')
    createMany(@Body() users: User[]) {
        return this.userService.createMany(users);
    }

    @Delete('/remove/:id')
    remove(@Param('id') id: number) {
        return this.userService.remove(id);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

    @Get('/')
    findAll() {
        return this.userService.findAll();
    }
}
