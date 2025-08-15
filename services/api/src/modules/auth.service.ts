import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../orm/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService
  ) {}

  async loginWithPassword(handleOrEmail: string, password: string) {
    const user = await this.users.findOne({
      where: [{ handle: handleOrEmail }, { email: handleOrEmail }]
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, handle: user.handle };
    const access = await this.jwt.signAsync(payload, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
    const refresh = await this.jwt.signAsync(payload, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' });
    return { access, refresh };
  }
}