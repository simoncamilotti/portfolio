import { useQuery } from '@tanstack/react-query';
import type { FunctionComponent } from 'react';

import { resumesKey } from '../resumes.key';
import { ResumesService } from '../resumes.service';
import { NoResumePlaceholder } from './NoResumePlaceholder';
import { ResumeItem } from './ResumeItem';

export const DashboardResumeList: FunctionComponent = () => {
  const { data: resumes, isPending } = useQuery({
    queryKey: resumesKey.getAllResumes,
    queryFn: ResumesService.getAllResumes,
  });

  return (
    <>
      {isPending ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-20 rounded-xl border border-border/50 bg-card animate-pulse" />
          ))}
        </div>
      ) : resumes?.length === 0 ? (
        <section className="max-w-7xl mx-auto">
          <div className="text-center py-20 text-muted-foreground">
            <NoResumePlaceholder />
            <p className="mt-4 text-sm">Aucun CV. Créez votre premier !</p>
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto">
          {resumes?.map((resume, index) => (
            <ResumeItem key={resume.id} resumeIndex={index} resume={resume} />
          ))}
        </section>
      )}
    </>
  );
};
