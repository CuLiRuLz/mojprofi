import Link from "next/link";
import { Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";

type UserProfile = {
  id: number;
  account_type: string | null;
  slug: string | null;
  company_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  verified_level: number | null;
  approval_status: string | null;
};

function getProfileName(profile: UserProfile) {
  if (profile.account_type === "company") {
    return profile.company_name || "-";
  }

  return `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "-";
}

function getProfileLink(profile: UserProfile) {
  if (!profile.slug) return "#";

  if (profile.account_type === "professional") {
    return `/professional/${profile.slug}`;
  }

  return `/company/${profile.slug}`;
}

function getAccountType(type: string | null) {
  if (type === "company") {
    return (
      <span className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600">
        Kompani
      </span>
    );
  }

  return (
    <span className="rounded-lg bg-purple-100 px-3 py-1 text-xs font-bold text-purple-600">
      Profesionist
    </span>
  );
}

function getStatusBadge(status: string | null) {
  if (status === "approved") {
    return (
      <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-600">
        Aprovuar
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="rounded-lg bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
        Refuzuar
      </span>
    );
  }

  return (
    <span className="rounded-lg bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
      Në pritje
    </span>
  );
}

function getVerificationBadge(level: number | null) {
  if (level === 3) {
    return (
      <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-600">
        Level 3
      </span>
    );
  }

  if (level === 2) {
    return (
      <span className="rounded-lg bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
        Level 2
      </span>
    );
  }

  if (level === 1) {
    return (
      <span className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600">
        Level 1
      </span>
    );
  }

  return (
    <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
      Pa verifikim
    </span>
  );
}

export default async function AdminUsersPage() {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(`
      id,
      account_type,
      slug,
      company_name,
      first_name,
      last_name,
      phone,
      verified_level,
      approval_status
    `)
    .order("id", { ascending: false });

  const profilesList = (profiles as UserProfile[] | null) || [];

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
      <h1 className="text-2xl font-black">Përdoruesit</h1>

      <p className="mt-1 text-sm text-slate-500">
        Menaxhimi i të gjitha kompanive dhe profesionistëve të regjistruar.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[850px] w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3 pr-4 font-bold">ID</th>
                <th className="py-3 pr-4 font-bold">Emri</th>
                <th className="py-3 pr-4 font-bold">Lloji</th>
                <th className="py-3 pr-4 font-bold">Telefoni</th>
                <th className="py-3 pr-4 font-bold">Statusi</th>
                <th className="py-3 pr-4 font-bold">Verifikimi</th>
                <th className="py-3 font-bold">Veprimet</th>
              </tr>
            </thead>

            <tbody>
              {profilesList.map((profile) => (
                <tr
                  key={profile.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="py-4 pr-4 font-medium">#{profile.id}</td>

                  <td className="py-4 pr-4 font-bold">
                    {getProfileName(profile)}
                  </td>

                  <td className="py-4 pr-4">
                    {getAccountType(profile.account_type)}
                  </td>

                  <td className="py-4 pr-4 text-slate-600">
                    {profile.phone || "-"}
                  </td>

                  <td className="py-4 pr-4">
                    {getStatusBadge(profile.approval_status)}
                  </td>

                  <td className="py-4 pr-4">
                    {getVerificationBadge(profile.verified_level)}
                  </td>

                  <td className="py-4">
                    <Link
                      href={getProfileLink(profile)}
                      className="inline-flex rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                      title="Shiko profilin"
                    >
                      <Eye size={15} />
                    </Link>
                  </td>
                </tr>
              ))}

              {profilesList.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500">
                    Nuk ka përdorues.
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