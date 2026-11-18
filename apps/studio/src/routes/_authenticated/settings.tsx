import { createFileRoute } from '@tanstack/react-router';

import { SettingsPage } from '../../app/pages/settings-page.js';

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsPage,
});
