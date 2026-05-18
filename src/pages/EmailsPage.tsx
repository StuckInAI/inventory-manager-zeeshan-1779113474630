import { useAts } from '@/context/AtsContext';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import { Mail } from 'lucide-react';

export default function EmailsPage() {
  const { emails, candidates } = useAts();
  const sorted = [...emails].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

  return (
    <div>
      <PageHeader title="Emails" description="Outbound communication log (simulated)." />
      {sorted.length === 0 ? (
        <Card><CardBody><EmptyState icon={<Mail size={22} />} title="No emails sent yet" /></CardBody></Card>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {sorted.map((e) => {
            const cand = candidates.find((c) => c.id === e.candidateId);
            return (
              <Card key={e.id}>
                <CardBody>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{e.subject}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 2 }}>To: {cand?.name || e.to}</div>
                      <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 8, whiteSpace: 'pre-wrap' }}>{e.body}</div>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--color-text-soft)', whiteSpace: 'nowrap' }}>
                      {new Date(e.sentAt).toLocaleString()}
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
