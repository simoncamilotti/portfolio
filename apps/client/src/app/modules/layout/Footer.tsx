import type { FunctionComponent } from 'react';

export const Footer: FunctionComponent = () => {
  return (
    <footer className="border-t border-border/50 py-10 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[13px] text-muted-foreground">
        <span>© {new Date().getFullYear()} Portfolio. Tous droits réservés.</span>
        <span>
          Conçu avec <span className="text-primary">♥</span> et beaucoup de café
        </span>
      </div>
    </footer>
  );
};
