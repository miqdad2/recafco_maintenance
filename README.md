# RECAFCO Maintenance System Requirement Collection Portal

Internal web application for collecting structured maintenance system requirements from RECAFCO departments before the full Maintenance Management System is built.

## Phase 1 Features

- Next.js App Router with strict TypeScript and Tailwind CSS
- Supabase Auth session handling with protected admin/reviewer/viewer routes
- Server-side RBAC helpers for admin, reviewer, and viewer roles
- Secure token questionnaire links for department respondents without login
- Supabase PostgreSQL migration with all core tables, indexes, triggers, helper functions, RLS policies, dashboard view, and private `requirement-files` bucket
- Department management
- Respondent management
- Assignment management with secure link generation, copy link, token regeneration, expiry dates, and reopen support
- Public `/q/[secureToken]` questionnaire flow for drafts, uploads, and final submission
- Basic dashboard counts and recent department table
- Zod validation in server actions
- Audit log inserts for Phase 1 create actions

## Tech Stack

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- Supabase Auth, PostgreSQL, RLS, and Storage
- Zod
- React Hook Form dependency included for later form-heavy phases

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Fill in:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   INITIAL_ADMIN_USERNAME=admin
   INITIAL_ADMIN_PASSWORD=
   INITIAL_ADMIN_FULL_NAME=System Admin
   ```

   `SUPABASE_SERVICE_ROLE_KEY` must only be used server-side. Do not expose it in client components.

## Supabase Setup

Create a Supabase project, then run the migration in:

```txt
supabase/migrations/202606020001_initial_schema.sql
```

With Supabase CLI:

```bash
supabase db push
```

Or paste the SQL into the Supabase SQL editor.

Seed the default questionnaires and sample questions:

```txt
supabase/seed/202606020001_default_questionnaires.sql
```

The migration creates a private storage bucket named `requirement-files` with a 10MB limit and allowed PDF/JPG/PNG/XLS/XLSX/DOC/DOCX MIME types.

## Default Admin Creation

Use the server-only bootstrap script after migrations are applied:

```bash
npm run bootstrap:admin
```

The script reads `INITIAL_ADMIN_USERNAME`, `INITIAL_ADMIN_PASSWORD`, and `INITIAL_ADMIN_FULL_NAME` from `.env.local` or `.env`, creates or updates the Supabase Auth user, confirms the internal auth email, and upserts the matching `profiles` row as `super_admin`.

Then sign in at `/login` using `INITIAL_ADMIN_USERNAME` and `INITIAL_ADMIN_PASSWORD`.

Supabase Auth requires an email internally. The app hides this by converting the username to an internal email such as `admin@recafco.local`. Users still enter only username and password.

Alternative manual setup:

1. Create the first user in Supabase Auth.
2. Update that user profile role in SQL:

   ```sql
   update public.profiles
   set role = 'super_admin', full_name = 'System Admin', is_active = true
   where email = 'admin@example.com';
   ```

3. Sign in at `/login`.

## Access Model

Admin, IT, reviewer, and management users sign in with Supabase Auth. These logged-in users can access dashboard, departments, respondents, questionnaires, assignments, submissions, reviews, follow-ups, exports, settings, and audit logs according to their role.

Department respondents do not need accounts in Phase 1. They receive a secure questionnaire link in this format:

```txt
/q/[secureToken]
```

Each assignment has a long random token, expiry date, respondent, department, status, and submitted timestamp. Respondents can save a draft, return later using the same link, upload supporting files, and submit final answers. Submitted assignments are locked unless an admin reopens them.

## Sending Respondent Links

1. Create departments and respondents.
2. Seed or create published questionnaires.
3. Go to `/assignments/new`.
4. Select the questionnaire and respondent.
5. Click `Create link`.
6. Open `/assignments` and use `Copy link`.
7. Send the copied link to the respondent through the approved company channel.

For in-person collection, open `/collect`, click `Start interview`, sit with the respondent, enter the answers, and submit. This is useful when the person is busy or prefers to answer verbally.

Admins can regenerate a link from `/assignments` if a token is exposed or expired. Regenerating invalidates the old token because the assignment stores only one current `secure_token`.

## Development Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run bootstrap:admin
npm run seed:it-manager
```

## Security Notes

- RLS is enabled for all business tables.
- Initial admin username/password may be stored in local/deployment environment variables for bootstrap only. The login screen still authenticates through Supabase Auth.
- Server pages and actions call server-side auth/RBAC helpers.
- Admin assignment access is enforced by `public.can_access_assignment(assignment_id uuid)`.
- Respondent token access is validated server-side by looking up only the assignment with the matching `secure_token`, checking expiry, respondent active status, questionnaire active/published status, and assignment status.
- Uploaded files are in a private bucket. Token uploads are handled server-side and attached only to the validated assignment.
- File download endpoints must create signed URLs only after checking assignment/file access.
- Business records use `is_active` where applicable instead of hard deletes.
- Audit logs are written for token generation, token regeneration, questionnaire opening by token, draft save by token, final submission by token, and submission reopening.

## Workflow Testing

1. Apply migration and seed.
2. Create a Supabase Auth user and promote the profile to `super_admin`.
3. Start the app with `npm run dev`.
4. Log in at `/login`.
5. Confirm `/dashboard` loads.
6. Create a department at `/departments/new`.
7. Create a respondent at `/respondents/new`.
8. If the IT Manager questionnaire is not visible, run `npm run seed:it-manager`.
9. Open `/questionnaires` and confirm `IT Manager Questionnaire` shows 10 questions.
10. Create an assignment at `/assignments/new`.
11. Copy the secure link from `/assignments`.
12. Open the `/q/[secureToken]` link in a logged-out browser session.
13. Save a draft, reopen the same link, then submit final answers.
14. Confirm the submitted link shows a locked/submitted page.
15. Reopen the submission from `/assignments` or `/submissions/[id]` and confirm the same respondent link can be edited again.

## Deployment Notes

Deploy to Vercel or company-approved hosting. Configure the same environment variables in the deployment environment and set `NEXT_PUBLIC_APP_URL` to the deployed application URL.
