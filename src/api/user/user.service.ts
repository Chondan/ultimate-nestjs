import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/model/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly dataSource: DataSource,
    ) {}

    async create(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async createMany(users: User[]): Promise<void> {
        await this.dataSource.transaction(async (manager) => {
            const userInstances = users.map((user) => plainToInstance(User, user));

            await manager.save(User, userInstances);
        });
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<User | null> {
        return this.userRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
