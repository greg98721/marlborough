import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AirRoutesController } from './air-routes/airRoutes.controller';
import { ScheduleService } from './schedule/schedule.service';
import { FlightsController } from './flights/flights.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { LocalStrategy } from './auth/local.strategy';
import { AuthController } from './auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        '..',
        'marlborough-client',
        'dist',
        'marlborough-client',
      ),
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AirRoutesController, FlightsController, AuthController],
  providers: [
    ScheduleService,
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AppModule {}
