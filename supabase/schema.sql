-- PDA Recreation Web App — Supabase Schema
-- Run this in Supabase SQL Editor

-- Teams
create table if not exists teams (
  id   serial primary key,
  name text not null,
  color text not null default '#0046ff',
  total_score integer not null default 0
);

-- Members
create table if not exists members (
  id      serial primary key,
  name    text not null,
  team_id integer references teams(id) on delete set null
);

-- Score logs
create table if not exists score_logs (
  id         serial primary key,
  team_id    integer not null references teams(id) on delete cascade,
  game_name  text not null,
  points     integer not null,
  note       text,
  created_at timestamptz not null default now()
);

-- Settings (key-value store, e.g. admin_password_hash)
create table if not exists settings (
  key   text primary key,
  value text not null
);

-- Questions (for cho-sung, flag-quiz, silent-scream, i-sim)
create table if not exists questions (
  id        serial primary key,
  game_type text not null,  -- 'cho-sung' | 'flag-quiz' | 'silent-scream' | 'i-sim'
  content   text not null,  -- 초성 힌트 또는 단어/테마
  answer    text,
  hint      text,
  image_url text,
  "order"   integer not null default 0
);

-- Snacks (for 흑백요리사)
create table if not exists snacks (
  id        serial primary key,
  name      text not null,
  image_url text,
  "order"   integer not null default 0
);

-- Enable Realtime on teams table
alter publication supabase_realtime add table teams;

-- Postgres RPC: add_score (atomic score update)
create or replace function add_score(
  p_team_id  integer,
  p_game_name text,
  p_points   integer,
  p_note     text default null
)
returns void
language plpgsql
security definer
as $$
begin
  insert into score_logs (team_id, game_name, points, note)
  values (p_team_id, p_game_name, p_points, p_note);

  update teams
  set total_score = total_score + p_points
  where id = p_team_id;
end;
$$;

-- Seed: 3 teams
insert into teams (name, color) values
  ('1팀', '#0046ff'),
  ('2팀', '#2878f5'),
  ('3팀', '#4baff5')
on conflict do nothing;

-- Seed: default admin password hash placeholder
-- Replace with actual bcrypt hash via /admin setup or directly:
-- insert into settings (key, value) values ('admin_password_hash', '<bcrypt-hash>');
