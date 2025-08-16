import { Controller, Get, Query, Res } from '@nestjs/common';
import fetch from 'cross-fetch';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('oauth')
export class OauthController {
  constructor(private readonly jwt: JwtService) {}

  @Get('google/init')
  init(@Res() res: Response) {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      redirect_uri: `${process.env.APP_BASE_URL || 'http://localhost:3000'}/api/oauth/google/callback`,
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'consent'
    });
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  }

  @Get('google/callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${process.env.APP_BASE_URL || 'http://localhost:3000'}/api/oauth/google/callback`,
        grant_type: 'authorization_code'
      }) as any
    });
    const token = await tokenRes.json() as any;
    const idTok = token.id_token as string;
    // In production: verify id_token JWT signature & extract email/sub
    const access = await this.jwt.signAsync({ sub: '1', handle: 'demo' }, { expiresIn: '15m' });
    res.redirect(`${process.env.APP_BASE_URL || 'http://localhost:3000'}/auth/login?oauth=ok&access=${access}`);
  }
}