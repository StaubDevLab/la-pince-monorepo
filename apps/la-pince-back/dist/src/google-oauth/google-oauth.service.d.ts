import { OnModuleInit } from '@nestjs/common';
import { oauth2_v2 } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
export declare class GoogleService implements OnModuleInit {
    private configService;
    private readonly logger;
    private readonly scopesAPI;
    private readonly credentialsPath;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    readCredentials(filePath: string): IGoogleAuthCredentials;
    getOAuth2ClientUrl(): Promise<{
        url: string;
    }>;
    getAuthClient(): OAuth2Client;
    getAuthUrl(authClient: OAuth2Client): {
        url: string;
    };
    getAuthClientData(code: string): Promise<{
        userData: oauth2_v2.Schema$Userinfo;
        refreshToken: string;
        accessToken: string;
    }>;
}
export interface IGoogleAuthCredentials {
    web: {
        client_id: string;
        client_secret: string;
        redirect_uris: string[];
        auth_uri: string;
        token_uri: string;
        auth_provider_x509_cert_url: string;
        javascript_origins: string[];
    };
}
export interface IGoogleAuthUserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
}
