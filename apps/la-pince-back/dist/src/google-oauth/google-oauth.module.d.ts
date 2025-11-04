import { DynamicModule } from "@nestjs/common";
interface IGoogleModuleOptions {
    enabled: boolean;
    credentialsPath?: string;
    scopesAPI?: string;
}
export declare class GoogleModule {
    static forRoot(options?: IGoogleModuleOptions): DynamicModule;
}
export {};
