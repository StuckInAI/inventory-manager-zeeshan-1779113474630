import { Link } from 'react-router-dom';
import { Briefcase, Users, Clock, TrendingUp } from 'lucide-react';
import { useAts } from '@/context/AtsContext';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import styles from './DashboardPage.module.css';
import { daysBetween, formatDate } from '@/lib/storage';

export default function DashboardPage() {
  const { jobs, applications, candidates, interviews, currentUser } = useAts();

  // Hiring managers only see their assigned jobs
  const visibleJobs =
    currentUser.role === 'HiringManager'
      ? jobs.filter((j) => j.hiringManagerId === currentUser.id)
      : jobs;
  const visibleJobIds = new Set(visibleJobs.map((j) => j.id));
  const visibleApps = applications.filter((a) => visibleJobIds.has(a.jobId) && !a.archived);

  const openJobs = visibleJobs.filter((j) => j.status === 'open');

  const hired = visibleApps.filter((a) => {
    const job = jobs.find((j) => j.id === a.jobId);
    if (!job) return false;
    const stage = job.stages.find((s) => s.id === a.stageId);
    return stage?.name.toLowerCase() === 'hired';
  });

  const avgTimeToHire =
    hired.length === 0
      ? 0
      : Math.round(
          hired.reduce((acc, a) => acc + daysBetween(a.createdAt), 0) / hired.length
        );

  // Applicants by stage (across visible jobs)
  const stageCounts = new Map<string, number>();
  visibleApps.forEach((a) => {
    if (a.rejected) return;
    const job = jobs.find((j) => j.id === a.jobId);
    const stage = job?.stages.find((s) => s.id === a.stageId);
    if (!stage) return;
    stageCounts.set(stage.name, (stageCounts.get(stage.name) ?? 0) + 1);
  });
  const stageBreakdown = Array.from(stageCounts.entries()).sort((a, b) => b[1] - a[1]);
  const maxStageCount = Math.max(1, ...stageBreakdown.map(([, n]) => n));

  const recentActivity = visibleApps
    .flatMap((a) => {
      const candidate = candidates.find((c) => c.id === a.candidateId);
      const job = jobs.find((j) => j.id === a.jobId);
      return a.history.map((h) => ({
        id: `${a.id}_${h.enteredAt}`,
        message: `${candidate?.name ?? 'Candidate'} moved to ${h.stageName} for ${job?.title ?? 'job'}`,
        at: h.enteredAt,
        appId: a.id,
      }));
    })
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 8);

  const upcoming = interviews
    .filter((iv) => new Date(iv.date).getTime() >= Date.now() - 1000 * 60 * 60)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(' ')[0]}`}
        subtitle={currentUser.role === 'HiringManager' ? 'Your assigned jobs and pipeline activity' : 'A snapshot of your hiring pipeline'}
      />

      <div className={styles.metrics}>
        <MetricCard icon={<Briefcase size={18} />} label="Open Jobs" value={openJobs.length} tone="primary" />
        <MetricCard icon={<Users size={18} />} label="Active Applicants" value={visibleApps.filter((a) => !a.rejected).length} tone="accent" />
        <MetricCard icon={<Clock size={18} />} label="Avg. Time to Hire" value={`${avgTimeToHire}d`} tone="warning" />
        <MetricCard icon={<TrendingUp size={18} />} label="Hired (all time)" value={hired.length} tone="success" />
      </div>

      <div className={styles.grid}>
        <Card>
          <CardHeader title="Applicants by stage" />
          <CardBody>
            {stageBreakdown.length === 0 ? (
              <p className={styles.muted}>No applicants yet.</p>
            ) : (
              <ul className={styles.stageList}>
                {stageBreakdown.map(([stage, count]) => (
                  <li key={stage} className={styles.stageRow}>
                    <span className={styles.stageName}>{stage}</span>
                    <div className={styles.barWrap}>
                      <div
                        className={styles.bar}
                        style={{ width: `${(count / maxStageCount) * 100}%` }}
                      />
                    </div>
                    <span className={styles.stageCount}>{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Upcoming interviews" />
          <CardBody>
            {upcoming.length === 0 ? (
              <p className={styles.muted}>No interviews scheduled.</p>
            ) : (
              <ul className={styles.upcoming}>
                {upcoming.map((iv) => (
                  <li key={iv.id} className={styles.upcomingRow}>
                    <div>
                      <Link to={`/applications/${iv.applicationId}`} className={styles.upcomingTitle}>
                        {iv.title}
                      </Link>
                      <div className={styles.upcomingSub}>
                        {formatDate(iv.date)} · {iv.durationMinutes}m
                      </div>
                    </div>
                    <Badge tone="primary">{iv.format}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card className={styles.fullSpan}>
          <CardHeader title="Recent activity" />
          <CardBody>
            {recentActivity.length === 0 ? (
              <p className={styles.muted}>No recent activity.</p>
            ) : (
              <ul className={styles.activity}>
                {recentActivity.map((a) => (
                  <li key={a.id} className={styles.activityRow}>
                    <div className={styles.dot} />
                    <div className={styles.activityBody}>
                      <Link to={`/applications/${a.appId}`} className={styles.activityMsg}>
                        {a.message}
                      </Link>
                      <div className={styles.activityDate}>{formatDate(a.at)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  tone: 'primary' | 'accent' | 'warning' | 'success';
}) {
  return (
    <div className={styles.metric}>
      <div className={`${styles.metricIcon} ${styles[tone]}`}>{icon}</div>
      <div>
        <div className={styles.metricValue}>{value}</div>
        <div className={styles.metricLabel}>{label}</div>
      </div>
    </div>
  );
}
