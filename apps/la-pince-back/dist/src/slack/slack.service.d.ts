import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
export declare class SlackService {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    postToSlack(message: string, level?: "error" | "success" | "info" | "warning"): Promise<void>;
}
