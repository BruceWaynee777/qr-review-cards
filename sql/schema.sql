-- Run this once in Supabase: Project > SQL Editor > New query > paste > Run

create table if not exists cards (
  id text primary key,
  shop_name text,
  review_link text,
  scan_count integer not null default 0,
  created_at timestamptz not null default now()
);
