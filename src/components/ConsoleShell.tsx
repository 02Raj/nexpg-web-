'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useBuilding } from '@/providers/BuildingProvider';
import { formatBuildingLocation } from '@/lib/locations';
import { isPlatformAdminEmail } from '@/lib/platform-admin';
import { LayoutDashboard, BedDouble, Receipt, Settings, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './console-shell.module.css';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', desc: 'Overview & occupancy', icon: LayoutDashboard },
  { href: '/beds', label: 'Beds', desc: 'Room-wise map', icon: BedDouble },
  { href: '/bills', label: 'Bills', desc: 'Rent invoices', icon: Receipt },
  { href: '/more', label: 'Settings', desc: 'PG & account', icon: Settings },
];

function pageMeta(pathname: string, buildingName?: string) {
  if (pathname.startsWith('/dashboard')) {
    return { kicker: 'Dashboard', title: buildingName || 'Dashboard', showActions: true };
  }
  if (pathname.startsWith('/beds')) {
    return { kicker: 'Beds', title: 'Bed occupancy', showActions: true };
  }
  if (pathname.startsWith('/bills')) {
    return { kicker: 'Bills', title: 'Rent invoices', showActions: true };
  }
  if (pathname.startsWith('/more')) {
    return { kicker: 'Settings', title: 'Property settings', showActions: true };
  }
  if (pathname.startsWith('/tenant/new')) {
    return { kicker: 'Tenant', title: 'Add tenant', showActions: false };
  }
  if (pathname.startsWith('/tenant/')) {
    return { kicker: 'Tenant', title: 'Tenant profile', showActions: false };
  }
  if (pathname.startsWith('/setup/building')) {
    return { kicker: 'Setup · Step 1', title: 'Add property', showActions: false };
  }
  if (pathname.startsWith('/setup/rooms')) {
    return { kicker: 'Setup · Step 2', title: 'Add rooms', showActions: false };
  }
  return { kicker: 'RunMyPG', title: 'Console', showActions: true };
}

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

  const meta = pageMeta(pathname, building?.name);
  const showPlatformAdmin = isPlatformAdminEmail(user?.email);

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
          <span className={styles.brandMark}>R</span>
          <span className={styles.mobileHeaderText}>
            <strong>{meta.title}</strong>
            <small>{building?.name ?? 'RunMyPG'}</small>
          </span>
        </Link>
        {meta.showActions ? (
          <div className={styles.mobileHeaderActions}>
            <button type="button" className={styles.mobileActionBtn} onClick={() => router.push('/tenant/new')}>
              + Tenant
            </button>
          </div>
        ) : null}
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
            <span className={styles.brandMark}>R</span>
            <span>
              <strong>RunMyPG</strong>
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
                      {b.name} · {formatBuildingLocation(b)}
                    </option>
                  ))}
                </select>
              ) : (
                <p className={styles.propertyName}>
                  {building.name}
                  <span>{formatBuildingLocation(building)}</span>
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
          {showPlatformAdmin ? (
            <Link href="/platform/dashboard" className={styles.apkLink}>
              Platform admin
            </Link>
          ) : null}
          <Link href="/download" className={styles.apkLink}>
            Mobile app
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
              <p className="kicker">{meta.kicker}</p>
              <h1 className={styles.topTitle}>{meta.title}</h1>
            </div>
            {meta.showActions ? (
              <div className={styles.topActions}>
                <ButtonQuick label="Add tenant" onClick={() => router.push('/tenant/new')} />
                <ButtonQuick label="Add PG" variant="ghost" onClick={() => router.push('/setup/building')} />
              </div>
            ) : null}
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
