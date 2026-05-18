import { Routes, Route, Navigate } from 'react-router-dom';
import { AtsProvider } from '@/context/AtsContext';
import AppLayout from '@/components/layout/AppLayout';
import DashboardPage from '@/pages/DashboardPage';
import JobsPage from '@/pages/JobsPage';
import JobDetailPage from '@/pages/JobDetailPage';
import CandidatesPage from '@/pages/CandidatesPage';
import CandidateDetailPage from '@/pages/CandidateDetailPage';
import ApplicationDetailPage from '@/pages/ApplicationDetailPage';
import InterviewsPage from '@/pages/InterviewsPage';
import UsersPage from '@/pages/UsersPage';
import EmailsPage from '@/pages/EmailsPage';
import CareersPage from '@/pages/CareersPage';
import CareersJobPage from '@/pages/CareersJobPage';

export default function App() {
  return (
    <AtsProvider>
      <Routes>
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/careers/:jobId" element={<CareersJobPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/candidates/:candidateId" element={<CandidateDetailPage />} />
          <Route path="/applications/:applicationId" element={<ApplicationDetailPage />} />
          <Route path="/interviews" element={<InterviewsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/emails" element={<EmailsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AtsProvider>
  );
}
