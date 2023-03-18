export interface UserDatabase {
  uuid: string;
  isVerify: boolean;
  username: string;
  password: string;
  salt: string;
  email: string;
}

export interface UserToken {
  uuid: string;
  username: string;
}
