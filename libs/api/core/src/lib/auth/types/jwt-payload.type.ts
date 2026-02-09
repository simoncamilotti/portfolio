export type JWTPayload = {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  'allowed-origins': string[];
  realm_access: {
    roles: string[];
  };
  resource_access: Record<string, { roles: string[] }>;
  scope: string;
  sid: string;
  email_verified: true;
  name: string;
  preferred_username: string;
  given_name: string;
  locale: string;
  family_name: string;
  email: string;
};
