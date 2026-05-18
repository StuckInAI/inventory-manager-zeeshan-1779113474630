import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAts } from '@/context/AtsContext';
import { Field, Input, Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export default function CareersJobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, submitPublicApplication } = useAts();
  const job = jobs.find((j) => j.id === jobId);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [summary, setSummary] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!job) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Job not found.</p>
        <Link to="/careers">Back to careers</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fc' }}>
      <header style={{ padding: '20px 24px', background: '#fff', borderBottom: '1px solid #e3e8f0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Link to="/careers" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#2d5bff', fontSize: 13 }}>
            <ArrowLeft size={14} /> All positions
          </Link>
        </div>
      </header>
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700 }}>{job.title}</h1>
        <div style={{ color: '#5b6478', marginTop: 6 }}>{job.department} · {job.location} · {job.employmentType}</div>
        <div style={{ marginTop: 20, whiteSpace: 'pre-wrap', color: '#3b4456', fontSize: 14.5, lineHeight: 1.6 }}>
          {job.description || 'No description provided.'}
        </div>

        <div style={{ marginTop: 32, background: '#fff', border: '1px solid #e3e8f0', borderRadius: 10, padding: 20 }}>
          {submitted ? (
            <div>
              <h3 style={{ fontWeight: 600, marginBottom: 6 }}>Thanks for applying!</h3>
              <p style={{ color: '#5b6478', fontSize: 14 }}>We'll be in touch soon.</p>
              <div style={{ marginTop: 14 }}>
                <Button variant="secondary" onClick={() => navigate('/careers')}>Back to careers</Button>
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{ fontWeight: 600, marginBottom: 14 }}>Apply for this role</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                <Field label="Full name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
                <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
                <Field label="Phone (optional)"><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
                <Field label="Why are you a great fit?"><Textarea value={summary} onChange={(e) => setSummary(e.target.value)} /></Field>
              </div>
              <div style={{ marginTop: 14, textAlign: 'right' }}>
                <Button
                  disabled={!name.trim() || !email.trim()}
                  onClick={() => {
                    submitPublicApplication({
                      jobId: job.id,
                      name: name.trim(),
                      email: email.trim(),
                      phone: phone.trim(),
                      summary: summary.trim(),
                    });
                    setSubmitted(true);
                  }}
                >Submit application</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
