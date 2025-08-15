import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { Logger } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true });
	const logger = new Logger('Bootstrap');

	app.use(helmet());
	app.use(cookieParser());
	app.enableCors({ origin: true, credentials: true });
	app.setGlobalPrefix('api');
	app.use(rateLimit({ windowMs: Number(process.env.RATE_LIMIT_DURATION || 60) * 1000, max: Number(process.env.RATE_LIMIT_POINTS || 100) }));

	const port = Number(process.env.API_PORT || 8080);
	await app.listen(port, '0.0.0.0');
	logger.log(`API listening on ${port}`);
}
bootstrap();