# AGENTS.md

## Project Name

**RECAFCO Maintenance System Requirement Collection Portal**

## Project Purpose

This project is an internal web application for collecting requirements before building the full Maintenance Management System.

The company currently uses paper-based maintenance forms such as work orders and parts request forms. The goal of this portal is to collect structured answers from different departments and people so the final maintenance system can be designed correctly.

This portal must allow admins to create department-specific questionnaires, assign them to users/respondents, collect answers from mobile or desktop, upload supporting files/forms/photos, review submissions, ask follow-up questions, and export results to Excel/PDF for SRS preparation.

This is not a demo. Build it as a real internal production-ready application.

---

## Main Goals

1. Replace scattered requirement collection through WhatsApp, paper notes, and Excel.
2. Collect answers from different departments in a structured way.
3. Allow each person to answer only the questions related to their role/department.
4. Track progress of answered, pending, submitted, reviewed, and approved questionnaires.
5. Allow file uploads for paper forms, photos, Excel files, and supporting documents.
6. Allow reviewers to mark answers as clear, unclear, approved, or needing follow-up.
7. Export collected requirements for SRS preparation.
8. Build the foundation in a way that can later support the full Maintenance Management System.

---

## Tech Stack

Use the following stack:

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui or clean reusable custom components
- Database: Supabase PostgreSQL
- Authentication: Supabase Auth
- Storage: Supabase Storage
- Validation: Zod
- Forms: React Hook Form
- Excel Export: exceljs or xlsx
- PDF Export: pdfmake, react-pdf, or a stable server-side PDF library
- Deployment Target: Vercel or company-approved hosting
- Mobile Support: responsive web app, PWA-friendly structure

Use TypeScript strict mode.

---

## Important Development Rules

1. Always build real working features, not fake UI.
2. Do not hardcode secrets, credentials, tokens, or Supabase service keys.
3. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
4. Use server-side permission checks for protected operations.
5. Use Supabase Row Level Security wherever applicable.
6. Use private storage buckets for uploaded files.
7. Generate signed URLs only for users who are authorized to view files.
8. Validate all form inputs with Zod.
9. Use clean, reusable components.
10. Keep the UI simple, professional, and mobile-friendly.
11. Add loading states, empty states, and error states.
12. Do not delete important business records permanently unless clearly required.
13. Prefer soft delete/deactivate for users, departments, questionnaires, and respondents.
14. Keep audit logs for important actions.
15. Update README when setup, env variables, migrations, or commands change.

---

## User Roles

Implement role-based access control.

### Super Admin / IT Admin

Full access to everything.

Can manage users, departments, respondents, questionnaires, questions, assignments, answers, files, exports, audit logs, and settings.

### Requirement Admin

Can manage questionnaires, questions, assignments, answers, exports, reviews, and follow-up questions.

Cannot manage system-level settings unless explicitly allowed.

### Reviewer / IT Manager

Can view submissions, review answers, mark answers as clear/unclear/approved/needs follow-up, add comments, ask follow-up questions, and reopen submissions.

### Department Respondent

Can view assigned questionnaires only, save draft answers, submit final answers, upload files, answer follow-up questions, and view own submissions.

Cannot view other respondents’ answers or access admin areas.

### Viewer / Management

Can view dashboards and reports only. Cannot edit, review, or manage system data.

---

## Core Modules

Build the application around these modules:

1. Authentication
2. Dashboard
3. Department Management
4. User/Profile Management
5. Respondent Management
6. Questionnaire Management
7. Question Category Management
8. Question Bank
9. Assignment Management
10. Respondent Answer Portal
11. File Uploads
12. Answer Review
13. Follow-up Questions
14. Excel Export
15. PDF Export
16. Audit Logs
17. App Settings

---

## Main Routes

### Auth Routes

- `/login`
- `/forgot-password`
- `/reset-password`

### Admin Routes

- `/dashboard`
- `/departments`
- `/departments/new`
- `/departments/[id]`
- `/users`
- `/users/new`
- `/respondents`
- `/respondents/new`
- `/questionnaires`
- `/questionnaires/new`
- `/questionnaires/[id]`
- `/questions`
- `/questions/new`
- `/assignments`
- `/assignments/new`
- `/submissions`
- `/submissions/[id]`
- `/files`
- `/exports`
- `/audit-logs`
- `/settings`

### Respondent Routes

- `/my-questionnaires`
- `/my-questionnaires/[assignmentId]`
- `/my-questionnaires/[assignmentId]/submit`
- `/follow-ups`
- `/profile`

### Optional Secure Token Route

- `/q/[secureToken]`

The secure token route should allow questionnaire access through a unique expiring token if the admin chooses token-based access.

---

## Database Tables

Create Supabase migrations for the following tables.

Use UUID primary keys where suitable. Add `created_at`, `updated_at`, `created_by`, and `updated_by` where useful.

### profiles

Fields:

- `id uuid primary key references auth.users(id)`
- `employee_id text nullable`
- `full_name text not null`
- `email text unique not null`
- `phone text nullable`
- `role text not null`
- `department_id uuid nullable references departments(id)`
- `is_active boolean default true`
- `last_login_at timestamp nullable`
- `created_at timestamp default now()`
- `updated_at timestamp default now()`

### departments

Fields:

- `id uuid primary key`
- `name text not null`
- `code text unique nullable`
- `description text nullable`
- `manager_name text nullable`
- `manager_email text nullable`
- `is_active boolean default true`
- `created_at timestamp default now()`
- `updated_at timestamp default now()`

### respondents

Fields:

- `id uuid primary key`
- `profile_id uuid nullable references profiles(id)`
- `department_id uuid references departments(id)`
- `full_name text not null`
- `designation text nullable`
- `email text nullable`
- `phone text nullable`
- `access_type text default 'login'`
- `is_active boolean default true`
- `notes text nullable`
- `created_at timestamp default now()`
- `updated_at timestamp default now()`

### questionnaires

Fields:

- `id uuid primary key`
- `title text not null`
- `description text nullable`
- `target_department_type text nullable`
- `estimated_minutes int nullable`
- `status text default 'draft'`
- `is_active boolean default true`
- `created_at timestamp default now()`
- `updated_at timestamp default now()`

Questionnaire status values:

- `draft`
- `published`
- `archived`

### question_categories

Fields:

- `id uuid primary key`
- `questionnaire_id uuid references questionnaires(id) on delete cascade`
- `title text not null`
- `description text nullable`
- `sort_order int default 0`
- `created_at timestamp default now()`
- `updated_at timestamp default now()`

### questions

Fields:

- `id uuid primary key`
- `questionnaire_id uuid references questionnaires(id) on delete cascade`
- `category_id uuid nullable references question_categories(id) on delete set null`
- `question_text text not null`
- `help_text text nullable`
- `question_type text not null`
- `options jsonb nullable`
- `is_required boolean default false`
- `sort_order int default 0`
- `is_active boolean default true`
- `created_at timestamp default now()`
- `updated_at timestamp default now()`

Supported question types:

- `short_text`
- `long_text`
- `yes_no`
- `single_choice`
- `multi_choice`
- `number`
- `date`
- `file`
- `priority`
- `rating`

### questionnaire_assignments

Fields:

- `id uuid primary key`
- `questionnaire_id uuid references questionnaires(id)`
- `respondent_id uuid references respondents(id)`
- `department_id uuid references departments(id)`
- `assigned_by uuid references profiles(id)`
- `status text default 'assigned'`
- `secure_token text unique nullable`
- `token_expires_at timestamp nullable`
- `due_date date nullable`
- `submitted_at timestamp nullable`
- `reviewed_at timestamp nullable`
- `reviewed_by uuid nullable references profiles(id)`
- `progress_percent int default 0`
- `created_at timestamp default now()`
- `updated_at timestamp default now()`

Assignment status values:

- `assigned`
- `in_progress`
- `submitted`
- `reviewed`
- `approved`
- `reopened`
- `expired`

### answers

Fields:

- `id uuid primary key`
- `assignment_id uuid references questionnaire_assignments(id) on delete cascade`
- `question_id uuid references questions(id)`
- `respondent_id uuid references respondents(id)`
- `answer_text text nullable`
- `answer_json jsonb nullable`
- `comment text nullable`
- `status text default 'draft'`
- `reviewed_by uuid nullable references profiles(id)`
- `reviewed_at timestamp nullable`
- `review_comment text nullable`
- `created_at timestamp default now()`
- `updated_at timestamp default now()`
- `unique(assignment_id, question_id)`

Answer status values:

- `draft`
- `submitted`
- `clear`
- `unclear`
- `needs_follow_up`
- `approved`

### answer_files

Fields:

- `id uuid primary key`
- `answer_id uuid nullable references answers(id) on delete cascade`
- `assignment_id uuid references questionnaire_assignments(id) on delete cascade`
- `uploaded_by uuid nullable references profiles(id)`
- `file_name text not null`
- `file_path text not null`
- `file_type text nullable`
- `file_size bigint nullable`
- `description text nullable`
- `created_at timestamp default now()`

### follow_up_questions

Fields:

- `id uuid primary key`
- `assignment_id uuid references questionnaire_assignments(id) on delete cascade`
- `answer_id uuid nullable references answers(id) on delete set null`
- `question_text text not null`
- `asked_by uuid references profiles(id)`
- `assigned_to uuid nullable references respondents(id)`
- `response_text text nullable`
- `status text default 'open'`
- `created_at timestamp default now()`
- `answered_at timestamp nullable`
- `closed_at timestamp nullable`

Follow-up status values:

- `open`
- `answered`
- `closed`

### exports

Fields:

- `id uuid primary key`
- `export_type text not null`
- `scope text not null`
- `file_path text nullable`
- `generated_by uuid references profiles(id)`
- `generated_at timestamp default now()`
- `filters jsonb nullable`

Export type values:

- `excel`
- `pdf`

Scope values:

- `all`
- `department`
- `questionnaire`
- `assignment`

### audit_logs

Fields:

- `id uuid primary key`
- `user_id uuid nullable references profiles(id)`
- `action text not null`
- `entity_type text not null`
- `entity_id uuid nullable`
- `old_values jsonb nullable`
- `new_values jsonb nullable`
- `ip_address text nullable`
- `user_agent text nullable`
- `created_at timestamp default now()`

### app_settings

Fields:

- `key text primary key`
- `value jsonb not null`
- `updated_by uuid nullable references profiles(id)`
- `updated_at timestamp default now()`

---

## Database Indexes

Add indexes for:

- `questionnaire_assignments.status`
- `questionnaire_assignments.respondent_id`
- `questionnaire_assignments.department_id`
- `answers.assignment_id`
- `answers.question_id`
- `answers.status`
- `follow_up_questions.status`
- `audit_logs.user_id`
- `audit_logs.created_at`

Add an `updated_at` trigger where needed.

---

## Supabase RLS Requirements

Enable Row Level Security.

Rules:

1. Super Admin can access everything.
2. Requirement Admin can manage questionnaires, questions, assignments, answers, exports, and follow-ups.
3. Reviewer can view all submissions and review answers.
4. Respondent can only access assigned questionnaires and their own answers/files.
5. Viewer can read dashboards/reports but cannot modify.
6. Uploaded files must be private.
7. File access must be controlled through signed URLs.

Create helper database functions if useful:

- `get_current_user_role()`
- `is_admin()`
- `can_access_assignment(assignment_id uuid)`

Never rely only on frontend checks.

---

## Questionnaire Requirements

Admins must be able to:

- Create questionnaires
- Edit questionnaires
- Archive questionnaires
- Publish questionnaires
- Create question categories
- Create questions
- Set question type
- Set question as required/optional
- Add options for single choice and multiple choice questions
- Reorder categories
- Reorder questions
- Assign questionnaires to respondents/departments

Respondents must be able to:

- Open assigned questionnaires
- Answer questions
- Save draft
- Continue later
- Upload files
- See progress
- Submit final answers
- View follow-up questions
- Reply to follow-up questions

Validation:

- Required questions must be answered before final submission.
- File upload type and size must be validated.
- Date and number fields must be validated.
- Respondents cannot edit submitted answers unless admin reopens the assignment.

---

## Dashboard Requirements

Admin dashboard must show:

- Total departments
- Total respondents
- Total questionnaires
- Total questions
- Total assignments
- Submitted assignments
- Pending assignments
- In-progress assignments
- Files uploaded
- Open follow-up questions

Dashboard tables:

- Department-wise completion
- Respondent-wise completion
- Questionnaire-wise completion
- Pending submissions
- Recently submitted answers
- Open follow-up questions

Use clear cards, status badges, progress bars, filters, and pagination.

---

## Review Workflow

Reviewers must be able to:

- View submitted assignments
- View answers grouped by category
- Mark each answer as:
  - Clear
  - Unclear
  - Needs Follow-up
  - Approved
- Add review comments
- Ask follow-up questions for specific answers
- Reopen submissions
- Approve final submission

Respondents must be able to see and answer follow-up questions assigned to them.

---

## Export Requirements

### Excel Export

Support exports for:

- All answers
- Answers by department
- Answers by questionnaire
- Answers by respondent
- Pending questions
- Follow-up questions

Excel columns should include:

- Department
- Respondent
- Designation
- Questionnaire
- Category
- Question
- Answer
- Comment
- Status
- Review Comment
- Submitted At
- Reviewed By

### PDF Export

PDF summary should include:

- Header: RECAFCO Maintenance System Requirement Collection
- Questionnaire title
- Department
- Respondent details
- Answers grouped by category
- Unanswered questions
- Follow-up questions
- Uploaded file list
- Generated date/time
- Generated by

---

## File Upload Requirements

Create a private Supabase Storage bucket:

- `requirement-files`

Allowed file types:

- PDF
- JPG
- PNG
- XLS
- XLSX
- DOC
- DOCX

Default max file size: 10MB.

The file size limit should be configurable later.

Files can be attached to:

- A specific answer
- A whole assignment

Store file metadata in `answer_files`.

---

## Audit Log Requirements

Audit these actions:

- Login
- Create/update/deactivate user
- Create/update/deactivate respondent
- Create/update/deactivate department
- Create/update/publish/archive questionnaire
- Create/update question
- Assign questionnaire
- Save answer
- Submit answer
- Upload file
- Review answer
- Create follow-up question
- Answer follow-up question
- Generate export
- Change role
- Change settings

Audit log page must support:

- Date filter
- User filter
- Action filter
- Entity type filter

---

## Default Questionnaires to Seed

Seed department-wise questionnaires.

### IT Manager Questionnaire

Topics:

- System scope
- Phase 1 scope
- Hosting
- Security
- Login method
- Network access
- Backup
- Audit logs
- Language
- Tech stack
- Integrations
- Users and roles
- Deadline

### Maintenance Manager Questionnaire

Topics:

- Maintenance sections
- Work order workflow
- Approval flow
- Emergency work
- Technician assignment
- Work order types
- Statuses
- Completion and closure
- Preventive maintenance
- Reports
- Labor/material cost

### Maintenance Data Entry Questionnaire

Topics:

- Paper form usage
- Work order numbering
- Mandatory fields
- Common mistakes
- Filing method
- Old form entry
- Print/PDF need
- Excel tracking
- Manual reports

### Maintenance Supervisor Questionnaire

Topics:

- Technician assignment
- Job verification
- Start/end time
- Parts request process
- Completion flow
- Operator confirmation
- Field problems
- Mobile usage

### Technician Questionnaire

Topics:

- Login need
- Assigned jobs
- Mobile updates
- Start/finish time
- Material usage
- Parts request
- Photo upload
- Weak internet
- Current paper process pain points

### Store Keeper Questionnaire

Topics:

- Parts request flow
- Approval before issue
- Spare parts inventory
- SS rec code
- Part number
- Stock availability
- Partial issue
- Unavailable parts
- Stock deduction
- Returned parts
- Low stock alerts

### Purchase Department Questionnaire

Topics:

- Purchase request flow
- When purchase is involved
- Who creates purchase requests
- Approvals
- Quotations
- Supplier selection
- Status updates
- Attachments
- Existing purchase system

### Finance Department Questionnaire

Topics:

- Cost approval
- Price visibility
- Approval limits
- CEO approval amount
- Cost reports
- Currency
- Budget tracking
- Excel export

### Department Manager / Requester Questionnaire

Topics:

- Maintenance request process
- Request permissions
- Department manager approval
- Request status tracking
- Completion confirmation
- Notifications
- Cost visibility
- Reports needed

### CEO / Management Questionnaire

Topics:

- High-level dashboard
- KPIs
- Approval involvement
- Cost reports
- Asset downtime
- Overdue work orders
- Department comparison
- Monthly summary

---

## Exact Sample Questions to Seed

### IT Manager

1. Is the system only for the Maintenance Department, or should it become a company-wide workflow system later?
2. What is the phase 1 scope?
3. What is the expected deadline for the first working version?
4. Where should the system be hosted?
5. Should the system be accessible outside the company network?
6. Should login use company email, employee number, or username?
7. Is two-factor authentication required?
8. Should every action be audit logged?
9. Should the system be English only or bilingual English/Arabic?
10. Does company data need to stay inside company server or inside Kuwait?

### Maintenance Manager

1. Who can create a work order?
2. Who approves a work order?
3. Does every work order need approval before work starts?
4. Can emergency work start without approval?
5. Who assigns technicians?
6. What are the maintenance sections?
7. What are the work order types?
8. Who closes the work order?
9. Is operator signature required after completion?
10. Do you need preventive maintenance reminders?

### Maintenance Data Entry

1. How do you currently number work orders?
2. Are work order numbers manual or automatic?
3. Which fields are mandatory in the current work order form?
4. Which fields are often missing?
5. Where do completed paper forms go?
6. Do you use Excel for tracking?
7. Do you prepare monthly reports manually?
8. Should old paper work orders be entered into the new system?
9. Should the digital form look like the paper form?
10. Do you need PDF/print after submission?

### Technician

1. Do technicians need their own login?
2. Should technicians see only assigned jobs?
3. Should technicians update job status from mobile?
4. Should technicians enter start time and finish time?
5. Should technicians upload before/after repair photos?
6. Should technicians request parts from mobile?
7. Is internet weak in workshop/site areas?
8. What is difficult in the current paper process?

### Store Keeper

1. Do you receive parts requests from maintenance?
2. Do you issue parts only after approval?
3. Do you have spare parts inventory now?
4. Is inventory in Excel, ERP, or paper?
5. What does SS rec code mean?
6. Is part number available for all items?
7. Can parts be partially issued?
8. What happens if parts are not available?
9. Should stock reduce automatically after issue?
10. Should unused parts be returned to store?

### Purchase Department

1. When does maintenance send purchase request?
2. Is purchase request created by maintenance or store?
3. Who approves purchase request?
4. Do you need multiple quotations?
5. Who selects supplier?
6. Does purchase need to update request status?
7. Should purchase status connect to the maintenance work order?
8. Do you already have a purchase system?

### Finance Department

1. Does finance approve maintenance cost?
2. Who can see prices?
3. Should normal maintenance users see prices?
4. Are approval limits based on amount?
5. Does CEO approve high-value repairs?
6. Should reports show cost by department, asset, vehicle, and month?
7. What currency should be used?
8. Do you need budget tracking?

### Department Manager / Requester

1. How do you currently request maintenance?
2. Who is allowed to submit maintenance request from your department?
3. Should department manager approve before sending to maintenance?
4. Should you see status of your request?
5. Do you need notification when work is completed?
6. Should you confirm completion?
7. Should you see maintenance cost or not?
8. What reports do you need from maintenance?

### CEO / Management

1. What KPIs should management see?
2. Should CEO see all departments and all work orders?
3. Should CEO approve high-cost maintenance or purchase requests?
4. What cost limit requires CEO approval?
5. Do you need monthly maintenance summary?
6. Do you need asset downtime report?
7. Do you need overdue work order report?
8. Do you need department-wise cost comparison?

---

## UI Design Requirements

Design style:

- Professional internal enterprise application
- Clean white/light background
- Simple and clear for non-technical users
- Mobile-first respondent screens
- Modern dashboard for admins and managers
- RECAFCO corporate feel
- Avoid overcomplicated animations
- Use readable fonts and good spacing

Required components:

- `PageHeader`
- `StatCard`
- `DataTable`
- `StatusBadge`
- `QuestionRenderer`
- `FileUploader`
- `ProgressBar`
- `EmptyState`
- `ConfirmDialog`
- `FormSection`
- `ReviewPanel`

Admin layout:

- Sidebar navigation
- Top bar with user profile/logout
- Breadcrumbs
- Search/filter
- Pagination

Respondent layout:

- Simple mobile-first layout
- Progress indicator
- Save draft button
- Next/Previous navigation
- Submit final answers button

---

## Validation and Error Handling

Implement:

- Zod validation for all forms
- Safe server actions or API routes
- Clear error messages
- Loading states
- Empty states
- Unauthorized page
- Not found page
- Form draft saving
- Final submission confirmation
- Duplicate submission prevention

---

## Environment Variables

Create `.env.example` with:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
```

Rules:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be used in client.
- `SUPABASE_SERVICE_ROLE_KEY` must only be used server-side.
- Never commit real `.env` values.

---

## Folder Structure Preference

Use a clean structure similar to:

```txt
app/
  (auth)/
  (admin)/
  (respondent)/
components/
  ui/
  dashboard/
  forms/
  questionnaires/
  files/
  review/
lib/
  supabase/
  auth/
  permissions/
  validations/
  exports/
  audit/
types/
supabase/
  migrations/
  seed/
docs/
```

---

## Commands

Use these commands where applicable:

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

If using pnpm, use:

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

Add the correct commands to README.

---

## README Requirements

Create and maintain `README.md` with:

- Project overview
- Features
- Tech stack
- Setup steps
- Supabase setup
- Environment variables
- Migration instructions
- Seed instructions
- Development commands
- Deployment notes
- Default admin creation instructions
- Security notes
- Main workflow testing steps

---

## Quality Checklist Before Finishing

Before completing any major task, check:

1. Does the app compile?
2. Does TypeScript pass?
3. Does lint pass?
4. Are protected routes protected?
5. Are server-side permission checks implemented?
6. Can respondents only see their own assignments?
7. Are uploaded files private?
8. Are signed URLs used correctly?
9. Can admins review answers?
10. Can exports be generated?
11. Is the mobile questionnaire screen usable?
12. Are there loading, empty, and error states?
13. Is audit logging implemented for important actions?

---

## Development Order

Build in this order.

### Phase 1

- Project setup
- Supabase client
- Auth
- Layout
- Database migrations
- Profiles and roles
- Departments
- Respondents
- Basic dashboard

### Phase 2

- Questionnaire CRUD
- Categories
- Questions
- Question types
- Publishing

### Phase 3

- Assignment system
- Respondent portal
- Save draft answers
- Submit final answers
- Progress tracking

### Phase 4

- File uploads
- Review answers
- Follow-up questions
- Dashboard improvements

### Phase 5

- Excel export
- PDF export
- Audit logs
- UI polish
- README
- Testing and fixes

---

## Current Business Context

The larger future project is a Maintenance Management System for a large construction/manufacturing company. The maintenance department currently uses paper forms for work orders and parts requests.

The current paper forms include:

### Work Order Form

Fields include:

- Work order number
- Ordered by
- Machine
- Serial number
- Date of order
- Job location
- Start date/time
- End date/time
- Maintenance type
- Worker type
- Running hours/kilometers
- Operator complaint
- Description of work
- Labor entries
- Material used
- Operator signature
- Next service

### Parts Request Form

Fields include:

- Department
- Work order number
- Equipment/remarks
- Date/time
- Item description
- Part number
- SS rec code
- Quantity
- Remarks
- Total price
- Requested by
- Prepared by
- Approved by

The requirement collection portal must help gather accurate answers before the full system is designed and built.

---

## Final Instruction to Codex

When working on this project:

1. Read this `AGENTS.md` first.
2. Follow the project architecture and security rules.
3. Build features in phases.
4. Do not skip database, auth, RBAC, RLS, validation, file security, exports, or audit logs.
5. Do not create placeholder-only pages for core functionality.
6. Always explain what files were changed and how to test the result.
7. Run lint, typecheck, and build whenever possible before final response.
