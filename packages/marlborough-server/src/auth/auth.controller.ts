import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { map } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private _authService: AuthService,
    private _userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('user/:username')
  user(@Param('username') username: string) {
    return this._userService.findUser$(username).pipe(
      map((user) => {
        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...result } = user;
          return result;
        } else {
          throw new HttpException(
            `User ${username} not found`,
            HttpStatus.NOT_FOUND,
          );
        }
      }),
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this._authService.login(req.user);
  }
}
