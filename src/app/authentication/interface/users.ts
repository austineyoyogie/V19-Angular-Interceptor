import {Events} from './events';
import {Role} from './roles';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  token: string;
  role_id: string;
  role: string;
  name: string;
  usingMfa: string;
  permission: string;
  enabled: string;
  active: string;
  login_at: string;
  createdAt: string;
  updatedAt: string;

  // constructor() {
  //   this.id = '';
  //   this.first_name = '';
  //   this.last_name = '';
  //   this.email = '';
  //   this.phone = '';
  //   this.token = '';
  //   this.role_id = '';
  //   this.roles = '';
  //   this.usingMfa = '';
  //   this.permission = '';
  //   this.enabled = '';
  //   this.active = '';
  //   this.login_at = '';
  //   this.createdAt = '';
  //   this.updatedAt = '';
  // }
}
export interface CustomHttpResponse<T> {
  timestamp: Date;
  statusCode: number;
  status: string;
  message: string;
  reason?: string;
  developerMessage?: string;
  data?: T;

}

export interface Profile {
  user: User;
  events?: Events[]
  roles?: Role[];
  access_token?: string;
  refresh_token?: string;
}

// export class User {
//   id: number;
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone?: string;
//   token: string;
//   role_id: number;
//   roles: number;
//   usingMfa: boolean;
//   permission: string;
//   enabled: boolean;
//   login_at?: Date;
//   createdAt?: Date;
//   updatedAt?: Date;
// }
