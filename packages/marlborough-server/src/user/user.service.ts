import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

import { User } from '@marlborough/model';

export interface UserWithPassword extends User {
  password: string;
}

@Injectable()
export class UserService {
  private readonly _allUsers: UserWithPassword[] = [
    { username: 'bob', password: 'topSecret' },
  ];

  findUser$(username: string): Observable<UserWithPassword | undefined> {
    return of(this._allUsers.find((u) => u.username === username));
  }
}
