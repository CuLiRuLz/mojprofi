import Link from "next/link";
import { Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import VerificationLevelButton from "./VerificationLevelButton";

type Profile = {
  id: number;
  account_type: string | null;
  slug: string | null;
  company_name: string | null;
  first_name: string | null;
  last_name: string | null;
  approval_status: string | null;
  verified_level: number | null;
  cities: {
    name: string | null;
  } | null;
};

function getProfileName(profile: Profile) {
  if (profile.account_type === "company") {
    return profile.company_name || "-";
  }

  return `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "-";
}

function getProfileType(profile: Profile) {
  if (profile.account_type === "company") {
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

function getProfileLink(profile: Profile) {
  if (!profile.slug) return "#";

  if (profile.account_type === "professional") {
    return `/professional/${profile.slug}`;
  }

  return `/company/${profile.slug}`;
}

export default async function AdminVerificationsPage() {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(`
      id,
      account_type,
      slug,
      company_name,
      first_name,
      last_name,
      approval_status,
      verified_level,
      cities(name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="px-8 py-7">
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="px-8 py-7">
      <h1 className="text-2xl font-black">Verifikimet</h1>
      <p className="mt-1 text-sm text-slate-500">
        Këtu menaxhohen nivelet e verifikimit për kompanitë dhe profesionistët.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-3 font-bold">Profili</th>
              <th className="py-3 font-bold">Lloji</th>
              <th className="py-3 font-bold">Qyteti</th>
              <th className="py-3 font-bold">Statusi</th>
              <th className="py-3 font-bold">Verifikimi</th>
              <th className="py-3 font-bold">Veprimet</th>
            </tr>
          </thead>

          <tbody>
            {(profiles as unknown as Profile[] | null)?.map((profile) => (
              <tr
                key={profile.id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="py-3 font-bold">{getProfileName(profile)}</td>

                <td className="py-3">{getProfileType(profile)}</td>

                <td className="py-3 text-slate-600">
                  {profile.cities?.name || "-"}
                </td>

                <td className="py-3">
                  {getStatusBadge(profile.approval_status)}
                </td>

                <td className="py-3">
                  {getVerificationBadge(profile.verified_level)}
                </td>

                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={getProfileLink(profile)}
                      className="inline-flex rounded-lg bg-blue-50 p-2 text-blue-600"
                      title="Shiko profilin"
                    >
                      <Eye size={15} />
                    </Link>

                    <VerificationLevelButton profileId={profile.id} level={0} />
                    <VerificationLevelButton profileId={profile.id} level={1} />
                    <VerificationLevelButton profileId={profile.id} level={2} />
                    <VerificationLevelButton profileId={profile.id} level={3} />
                  </div>
                </td>
              </tr>
            ))}

            {profiles?.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-500">
                  Nuk ka profile për verifikim.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}