import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './Card.module.css';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx(styles.card, className)}>{children}</div>;
}

export function CardHeader({ title, action }: { title: ReactNode; action?: ReactNode }) {
  return (
    <div className={styles.header}>
      <h3 className={styles.title}>{title}</h3>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx(styles.body, className)}>{children}</div>;
}
