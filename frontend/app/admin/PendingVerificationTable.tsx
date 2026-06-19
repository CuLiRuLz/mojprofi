"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Check, Eye, X } from "lucide-react";

type PendingProfile = {
  id: number;
  account_type: string;
  slug: string;
  company_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  created_at?: string | null;
  cities?: { name?: string | null } | null;
};

export default function PendingVerificationTable({
  initialProfiles,
}: {
  initialProfiles: PendingProfile[];
}) {
  const [profiles, setProfiles] = useState<PendingProfile[]>(initialProfiles);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  async function approveProfile(profileId: number) {
    setLoadingIds((prev) => [...prev, profileId]);

    const { error } = await supabase.rpc("admin_approve_profile", {
      p_profile_id: profileId,
    });

    setLoadingIds((prev) => prev.filter((id) => id !== profileId));

    if (error) {
      alert("Gabim gjatë aprovimit: " + error.message);
      return;
    }

    setProfiles((current) =>
      current.filter((profile) => profile.id !== profileId)
    );
  }

  async function rejectProfile(profileId: number) {
    const confirmReject = window.confirm(
      "A je i sigurt që dëshiron ta refuzosh këtë profil?"
    );

    if (!confirmReject) return;

    setLoadingIds((prev) => [...prev, profileId]);

    const { error } = await supabase.rpc("admin_reject_profile", {
      p_profile_id: profileId,
    });

    setLoadingIds((prev) => prev.filter((id) => id !== profileId));

    if (error) {
      alert("Gabim gjatë refuzimit: " + error.message);
      return;
    }

    setProfiles((current) =>
      current.filter((profile) => profile.id !== profileId)
    );
  }

  return (
    <>
      {profiles.map((profile) => {
        const name =
          profile.account_type === "company"
            ? profile.company_name || "-"
            : `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
              "-";

        const typeLabel =
          profile.account_type === "company" ? "Company" : "Professional";

        const cityName = profile.cities?.name || "-";
        const phone = profile.phone || "-";
        const createdAt = profile.created_at || "-";

        const profileHref =
          profile.account_type === "company"
            ? `/company/${profile.slug}`
            : `/professional/${profile.slug}`;

        const isLoading = loadingIds.includes(profile.id);

        return (
          <tr
            key={profile.id}
            className="border-b border-slate-100 last:border-0"
          >
            <td className="py-3 font-bold">{name}</td>
            <td className="py-3 text-slate-600">{typeLabel}</td>
            <td className="py-3 text-slate-600">{cityName}</td>
            <td className="py-3 text-slate-600">{phone}</td>
            <td className="py-3 text-slate-600">{createdAt}</td>
            <td className="py-3">
              <span className="rounded-lg bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
                Në pritje
              </span>
            </td>
            <td className="py-3">
              <div className="flex gap-2">
                <Link
                  href={profileHref}
                  className="rounded-lg bg-blue-50 p-2 text-blue-600"
                >
                  <Eye size={15} />
                </Link>

                <button
                  type="button"
                  onClick={() => approveProfile(profile.id)}
                  disabled={isLoading}
                  className="rounded-lg bg-emerald-50 p-2 text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => rejectProfile(profile.id)}
                  disabled={isLoading}
                  className="rounded-lg bg-red-50 p-2 text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={15} />
                </button>
              </div>
            </td>
          </tr>
        );
      })}

      {profiles.length === 0 && (
        <tr>
          <td colSpan={7} className="py-6 text-center text-slate-500">
            Nuk ka profile në pritje për momentin.
          </td>
        </tr>
      )}
    </>
  );
}