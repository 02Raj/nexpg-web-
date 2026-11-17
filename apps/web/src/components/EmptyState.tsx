import styles from './empty-state.module.css';

type Props = {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
  /** Use inside an existing panel — drops outer card chrome */
  flat?: boolean;
};

export function EmptyState({ icon, title, message, action, flat }: Props) {
  return (
    <div className={[styles.wrap, flat ? styles.flat : ''].filter(Boolean).join(' ')}>
      <div className={styles.iconCircle}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {action ? (
        <button type="button" className={styles.cta} onClick={action.onClick}>
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
