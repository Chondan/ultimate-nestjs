import { registerAs } from '@nestjs/config';
import { ClassConstructor } from 'class-transformer';
import { validateConfig } from './validate-config';

export function createConfigLoader<T extends object>(prefix: string, ValidatorClass: ClassConstructor<any>, mapFn: () => T) {
    return registerAs(prefix, () => {
        console.info(`Registering ${prefix}Config from environment variables`);

        // Validate the raw process.env against the Validator class
        validateConfig(process.env, ValidatorClass);

        // Return the mapped/typed object
        return mapFn();
    });
}
