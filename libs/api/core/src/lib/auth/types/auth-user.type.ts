export type AuthUser = {
  id: string;
  keycloakId: string;
  username: string;
  firstName: string;
  lastName: string;
  locale: string;
  email: string;
  roles: string[];
};
