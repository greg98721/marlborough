import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const userService = new UserService();
    service = new AuthService(
      userService,
      new JwtService({ secret: 'wibble-flibble' }),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // test validateUser method
  it('should return a user if the user is valid', async () => {
    const user = { username: 'bob', password: 'topSecret' };
    const userDetails = await service.validateUser(
      user.username,
      user.password,
    );
    expect(userDetails?.fullname).toBe('Bob Smith');
  });

  it('should return undefined if the user is invalid', async () => {
    const user = { username: 'bob', password: 'wrongSecret' };
    const userDetails = await service.validateUser(
      user.username,
      user.password,
    );
    expect(userDetails).toBeUndefined();
  });

  // test login method
  it('should return a valid JWT token', async () => {
    const user = { username: 'Bob' };
    expect((await service.login(user)).access_token).toBeDefined();
  });
});
