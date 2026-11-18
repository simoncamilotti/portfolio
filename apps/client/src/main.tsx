import '@repo/i18n';

import { configureApiClient } from '@repo/api-client';
import ReactDOM from 'react-dom/client';

import { App } from './app/app.js';
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
