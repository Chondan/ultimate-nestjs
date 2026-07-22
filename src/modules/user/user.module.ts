import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../auth/entities/user.entity';
import { Pet } from './entities/pet.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Pet])],
    controllers: [UserController],
    providers: [UserService],
    exports: [],
})
export class UserModule {}
