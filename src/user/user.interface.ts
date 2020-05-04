export interface UserKey {
  id: string;
}

export interface User extends UserKey {
  username: string;
  password: string;
}
