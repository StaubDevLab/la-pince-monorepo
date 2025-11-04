import { GoogleService } from "./google-oauth.service";
import { AuthService } from "src/auth/auth.service";
export declare class GoogleController {
    private readonly googleService;
    private readonly authService;
    constructor(googleService: GoogleService, authService: AuthService);
    googleAuth(): Promise<{
        url: string;
    }>;
    googleAuthCallback(code: string): Promise<{
        url: string;
    }>;
}
