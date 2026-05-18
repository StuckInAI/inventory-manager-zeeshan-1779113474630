import type { Application, Candidate, EmailLog, Interview, Job, Scorecard, User } from '@/types';

export const seedUsers: User[] = [
  { id: 'u_admin', name: 'Alex Admin', email: 'alex@company.com', role: 'Admin', active: true },
  { id: 'u_recruiter', name: 'Riley Recruiter', email: 'riley@company.com', role: 'Recruiter', active: true },
  { id: 'u_hm', name: 'Morgan Manager', email: 'morgan@company.com', role: 'HiringManager', active: true },
  { id: 'u_iv', name: 'Ivan Interviewer', email: 'ivan@company.com', role: 'Interviewer', active: true },
  { id: 'u_iv2', name: 'Iris Interviewer', email: 'iris@company.com', role: 'Interviewer', active: true },
];

export const seedJobs: Job[] = [
  {
    id: 'j_se',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    description: 'We are looking for a senior software engineer to help build our core platform. You will work across the stack, mentor junior engineers, and shape technical direction.',
    employmentType: 'Full-time',
    visibility: 'public',
    status: 'open',
    assignedRecruiterId: 'u_recruiter',
    hiringManagerId: 'u_hm',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    stages: [
      { id: 's_se_applied', name: 'Applied', order: 0 },
      { id: 's_se_phone', name: 'Phone Screen', order: 1 },
      { id: 's_se_tech', name: 'Technical Interview', order: 2 },
      { id: 's_se_onsite', name: 'Onsite', order: 3 },
      { id: 's_se_offer', name: 'Offer', order: 4 },
      { id: 's_se_hired', name: 'Hired', order: 5 },
    ],
  },
  {
    id: 'j_pm',
    title: 'Product Manager',
    department: 'Product',
    location: 'Remote',
    description: 'Drive product strategy and execution for our growing platform. Work cross-functionally with engineering, design, and go-to-market teams.',
    employmentType: 'Full-time',
    visibility: 'public',
    status: 'open',
    assignedRecruiterId: 'u_recruiter',
    hiringManagerId: 'u_hm',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    stages: [
      { id: 's_pm_applied', name: 'Applied', order: 0 },
      { id: 's_pm_screen', name: 'Recruiter Screen', order: 1 },
      { id: 's_pm_case', name: 'Case Study', order: 2 },
      { id: 's_pm_panel', name: 'Panel', order: 3 },
      { id: 's_pm_offer', name: 'Offer', order: 4 },
    ],
  },
  {
    id: 'j_internal',
    title: 'Internal Tools Lead',
    department: 'Operations',
    location: 'New York, NY',
    description: 'Internal posting only. Lead our internal tooling team.',
    employmentType: 'Full-time',
    visibility: 'private',
    status: 'open',
    assignedRecruiterId: 'u_recruiter',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    stages: [
      { id: 's_int_applied', name: 'Applied', order: 0 },
      { id: 's_int_review', name: 'Review', order: 1 },
      { id: 's_int_offer', name: 'Offer', order: 2 },
    ],
  },
];

export const seedCandidates: Candidate[] = [
  { id: 'c_1', name: 'Jane Doe', email: 'jane.doe@example.com', phone: '+1 555-0101', resumeName: 'jane_doe_resume.pdf', notes: [], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() },
  { id: 'c_2', name: 'John Smith', email: 'john.smith@example.com', phone: '+1 555-0102', resumeName: 'john_smith_resume.pdf', notes: [], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString() },
  { id: 'c_3', name: 'Priya Patel', email: 'priya@example.com', phone: '+1 555-0103', resumeName: 'priya_patel_resume.pdf', notes: [], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString() },
  { id: 'c_4', name: 'Carlos Rivera', email: 'carlos@example.com', phone: '+1 555-0104', notes: [], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
  { id: 'c_5', name: 'Mei Chen', email: 'mei@example.com', phone: '+1 555-0105', resumeName: 'mei_chen_resume.pdf', notes: [], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
];

export const seedApplications: Application[] = [
  {
    id: 'a_1', jobId: 'j_se', candidateId: 'c_1', stageId: 's_se_tech',
    stageEnteredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    rejected: false, archived: false,
    history: [
      { stageId: 's_se_applied', stageName: 'Applied', enteredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() },
      { stageId: 's_se_phone', stageName: 'Phone Screen', enteredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString() },
      { stageId: 's_se_tech', stageName: 'Technical Interview', enteredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: 'a_2', jobId: 'j_se', candidateId: 'c_2', stageId: 's_se_phone',
    stageEnteredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    rejected: false, archived: false,
    history: [
      { stageId: 's_se_applied', stageName: 'Applied', enteredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString() },
      { stageId: 's_se_phone', stageName: 'Phone Screen', enteredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString() },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: 'a_3', jobId: 'j_pm', candidateId: 'c_3', stageId: 's_pm_case',
    stageEnteredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    rejected: false, archived: false,
    history: [
      { stageId: 's_pm_applied', stageName: 'Applied', enteredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString() },
      { stageId: 's_pm_screen', stageName: 'Recruiter Screen', enteredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
      { stageId: 's_pm_case', stageName: 'Case Study', enteredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString() },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    id: 'a_4', jobId: 'j_pm', candidateId: 'c_4', stageId: 's_pm_applied',
    stageEnteredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    rejected: false, archived: false,
    history: [
      { stageId: 's_pm_applied', stageName: 'Applied', enteredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'a_5', jobId: 'j_se', candidateId: 'c_5', stageId: 's_se_applied',
    stageEnteredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    rejected: false, archived: false,
    history: [
      { stageId: 's_se_applied', stageName: 'Applied', enteredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
];

export const seedInterviews: Interview[] = [
  {
    id: 'iv_1',
    applicationId: 'a_1',
    title: 'Technical Interview — Jane Doe',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(),
    durationMinutes: 60,
    format: 'Video',
    interviewerIds: ['u_iv', 'u_iv2'],
  },
  {
    id: 'iv_2',
    applicationId: 'a_2',
    title: 'Phone Screen — John Smith',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    durationMinutes: 30,
    format: 'Phone',
    interviewerIds: ['u_recruiter'],
  },
];

export const seedScorecards: Scorecard[] = [];
export const seedEmails: EmailLog[] = [];
