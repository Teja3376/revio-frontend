-- Messages sent from revio.charanteja.site/connect.
-- Only the site's server writes here (secret key, through a server action).
-- No public access at all: RLS is on with no policies, and anon/authenticated get no grants.
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 200),
  topic text not null check (topic in ('feedback', 'bug', 'collaborate', 'hire')),
  message text not null check (char_length(message) between 10 and 2000),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;
revoke all on public.contact_messages from anon, authenticated;

create index contact_messages_created_at_idx on public.contact_messages (created_at);
create index contact_messages_email_created_at_idx on public.contact_messages (email, created_at);

-- Rate limit, enforced in the database so no caller can skip it:
-- at most 3 messages per email and 30 overall in any hour.
create function public.contact_messages_rate_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (
    select count(*) from public.contact_messages
    where email = new.email and created_at > now() - interval '1 hour'
  ) >= 3
  or (
    select count(*) from public.contact_messages
    where created_at > now() - interval '1 hour'
  ) >= 30 then
    raise exception 'rate_limited: too many messages';
  end if;
  return new;
end;
$$;

create trigger contact_messages_rate_limit
  before insert on public.contact_messages
  for each row execute function public.contact_messages_rate_limit();
