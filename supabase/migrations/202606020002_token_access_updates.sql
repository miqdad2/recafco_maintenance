alter table public.respondents
  alter column profile_id drop not null,
  alter column access_type set default 'secure_token';

update public.respondents
set access_type = 'secure_token'
where access_type = 'login' and profile_id is null;

create index if not exists questionnaire_assignments_secure_token_idx
  on public.questionnaire_assignments(secure_token)
  where secure_token is not null;

create index if not exists questionnaire_assignments_token_expires_at_idx
  on public.questionnaire_assignments(token_expires_at);

create or replace function public.is_valid_assignment_token(token text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.questionnaire_assignments qa
    join public.respondents r on r.id = qa.respondent_id
    join public.questionnaires q on q.id = qa.questionnaire_id
    where qa.secure_token = token
      and qa.secure_token is not null
      and (qa.token_expires_at is null or qa.token_expires_at > now())
      and qa.status in ('assigned','in_progress','submitted','reopened')
      and r.is_active = true
      and q.is_active = true
      and q.status = 'published'
  );
$$;

create or replace function public.can_access_assignment(assignment_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    public.get_current_user_role() in ('super_admin','requirement_admin','reviewer','viewer'),
    false
  );
$$;

drop policy if exists "requirement_files_insert_authorized" on storage.objects;
create policy "requirement_files_insert_admin_only" on storage.objects
  for insert
  with check (
    bucket_id = 'requirement-files'
    and public.get_current_user_role() in ('super_admin','requirement_admin')
  );
