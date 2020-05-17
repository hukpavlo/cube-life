import { RegistrationType } from './constants';

export interface UserKey {
  id?: string;
}

export interface User {
  email: string;
  username: string;
  password?: string;
}

export interface UserDB extends UserKey, User {
  confirmed: boolean;
  from: RegistrationType;
  confirmationCode?: {
    value: string;
    expiresAt: number;
    attemptsBalance: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
