import { useAts } from '@/context/AtsContext';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InterviewsPage() {
  const { interviews, applications, candidates, jobs, users } = useAts();

  const sorted = [...interviews].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  return (
    <div>
      <PageHeader title="Interviews" description="Upcoming and past interviews across all roles." />
      {sorted.length === 0 ? (
        <Card><CardBody><EmptyState icon={<Calendar size={22} />} title="No interviews scheduled" /></CardBody></Card>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {sorted.map((iv) => {
            const app = applications.find((a) => a.id === iv.applicationId);
            const cand = app && candidates.find((c) => c.id === app.candidateId);
            const job = app && jobs.find((j) => j.id === app.jobId);
            const interviewerNames = iv.interviewerIds.map((id) => users.find((u) => u.id === id)?.name).filter(Boolean);
            const date = new Date(iv.scheduledAt);
            const past = date.getTime() < Date.now();
            return (
              <Card key={iv.id}>
                <CardBody>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {cand && app ? <Link to={`/applications/${app.id}`}>{cand.name}</Link> : 'Unknown candidate'}
                        {' '}<span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>· {job?.title}</span>
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 4 }}>
                        {date.toLocaleString()} · {iv.durationMinutes} min · {iv.type}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-soft)', marginTop: 4 }}>
                        Interviewers: {interviewerNames.join(', ') || '—'}
                      </div>
                    </div>
                    <Badge tone={past ? 'neutral' : 'success'}>{past ? 'Past' : 'Upcoming'}</Badge>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
