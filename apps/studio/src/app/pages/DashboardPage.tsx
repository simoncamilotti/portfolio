import { PageLayout } from '@portfolio/shared-ui';
import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

import { DashboardHeader } from '../modules/dashboard/components/DashboardHeader';
import { DashboardResumeList } from '../modules/dashboard/components/DashboardResumeList';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../modules/ui/Dialog';

export const DashboardPage: FunctionComponent = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    // await api.createCV(newTitle);
    setNewTitle('');
    setCreateOpen(false);
    // await loadCVs();
    toast.success('CV créé avec succès');
  };

  return (
    <PageLayout>
      <div className="pt-20 pb-24 relative overflow-hidden">
        <DashboardHeader setCreateOpen={setCreateOpen} />

        <DashboardResumeList />
        {/* Create Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="sm:max-w-md border-border/50">
            <DialogHeader>
              <DialogTitle>Nouveau CV</DialogTitle>
            </DialogHeader>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="Titre du CV..."
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
            <DialogFooter>
              <button
                onClick={() => setCreateOpen(false)}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreate}
                disabled={!newTitle.trim()}
                className="px-3.5 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Créer
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};
