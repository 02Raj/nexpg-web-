import styles from './loading.module.css';

export function Spinner({ small = false }: { small?: boolean }) {
  return <span className={`${styles.spinner} ${small ? styles.spinnerSmall : ''}`} />;
}

export function Skeleton({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`${styles.skeleton} ${className}`} style={style} />;
}

export function LoadingCenter({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className={styles.loadingCenter}>
      <Spinner />
      <span className="bodyMuted">{message}</span>
    </div>
  );
}
