import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useAts } from '@/context/AtsContext';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { Field, Select, Textarea } from '@/components/ui/Input';
import type { Stage } from '@/types';

const STAGES: Stage[] = ['Applied', 'Screen', 'Interview', 'Offer', 'Hired', 'Rejected'];

export default function ApplicationDetailPage() {
  const { applicationId } = useParams();
  const { applications, candidates, jobs, updateApplicationStage, addNote, currentUser } = useAts();
  const app = applications.find((a) => a.id === applicationId);
  const [note, setNote] = useState('');

  if (!app) return <EmptyState title="Application not found" />;
  const candidate = candidates.find((c) => c.id === app.candidateId);
  const job = jobs.find((j) => j.id === app.jobId);

  return (
    <div>
      <PageHeader
        title={candidate?.name || 'Unknown'}
        description={`Applying for ${job?.title || 'Unknown role'}`}
      />
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '2fr 1fr' }}>
        <Card>
          <CardHeader title="Notes" />
          <CardBody>
            <div style={{ display: 'grid', gap: 10, marginBottom: 14 }}>
              {(app.notes || []).length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No notes yet.</div>
              ) : (
                (app.notes || []).map((n) => (
                  <div key={n.id} style={{ padding: 10, border: '1px solid var(--color-border)', borderRadius: 6 }}>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                      {n.authorName} · {new Date(n.createdAt).toLocaleString()}
                    </div>
                    <div style={{ fontSize: 13.5 }}>{n.body}</div>
                  </div>
                ))
              )}
            </div>
            <Field label="Add note">
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Share an update or feedback..." />
            </Field>
            <div style={{ marginTop: 8, textAlign: 'right' }}>
              <Button
                disabled={!note.trim()}
                onClick={() => {
                  addNote(app.id, note.trim(), currentUser.id);
                  setNote('');
                }}
              >Post note</Button>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Pipeline" />
          <CardBody>
            <Field label="Stage">
              <Select value={app.stage} onChange={(e) => updateApplicationStage(app.id, e.target.value as Stage)}>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
            <div style={{ marginTop: 12 }}>
              <Badge tone="primary">{app.stage}</Badge>
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 12 }}>
              Applied {new Date(app.createdAt).toLocaleDateString()}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
