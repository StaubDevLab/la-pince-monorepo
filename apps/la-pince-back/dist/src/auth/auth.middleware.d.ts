import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
export declare class AuthMiddleware implements NestMiddleware {
    private readonly jwtService;
    private readonly usersService;
    constructor(jwtService: JwtService, usersService: UsersService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
