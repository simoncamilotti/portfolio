import { motion } from 'framer-motion';
import type { FunctionComponent } from 'react';

import { RouteAnchors } from '../../../routes/paths.const';

export const PublicResume: FunctionComponent = () => {
  return (
    <section id={RouteAnchors.HOME.RESUME} className="py-24 border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-10">
            Curriculum Vitae
          </h2>
          {/*<PublicCV />*/}
        </motion.div>
      </div>
    </section>
  );
};
