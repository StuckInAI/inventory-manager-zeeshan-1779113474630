import { useAts } from '@/context/AtsContext';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';

export default function UsersPage() {
  const { users, currentUser } = useAts();

  if (currentUser.role !== 'Admin') {
    return <EmptyState title="Access denied" description="Only admins can view team members." />;
  }

  return (
    <div>
      <PageHeader title="Users" description="Members of your recruiting workspace." />
      <div style={{ display: 'grid', gap: 10 }}>
        {users.map((u) => (
          <Card key={u.id}>
            <CardBody>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{u.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>{u.email}</div>
                </div>
                <Badge tone="primary">{u.role === 'HiringManager' ? 'Hiring Manager' : u.role}</Badge>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
