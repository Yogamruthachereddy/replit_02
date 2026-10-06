-- FIND-BACK initial schema.
-- Public case records intentionally contain only public-safe, approximate information.
-- Reporter contact details, exact locations, and evidence are stored separately.

create extension if not exists pgcrypto;
create sequence if not exists public.findback_case_number_seq start 100;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  phone text,
  role text not null default 'user' check (role in ('user', 'reporter', 'authority', 'admin')),
  status text not null default 'active' check (status in ('active', 'suspended')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.missing_persons (
  id uuid primary key default gen_random_uuid(),
  case_id text unique not null,
  full_name text not null,
  age integer not null check (age between 0 and 120),
  date_of_birth date,
  gender text not null default 'Not specified',
  photo_url text,
  height text,
  identifying_marks text,
  hair_description text,
  eye_description text,
  clothing_description text not null default '',
  last_seen_date date not null,
  last_seen_time time,
  public_area text not null,
  city text not null default '',
  district text,
  state text not null default '',
  public_latitude double precision,
  public_longitude double precision,
  public_circumstances text not null default '',
  status text not null default 'pending_verification'
    check (status in ('pending_verification','verified','active','under_investigation','possible_sighting','found','closed','rejected')),
  reporter_id uuid references auth.users(id) on delete set null,
  verified_by uuid references auth.users(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_private_details (
  case_id uuid primary key references public.missing_persons(id) on delete cascade,
  reporter_name text not null,
  relationship text not null default '',
  phone text not null,
  email text not null,
  contact_preference text not null default 'phone',
  exact_last_seen_location text not null,
  exact_latitude double precision,
  exact_longitude double precision,
  circumstances text not null default '',
  additional_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sightings (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.missing_persons(id) on delete cascade,
  submitted_by uuid references auth.users(id) on delete set null,
  anonymous boolean not null default false,
  sighting_date date not null,
  sighting_time time not null,
  public_location text not null,
  public_latitude double precision,
  public_longitude double precision,
  description text not null check (char_length(description) between 10 and 3000),
  status text not null default 'pending_review'
    check (status in ('pending_review','verified','rejected','needs_more_information')),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.sighting_private_details (
  sighting_id uuid primary key references public.sightings(id) on delete cascade,
  contact_name text,
  contact_phone text,
  contact_email text,
  evidence_path text,
  contact_preference text,
  created_at timestamptz not null default now()
);

create table if not exists public.case_updates (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.missing_persons(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null default 'FindBack reviewer',
  type text not null check (type in ('report_submitted','verification','sighting','investigation','status_change','official_note','found','closed')),
  message text not null,
  visibility text not null default 'public' check (visibility in ('public','reporter','authority','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('report_submitted','report_verified','report_rejected','new_sighting','status_changed','authority_update','possible_match')),
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.verifications (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.missing_persons(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete restrict,
  decision text not null check (decision in ('verified','rejected','more_information_required')),
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.report_flags (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.missing_persons(id) on delete set null,
  reporter_id uuid references auth.users(id) on delete set null,
  reason text not null check (reason in ('false_information','spam','inappropriate_content','duplicate','privacy_issue','harassment','other')),
  details text not null default '',
  status text not null default 'open' check (status in ('open','reviewing','dismissed','restricted','rejected','escalated')),
  created_at timestamptz not null default now()
);

create table if not exists public.case_locations (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.missing_persons(id) on delete cascade,
  label text not null,
  exact_latitude double precision not null,
  exact_longitude double precision not null,
  public_latitude double precision,
  public_longitude double precision,
  source text not null default 'reporter',
  created_at timestamptz not null default now()
);

create index if not exists missing_persons_case_id_idx on public.missing_persons(case_id);
create index if not exists missing_persons_status_created_idx on public.missing_persons(status, created_at desc);
create index if not exists missing_persons_name_idx on public.missing_persons using gin (to_tsvector('simple', full_name));
create index if not exists missing_persons_location_idx on public.missing_persons(state, district, city);
create index if not exists missing_persons_reporter_idx on public.missing_persons(reporter_id);
create index if not exists sightings_case_status_idx on public.sightings(case_id, status, created_at desc);
create index if not exists case_updates_case_date_idx on public.case_updates(case_id, created_at);
create index if not exists notifications_user_read_idx on public.notifications(user_id, read, created_at desc);
create index if not exists audit_logs_entity_idx on public.audit_logs(entity_type, entity_id, created_at desc);

create or replace function public.current_app_role()
returns text language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() and status = 'active' $$;

create or replace function public.is_reviewer()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role in ('authority','admin') and status = 'active') $$;

create or replace function public.is_active_user()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and status = 'active') $$;

create or replace function public.is_case_reporter(p_case_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists(
    select 1 from public.missing_persons m
    join public.profiles p on p.id = m.reporter_id
    where m.id = p_case_id and m.reporter_id = auth.uid() and p.status = 'active'
  )
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public
as $$ begin new.updated_at = now(); return new; end $$;

create or replace function public.assign_case_number()
returns trigger language plpgsql set search_path = public
as $$
begin
  if new.case_id is null or new.case_id = '' then
    new.case_id := 'FB-' || to_char(current_date, 'YYYY') || '-' ||
      lpad(nextval('public.findback_case_number_seq')::text, 5, '0');
  end if;
  return new;
end $$;

create or replace function public.create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, phone, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name',''), coalesce(new.email,''), new.raw_user_meta_data->>'phone', 'user')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists auth_user_profile_insert on auth.users;
create trigger auth_user_profile_insert after insert on auth.users
for each row execute function public.create_profile_for_new_user();
drop trigger if exists missing_person_case_number on public.missing_persons;
create trigger missing_person_case_number before insert on public.missing_persons
for each row execute function public.assign_case_number();
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
drop trigger if exists missing_persons_updated_at on public.missing_persons;
create trigger missing_persons_updated_at before update on public.missing_persons
for each row execute function public.set_updated_at();

create or replace function public.submit_missing_person(p_public jsonb, p_private jsonb)
returns public.missing_persons language plpgsql security definer set search_path = public, auth
as $$
declare
  v_case public.missing_persons;
  v_lat double precision;
  v_lng double precision;
begin
  if auth.uid() is null or not public.is_active_user() then raise exception 'Active account required'; end if;
  if public.current_app_role() not in ('user','reporter') then raise exception 'Reporter account required'; end if;
  if nullif(p_public->>'full_name','') is null or nullif(p_private->>'phone','') is null
    or nullif(p_private->>'email','') is null or nullif(p_private->>'exact_last_seen_location','') is null then
    raise exception 'Required report information is missing';
  end if;
  if coalesce((p_public->>'age')::integer,0) < 0 or coalesce((p_public->>'age')::integer,0) > 120 then
    raise exception 'Age must be between 0 and 120';
  end if;
  v_lat := nullif(p_private->>'exact_latitude','')::double precision;
  v_lng := nullif(p_private->>'exact_longitude','')::double precision;
  if (v_lat is null) <> (v_lng is null) or v_lat not between -90 and 90 or v_lng not between -180 and 180 then
    raise exception 'Invalid exact location coordinates';
  end if;
  insert into public.missing_persons (
    full_name, age, date_of_birth, gender, photo_url, height, identifying_marks,
    hair_description, eye_description, clothing_description, last_seen_date,
    last_seen_time, public_area, city, district, state, public_latitude,
    public_longitude, public_circumstances, reporter_id, status
  ) values (
    p_public->>'full_name',
    (p_public->>'age')::integer,
    nullif(p_public->>'date_of_birth','')::date,
    coalesce(nullif(p_public->>'gender',''),'Not specified'),
    nullif(p_public->>'photo_url',''),
    nullif(p_public->>'height',''),
    nullif(p_public->>'identifying_marks',''),
    nullif(p_public->>'hair_description',''),
    nullif(p_public->>'eye_description',''),
    coalesce(p_public->>'clothing_description',''),
    (p_public->>'last_seen_date')::date,
    nullif(p_public->>'last_seen_time','')::time,
    p_public->>'public_area',
    coalesce(p_public->>'city',''),
    nullif(p_public->>'district',''),
    coalesce(p_public->>'state',''),
    case when nullif(p_public->>'public_latitude','') is null then null
      else round((p_public->>'public_latitude')::numeric, 2)::double precision end,
    case when nullif(p_public->>'public_longitude','') is null then null
      else round((p_public->>'public_longitude')::numeric, 2)::double precision end,
    coalesce(p_public->>'public_circumstances',''),
    auth.uid(),
    'pending_verification'
  ) returning * into v_case;
  insert into public.case_private_details (
    case_id, reporter_name, relationship, phone, email, contact_preference,
    exact_last_seen_location, exact_latitude, exact_longitude, circumstances, additional_notes
  ) values (
    v_case.id,
    coalesce(p_private->>'reporter_name',''),
    coalesce(p_private->>'relationship',''),
    p_private->>'phone',
    p_private->>'email',
    coalesce(p_private->>'contact_preference','phone'),
    p_private->>'exact_last_seen_location',
    v_lat, v_lng,
    coalesce(p_private->>'circumstances',''),
    coalesce(p_private->>'additional_notes','')
  );
  if v_lat is not null and v_lng is not null then
    insert into public.case_locations (
      case_id, label, exact_latitude, exact_longitude, public_latitude, public_longitude
    ) values (
      v_case.id, p_private->>'exact_last_seen_location', v_lat, v_lng,
      round(v_lat::numeric, 2)::double precision, round(v_lng::numeric, 2)::double precision
    );
  end if;
  return v_case;
end $$;

create or replace function public.get_my_cases()
returns setof public.missing_persons language sql stable security definer set search_path = public, auth
as $$
  select m.* from public.missing_persons m
  join public.profiles p on p.id = m.reporter_id
  where auth.uid() is not null and m.reporter_id = auth.uid() and p.status = 'active'
$$;

create or replace function public.review_missing_person(p_case_id uuid, p_decision text, p_notes text default '')
returns public.missing_persons language plpgsql security definer set search_path = public, auth
as $$
declare
  v_case public.missing_persons;
  v_status text;
begin
  if not public.is_reviewer() then raise exception 'Authorized reviewer required'; end if;
  if p_decision not in ('verified','rejected','more_information_required') then raise exception 'Invalid review decision'; end if;
  v_status := case p_decision when 'verified' then 'active' when 'rejected' then 'rejected' else 'pending_verification' end;
  update public.missing_persons set status = v_status,
    verified_by = case when p_decision = 'verified' then auth.uid() else verified_by end,
    verified_at = case when p_decision = 'verified' then now() else verified_at end
  where id = p_case_id returning * into v_case;
  if not found then raise exception 'Case not found'; end if;
  insert into public.verifications(case_id, reviewer_id, decision, notes) values (p_case_id, auth.uid(), p_decision, coalesce(p_notes,''));
  insert into public.case_updates(case_id, author_id, type, message, visibility)
  values (p_case_id, auth.uid(), 'verification', coalesce(nullif(p_notes,''), 'Case review completed: ' || replace(p_decision,'_',' ')), 'public');
  insert into public.audit_logs(user_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'case_verification', 'missing_person', p_case_id, jsonb_build_object('decision',p_decision));
  if v_case.reporter_id is not null then
    insert into public.notifications(user_id, type, title, message)
    values (v_case.reporter_id, case p_decision when 'verified' then 'report_verified' when 'rejected' then 'report_rejected' else 'authority_update' end,
      case p_decision when 'verified' then 'Case verified' when 'rejected' then 'Case review complete' else 'More information requested' end,
      'There is an update on case ' || v_case.case_id || '.');
  end if;
  return v_case;
end $$;

create or replace function public.submit_sighting(p_case_id uuid, p_sighting jsonb, p_private jsonb default '{}'::jsonb)
returns public.sightings language plpgsql security definer set search_path = public, auth
as $$
declare
  v_sighting public.sightings;
  v_reporter_id uuid;
  v_anonymous boolean;
  v_case_status text;
begin
  v_anonymous := coalesce((p_sighting->>'anonymous')::boolean, false);
  if auth.uid() is not null and not public.is_active_user() then raise exception 'Active account required'; end if;
  select status into v_case_status from public.missing_persons
    where id = p_case_id and status in ('verified','active','under_investigation','possible_sighting','found');
  if not found then raise exception 'This case is not open for public sightings'; end if;
  if nullif(p_sighting->>'sighting_date','') is null or nullif(p_sighting->>'sighting_time','') is null
    or nullif(p_sighting->>'public_location','') is null or char_length(coalesce(p_sighting->>'description','')) < 10 then
    raise exception 'Required sighting information is missing';
  end if;
  if v_anonymous then v_reporter_id := null; else v_reporter_id := auth.uid(); end if;
  insert into public.sightings (
    case_id, submitted_by, anonymous, sighting_date, sighting_time, public_location,
    public_latitude, public_longitude, description, status
  ) values (
    p_case_id, v_reporter_id, v_anonymous,
    (p_sighting->>'sighting_date')::date, (p_sighting->>'sighting_time')::time,
    p_sighting->>'public_location',
    case when nullif(p_sighting->>'public_latitude','') is null then null
      else round((p_sighting->>'public_latitude')::numeric,2)::double precision end,
    case when nullif(p_sighting->>'public_longitude','') is null then null
      else round((p_sighting->>'public_longitude')::numeric,2)::double precision end,
    p_sighting->>'description', 'pending_review'
  ) returning * into v_sighting;
  if nullif(p_private->>'contact_name','') is not null
    or nullif(p_private->>'contact_phone','') is not null
    or nullif(p_private->>'contact_email','') is not null
    or nullif(p_private->>'evidence_path','') is not null then
    insert into public.sighting_private_details (
      sighting_id, contact_name, contact_phone, contact_email, evidence_path, contact_preference
    ) values (
      v_sighting.id, nullif(p_private->>'contact_name',''), nullif(p_private->>'contact_phone',''),
      nullif(p_private->>'contact_email',''), nullif(p_private->>'evidence_path',''),
      nullif(p_private->>'contact_preference','')
    );
  end if;
  insert into public.audit_logs(user_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'sighting_submission', 'sighting', v_sighting.id, jsonb_build_object('anonymous',v_anonymous));
  insert into public.notifications(user_id, type, title, message)
  select m.reporter_id, 'new_sighting', 'New sighting submitted', 'A sighting is awaiting review for case ' || m.case_id || '.'
  from public.missing_persons m where m.id = p_case_id and m.reporter_id is not null;
  return v_sighting;
end $$;

create or replace function public.review_sighting(p_sighting_id uuid, p_decision text, p_notes text default '')
returns public.sightings language plpgsql security definer set search_path = public, auth
as $$
declare v_sighting public.sightings;
begin
  if not public.is_reviewer() then raise exception 'Authorized reviewer required'; end if;
  if p_decision not in ('verified','rejected','needs_more_information') then raise exception 'Invalid sighting decision'; end if;
  update public.sightings set status = p_decision, reviewed_by = auth.uid(), reviewed_at = now()
    where id = p_sighting_id returning * into v_sighting;
  if not found then raise exception 'Sighting not found'; end if;
  insert into public.case_updates(case_id, author_id, type, message, visibility)
  values (v_sighting.case_id, auth.uid(), 'sighting',
    coalesce(nullif(p_notes,''), 'Sighting review updated: ' || replace(p_decision,'_',' ')), 'authority');
  insert into public.audit_logs(user_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'sighting_review', 'sighting', p_sighting_id, jsonb_build_object('decision',p_decision));
  return v_sighting;
end $$;

create or replace function public.change_case_status(p_case_id uuid, p_status text, p_message text default '')
returns public.missing_persons language plpgsql security definer set search_path = public, auth
as $$
declare v_case public.missing_persons;
begin
  if not public.is_reviewer() then raise exception 'Authorized reviewer required'; end if;
  if p_status not in ('active','under_investigation','possible_sighting','found','closed') then raise exception 'Invalid status transition'; end if;
  update public.missing_persons set status = p_status where id = p_case_id returning * into v_case;
  if not found then raise exception 'Case not found'; end if;
  insert into public.case_updates(case_id, author_id, type, message, visibility)
  values (p_case_id, auth.uid(), case when p_status = 'found' then 'found' when p_status = 'closed' then 'closed' else 'status_change' end,
    coalesce(nullif(p_message,''), 'Case status updated to ' || replace(p_status,'_',' ') || '.'), 'public');
  insert into public.audit_logs(user_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'case_status_change', 'missing_person', p_case_id, jsonb_build_object('status',p_status));
  if v_case.reporter_id is not null then
    insert into public.notifications(user_id, type, title, message)
    values (v_case.reporter_id, 'status_changed', 'Case status updated', 'There is an update on case ' || v_case.case_id || '.');
  end if;
  return v_case;
end $$;

create or replace function public.admin_set_profile_role(p_user_id uuid, p_role text)
returns public.profiles language plpgsql security definer set search_path = public, auth
as $$
declare v_profile public.profiles;
begin
  if not public.is_reviewer() or public.current_app_role() <> 'admin' then raise exception 'Administrator required'; end if;
  if p_user_id = auth.uid() then raise exception 'Administrators cannot change their own role'; end if;
  if p_role not in ('user','reporter','authority') then raise exception 'Invalid role'; end if;
  update public.profiles set role = p_role where id = p_user_id returning * into v_profile;
  if not found then raise exception 'Profile not found'; end if;
  insert into public.audit_logs(user_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'user_role_change', 'profile', p_user_id, jsonb_build_object('role',p_role));
  return v_profile;
end $$;

create or replace function public.admin_set_profile_status(p_user_id uuid, p_status text)
returns public.profiles language plpgsql security definer set search_path = public, auth
as $$
declare v_profile public.profiles;
begin
  if not public.is_reviewer() or public.current_app_role() <> 'admin' then raise exception 'Administrator required'; end if;
  if p_user_id = auth.uid() and p_status = 'suspended' then raise exception 'Administrators cannot suspend their own account'; end if;
  if p_status not in ('active','suspended') then raise exception 'Invalid account status'; end if;
  update public.profiles set status = p_status where id = p_user_id returning * into v_profile;
  if not found then raise exception 'Profile not found'; end if;
  insert into public.audit_logs(user_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'user_status_change', 'profile', p_user_id, jsonb_build_object('status',p_status));
  return v_profile;
end $$;

create or replace function public.admin_review_report_flag(p_flag_id uuid, p_status text)
returns public.report_flags language plpgsql security definer set search_path = public, auth
as $$
declare
  v_flag public.report_flags;
begin
  if not public.is_reviewer() or public.current_app_role() <> 'admin' then raise exception 'Administrator required'; end if;
  if p_status not in ('reviewing','dismissed','restricted','rejected','escalated') then raise exception 'Invalid flag status'; end if;
  update public.report_flags set status = p_status where id = p_flag_id returning * into v_flag;
  if not found then raise exception 'Report flag not found'; end if;
  insert into public.audit_logs(user_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'report_flag_review', 'report_flag', p_flag_id, jsonb_build_object('status',p_status));
  return v_flag;
end $$;

create or replace function public.audit_case_insert()
returns trigger language plpgsql security definer set search_path = public, auth
as $$
begin
  insert into public.case_updates(case_id, author_id, author_name, type, message, visibility)
  values (new.id, new.reporter_id, 'FindBack', 'report_submitted', 'Report submitted for authorized review.', 'reporter');
  insert into public.audit_logs(user_id, action, entity_type, entity_id)
  values (new.reporter_id, 'case_creation', 'missing_person', new.id);
  if new.reporter_id is not null then
    insert into public.notifications(user_id, type, title, message)
    values (new.reporter_id, 'report_submitted', 'Report received', 'Case ' || new.case_id || ' is pending verification.');
  end if;
  return new;
end $$;
drop trigger if exists missing_person_insert_audit on public.missing_persons;
create trigger missing_person_insert_audit after insert on public.missing_persons
for each row execute function public.audit_case_insert();

alter table public.profiles enable row level security;
alter table public.missing_persons enable row level security;
alter table public.case_private_details enable row level security;
alter table public.sightings enable row level security;
alter table public.sighting_private_details enable row level security;
alter table public.case_updates enable row level security;
alter table public.notifications enable row level security;
alter table public.verifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.report_flags enable row level security;
alter table public.case_locations enable row level security;

create policy "profile self read" on public.profiles for select to authenticated
using (id = auth.uid() or (public.current_app_role() = 'admin' and public.is_reviewer()));
create policy "admin profile management" on public.profiles for all to authenticated
using (public.current_app_role() = 'admin' and public.is_reviewer())
with check (public.current_app_role() = 'admin' and public.is_reviewer());

create policy "public read safe published cases" on public.missing_persons for select to anon, authenticated
using (status in ('verified','active','under_investigation','possible_sighting','found','closed'));
create policy "reporter read own cases" on public.missing_persons for select to authenticated
using (reporter_id = auth.uid() and public.is_active_user());
create policy "reviewer read all cases" on public.missing_persons for select to authenticated
using (public.is_reviewer());
create policy "authenticated submit own case" on public.missing_persons for insert to authenticated
with check (false);
create policy "reporter edit pending own case" on public.missing_persons for update to authenticated
using (reporter_id = auth.uid() and status = 'pending_verification')
with check (reporter_id = auth.uid() and status = 'pending_verification' and verified_by is null);
create policy "reviewer manage cases" on public.missing_persons for all to authenticated
using (public.is_reviewer()) with check (public.is_reviewer());

create policy "case private reporter or reviewer read" on public.case_private_details for select to authenticated
using (public.is_case_reporter(case_id) or public.is_reviewer());
create policy "reporter writes own private details" on public.case_private_details for insert to authenticated
with check (public.is_case_reporter(case_id));
create policy "reporter updates own pending private details" on public.case_private_details for update to authenticated
using (public.is_case_reporter(case_id) and exists (select 1 from public.missing_persons m where m.id = case_id and m.status = 'pending_verification'))
with check (public.is_case_reporter(case_id));
create policy "reviewer manages private details" on public.case_private_details for all to authenticated
using (public.is_reviewer()) with check (public.is_reviewer());

create policy "public read reviewed sightings" on public.sightings for select to anon, authenticated
using (status = 'verified');
create policy "submit sightings for review" on public.sightings for insert to anon, authenticated
with check (status = 'pending_review' and (submitted_by is null or submitted_by = auth.uid()));
create policy "reviewer manage sightings" on public.sightings for all to authenticated
using (public.is_reviewer()) with check (public.is_reviewer());
create policy "sighting owner read own" on public.sightings for select to authenticated
using (submitted_by = auth.uid() and public.is_active_user());

create policy "sighting private reviewer read" on public.sighting_private_details for select to authenticated
using (public.is_reviewer() or exists (select 1 from public.sightings s where s.id = sighting_id and s.submitted_by = auth.uid()));
create policy "sighting private owner or reviewer write" on public.sighting_private_details for all to authenticated
using (public.is_reviewer() or exists (select 1 from public.sightings s where s.id = sighting_id and s.submitted_by = auth.uid()))
with check (public.is_reviewer() or exists (select 1 from public.sightings s where s.id = sighting_id and s.submitted_by = auth.uid()));

create policy "public and scoped case timeline" on public.case_updates for select to anon, authenticated
using (
  (visibility = 'public' and exists (select 1 from public.missing_persons m where m.id = case_id and m.status in ('verified','active','under_investigation','possible_sighting','found','closed')))
  or (visibility = 'reporter' and public.is_case_reporter(case_id))
  or (visibility in ('authority','admin') and public.is_reviewer())
);
create policy "reviewer adds timeline events" on public.case_updates for insert to authenticated
with check (public.is_reviewer() and author_id = auth.uid());

create policy "user reads own notifications" on public.notifications for select to authenticated
using (user_id = auth.uid() and public.is_active_user());
create policy "user marks own notifications" on public.notifications for update to authenticated
using (user_id = auth.uid() and public.is_active_user()) with check (user_id = auth.uid() and public.is_active_user());

create policy "reviewer reads verifications" on public.verifications for select to authenticated
using (public.is_reviewer());
create policy "reviewer creates verifications" on public.verifications for insert to authenticated
with check (public.is_reviewer() and reviewer_id = auth.uid());

create policy "authorized roles read audit logs" on public.audit_logs for select to authenticated
using (public.is_reviewer());

create policy "public may submit flags" on public.report_flags for insert to anon, authenticated
with check (status = 'open' and (reporter_id is null or reporter_id = auth.uid()));
create policy "admins read flags" on public.report_flags for select to authenticated
using (public.current_app_role() = 'admin');
create policy "admins update flags" on public.report_flags for update to authenticated
using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');

create policy "reporter or reviewer reads exact case locations" on public.case_locations for select to authenticated
using (public.is_case_reporter(case_id) or public.is_reviewer());
create policy "reporter adds own exact case locations" on public.case_locations for insert to authenticated
with check (public.is_case_reporter(case_id));
create policy "reviewer manages exact case locations" on public.case_locations for all to authenticated
using (public.is_reviewer()) with check (public.is_reviewer());

grant usage on schema public to anon, authenticated;
revoke select on public.missing_persons, public.sightings, public.case_updates from anon, authenticated;
grant select (
  id, case_id, full_name, age, gender, photo_url, height, identifying_marks,
  hair_description, eye_description, clothing_description, last_seen_date, last_seen_time,
  public_area, city, district, state, public_latitude, public_longitude,
  public_circumstances, status, verified_at, created_at, updated_at
) on public.missing_persons to anon, authenticated;
grant select (
  id, case_id, anonymous, sighting_date, sighting_time, public_location,
  public_latitude, public_longitude, description, status, created_at, reviewed_at
) on public.sightings to anon, authenticated;
grant select (id, case_id, author_name, type, message, visibility, created_at)
  on public.case_updates to anon, authenticated;
grant select on public.profiles to authenticated;
grant select on public.case_private_details to authenticated;
grant select on public.sighting_private_details to authenticated;
grant select, update on public.notifications to authenticated;
grant select, insert on public.verifications to authenticated;
grant select on public.audit_logs to authenticated;
grant select, insert on public.report_flags to anon, authenticated;
grant select on public.case_locations to authenticated;
grant execute on function public.review_missing_person(uuid,text,text) to authenticated;
grant execute on function public.review_sighting(uuid,text,text) to authenticated;
grant execute on function public.change_case_status(uuid,text,text) to authenticated;
grant execute on function public.admin_set_profile_role(uuid,text) to authenticated;
grant execute on function public.admin_set_profile_status(uuid,text) to authenticated;
grant execute on function public.admin_review_report_flag(uuid,text) to authenticated;
grant execute on function public.get_my_cases() to authenticated;
grant execute on function public.submit_missing_person(jsonb,jsonb) to authenticated;
grant execute on function public.submit_sighting(uuid,jsonb,jsonb) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('case-photos', 'case-photos', false, 5242880, array['image/jpeg','image/png','image/webp']),
  ('sighting-evidence', 'sighting-evidence', false, 5242880, array['image/jpeg','image/png','image/webp']),
  ('avatars', 'avatars', false, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "case photos owner uploads" on storage.objects for insert to authenticated
with check (bucket_id = 'case-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "case photos reporter and authorized read" on storage.objects for select to authenticated
using (bucket_id = 'case-photos' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_reviewer()));
create policy "case photo public read only when case is published" on storage.objects for select to anon, authenticated
using (bucket_id = 'case-photos' and exists (
  select 1 from public.missing_persons m where m.photo_url = name and m.status in ('verified','active','under_investigation','possible_sighting','found','closed')
));

create policy "sighting evidence authenticated upload" on storage.objects for insert to authenticated
with check (bucket_id = 'sighting-evidence' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "sighting evidence reviewer and owner read" on storage.objects for select to authenticated
using (bucket_id = 'sighting-evidence' and (
  public.is_reviewer() or exists (
    select 1 from public.sighting_private_details d
    join public.sightings s on s.id = d.sighting_id
    where d.evidence_path = name and s.submitted_by = auth.uid()
  )
));
create policy "avatar owner manages own files" on storage.objects for all to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
