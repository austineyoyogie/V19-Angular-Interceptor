import {DataState} from "../enum/data-state";
import {Role} from "./roles";
import {User} from "./users";
import {Events} from './events';

export interface LoginState {
  dataState: DataState;
  loginSuccess?: boolean;
  error?: string;
  message?: string;
  isUsingMfa?: boolean;
  phone?: string;
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
  user: User[];
  events?: Events[]
  roles?: Role[];
  access_token?: string;
  refresh_token?: string;
}
