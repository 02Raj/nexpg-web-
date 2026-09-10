const DEFAULT_ADMIN = 'divyanshr243@gmail.com';

function adminEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_PLATFORM_ADMIN_EMAILS?.trim();
  const list = raw
    ? raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
    : [DEFAULT_ADMIN.toLowerCase()];
  return list;
}

export function isPlatformAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}
