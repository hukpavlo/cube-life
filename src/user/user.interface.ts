export interface UserKey {
  id?: string;
}

export interface User {
  username: string;
  email: string;
}

export interface UserDB extends UserKey, User {
  createdAt?: Date;
  updatedAt?: Date;
}
