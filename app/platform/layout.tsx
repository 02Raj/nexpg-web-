'use client';

import { useAuth } from '@/providers/AuthProvider';
import { isPlatformAdminEmail } from '@/lib/platform-admin';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import styles from './platform.module.css';

export default function PlatformLayout({ children }: { children: ReactNode }) {
  const { session, user, loading } = useAuth();
  const router = useRouter();
  const allowed = isPlatformAdminEmail(user?.email);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.replace('/login?next=/platform/apk-requests');
      return;
    }
    if (!allowed) router.replace('/dashboard');
  }, [loading, session, allowed, router]);

  if (loading || !session || !allowed) {
    return <p className="bodyMuted" style={{ padding: 32 }}>Loading platform admin…</p>;
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div>
          <p className="kicker">Platform admin</p>
          <h1 className={styles.title}>Android app requests</h1>
        </div>
        <nav className={styles.nav}>
          <Link href="/platform/apk-requests" className={styles.navLink}>
            Requests
          </Link>
          <Link href="/dashboard" className={styles.navLinkMuted}>
            Owner console
          </Link>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
