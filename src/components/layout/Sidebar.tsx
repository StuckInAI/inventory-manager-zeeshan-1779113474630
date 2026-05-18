import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, Calendar, Mail, UserCog, Globe } from 'lucide-react';
import { useAts } from '@/context/AtsContext';
import styles from './Sidebar.module.css';
import clsx from 'clsx';

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; roles?: string[] };

const items: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/candidates', label: 'Candidates', icon: Users, roles: ['Admin', 'Recruiter', 'HiringManager'] },
  { to: '/interviews', label: 'Interviews', icon: Calendar },
  { to: '/emails', label: 'Emails', icon: Mail, roles: ['Admin', 'Recruiter'] },
  { to: '/users', label: 'Users', icon: UserCog, roles: ['Admin'] },
];

export default function Sidebar() {
  const { currentUser } = useAts();

  const visible = items.filter((i) => !i.roles || i.roles.includes(currentUser.role));

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>A</div>
        <div>
          <div className={styles.brandTitle}>HireFlow</div>
          <div className={styles.brandSub}>ATS</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {visible.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => clsx(styles.link, isActive && styles.linkActive)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <a href="/careers" target="_blank" rel="noreferrer" className={styles.publicLink}>
          <Globe size={16} />
          <span>Public careers page</span>
        </a>
      </div>
    </aside>
  );
}
