"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Eye } from "lucide-react";

type ProfileCategory = {
  is_main?: boolean | null;
  categories?: {
    name?: string | null;
  } | null;
};

type Project = {
  id: number;
};

type Review = {
  rating?: number | null;
};

type Profile = {
  id: number;
  account_type: string;
  slug: string;
  first_name?: string | null;
  last_name?: string | null;
  profession?: string | null;
  phone?: string | null;
  created_at?: string | null;
  approval_status?: string | null;
  cities?: {
    name?: string | null;
  } | null;
  profile_categories?: ProfileCategory[] | null;
  projects?: Project[] | null;
  reviews?: Review[] | null;
};

export default function AdminProfessionalsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProfessionals();
  }, []);

  async function loadProfessionals() {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        account_type,
        slug,
        first_name,
        last_name,
        profession,
        phone,
        created_at,
        approval_status,
        cities(name),
        profile_categories(
          is_main,
          categories(name)
        ),
        projects(id),
        reviews(rating)
      `)
      .eq("account_type", "professional")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setProfiles((data as Profile[]) || []);
  }

  const filteredProfiles = profiles.filter((profile) => {
    const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`;
    const text = `${fullName} ${profile.profession || ""} ${
      profile.phone || ""
    }`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  function getFullName(profile: Profile) {
    return `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "-";
  }

  function getMainCategory(profile: Profile) {
    const mainCategory =
      profile.profile_categories?.find((item) => item.is_main)?.categories?.name ||
      profile.profile_categories?.[0]?.categories?.name;

    return mainCategory || "-";
  }

  function getReviews(profile: Profile) {
    const reviews = profile.reviews || [];

    if (reviews.length === 0) {
      return "⭐ 0.0 (0)";
    }

    const total = reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );

    const average = total / reviews.length;

    return `⭐ ${average.toFixed(1)} (${reviews.length})`;
  }

  function getStatusBadge(status?: string | null) {
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

  return (
    <div className="px-8 py-7">
      <h1 className="text-2xl font-black">Mjeshtrit / Profesionistët</h1>
      <p className="mt-1 text-sm text-slate-500">
        Këtu shfaqen të gjithë profesionistët e regjistruar në MojProfi.
      </p>

      <div className="mt-6 flex gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Kërko emër, profesion ose telefon..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-3 font-bold">Emri</th>
              <th className="py-3 font-bold">Profesioni</th>
              <th className="py-3 font-bold">Kategoria</th>
              <th className="py-3 font-bold">Qyteti</th>
              <th className="py-3 font-bold">Projektet</th>
              <th className="py-3 font-bold">Vlerësimet</th>
              <th className="py-3 font-bold">Telefoni</th>
              <th className="py-3 font-bold">Regjistruar më</th>
              <th className="py-3 font-bold">Statusi</th>
              <th className="py-3 font-bold">Veprimet</th>
            </tr>
          </thead>

          <tbody>
            {filteredProfiles.map((profile) => (
              <tr
                key={profile.id}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="py-3 font-bold">{getFullName(profile)}</td>

                <td className="py-3 text-slate-600">
                  {profile.profession || "-"}
                </td>

                <td className="py-3 text-slate-600">
                  {getMainCategory(profile)}
                </td>

                <td className="py-3 text-slate-600">
                  {profile.cities?.name || "-"}
                </td>

                <td className="py-3 text-slate-600">
                  {profile.projects?.length || 0}
                </td>

                <td className="py-3 text-slate-600">
                  {getReviews(profile)}
                </td>

                <td className="py-3 text-slate-600">
                  {profile.phone || "-"}
                </td>

                <td className="py-3 text-slate-600">
                  {profile.created_at
                    ? new Date(profile.created_at).toISOString().split("T")[0]
                    : "-"}
                </td>

                <td className="py-3">
                  {getStatusBadge(profile.approval_status)}
                </td>

                <td className="py-3">
                  <Link
                    href={`/professional/${profile.slug}`}
                    className="inline-flex rounded-lg bg-blue-50 p-2 text-blue-600"
                  >
                    <Eye size={15} />
                  </Link>
                </td>
              </tr>
            ))}

            {filteredProfiles.length === 0 && (
              <tr>
                <td colSpan={10} className="py-6 text-center text-slate-500">
                  Nuk ka profesionistë për momentin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}