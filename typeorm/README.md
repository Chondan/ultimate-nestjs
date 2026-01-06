# 🗄️ Database Migration Guide

This project uses **TypeORM** for database management. All schema changes must be handled through migration files rather than manual SQL or `synchronize: true`.



## 📄 Data Source Configuration

The following is an example of the TypeORM Data Source configuration used in this project. This configuration is essential for connecting to the database and managing migrations and entities.

Ensure that the `typeorm.config.ts` file is updated to reflect the correct database connection settings and paths for migrations and entities.

```typescript
import { DataSource } from 'typeorm';

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'ultimate-nestjs',
    migrations: ['typeorm/migrations/**'],
    entities: ['src/**/*.entity.ts'],
});
```

### Explanation
- **type**: Specifies the database type (e.g., `postgres`).
- **host**: The database server address.
- **port**: The port on which the database server is running.
- **username**: The database user.
- **password**: The password for the database user.
- **database**: The name of the database.
- **migrations**: Path to the migration files.
- **entities**: Path to the entity files.

Ensure that the above configuration matches your environment settings. Update the `host`, `port`, `username`, `password`, and `database` fields as needed.

## 🚀 Migration Commands

To pass a name to the migration scripts, use the --name= flag (e.g., npm run typeorm:create-migration --name=CreateUserTable).

### 1. Create Empty Migration
Use this when you want to write manual SQL for a migration.
```bash
npm run typeorm:create-migration --name=MigrationName
```

### 2. Generate Migration (Auto-detect Changes)
Use this after you have updated a .entity.ts file. TypeORM will compare your code with the database and generate the SQL automatically.
```bash
npm run typeorm:generate-migration --name=UpdateUserBio
```

### 3. Run Migrations
Apply all pending migrations to your database.
```bash
npm run typeorm:run-migration
```

### 4. Revert Migration
Undo the very last migration that was executed.
```bash
npm run typeorm:revert-migration
```

## 🛠️ TypeORM Commands

The following table provides an overview of the available TypeORM commands, their purposes, and the configuration files they use:

| Command   | Purpose                        | Configuration File            |
|-----------|--------------------------------|--------------------------------|
| `create`  | Generates a boilerplate file   | N/A                            |
| `generate`| Compares Entities vs DB        | `./typeorm/typeorm.config.ts` |
| `run`     | Executes SQL against DB        | `./typeorm/typeorm.config.ts` |
| `revert`  | Rolls back last batch          | `./typeorm/typeorm.config.ts` |

## ⚠️ Notes

- Ensure that the `typeorm/typeorm.config.ts` file is properly configured with your database connection settings.
- Use these commands to manage migrations and synchronize your database schema effectively.

## 💡 Best Practices
- Review Generated Code: Always check the generated migration file in ./typeorm/migrations/ before running it to ensure no accidental data loss is scripted.

- Atomic Changes: Keep migrations small. Instead of one giant migration for 10 tables, create smaller, logical migrations.

- Production Safety: Never run migration:generate against a production database. Always generate locally, commit the file, and use migration:run in your CI/CD pipeline.