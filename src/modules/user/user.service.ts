import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto, UserDto } from 'src/modules/user/dto/user.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly dataSource: DataSource,
    ) {}

    async create(user: CreateUserDto): Promise<UserDto> {
        return this.userRepository.save(user);
    }

    async createMany(users: CreateUserDto[]): Promise<void> {
        await this.dataSource.transaction(async (manager) => {
            const userInstances = users.map((user) => plainToInstance(UserEntity, user));

            await manager.save(UserEntity, userInstances);
        });
    }

    async findAll(): Promise<UserEntity[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<UserEntity | null> {
        return this.userRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
