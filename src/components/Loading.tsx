import styles from './loading.module.css';

export function Skeleton({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`${styles.skeleton} ${className}`} style={style} aria-hidden />;
}

export type PageSkeletonVariant =
  | 'default'
  | 'dashboard'
  | 'stats'
  | 'table'
  | 'profile'
  | 'download'
  | 'compact';

function StatGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={styles.statGrid}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.statCard}>
          <Skeleton style={{ width: '70%', height: 12 }} />
          <Skeleton style={{ width: '45%', height: 28, marginTop: 10 }} />
        </div>
      ))}
    </div>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className={styles.table}>
      <Skeleton style={{ width: '100%', height: 36, marginBottom: 8 }} />
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} style={{ width: '100%', height: 44, marginBottom: 6 }} />
      ))}
    </div>
  );
}

function PanelSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className={styles.panel}>
      <Skeleton style={{ width: 140, height: 18, marginBottom: 16 }} />
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} style={{ width: i === lines - 1 ? '60%' : '100%', height: 14, marginBottom: 10 }} />
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className={styles.page}>
      <Skeleton style={{ width: 180, height: 16, marginBottom: 20 }} />
      <StatGridSkeleton />
      <div className={styles.twoCol}>
        <PanelSkeleton lines={5} />
        <div className={styles.panel}>
          <Skeleton style={{ width: 120, height: 18, marginBottom: 16 }} />
          <Skeleton style={{ width: '100%', height: 200 }} />
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className={styles.page}>
      <Skeleton style={{ width: 100, height: 14, marginBottom: 16 }} />
      <div className={styles.panel}>
        <Skeleton style={{ width: '50%', height: 28, marginBottom: 12 }} />
        <Skeleton style={{ width: '70%', height: 14, marginBottom: 20 }} />
        <div className={styles.statGrid}>
          <Skeleton style={{ height: 80 }} />
          <Skeleton style={{ height: 80 }} />
        </div>
      </div>
      <PanelSkeleton lines={3} />
    </div>
  );
}

function DownloadSkeleton() {
  return (
    <div className={styles.download}>
      <div className={styles.downloadIntro}>
        <Skeleton style={{ width: 100, height: 12 }} />
        <Skeleton style={{ width: '90%', height: 32, marginTop: 12 }} />
        <Skeleton style={{ width: '100%', height: 14, marginTop: 12 }} />
        <Skeleton style={{ width: '85%', height: 14, marginTop: 8 }} />
      </div>
      <div className={styles.panel}>
        <Skeleton style={{ width: 160, height: 18, marginBottom: 16 }} />
        <div className={styles.stepper}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} style={{ height: 56, flex: 1 }} />
          ))}
        </div>
        <Skeleton style={{ width: '100%', height: 44, marginTop: 20 }} />
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className={styles.page}>
      <StatGridSkeleton count={8} />
      <div className={styles.panel} style={{ marginTop: 20 }}>
        <Skeleton style={{ width: 200, height: 18, marginBottom: 16 }} />
        <div className={styles.chartBars}>
          {Array.from({ length: 14 }, (_, i) => (
            <Skeleton key={i} style={{ flex: 1, height: `${40 + (i % 5) * 12}%`, alignSelf: 'flex-end' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CompactSkeleton() {
  return (
    <div className={styles.compact} role="status" aria-label="Loading">
      <Skeleton style={{ width: '100%', height: 12 }} />
      <Skeleton style={{ width: '80%', height: 12, marginTop: 8 }} />
      <Skeleton style={{ width: '55%', height: 12, marginTop: 8 }} />
    </div>
  );
}

export function PageSkeleton({ variant = 'default' }: { variant?: PageSkeletonVariant }) {
  return (
    <div role="status" aria-label="Loading" className={styles.root}>
      {variant === 'dashboard' && <DashboardSkeleton />}
      {variant === 'stats' && <StatsSkeleton />}
      {variant === 'table' && (
        <div className={styles.page}>
          <PanelSkeleton lines={2} />
          <TableSkeleton />
        </div>
      )}
      {variant === 'profile' && <ProfileSkeleton />}
      {variant === 'download' && <DownloadSkeleton />}
      {variant === 'compact' && <CompactSkeleton />}
      {variant === 'default' && (
        <div className={styles.page}>
          <PanelSkeleton lines={5} />
        </div>
      )}
    </div>
  );
}

/** @deprecated Use PageSkeleton — kept for one-line swaps */
export function LoadingCenter({
  variant = 'default',
}: {
  message?: string;
  variant?: PageSkeletonVariant;
}) {
  return <PageSkeleton variant={variant} />;
}
