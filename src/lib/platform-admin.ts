function adminEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_PLATFORM_ADMIN_EMAILS?.trim();
  if (!raw) return [];
  return raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function isPlatformAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}
