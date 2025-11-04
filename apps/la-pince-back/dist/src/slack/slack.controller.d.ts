import { SlackService } from "./slack.service";
export declare class SlackController {
    private readonly slackService;
    constructor(slackService: SlackService);
    postToSlack(): Promise<void>;
}
