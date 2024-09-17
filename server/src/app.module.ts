import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './1-auth/auth.module';
import configuration from 'config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PostModule } from './2-post/post.module';

@Module({
  imports: [/*PrismaModule */
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    AuthModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    PostModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
