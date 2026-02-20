import type { ResumeDto } from '@portfolio/shared-models';
import type { FunctionComponent } from 'react';

import { NoResumePlaceholder } from './NoResumePlaceholder';
import { ResumeItem } from './ResumeItem';

type DashboardResumeListProps = {
  resumes?: ResumeDto[];
};

export const DashboardResumeList: FunctionComponent<DashboardResumeListProps> = ({ resumes }) => {
  return (
    <>
      {resumes?.length === 0 ? (
        <section className="max-w-7xl mx-auto">
          <div className="text-center py-20 text-muted-foreground">
            <NoResumePlaceholder />
            <p className="mt-4 text-sm">Aucun CV. Créez votre premier !</p>
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto">
          <div className="space-y-1.5">
            {resumes?.map((resume, index) => (
              <ResumeItem key={resume.id} resumeIndex={index} resume={resume} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};
