import { DynamicModule } from "@nestjs/common";
interface SlackModuleOptions {
    enable?: boolean;
    isGlobal?: boolean;
}
export declare class SlackModule {
    static register(options?: SlackModuleOptions): DynamicModule;
}
export {};
