import { supabase } from "@/lib/supabase";
import RoleActions from "./RoleActions";
import AddRoleForm from "./AddRoleForm";

type UserRole = {
  id: number;
  user_id: string;
  role: string | null;
  created_at: string | null;
};

type Profile = {
  user_id: string;
  company_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  account_type: string | null;
};

function getProfileName(profile?: Profile) {
  if (!profile) return "Pa emër";

  if (profile.company_name) return profile.company_name;

  const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();

  return fullName || "Pa emër";
}

function getAccountType(type?: string | null) {
  if (type === "company") {
    return (
      <span className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600">
        Kompani
      </span>
    );
  }

  if (type === "professional") {
    return (
      <span className="rounded-lg bg-purple-100 px-3 py-1 text-xs font-bold text-purple-600">
        Profesionist
      </span>
    );
  }

  return (
    <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
      Staf
    </span>
  );
}

function getRoleBadge(role?: string | null) {
  if (role === "super_admin") {
    return (
      <span className="rounded-lg bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
        Super Admin
      </span>
    );
  }

  if (role === "admin") {
    return (
      <span className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600">
        Admin
      </span>
    );
  }

  if (role === "moderator") {
    return (
      <span className="rounded-lg bg-purple-100 px-3 py-1 text-xs font-bold text-purple-600">
        Moderator
      </span>
    );
  }

  if (role === "operator") {
    return (
      <span className="rounded-lg bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
        Operator
      </span>
    );
  }

  return (
    <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
      User
    </span>
  );
}

export default async function AdminRolesPage() {
  const { data: roles, error } = await supabase
    .from("user_roles")
    .select("id, user_id, role, created_at")
    .order("created_at", { ascending: false });

  const rolesList = (roles as UserRole[] | null) || [];
  const userIds = rolesList.map((role) => role.user_id);

  const { data: profiles } =
    userIds.length > 0
      ? await supabase
          .from("profiles")
          .select("user_id, company_name, first_name, last_name, email, account_type")
          .in("user_id", userIds)
      : { data: [] };

  function getProfile(userId: string) {
    return (profiles as Profile[] | null)?.find(
      (profile) => profile.user_id === userId
    );
  }

  if (error) {
    return (
      <div className="px-4 py-5 lg:px-8 lg:py-7">
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 lg:px-8 lg:py-7">
      <h1 className="text-2xl font-black">Rolet & Lejet</h1>

      <p className="mt-1 text-sm text-slate-500">
        Këtu menaxhohen rolet dhe kompetencat e stafit në MojProfi.
      </p>

      <AddRoleForm />

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[850px] w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3 pr-4 font-bold">Emri</th>
                <th className="py-3 pr-4 font-bold">Email</th>
                <th className="py-3 pr-4 font-bold">Lloji</th>
                <th className="py-3 pr-4 font-bold">Roli aktual</th>
                <th className="py-3 font-bold">Ndrysho rol</th>
              </tr>
            </thead>

            <tbody>
              {rolesList.map((item) => {
                const profile = getProfile(item.user_id);

                return (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="py-4 pr-4 font-bold">
                      {getProfileName(profile)}
                    </td>

                    <td className="py-4 pr-4 text-slate-600">
                      {profile?.email || "Pa email"}
                    </td>

                    <td className="py-4 pr-4">
                      {getAccountType(profile?.account_type)}
                    </td>

                    <td className="py-4 pr-4">
                      {getRoleBadge(item.role)}
                    </td>

                    <td className="py-4">
                      <RoleActions userId={item.user_id} currentRole={item.role} />
                    </td>
                  </tr>
                );
              })}

              {rolesList.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    Nuk ka ende role të regjistruara.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}