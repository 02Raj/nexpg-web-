'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Smartphone, Users } from 'lucide-react';
import styles from './platform-shell.module.css';

const NAV = [
  { href: '/platform/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/platform/owners', label: 'PG owners', icon: Users },
  { href: '/platform/apk-requests', label: 'Android APK', icon: Smartphone },
];

export function PlatformShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? '';

  return (
    <div className={styles.root}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>R</span>
          <div>
            <strong>RunMyPG</strong>
            <small>Platform admin</small>
          </div>
        </div>
        <nav className={styles.nav}>
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[styles.navItem, active ? styles.navItemActive : ''].filter(Boolean).join(' ')}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className={styles.sidebarFoot}>
          <Link href="/dashboard" className={styles.footLink}>
            Owner console →
          </Link>
        </div>
      </aside>
      <div className={styles.mainCol}>
        <header className={styles.topbar}>
          <p className="kicker">Platform</p>
          <h1 className={styles.pageTitle}>{title}</h1>
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
