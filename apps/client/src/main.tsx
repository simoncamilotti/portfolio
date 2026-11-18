import '@repo/i18n';

import { configureApiClient } from '@repo/api-client';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter } from 'react-router';

import { App } from './app/app.js';
import { routes } from './app/routes/routes.js';
import { loadConfig } from './config/config.js';

const config = loadConfig();

configureApiClient({ baseUrl: config.apiUrl });

if (config.umami.src && config.umami.websiteId) {
  const script = document.createElement('script');
  script.defer = true;
  script.src = config.umami.src;
  script.dataset['websiteId'] = config.umami.websiteId;
  document.head.appendChild(script);
}

const router = createBrowserRouter(routes);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App router={router} />);
