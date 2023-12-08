export interface AuthTokenResult {
  email: string;
  sub: string;
  roles: string[];
  iat: number;
  exp: number;
}

export interface IUseToken {
  sub: string;
  roles: string[];
  isExpired: boolean;
}
