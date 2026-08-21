import { DataSource } from 'typeorm';

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres-docker',
    password: 'postgres-docker',
    database: 'ultimate-nestjs',
    migrations: ['typeorm/migrations/**'],
    entities: ['src/**/*.entity.ts'],
});
