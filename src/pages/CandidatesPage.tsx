import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search } from 'lucide-react';
import { useAts } from '@/context/AtsContext';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

export default function CandidatesPage() {
  const { candidates, applications, jobs } = useAts();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return candidates.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      (c.tags || []).some((t) => t.toLowerCase().includes(query.toLowerCase()))
    );
  }, [candidates, query]);

  return (
    <div>
      <PageHeader title="Candidates" description="All people in your talent pool." />
      <div style={{ marginBottom: 16, maxWidth: 360, position: 'relative' }}>
        <Search size={15} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--color-text-soft)' }} />
        <Input placeholder="Search candidates..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 32 }} />
      </div>

      {filtered.length === 0 ? (
        <Card><CardBody><EmptyState icon={<Users size={22} />} title="No candidates" /></CardBody></Card>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {filtered.map((c) => {
            const apps = applications.filter((a) => a.candidateId === c.id);
            return (
              <Card key={c.id}>
                <CardBody>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div>
                      <Link to={`/candidates/${c.id}`} style={{ fontWeight: 600 }}>{c.name}</Link>
                      <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 2 }}>{c.email} · {c.location || '—'}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                        {(c.tags || []).map((t) => <Badge key={t} tone="accent">{t}</Badge>)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Badge tone="primary">{apps.length} application{apps.length === 1 ? '' : 's'}</Badge>
                      <div style={{ fontSize: 11.5, color: 'var(--color-text-soft)', marginTop: 6 }}>
                        {apps.map((a) => jobs.find((j) => j.id === a.jobId)?.title).filter(Boolean).slice(0, 2).join(', ')}
                      </div>
                    </div>
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
