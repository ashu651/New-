import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly auth: AuthService) {}

	@Post('login')
	async login(@Body() body: { handle: string; password: string }) {
		return this.auth.loginWithPassword(body.handle, body.password);
	}
}