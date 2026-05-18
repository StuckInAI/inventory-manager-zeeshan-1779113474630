export type Role = 'Admin' | 'Recruiter' | 'HiringManager' | 'Interviewer';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
};

export type JobStatus = 'draft' | 'open' | 'closed';
export type JobVisibility = 'public' | 'private';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export type Stage = {
  id: string;
  name: string;
  order: number;
};

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  employmentType: EmploymentType;
  visibility: JobVisibility;
  status: JobStatus;
  stages: Stage[];
  assignedRecruiterId?: string;
  hiringManagerId?: string;
  createdAt: string;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeName?: string;
  notes: Note[];
  createdAt: string;
};

export type Application = {
  id: string;
  jobId: string;
  candidateId: string;
  stageId: string;
  stageEnteredAt: string;
  coverLetter?: string;
  rejected: boolean;
  archived: boolean;
  history: StageHistoryEntry[];
  createdAt: string;
};

export type StageHistoryEntry = {
  stageId: string;
  stageName: string;
  enteredAt: string;
  by?: string;
};

export type Note = {
  id: string;
  body: string;
  authorId: string;
  authorName: string;
  createdAt: string;
};

export type InterviewFormat = 'In-person' | 'Phone' | 'Video';

export type Interview = {
  id: string;
  applicationId: string;
  title: string;
  date: string; // ISO
  durationMinutes: number;
  format: InterviewFormat;
  interviewerIds: string[];
  notes?: string;
};

export type Recommendation = 'Strong Yes' | 'Yes' | 'No' | 'Strong No';

export type Scorecard = {
  id: string;
  interviewId: string;
  applicationId: string;
  interviewerId: string;
  interviewerName: string;
  ratings: { criterion: string; score: number }[];
  feedback: string;
  recommendation: Recommendation;
  submittedAt: string;
};

export type EmailLog = {
  id: string;
  candidateId: string;
  applicationId?: string;
  subject: string;
  body: string;
  to: string;
  sentAt: string;
  trigger: 'manual' | 'application_received' | 'stage_change' | 'interview_invite' | 'rejection';
};

export type ActivityEntry = {
  id: string;
  type: 'application' | 'stage_change' | 'interview' | 'note' | 'email' | 'hire' | 'reject';
  message: string;
  at: string;
};
