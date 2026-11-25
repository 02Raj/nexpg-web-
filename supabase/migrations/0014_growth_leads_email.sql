-- Add email and email_body columns to growth_leads for dual-channel outreach

alter table public.growth_leads
  add column if not exists email text,
  add column if not exists email_body text;
