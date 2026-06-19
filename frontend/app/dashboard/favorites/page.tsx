"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

type FavoriteProfile = {
  id: number;
  slug: string | null;
  account_type: "company" | "professional";
  company_name: string | null;
  first_name: string | null;
  last_name: string | null;
  city_id: number | null;
  city_name?: string | null;
};

export default function FavoritesPage() {
  const [profiles, setProfiles] = useState<FavoriteProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setProfiles([]);
      setLoading(false);
      return;
    }

    const { data: favoritesData } = await supabase
      .from("favorites")
      .select("profile_id")
      .eq("user_id", userData.user.id);

    if (!favoritesData || favoritesData.length === 0) {
      setProfiles([]);
      setLoading(false);
      return;
    }

    const profileIds = favoritesData.map((item) => Number(item.profile_id));

    const { data: profileData } = await supabase
      .from("profiles")
      .select(
        "id, slug, account_type, company_name, first_name, last_name, city_id"
      )
      .in("id", profileIds);

    if (!profileData || profileData.length === 0) {
      setProfiles([]);
      setLoading(false);
      return;
    }

    const cityIds = profileData
      .map((profile) => profile.city_id)
      .filter((id): id is number => id !== null);

    let cityMap: Record<number, string> = {};

    if (cityIds.length > 0) {
      const { data: citiesData } = await supabase
        .from("cities")
        .select("id, name")
        .in("id", cityIds);

      cityMap =
        citiesData?.reduce((acc, city) => {
          acc[city.id] = city.name;
          return acc;
        }, {} as Record<number, string>) || {};
    }

    const formattedProfiles = profileData.map((profile) => ({
      ...profile,
      city_name: profile.city_id ? cityMap[profile.city_id] : null,
    }));

    setProfiles(formattedProfiles as FavoriteProfile[]);
    setLoading(false);
  }

  function getProfileName(profile: FavoriteProfile) {
    if (profile.account_type === "company") {
      return profile.company_name || "Kompani";
    }

    return (
      `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
      "Profesionist"
    );
  }

  function getProfileLink(profile: FavoriteProfile) {
    if (!profile.slug) return "#";

    return profile.account_type === "company"
      ? `/company/${profile.slug}`
      : `/professional/${profile.slug}`;
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-8 text-4xl font-black text-slate-950">
            Favoritët e Mi
          </h1>

          {loading ? (
            <p className="text-slate-600">Duke u ngarkuar...</p>
          ) : profiles.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <p className="font-semibold text-slate-700">
                Nuk ke ende profile të ruajtura.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {profiles.map((profile) => (
                <Link
                  key={profile.id}
                  href={getProfileLink(profile)}
                  className="block rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    {profile.account_type === "company"
                      ? "Kompani"
                      : "Mjeshtër i Pavarur"}
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-slate-950">
                    {getProfileName(profile)}
                  </h2>

                  <p className="mt-2 text-slate-600">
                    📍 {profile.city_name || "Pa qytet"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}