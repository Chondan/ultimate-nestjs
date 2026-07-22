import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class EntityToDtoInterceptor<Entity, Dto> implements NestInterceptor {
    constructor(private readonly dto: new () => Dto) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data: Entity | Entity[]) => {
                if (Array.isArray(data)) {
                    return data.map((item) =>
                        plainToInstance(this.dto, item, {
                            excludeExtraneousValues: true, // <--- Strips out any unexposed fields
                        }),
                    );
                }
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true, // <--- Strips out any unexposed fields
                });
            }),
        );
    }
}
