import { motion } from 'framer-motion';
import type { FunctionComponent } from 'react';

import { RouteAnchors } from '../../../routes/paths.const';

type ProjectSectionProps = {
  projects: any[];
};

export const ProjectsSection: FunctionComponent<ProjectSectionProps> = ({ projects }) => {
  return (
    <section id={RouteAnchors.HOME.PROJECTS} className="py-24 border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-10">Projets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/*<ProjectCard key={project.id} project={project} index={i} />*/}
            {projects.map((project, i) => (
              <div>{project.name}</div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
