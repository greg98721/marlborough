import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const userService = new UserService();
    service = new AuthService(userService, new JwtService({}));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
