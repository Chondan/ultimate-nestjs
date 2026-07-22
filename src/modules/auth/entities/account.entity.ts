import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('account')
export class Account {
    @PrimaryColumn('text')
    id!: string;

    @Column('text', { name: 'accountId' })
    accountId!: string;

    @Column('text', { name: 'providerId' })
    providerId!: string;

    @Index('account_userId_idx')
    @Column('text', { name: 'userId' })
    userId!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user!: User;

    @Column('text', { name: 'accessToken', nullable: true })
    accessToken: string | null | undefined;

    @Column('text', { name: 'refreshToken', nullable: true })
    refreshToken: string | null | undefined;

    @Column('text', { name: 'idToken', nullable: true })
    idToken: string | null | undefined;

    @Column('timestamptz', { name: 'accessTokenExpiresAt', nullable: true })
    accessTokenExpiresAt: Date | null | undefined;

    @Column('timestamptz', { name: 'refreshTokenExpiresAt', nullable: true })
    refreshTokenExpiresAt: Date | null | undefined;

    @Column('text', { name: 'scope', nullable: true })
    scope: string | null | undefined;

    @Column('text', { name: 'password', nullable: true })
    password: string | null | undefined;

    @Column('timestamptz', { name: 'createdAt', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column('timestamptz', { name: 'updatedAt' })
    updatedAt!: Date;
}
