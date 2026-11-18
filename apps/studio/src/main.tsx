import '@repo/i18n';

import { configureApiClient } from '@repo/api-client';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from 'react-oidc-context';

import { App } from './app/app.js';
import { createUserManager, type SigninState } from './auth/user-manager.js';
import { loadConfig } from './config/config.js';

const config = loadConfig();
const userManager = createUserManager(config);

configureApiClient({
  baseUrl: config.apiUrl,
  getAccessToken: async () => (await userManager.getUser())?.access_token,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthProvider
    userManager={userManager}
    onSigninCallback={(user) => {
      // Removes the OIDC parameters from the URL and goes back to the requested page.
      const state = user?.state as SigninState | undefined;
      window.history.replaceState(null, '', state?.returnTo ?? '/');
    }}
  >
    <App />
  </AuthProvider>,
);
