import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { HealthResolver } from './health.resolver';
import { User } from '../orm/user.entity';
import { AuthModule } from './auth.module';
import { PostEntity } from '../orm/post.entity';
import { PostsController } from './posts.controller';
import { RecsController } from './recs.controller';
import { SearchController } from './search.controller';
import { FlagsController } from './flags.controller';
import { DmController } from './dm.controller';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'dist/schema.gql'),
      playground: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT || 5432),
      username: process.env.POSTGRES_USER || 'snapzy',
      password: process.env.POSTGRES_PASSWORD || 'snapzy',
      database: process.env.POSTGRES_DB || 'snapzy',
      entities: [User, PostEntity],
      synchronize: false
    }),
    TypeOrmModule.forFeature([User, PostEntity]),
    AuthModule
  ],
  controllers: [HealthController, PostsController, RecsController, SearchController, FlagsController, DmController, PaymentsController],
  providers: [HealthResolver]
})
export class AppModule {}