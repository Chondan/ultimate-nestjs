# 🛠 Usage Instructions

Standard Usage in a Controller/Service
By passing AllConfigType as a generic to ConfigService, the .get() method will now provide auto-complete for your strings and correct return types.

```ts
import { ConfigType } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from './database.config';

export type AllConfigType = {
  app: ConfigType<typeof appConfig>;
  database: ConfigType<typeof databaseConfig>;
};
```

```ts
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';

@Controller()
export class AppController {
  constructor(
    // Pass the global type here
    private configService: ConfigService<AllConfigType>,
  ) {}

  @Get()
  getConfigExample() {
    /**
     * ✅ Type-safe Access
     * 'app.port' will be auto-completed by your IDE.
     * The return type is automatically inferred as 'number'.
     */
    const port = this.configService.get('app.port', { infer: true });
    
    /**
     * ✅ Nested Access
     * 'database.host' is inferred as 'string'.
     */
    const dbHost = this.configService.get('database.host', { infer: true });

    return { port, dbHost };
  }
}
```


Accessing Config in Services/Controllers
Do not use process.env or generic string lookups. Instead, inject the specific configuration namespace using the .KEY property.

```ts
import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import databaseConfig from './config/database.config';

@Injectable()
export class MyService {
  constructor(
    // ✅ Injection using the config's unique key
    @Inject(databaseConfig.KEY)
    private dbConfig: ConfigType<typeof databaseConfig>,
  ) {}

  connect() {
    // ✅ Full Auto-complete and Type Safety
    const url = `mongodb://${this.dbConfig.username}:${this.dbConfig.password}@${this.dbConfig.host}`;
    console.log(`Connecting to ${url}`);
  }
}
```