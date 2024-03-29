import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { User } from '@marlborough/model';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private _userService: UserService,
    private _jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<User | undefined> {
    const isValid = this._userService.findUser$(username).pipe(
      map((u) => {
        if (u !== undefined && u.password === pass) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...user } = u;
          return user;
        } else {
          return undefined;
        }
      }),
    );

    // convert to a promise as passport will use them instead of observables
    return await firstValueFrom(isValid);
  }

  async login(user: any) {
    const payload = { username: user.username };
    return {
      access_token: this._jwtService.sign(payload),
    };
  }
}
