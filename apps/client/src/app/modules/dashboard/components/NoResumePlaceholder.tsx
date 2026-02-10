import { Plus } from 'lucide-react';
import type { FunctionComponent } from 'react';

export const NoResumePlaceholder: FunctionComponent = () => {
  return (
    <div className="flex justify-center">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
        <Plus className="w-5 h-5 text-muted-foreground" />
      </div>
    </div>
  )
}
