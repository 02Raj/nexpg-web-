'use client';

import { fetchPlatformDashboard } from '@/api/platform-admin';
import { LoadingCenter } from '@/components/Loading';
import { keys } from '@/lib/query';
import { useToastOnError } from '@/hooks/useToastOnError';
import { useQuery } from '@tanstack/react-query';
import layout from '../platform.module.css';

function StatCard({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className={layout.statCard}>
      <p className={layout.statLabel}>{label}</p>
      <p className={layout.statValue}>{value}</p>
      {hint ? <p className={layout.statHint}>{hint}</p> : null}
    </div>
  );
}

export default function PlatformDashboardPage() {
  const q = useQuery({
    queryKey: keys.platformDashboard,
    queryFn: fetchPlatformDashboard,
  });

  useToastOnError(q.error, 'Could not load dashboard');

  if (q.isLoading) return <LoadingCenter message="Loading dashboard…" />;

  const d = q.data;
  if (!d) return null;

  const days = d.signups_by_day ?? [];
  const max = Math.max(1, ...days.map((x) => x.count));

  return (
    <div className={layout.dashboard}>
      <div className={layout.statGrid}>
        <StatCard label="Total PG owners" value={d.total_owners} />
        <StatCard label="Active owners" value={d.active_owners} hint="Can use web & app" />
        <StatCard label="Inactive (soft)" value={d.inactive_owners} hint="Deactivated by admin" />
        <StatCard label="New sign-ups (7d)" value={d.new_owners_7d} />
        <StatCard label="New sign-ups (30d)" value={d.new_owners_30d} />
        <StatCard label="Properties" value={d.total_buildings} />
        <StatCard label="Active tenants (beds)" value={d.active_pg_tenants} />
        <StatCard label="APK pending" value={d.apk_pending} />
      </div>

      <section className={layout.panel}>
        <h2 className="section">New owner sign-ups — last 14 days</h2>
        {days.length === 0 ? (
          <p className="bodyMuted">No sign-ups in this period yet.</p>
        ) : (
          <div className={layout.chart} role="img" aria-label="Sign-ups bar chart">
            {days.map((row) => (
              <div key={row.day} className={layout.chartCol}>
                <div
                  className={layout.chartBar}
                  style={{ height: `${Math.max(8, (row.count / max) * 100)}%` }}
                  title={`${row.day}: ${row.count}`}
                />
                <span className={layout.chartCount}>{row.count}</span>
                <span className={layout.chartDay}>{row.day.slice(5)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
