'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useBuilding } from '@/providers/BuildingProvider';
import { LayoutDashboard, BedDouble, Receipt, Settings, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './console-shell.module.css';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', desc: 'Overview & occupancy', icon: LayoutDashboard },
  { href: '/beds', label: 'Beds', desc: 'Room-wise map', icon: BedDouble },
  { href: '/bills', label: 'Bills', desc: 'Rent invoices', icon: Receipt },
  { href: '/more', label: 'Settings', desc: 'PG & account', icon: Settings },
];

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { building, buildings, selectBuilding, showSwitcher } = useBuilding();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const activeNav = NAV.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  return (
    <div className={styles.root}>
      {/* Mobile header bar */}
      <div className={styles.mobileHeader}>
        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <Link href="/dashboard" className={styles.mobileHeaderBrand}>
          <span className={styles.brandMark}>N</span>
          <strong>{building?.name ?? 'NexPG'}</strong>
        </Link>
      </div>

      {/* Overlay for mobile sidebar */}
      <div
        className={[styles.overlay, mobileOpen ? styles.overlayVisible : ''].filter(Boolean).join(' ')}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={[styles.sidebar, mobileOpen ? styles.sidebarOpen : ''].filter(Boolean).join(' ')}>
        <div className={styles.sidebarTop}>
          {/* Close button visible only on mobile when open */}
          {mobileOpen && (
            <button
              type="button"
              className={styles.hamburger}
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              style={{ position: 'absolute', top: 16, right: 12, color: 'var(--paper)' }}
            >
              <X size={20} />
            </button>
          )}
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
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[styles.navItem, active ? styles.navItemActive : ''].filter(Boolean).join(' ')}
              >
                <span className={styles.navIcon}><Icon size={20} /></span>
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

      {/* Main content area */}
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

      {/* Bottom nav for mobile */}
      <nav className={styles.bottomNav} aria-label="Main navigation">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[styles.bottomNavItem, active ? styles.bottomNavItemActive : ''].filter(Boolean).join(' ')}
            >
              <Icon size={22} />
              <span className={styles.bottomNavLabel}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
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
