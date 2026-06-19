"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Eye, RotateCcw } from "lucide-react";

type Profile = {
  id: number;
  account_type: string;
  slug: string;
  company_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  created_at?: string | null;
  city_name?: string | null;
};

export default function ApprovedProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    async function loadProfiles() {
      const { data, error } = await supabase.rpc(
  "admin_get_profiles_by_status",
  {
    p_status: "approved",
  }
);

if (error) {
  alert(error.message);
  return;
}

      setProfiles(data || []);
    }

    loadProfiles();
  }, []);

  async function moveToPending(profileId: number) {
    const confirmed = window.confirm(
      "A je i sigurt që dëshiron ta kthesh këtë profil në pritje?"
    );

    if (!confirmed) return;

    const { error } = await supabase.rpc("admin_move_profile_to_pending", {
  p_profile_id: profileId,
});

    if (error) {
      alert(error.message);
      return;
    }

    setProfiles((current) =>
      current.filter((profile) => profile.id !== profileId)
    );
  }

  return (
    <div className="px-8 py-7">
      <h1 className="text-2xl font-black">Profile të aprovuara</h1>
      <p className="mt-1 text-sm text-slate-500">
        Këtu shfaqen kompanitë dhe profesionistët që janë aprovuar nga admini.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-3 font-bold">Emri</th>
              <th className="py-3 font-bold">Lloji</th>
              <th className="py-3 font-bold">Qyteti</th>
              <th className="py-3 font-bold">Telefoni</th>
              <th className="py-3 font-bold">Regjistruar më</th>
              <th className="py-3 font-bold">Statusi</th>
              <th className="py-3 font-bold">Veprimet</th>
            </tr>
          </thead>

          <tbody>
            {profiles.map((profile) => {
              const name =
                profile.account_type === "company"
                  ? profile.company_name || "-"
                  : `${profile.first_name || ""} ${
                      profile.last_name || ""
                    }`.trim() || "-";

              const profileHref =
                profile.account_type === "company"
                  ? `/company/${profile.slug}`
                  : `/professional/${profile.slug}`;

              return (
                <tr key={profile.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 font-bold">{name}</td>
                  <td className="py-3 text-slate-600">
                    {profile.account_type === "company" ? "Company" : "Professional"}
                  </td>
                  <td className="py-3 text-slate-600">
  {profile.city_name || "-"}
</td>
                  <td className="py-3 text-slate-600">{profile.phone || "-"}</td>
                  <td className="py-3 text-slate-600">
                    {profile.created_at
                      ? new Date(profile.created_at).toISOString().split("T")[0]
                      : "-"}
                  </td>
                  <td className="py-3">
                    <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-600">
                      Aprovuar
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Link
                        href={profileHref}
                        className="inline-flex rounded-lg bg-blue-50 p-2 text-blue-600"
                      >
                        <Eye size={15} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => moveToPending(profile.id)}
                        className="rounded-lg bg-orange-50 p-2 text-orange-600"
                      >
                        <RotateCcw size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {profiles.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-500">
                  Nuk ka profile të aprovuara për momentin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}