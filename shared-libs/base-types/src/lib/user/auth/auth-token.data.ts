export type AuthUserType = 'client' | 'employee';

export type AuthTokenType = 'access' | 'refresh';

export interface AuthTokenPayload {
  id: string;
  type: AuthUserType;
  tokenType: AuthTokenType;
  role?: number;
}
