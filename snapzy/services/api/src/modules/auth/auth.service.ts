import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	constructor(private readonly users: UsersService, private readonly jwt: JwtService) {}

	async loginWithPassword(handleOrEmail: string, password: string) {
		const user = (await this.users.findByHandle(handleOrEmail)) || null;
		if (!user) throw new UnauthorizedException('Invalid credentials');
		const ok = await this.users.verifyPassword(user, password);
		if (!ok) throw new UnauthorizedException('Invalid credentials');
		const access = await this.jwt.signAsync({ sub: user.id, h: user.handle });
		return { access_token: access, user };
	}
}