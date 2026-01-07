/* eslint-disable indent */
import { Exclude } from 'class-transformer';

export class UserDto {
    id: number;

    firstName: string;

    lastName: string;

    @Exclude()
    isActive: boolean;
}
