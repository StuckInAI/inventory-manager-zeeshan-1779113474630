import { Link } from 'react-router-dom';
import { useAts } from '@/context/AtsContext';
import { Briefcase } from 'lucide-react';

export default function CareersPage() {
  const { jobs } = useAts();
  const openJobs = jobs.filter((j) => j.status === 'Open');

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fc' }}>
      <header style={{ padding: '32px 24px', background: 'linear-gradient(135deg, #2d5bff, #7c3aed)', color: '#fff' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>Join HireFlow</div>
          <div style={{ marginTop: 6, opacity: 0.9 }}>We're hiring across teams. Find a role that fits you.</div>
        </div>
      </header>
      <main style={{ maxWidth: 880, margin: '0 auto', padding: '32px 24px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Open positions ({openJobs.length})</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {openJobs.map((j) => (
            <Link
              key={j.id}
              to={`/careers/${j.id}`}
              style={{ background: '#fff', border: '1px solid #e3e8f0', borderRadius: 10, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{j.title}</div>
                <div style={{ fontSize: 13, color: '#5b6478', marginTop: 4 }}>
                  {j.department} · {j.location} · {j.employmentType}
                </div>
              </div>
              <Briefcase size={20} color="#5b6478" />
            </Link>
          ))}
          {openJobs.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: '#5b6478' }}>No open positions right now. Check back soon!</div>
          )}
        </div>
      </main>
    </div>
  );
}
