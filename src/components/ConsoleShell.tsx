'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useBuilding } from '@/providers/BuildingProvider';
import styles from './console-shell.module.css';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', desc: 'Overview & occupancy' },
  { href: '/beds', label: 'Beds', desc: 'Room-wise map' },
  { href: '/bills', label: 'Bills', desc: 'Rent invoices' },
  { href: '/more', label: 'Settings', desc: 'PG & account' },
];

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { building, buildings, selectBuilding, showSwitcher } = useBuilding();

  const activeNav = NAV.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  return (
    <div className={styles.root}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link href="/dashboard" className={styles.brand}>
            <span className={styles.brandMark}>N</span>
            <span>
              <strong>NexPG</strong>
              <small>Owner console</small>
            </span>
          </Link>

          {building ? (
            <div className={styles.property}>
              <p className={styles.propertyLabel}>Active property</p>
              {showSwitcher ? (
                <select
                  className={styles.propertySelect}
                  value={building.id}
                  onChange={(e) => selectBuilding(e.target.value)}
                >
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} · {b.city}
                    </option>
                  ))}
                </select>
              ) : (
                <p className={styles.propertyName}>
                  {building.name}
                  <span>{building.city}</span>
                </p>
              )}
            </div>
          ) : null}
        </div>

        <nav className={styles.nav}>
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[styles.navItem, active ? styles.navItemActive : ''].filter(Boolean).join(' ')}
              >
                <span className={styles.navLabel}>{item.label}</span>
                <span className={styles.navDesc}>{item.desc}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFoot}>
          <Link href="/download" className={styles.apkLink}>
            Get Android app
          </Link>
          <p className={styles.userEmail}>{user?.email}</p>
          <button type="button" className={styles.signOut} onClick={() => signOut()}>
            Sign out
          </button>
        </div>
      </aside>

      <div className={styles.mainCol}>
        <header className={styles.topbar}>
          <div className={styles.topbarInner}>
            <div>
              <p className="kicker">{activeNav?.label ?? 'Console'}</p>
              <h1 className={styles.topTitle}>{pageTitle(pathname, building?.name)}</h1>
            </div>
            <div className={styles.topActions}>
              <ButtonQuick label="Add tenant" onClick={() => router.push('/tenant/new')} />
              <ButtonQuick label="Add PG" variant="ghost" onClick={() => router.push('/setup/building')} />
            </div>
          </div>
        </header>
        <main className={styles.main}>
          <div className={styles.mainInner}>{children}</div>
        </main>
      </div>
    </div>
  );
}

function pageTitle(pathname: string, buildingName?: string) {
  if (pathname.startsWith('/dashboard')) return buildingName ? `${buildingName}` : 'Dashboard';
  if (pathname.startsWith('/beds')) return 'Bed occupancy';
  if (pathname.startsWith('/bills')) return 'Rent invoices';
  if (pathname.startsWith('/more')) return 'Settings';
  if (pathname.startsWith('/tenant')) return 'Tenant';
  if (pathname.startsWith('/setup')) return 'Setup';
  return 'NexPG';
}

function ButtonQuick({
  label,
  onClick,
  variant,
}: {
  label: string;
  onClick: () => void;
  variant?: 'ghost';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[styles.quickBtn, variant === 'ghost' ? styles.quickBtnGhost : ''].filter(Boolean).join(' ')}
    >
      {label}
    </button>
  );
}
