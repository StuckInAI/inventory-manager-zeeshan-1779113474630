import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  Application,
  Candidate,
  EmailLog,
  Interview,
  Job,
  Note,
  Role,
  Scorecard,
  Stage,
  User,
} from '@/types';
import { load, save, uid } from '@/lib/storage';
import {
  seedApplications,
  seedCandidates,
  seedEmails,
  seedInterviews,
  seedJobs,
  seedScorecards,
  seedUsers,
} from '@/lib/seed';

type AtsState = {
  users: User[];
  jobs: Job[];
  candidates: Candidate[];
  applications: Application[];
  interviews: Interview[];
  scorecards: Scorecard[];
  emails: EmailLog[];
  currentUserId: string;
};

type AtsContextValue = AtsState & {
  currentUser: User;
  setCurrentUserId: (id: string) => void;

  // users
  addUser: (u: Omit<User, 'id'>) => void;
  updateUser: (id: string, patch: Partial<User>) => void;

  // jobs
  addJob: (j: Omit<Job, 'id' | 'createdAt'>) => Job;
  updateJob: (id: string, patch: Partial<Job>) => void;
  addStage: (jobId: string, name: string) => void;
  renameStage: (jobId: string, stageId: string, name: string) => void;
  removeStage: (jobId: string, stageId: string) => void;
  reorderStages: (jobId: string, orderedIds: string[]) => void;

  // candidates
  addCandidate: (c: Omit<Candidate, 'id' | 'createdAt' | 'notes'>) => Candidate;
  addNote: (candidateId: string, body: string) => void;

  // applications
  addApplication: (jobId: string, candidate: { name: string; email: string; phone: string; resumeName?: string; coverLetter?: string }) => Application;
  moveApplicationToStage: (appId: string, stageId: string) => void;
  rejectApplication: (appId: string) => void;
  archiveApplication: (appId: string) => void;

  // interviews
  addInterview: (i: Omit<Interview, 'id'>) => void;
  updateInterview: (id: string, patch: Partial<Interview>) => void;
  removeInterview: (id: string) => void;

  // scorecards
  addScorecard: (s: Omit<Scorecard, 'id' | 'submittedAt'>) => void;

  // emails
  sendEmail: (e: Omit<EmailLog, 'id' | 'sentAt'>) => void;
};

const AtsContext = createContext<AtsContextValue | null>(null);

const INITIAL_STATE: AtsState = {
  users: seedUsers,
  jobs: seedJobs,
  candidates: seedCandidates,
  applications: seedApplications,
  interviews: seedInterviews,
  scorecards: seedScorecards,
  emails: seedEmails,
  currentUserId: 'u_admin',
};

export function AtsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AtsState>(() => load<AtsState>('state', INITIAL_STATE));

  useEffect(() => {
    save('state', state);
  }, [state]);

  const currentUser = useMemo<User>(() => {
    return state.users.find((u) => u.id === state.currentUserId) ?? state.users[0];
  }, [state.users, state.currentUserId]);

  const setCurrentUserId = useCallback((id: string) => {
    setState((s) => ({ ...s, currentUserId: id }));
  }, []);

  const addUser = useCallback((u: Omit<User, 'id'>) => {
    setState((s) => ({ ...s, users: [...s.users, { ...u, id: uid('u') }] }));
  }, []);

  const updateUser = useCallback((id: string, patch: Partial<User>) => {
    setState((s) => ({ ...s, users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) }));
  }, []);

  const addJob = useCallback((j: Omit<Job, 'id' | 'createdAt'>): Job => {
    const newJob: Job = { ...j, id: uid('j'), createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, jobs: [...s.jobs, newJob] }));
    return newJob;
  }, []);

  const updateJob = useCallback((id: string, patch: Partial<Job>) => {
    setState((s) => ({ ...s, jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)) }));
  }, []);

  const addStage = useCallback((jobId: string, name: string) => {
    setState((s) => ({
      ...s,
      jobs: s.jobs.map((j) => {
        if (j.id !== jobId) return j;
        const stage: Stage = { id: uid('s'), name, order: j.stages.length };
        return { ...j, stages: [...j.stages, stage] };
      }),
    }));
  }, []);

  const renameStage = useCallback((jobId: string, stageId: string, name: string) => {
    setState((s) => ({
      ...s,
      jobs: s.jobs.map((j) =>
        j.id !== jobId ? j : { ...j, stages: j.stages.map((st) => (st.id === stageId ? { ...st, name } : st)) }
      ),
    }));
  }, []);

  const removeStage = useCallback((jobId: string, stageId: string) => {
    setState((s) => {
      const job = s.jobs.find((j) => j.id === jobId);
      if (!job) return s;
      if (job.stages.length <= 1) return s;
      const remaining = job.stages.filter((st) => st.id !== stageId).map((st, i) => ({ ...st, order: i }));
      const fallback = remaining[0]?.id;
      const apps = s.applications.map((a) => (a.jobId === jobId && a.stageId === stageId && fallback ? { ...a, stageId: fallback } : a));
      return {
        ...s,
        jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, stages: remaining } : j)),
        applications: apps,
      };
    });
  }, []);

  const reorderStages = useCallback((jobId: string, orderedIds: string[]) => {
    setState((s) => ({
      ...s,
      jobs: s.jobs.map((j) => {
        if (j.id !== jobId) return j;
        const byId = new Map(j.stages.map((st) => [st.id, st]));
        const reordered: Stage[] = orderedIds
          .map((id, idx) => {
            const st = byId.get(id);
            return st ? { ...st, order: idx } : null;
          })
          .filter((x): x is Stage => x !== null);
        return { ...j, stages: reordered };
      }),
    }));
  }, []);

  const addCandidate = useCallback((c: Omit<Candidate, 'id' | 'createdAt' | 'notes'>): Candidate => {
    const newC: Candidate = { ...c, id: uid('c'), notes: [], createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, candidates: [...s.candidates, newC] }));
    return newC;
  }, []);

  const addNote = useCallback(
    (candidateId: string, body: string) => {
      setState((s) => {
        const author = s.users.find((u) => u.id === s.currentUserId);
        const note: Note = {
          id: uid('n'),
          body,
          authorId: author?.id ?? '',
          authorName: author?.name ?? 'Unknown',
          createdAt: new Date().toISOString(),
        };
        return {
          ...s,
          candidates: s.candidates.map((c) => (c.id === candidateId ? { ...c, notes: [note, ...c.notes] } : c)),
        };
      });
    },
    []
  );

  const addApplication: AtsContextValue['addApplication'] = useCallback((jobId, candidateInput) => {
    let createdApp: Application | null = null;
    setState((s) => {
      const job = s.jobs.find((j) => j.id === jobId);
      if (!job || job.stages.length === 0) return s;
      const firstStage = [...job.stages].sort((a, b) => a.order - b.order)[0];

      let candidate = s.candidates.find((c) => c.email.toLowerCase() === candidateInput.email.toLowerCase());
      let candidates = s.candidates;
      if (!candidate) {
        candidate = {
          id: uid('c'),
          name: candidateInput.name,
          email: candidateInput.email,
          phone: candidateInput.phone,
          resumeName: candidateInput.resumeName,
          notes: [],
          createdAt: new Date().toISOString(),
        };
        candidates = [...candidates, candidate];
      }

      const now = new Date().toISOString();
      const app: Application = {
        id: uid('a'),
        jobId,
        candidateId: candidate.id,
        stageId: firstStage.id,
        stageEnteredAt: now,
        coverLetter: candidateInput.coverLetter,
        rejected: false,
        archived: false,
        history: [{ stageId: firstStage.id, stageName: firstStage.name, enteredAt: now }],
        createdAt: now,
      };
      createdApp = app;

      const email: EmailLog = {
        id: uid('e'),
        candidateId: candidate.id,
        applicationId: app.id,
        to: candidate.email,
        subject: `Application received: ${job.title}`,
        body: `Hi ${candidate.name},\n\nThanks for applying to the ${job.title} role. We've received your application and will be in touch soon.\n\n— The Recruiting Team`,
        sentAt: now,
        trigger: 'application_received',
      };

      return {
        ...s,
        candidates,
        applications: [...s.applications, app],
        emails: [email, ...s.emails],
      };
    });
    return createdApp as unknown as Application;
  }, []);

  const moveApplicationToStage = useCallback((appId: string, stageId: string) => {
    setState((s) => {
      const app = s.applications.find((a) => a.id === appId);
      if (!app) return s;
      const job = s.jobs.find((j) => j.id === app.jobId);
      const stage = job?.stages.find((st) => st.id === stageId);
      if (!stage) return s;
      const now = new Date().toISOString();
      const candidate = s.candidates.find((c) => c.id === app.candidateId);
      const updated: Application = {
        ...app,
        stageId,
        stageEnteredAt: now,
        history: [...app.history, { stageId, stageName: stage.name, enteredAt: now, by: s.currentUserId }],
      };
      const email: EmailLog | null = candidate
        ? {
            id: uid('e'),
            candidateId: candidate.id,
            applicationId: app.id,
            to: candidate.email,
            subject: `Update on your application — ${job?.title ?? ''}`,
            body: `Hi ${candidate.name},\n\nGood news — your application has progressed to the "${stage.name}" stage.\n\n— The Recruiting Team`,
            sentAt: now,
            trigger: 'stage_change',
          }
        : null;
      return {
        ...s,
        applications: s.applications.map((a) => (a.id === appId ? updated : a)),
        emails: email ? [email, ...s.emails] : s.emails,
      };
    });
  }, []);

  const rejectApplication = useCallback((appId: string) => {
    setState((s) => {
      const app = s.applications.find((a) => a.id === appId);
      if (!app) return s;
      const candidate = s.candidates.find((c) => c.id === app.candidateId);
      const job = s.jobs.find((j) => j.id === app.jobId);
      const now = new Date().toISOString();
      const email: EmailLog | null = candidate
        ? {
            id: uid('e'),
            candidateId: candidate.id,
            applicationId: app.id,
            to: candidate.email,
            subject: `Update on your application — ${job?.title ?? ''}`,
            body: `Hi ${candidate.name},\n\nThank you for your interest. After careful consideration, we won't be moving forward at this time. We wish you the best.\n\n— The Recruiting Team`,
            sentAt: now,
            trigger: 'rejection',
          }
        : null;
      return {
        ...s,
        applications: s.applications.map((a) => (a.id === appId ? { ...a, rejected: true } : a)),
        emails: email ? [email, ...s.emails] : s.emails,
      };
    });
  }, []);

  const archiveApplication = useCallback((appId: string) => {
    setState((s) => ({
      ...s,
      applications: s.applications.map((a) => (a.id === appId ? { ...a, archived: true } : a)),
    }));
  }, []);

  const addInterview = useCallback((i: Omit<Interview, 'id'>) => {
    setState((s) => {
      const interview: Interview = { ...i, id: uid('iv') };
      const app = s.applications.find((a) => a.id === i.applicationId);
      const candidate = app ? s.candidates.find((c) => c.id === app.candidateId) : undefined;
      const job = app ? s.jobs.find((j) => j.id === app.jobId) : undefined;
      const emails: EmailLog[] = [];
      if (candidate && job) {
        emails.push({
          id: uid('e'),
          candidateId: candidate.id,
          applicationId: app!.id,
          to: candidate.email,
          subject: `Interview scheduled — ${job.title}`,
          body: `Hi ${candidate.name},\n\nYou're scheduled for: ${i.title}\nWhen: ${new Date(i.date).toLocaleString()}\nFormat: ${i.format}\n\n— The Recruiting Team`,
          sentAt: new Date().toISOString(),
          trigger: 'interview_invite',
        });
      }
      return { ...s, interviews: [...s.interviews, interview], emails: [...emails, ...s.emails] };
    });
  }, []);

  const updateInterview = useCallback((id: string, patch: Partial<Interview>) => {
    setState((s) => ({ ...s, interviews: s.interviews.map((iv) => (iv.id === id ? { ...iv, ...patch } : iv)) }));
  }, []);

  const removeInterview = useCallback((id: string) => {
    setState((s) => ({ ...s, interviews: s.interviews.filter((iv) => iv.id !== id) }));
  }, []);

  const addScorecard = useCallback((sc: Omit<Scorecard, 'id' | 'submittedAt'>) => {
    setState((s) => ({
      ...s,
      scorecards: [...s.scorecards, { ...sc, id: uid('sc'), submittedAt: new Date().toISOString() }],
    }));
  }, []);

  const sendEmail = useCallback((e: Omit<EmailLog, 'id' | 'sentAt'>) => {
    setState((s) => ({
      ...s,
      emails: [{ ...e, id: uid('e'), sentAt: new Date().toISOString() }, ...s.emails],
    }));
  }, []);

  const value: AtsContextValue = {
    ...state,
    currentUser,
    setCurrentUserId,
    addUser,
    updateUser,
    addJob,
    updateJob,
    addStage,
    renameStage,
    removeStage,
    reorderStages,
    addCandidate,
    addNote,
    addApplication,
    moveApplicationToStage,
    rejectApplication,
    archiveApplication,
    addInterview,
    updateInterview,
    removeInterview,
    addScorecard,
    sendEmail,
  };

  return <AtsContext.Provider value={value}>{children}</AtsContext.Provider>;
}

export function useAts(): AtsContextValue {
  const ctx = useContext(AtsContext);
  if (!ctx) throw new Error('useAts must be used within AtsProvider');
  return ctx;
}

export function can(role: Role, action:
  | 'manageUsers'
  | 'manageJobs'
  | 'manageCandidates'
  | 'moveStages'
  | 'viewScorecards'
  | 'submitScorecard'
  | 'sendEmail'
  | 'scheduleInterviews'
): boolean {
  switch (role) {
    case 'Admin':
      return true;
    case 'Recruiter':
      return ['manageJobs', 'manageCandidates', 'moveStages', 'viewScorecards', 'sendEmail', 'scheduleInterviews', 'submitScorecard'].includes(action);
    case 'HiringManager':
      return ['moveStages', 'viewScorecards', 'submitScorecard', 'scheduleInterviews'].includes(action);
    case 'Interviewer':
      return ['submitScorecard'].includes(action);
    default:
      return false;
  }
}
