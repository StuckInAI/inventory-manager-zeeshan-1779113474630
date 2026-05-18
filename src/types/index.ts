// Core domain types for the ATS app

export type Role = 'Admin' | 'Recruiter' | 'HiringManager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type JobStatus = 'Open' | 'OnHold' | 'Closed' | 'Draft';
export type EmploymentType = 'FullTime' | 'PartTime' | 'Contract' | 'Internship';

export interface JobStage {
  id: string;
  name: string;
  order: number;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  status: JobStatus;
  description: string;
  requirements: string[];
  ownerId: string;
  recruiterIds: string[];
  hiringManagerIds: string[];
  stages: JobStage[];
  createdAt: string;
  publishedToCareers: boolean;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  summary?: string;
  tags?: string[];
  resumeUrl?: string;
  source?: string;
  createdAt: string;
}

export type ApplicationStatus = 'Active' | 'Hired' | 'Rejected' | 'Withdrawn';

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  stageId: string;
  status: ApplicationStatus;
  rating?: number;
  createdAt: string;
  source?: string;
  notes?: ApplicationNote[];
}

export interface ApplicationNote {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export type InterviewType = 'Phone' | 'Video' | 'Onsite' | 'Technical';
export type InterviewStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export interface Interview {
  id: string;
  applicationId: string;
  scheduledAt: string;
  durationMinutes: number;
  type: InterviewType;
  status: InterviewStatus;
  interviewerIds: string[];
  location?: string;
  notes?: string;
  feedback?: InterviewFeedback[];
}

export interface InterviewFeedback {
  id: string;
  interviewerId: string;
  rating: number;
  comments: string;
  createdAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export interface EmailMessage {
  id: string;
  toCandidateId: string;
  applicationId?: string;
  subject: string;
  body: string;
  sentAt: string;
  sentByUserId: string;
}

export interface AtsContextValue {
  users: User[];
  currentUser: User;
  setCurrentUserId: (id: string) => void;

  jobs: Job[];
  candidates: Candidate[];
  applications: Application[];
  interviews: Interview[];
  emailTemplates: EmailTemplate[];
  emails: EmailMessage[];

  createJob: (data: Omit<Job, 'id' | 'createdAt' | 'stages'> & { stages?: JobStage[] }) => Job;
  updateJob: (id: string, patch: Partial<Job>) => void;

  createCandidate: (data: Omit<Candidate, 'id' | 'createdAt'>) => Candidate;
  createApplication: (data: { candidateId: string; jobId: string; source?: string }) => Application;
  moveApplicationStage: (applicationId: string, stageId: string) => void;
  setApplicationStatus: (applicationId: string, status: ApplicationStatus) => void;
  addApplicationNote: (applicationId: string, body: string) => void;

  scheduleInterview: (data: Omit<Interview, 'id' | 'status' | 'feedback'>) => Interview;
  updateInterview: (id: string, patch: Partial<Interview>) => void;
  addInterviewFeedback: (interviewId: string, data: Omit<InterviewFeedback, 'id' | 'createdAt'>) => void;

  sendEmail: (data: Omit<EmailMessage, 'id' | 'sentAt' | 'sentByUserId'>) => EmailMessage;

  submitPublicApplication: (data: {
    jobId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
    summary?: string;
  }) => { candidate: Candidate; application: Application };
}
