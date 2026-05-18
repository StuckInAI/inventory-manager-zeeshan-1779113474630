import { useAts } from '@/context/AtsContext';
import styles from './Topbar.module.css';
import type { Role } from '@/types';

export default function Topbar() {
  const { users, currentUser, setCurrentUserId } = useAts();

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h2 className={styles.title}>Recruiting</h2>
      </div>
      <div className={styles.right}>
        <div className={styles.roleSwitcher}>
          <span className={styles.label}>View as</span>
          <select
            value={currentUser.id}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrentUserId(e.target.value)}
            className={styles.select}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {roleLabel(u.role)}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.avatar}>{currentUser.name.charAt(0)}</div>
      </div>
    </header>
  );
}

function roleLabel(r: Role): string {
  if (r === 'HiringManager') return 'Hiring Manager';
  return r;
}
