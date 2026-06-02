export type UserRole =
  | "super_admin"
  | "requirement_admin"
  | "reviewer"
  | "respondent"
  | "viewer";

export type Department = {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  manager_name: string | null;
  manager_email: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  employee_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  department_id: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Respondent = {
  id: string;
  profile_id: string | null;
  department_id: string;
  full_name: string;
  designation: string | null;
  email: string | null;
  phone: string | null;
  access_type: "login" | "secure_token";
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type DashboardStats = {
  total_departments: number;
  total_respondents: number;
  total_questionnaires: number;
  total_questions: number;
  total_assignments: number;
  submitted_assignments: number;
  pending_assignments: number;
  in_progress_assignments: number;
  files_uploaded: number;
  open_follow_ups: number;
};

export type Database = {
  public: {
    Tables: {
      departments: {
        Row: Department;
        Insert: Partial<Department> & Pick<Department, "name">;
        Update: Partial<Department>;
      };
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & Pick<Profile, "id" | "full_name" | "email" | "role">;
        Update: Partial<Profile>;
      };
      respondents: {
        Row: Respondent;
        Insert: Partial<Respondent> & Pick<Respondent, "department_id" | "full_name">;
        Update: Partial<Respondent>;
      };
    };
    Views: {
      dashboard_stats: {
        Row: DashboardStats;
      };
    };
    Functions: {
      get_current_user_role: {
        Args: Record<string, never>;
        Returns: UserRole | null;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      can_access_assignment: {
        Args: { assignment_id: string };
        Returns: boolean;
      };
    };
  };
};
