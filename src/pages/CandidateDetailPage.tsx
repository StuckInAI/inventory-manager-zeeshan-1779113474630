import { useParams, Link } from 'react-router-dom';
import { useAts } from '@/context/AtsContext';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';

export default function CandidateDetailPage() {
  const { candidateId } = useParams();
  const { candidates, applications, jobs } = useAts();
  const c = candidates.find((x) => x.id === candidateId);

  if (!c) return <EmptyState title="Candidate not found" />;

  const apps = applications.filter((a) => a.candidateId === c.id);

  return (
    <div>
      <PageHeader title={c.name} description={c.email} />
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '2fr 1fr' }}>
        <Card>
          <CardHeader title="Profile" />
          <CardBody>
            <div style={{ fontSize: 13.5, color: 'var(--color-text-muted)' }}>
              <div><strong>Location:</strong> {c.location || '—'}</div>
              <div><strong>Phone:</strong> {c.phone || '—'}</div>
              <div style={{ marginTop: 10 }}>{c.summary || 'No summary.'}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                {(c.tags || []).map((t) => <Badge key={t} tone="accent">{t}</Badge>)}
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title={`Applications (${apps.length})`} />
          <CardBody>
            {apps.length === 0 ? <EmptyState title="No applications" /> : (
              <div style={{ display: 'grid', gap: 8 }}>
                {apps.map((a) => {
                  const job = jobs.find((j) => j.id === a.jobId);
                  return (
                    <Link key={a.id} to={`/applications/${a.id}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: 6 }}>
                      <span>{job?.title || 'Unknown role'}</span>
                      <Badge tone="primary">{a.stage}</Badge>
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
