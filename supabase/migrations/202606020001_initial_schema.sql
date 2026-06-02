create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique,
  description text,
  manager_name text,
  manager_email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  employee_id text,
  full_name text not null,
  email text unique not null,
  phone text,
  role text not null check (role in ('super_admin','requirement_admin','reviewer','respondent','viewer')),
  department_id uuid references public.departments(id),
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.respondents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id),
  department_id uuid not null references public.departments(id),
  full_name text not null,
  designation text,
  email text,
  phone text,
  access_type text not null default 'login' check (access_type in ('login','secure_token')),
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.questionnaires (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  target_department_type text,
  estimated_minutes int,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.question_categories (
  id uuid primary key default gen_random_uuid(),
  questionnaire_id uuid not null references public.questionnaires(id) on delete cascade,
  title text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  questionnaire_id uuid not null references public.questionnaires(id) on delete cascade,
  category_id uuid references public.question_categories(id) on delete set null,
  question_text text not null,
  help_text text,
  question_type text not null check (question_type in ('short_text','long_text','yes_no','single_choice','multi_choice','number','date','file','priority','rating')),
  options jsonb,
  is_required boolean not null default false,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.questionnaire_assignments (
  id uuid primary key default gen_random_uuid(),
  questionnaire_id uuid not null references public.questionnaires(id),
  respondent_id uuid not null references public.respondents(id),
  department_id uuid not null references public.departments(id),
  assigned_by uuid references public.profiles(id),
  status text not null default 'assigned' check (status in ('assigned','in_progress','submitted','reviewed','approved','reopened','expired')),
  secure_token text unique,
  token_expires_at timestamptz,
  due_date date,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  progress_percent int not null default 0 check (progress_percent between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.answers (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.questionnaire_assignments(id) on delete cascade,
  question_id uuid not null references public.questions(id),
  respondent_id uuid not null references public.respondents(id),
  answer_text text,
  answer_json jsonb,
  comment text,
  status text not null default 'draft' check (status in ('draft','submitted','clear','unclear','needs_follow_up','approved')),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  review_comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assignment_id, question_id)
);

create table public.answer_files (
  id uuid primary key default gen_random_uuid(),
  answer_id uuid references public.answers(id) on delete cascade,
  assignment_id uuid not null references public.questionnaire_assignments(id) on delete cascade,
  uploaded_by uuid references public.profiles(id),
  file_name text not null,
  file_path text not null,
  file_type text,
  file_size bigint,
  description text,
  created_at timestamptz not null default now()
);

create table public.follow_up_questions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.questionnaire_assignments(id) on delete cascade,
  answer_id uuid references public.answers(id) on delete set null,
  question_text text not null,
  asked_by uuid not null references public.profiles(id),
  assigned_to uuid references public.respondents(id),
  response_text text,
  status text not null default 'open' check (status in ('open','answered','closed')),
  created_at timestamptz not null default now(),
  answered_at timestamptz,
  closed_at timestamptz
);

create table public.exports (
  id uuid primary key default gen_random_uuid(),
  export_type text not null check (export_type in ('excel','pdf')),
  scope text not null check (scope in ('all','department','questionnaire','assignment')),
  file_path text,
  generated_by uuid not null references public.profiles(id),
  generated_at timestamptz not null default now(),
  filters jsonb
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create index questionnaire_assignments_status_idx on public.questionnaire_assignments(status);
create index questionnaire_assignments_respondent_id_idx on public.questionnaire_assignments(respondent_id);
create index questionnaire_assignments_department_id_idx on public.questionnaire_assignments(department_id);
create index answers_assignment_id_idx on public.answers(assignment_id);
create index answers_question_id_idx on public.answers(question_id);
create index answers_status_idx on public.answers(status);
create index follow_up_questions_status_idx on public.follow_up_questions(status);
create index audit_logs_user_id_idx on public.audit_logs(user_id);
create index audit_logs_created_at_idx on public.audit_logs(created_at desc);

create trigger departments_set_updated_at before update on public.departments for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger respondents_set_updated_at before update on public.respondents for each row execute function public.set_updated_at();
create trigger questionnaires_set_updated_at before update on public.questionnaires for each row execute function public.set_updated_at();
create trigger question_categories_set_updated_at before update on public.question_categories for each row execute function public.set_updated_at();
create trigger questions_set_updated_at before update on public.questions for each row execute function public.set_updated_at();
create trigger questionnaire_assignments_set_updated_at before update on public.questionnaire_assignments for each row execute function public.set_updated_at();
create trigger answers_set_updated_at before update on public.answers for each row execute function public.set_updated_at();

create or replace function public.get_current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid() and is_active = true;
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(public.get_current_user_role() in ('super_admin','requirement_admin'), false);
$$;

create or replace function public.can_access_assignment(assignment_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    public.get_current_user_role() in ('super_admin','requirement_admin','reviewer','viewer')
    or exists (
      select 1
      from public.questionnaire_assignments qa
      join public.respondents r on r.id = qa.respondent_id
      where qa.id = assignment_id and r.profile_id = auth.uid()
    ),
    false
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'respondent')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace view public.dashboard_stats as
select
  (select count(*)::int from public.departments where is_active) as total_departments,
  (select count(*)::int from public.respondents where is_active) as total_respondents,
  (select count(*)::int from public.questionnaires where is_active) as total_questionnaires,
  (select count(*)::int from public.questions where is_active) as total_questions,
  (select count(*)::int from public.questionnaire_assignments) as total_assignments,
  (select count(*)::int from public.questionnaire_assignments where status in ('submitted','reviewed','approved')) as submitted_assignments,
  (select count(*)::int from public.questionnaire_assignments where status in ('assigned','reopened')) as pending_assignments,
  (select count(*)::int from public.questionnaire_assignments where status = 'in_progress') as in_progress_assignments,
  (select count(*)::int from public.answer_files) as files_uploaded,
  (select count(*)::int from public.follow_up_questions where status = 'open') as open_follow_ups;

alter table public.departments enable row level security;
alter table public.profiles enable row level security;
alter table public.respondents enable row level security;
alter table public.questionnaires enable row level security;
alter table public.question_categories enable row level security;
alter table public.questions enable row level security;
alter table public.questionnaire_assignments enable row level security;
alter table public.answers enable row level security;
alter table public.answer_files enable row level security;
alter table public.follow_up_questions enable row level security;
alter table public.exports enable row level security;
alter table public.audit_logs enable row level security;
alter table public.app_settings enable row level security;

create policy "profiles_self_read" on public.profiles for select using (id = auth.uid() or public.get_current_user_role() in ('super_admin','requirement_admin','reviewer','viewer'));
create policy "profiles_admin_write" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "departments_dashboard_read" on public.departments for select using (
  public.get_current_user_role() in ('super_admin','requirement_admin','reviewer','viewer')
  or exists (
    select 1 from public.respondents r
    where r.department_id = departments.id and r.profile_id = auth.uid()
  )
);
create policy "departments_admin_write" on public.departments for all using (public.is_admin()) with check (public.is_admin());

create policy "respondents_admin_read" on public.respondents for select using (public.get_current_user_role() in ('super_admin','requirement_admin','reviewer','viewer') or profile_id = auth.uid());
create policy "respondents_admin_write" on public.respondents for all using (public.is_admin()) with check (public.is_admin());

create policy "questionnaires_read" on public.questionnaires for select using (public.get_current_user_role() in ('super_admin','requirement_admin','reviewer','viewer') or exists (select 1 from public.questionnaire_assignments qa join public.respondents r on r.id = qa.respondent_id where qa.questionnaire_id = questionnaires.id and r.profile_id = auth.uid()));
create policy "questionnaires_admin_write" on public.questionnaires for all using (public.is_admin()) with check (public.is_admin());

create policy "question_categories_read" on public.question_categories for select using (public.get_current_user_role() in ('super_admin','requirement_admin','reviewer','viewer') or exists (select 1 from public.questionnaire_assignments qa join public.respondents r on r.id = qa.respondent_id where qa.questionnaire_id = question_categories.questionnaire_id and r.profile_id = auth.uid()));
create policy "question_categories_admin_write" on public.question_categories for all using (public.is_admin()) with check (public.is_admin());

create policy "questions_read" on public.questions for select using (public.get_current_user_role() in ('super_admin','requirement_admin','reviewer','viewer') or exists (select 1 from public.questionnaire_assignments qa join public.respondents r on r.id = qa.respondent_id where qa.questionnaire_id = questions.questionnaire_id and r.profile_id = auth.uid()));
create policy "questions_admin_write" on public.questions for all using (public.is_admin()) with check (public.is_admin());

create policy "assignments_access_read" on public.questionnaire_assignments for select using (public.can_access_assignment(id));
create policy "assignments_admin_write" on public.questionnaire_assignments for all using (public.is_admin()) with check (public.is_admin());

create policy "answers_access_read" on public.answers for select using (public.can_access_assignment(assignment_id));
create policy "answers_respondent_insert" on public.answers for insert with check (public.can_access_assignment(assignment_id));
create policy "answers_respondent_update_draft" on public.answers for update using (public.can_access_assignment(assignment_id) and status = 'draft') with check (public.can_access_assignment(assignment_id));
create policy "answers_review_update" on public.answers for update using (public.get_current_user_role() in ('super_admin','requirement_admin','reviewer')) with check (public.get_current_user_role() in ('super_admin','requirement_admin','reviewer'));

create policy "answer_files_access_read" on public.answer_files for select using (public.can_access_assignment(assignment_id));
create policy "answer_files_access_insert" on public.answer_files for insert with check (public.can_access_assignment(assignment_id));

create policy "follow_ups_access_read" on public.follow_up_questions for select using (public.can_access_assignment(assignment_id));
create policy "follow_ups_review_write" on public.follow_up_questions for all using (public.get_current_user_role() in ('super_admin','requirement_admin','reviewer')) with check (public.get_current_user_role() in ('super_admin','requirement_admin','reviewer'));
create policy "follow_ups_respondent_update" on public.follow_up_questions for update using (public.can_access_assignment(assignment_id)) with check (public.can_access_assignment(assignment_id));

create policy "exports_admin_read" on public.exports for select using (public.get_current_user_role() in ('super_admin','requirement_admin','reviewer','viewer'));
create policy "exports_admin_write" on public.exports for all using (public.is_admin()) with check (public.is_admin());

create policy "audit_logs_admin_read" on public.audit_logs for select using (public.get_current_user_role() in ('super_admin','requirement_admin','reviewer'));
create policy "audit_logs_insert" on public.audit_logs for insert with check (auth.uid() = user_id or public.is_admin());

create policy "app_settings_admin_read" on public.app_settings for select using (public.get_current_user_role() in ('super_admin','requirement_admin'));
create policy "app_settings_admin_write" on public.app_settings for all using (public.get_current_user_role() = 'super_admin') with check (public.get_current_user_role() = 'super_admin');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'requirement-files',
  'requirement-files',
  false,
  10485760,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "requirement_files_select_private" on storage.objects for select using (bucket_id = 'requirement-files' and public.get_current_user_role() in ('super_admin','requirement_admin','reviewer'));
create policy "requirement_files_insert_authorized" on storage.objects for insert with check (bucket_id = 'requirement-files' and public.get_current_user_role() in ('super_admin','requirement_admin','respondent'));
create policy "requirement_files_admin_update" on storage.objects for update using (bucket_id = 'requirement-files' and public.is_admin()) with check (bucket_id = 'requirement-files' and public.is_admin());
