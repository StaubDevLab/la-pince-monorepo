import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private readonly mailerService;
    private readonly logger;
    constructor(mailerService: MailerService);
    sendEmail(params: {
        to: string | string[];
        subject: string;
        template: string;
        context: ISendMailOptions['context'];
    }): Promise<void>;
}
