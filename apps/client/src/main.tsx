import ReactDOM from 'react-dom/client';
import { createBrowserRouter } from 'react-router';

import { App } from './app/App';
import { routes } from './app/routes/routes';

const router = createBrowserRouter(routes);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App router={router} />);
