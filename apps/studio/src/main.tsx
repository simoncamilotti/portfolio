import '@repo/i18n';

import { configureApiClient } from '@repo/api-client';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter } from 'react-router';

import { App } from './app/app.js';
import { getStoredToken, initAuth } from './app/modules/auth/auth.js';
import { routes } from './app/routes/routes.js';

if (!window.config?.auth) {
  throw new Error(
    'Missing config: public/config.js is not loaded. Copy public/config.example.js to public/config.js and fill in the values.',
  );
}

// Same origin: the ingress (and the Vite proxy in development) routes /api to the API.
configureApiClient({ baseUrl: '', getAccessToken: () => getStoredToken() ?? undefined });

initAuth({
  realm: window.config.auth.realm,
  clientId: window.config.auth.clientId,
  url: window.config.auth.url,
})
  .then(() => {
    const router = createBrowserRouter(routes);

    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <App router={router} />,
    );
  })
  .catch((error) => {
    console.error(error);
  });
