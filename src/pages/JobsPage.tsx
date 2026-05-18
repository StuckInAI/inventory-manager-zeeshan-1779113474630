import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Plus, Search } from 'lucide-react';
import { useAts } from '@/context/AtsContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import { Field, Input, Select, Textarea } from '@/components/ui/Input';
import type { JobStatus } from '@/types';

export default function JobsPage() {
  const { jobs, applications, currentUser, createJob, users } = useAts();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchQuery = j.title.toLowerCase().includes(query.toLowerCase()) ||
        j.department.toLowerCase().includes(query.toLowerCase());
      const matchStatus = statusFilter === 'all' || j.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [jobs, query, statusFilter]);

  const canCreate = currentUser.role === 'Admin' || currentUser.role === 'Recruiter';

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Manage open requisitions and track applicants per role."
        actions={canCreate ? (
          <Button onClick={() => setOpen(true)}><Plus size={16} /> New job</Button>
        ) : null}
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--color-text-soft)' }} />
          <Input
            placeholder="Search jobs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ paddingLeft: 32 }}
          />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as JobStatus | 'all')} style={{ maxWidth: 180 }}>
          <option value="all">All statuses</option>
          <option value="Open">Open</option>
          <option value="OnHold">On hold</option>
          <option value="Closed">Closed</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon={<Briefcase size={22} />}
              title="No jobs found"
              description="Try adjusting your filters or create a new job to get started."
            />
          </CardBody>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map((job) => {
            const count = applications.filter((a) => a.jobId === job.id).length;
            const owner = users.find((u) => u.id === job.ownerId);
            return (
              <Card key={job.id}>
                <CardBody>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ minWidth: 0 }}>
                      <Link to={`/jobs/${job.id}`} style={{ fontSize: 15, fontWeight: 600 }}>{job.title}</Link>
                      <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 4 }}>
                        {job.department} · {job.location} · {job.employmentType}
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                        <Badge tone={job.status === 'Open' ? 'success' : job.status === 'OnHold' ? 'warning' : 'neutral'}>
                          {job.status}
                        </Badge>
                        <Badge tone="primary">{count} applicants</Badge>
                        {owner ? <Badge tone="neutral">Owner: {owner.name}</Badge> : null}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {open ? <NewJobModal onClose={() => setOpen(false)} onCreate={createJob} users={users} ownerId={currentUser.id} /> : null}
    </div>
  );
}

function NewJobModal({
  onClose,
  onCreate,
  users,
  ownerId,
}: {
  onClose: () => void;
  onCreate: (input: { title: string; department: string; location: string; employmentType: 'FullTime' | 'PartTime' | 'Contract' | 'Internship'; description: string; ownerId: string }) => void;
  users: { id: string; name: string; role: string }[];
  ownerId: string;
}) {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('Remote');
  const [employmentType, setEmploymentType] = useState<'FullTime' | 'PartTime' | 'Contract' | 'Internship'>('FullTime');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState(ownerId);

  return (
    <Modal
      title="Create job"
      onClose={onClose}
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            disabled={!title.trim()}
            onClick={() => {
              onCreate({ title: title.trim(), department, location, employmentType, description, ownerId: owner });
              onClose();
            }}
          >Create</Button>
        </>
      )}
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer" /></Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Department"><Input value={department} onChange={(e) => setDepartment(e.target.value)} /></Field>
          <Field label="Location"><Input value={location} onChange={(e) => setLocation(e.target.value)} /></Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Employment type">
            <Select value={employmentType} onChange={(e) => setEmploymentType(e.target.value as 'FullTime' | 'PartTime' | 'Contract' | 'Internship')}>
              <option value="FullTime">Full time</option>
              <option value="PartTime">Part time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </Select>
          </Field>
          <Field label="Owner">
            <Select value={owner} onChange={(e) => setOwner(e.target.value)}>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Description"><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
      </div>
    </Modal>
  );
}
