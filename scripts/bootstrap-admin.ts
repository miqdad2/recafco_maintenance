import { createClient } from "@supabase/supabase-js";
import { usernameToInternalEmail, normalizeUsername } from "../lib/auth/username";
import { loadLocalEnv } from "./env";

loadLocalEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminUsername = process.env.INITIAL_ADMIN_USERNAME;
const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;
const adminFullName = process.env.INITIAL_ADMIN_FULL_NAME ?? "System Admin";

if (!supabaseUrl || !serviceRoleKey || !adminUsername || !adminPassword) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, INITIAL_ADMIN_USERNAME, or INITIAL_ADMIN_PASSWORD."
  );
}

if (adminPassword.length < 8) {
  throw new Error("INITIAL_ADMIN_PASSWORD must be at least 8 characters.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const adminEmail = usernameToInternalEmail(adminUsername);
const normalizedUsername = normalizeUsername(adminUsername);

async function findUserByEmail(email: string) {
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage
    });

    if (error) throw error;

    const user = data.users.find(
      (item) => item.email?.toLowerCase() === email.toLowerCase()
    );
    if (user) return user;
    if (data.users.length < perPage) return null;
    page += 1;
  }
}

async function bootstrapAdmin() {
  const existingUser = await findUserByEmail(adminEmail!);
  const userId = existingUser?.id;

  const userResult = existingUser
    ? await supabase.auth.admin.updateUserById(existingUser.id, {
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { full_name: adminFullName, role: "super_admin" }
      })
    : await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { full_name: adminFullName, role: "super_admin" }
      });

  if (userResult.error) throw userResult.error;

  const adminUserId = userId ?? userResult.data.user?.id;
  if (!adminUserId) throw new Error("Supabase did not return an admin user id.");

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: adminUserId,
    full_name: adminFullName,
    email: adminEmail,
    employee_id: normalizedUsername,
    role: "super_admin",
    is_active: true
  });

  if (profileError) throw profileError;

  console.log(`Admin account ready. Username: ${normalizedUsername}`);
}

bootstrapAdmin().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
