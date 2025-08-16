import { Body, Controller, Get, Post } from '@nestjs/common';
import { authenticator } from 'otplib';

@Controller('totp')
export class TotpController {
  @Get('setup')
  setup() {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri('user@example.com', process.env.TOTP_ISSUER || 'Snapzy', secret);
    return { secret, otpauth };
  }

  @Post('verify')
  verify(@Body() body: { secret: string; token: string }) {
    const ok = authenticator.verify({ secret: body.secret, token: body.token });
    return { ok };
  }
}