-- Messages sent from revio.charanteja.site/connect.
-- Anyone may insert; nobody can read through the API (read them in the Supabase dashboard).
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 200),
  topic text not null check (topic in ('feedback', 'bug', 'collaborate', 'hire')),
  message text not null check (char_length(message) between 10 and 2000),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can send a message"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);
