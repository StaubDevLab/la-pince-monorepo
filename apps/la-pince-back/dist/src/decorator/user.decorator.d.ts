import * as schema from '../db/schema';
export type UserEntity = schema.User & {
    accountId: string;
    accountName: string;
    amount: number;
};
export declare const User: (...dataOrPipes: unknown[]) => ParameterDecorator;
