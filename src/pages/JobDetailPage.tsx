import { useParams, Link } from 'react-router-dom';
import { useAts } from '@/context/AtsContext';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { Users } from 'lucide-react';

export default function JobDetailPage() {
  const { jobId } = useParams();
  const { jobs, applications, candidates } = useAts();
  const job = jobs.find((j) => j.id === jobId);

  if (!job) {
    return <EmptyState title="Job not found" description="This job may have been removed." />;
  }

  const jobApps = applications.filter((a) => a.jobId === job.id);

  return (
    <div>
      <PageHeader
        title={job.title}
        description={`${job.department} · ${job.location} · ${job.employmentType}`}
      />
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '2fr 1fr' }}>
        <Card>
          <CardHeader title="Description" />
          <CardBody>
            <p style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text-muted)', fontSize: 13.5 }}>
              {job.description || 'No description provided.'}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Status" />
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Badge tone={job.status === 'Open' ? 'success' : job.status === 'OnHold' ? 'warning' : 'neutral'}>{job.status}</Badge>
              <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>Created {new Date(job.createdAt).toLocaleDateString()}</div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div style={{ marginTop: 24 }}>
        <Card>
          <CardHeader title={`Applicants (${jobApps.length})`} />
          <CardBody>
            {jobApps.length === 0 ? (
              <EmptyState icon={<Users size={20} />} title="No applicants yet" />
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {jobApps.map((app) => {
                  const c = candidates.find((cc) => cc.id === app.candidateId);
                  if (!c) return null;
                  return (
                    <Link key={app.id} to={`/applications/${app.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 8 }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.email}</div>
                      </div>
                      <Badge tone="primary">{app.stage}</Badge>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
