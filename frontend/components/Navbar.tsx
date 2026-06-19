"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ProfileData = {
  account_type: "company" | "professional" | null;
  slug: string | null;
};

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [platformName, setPlatformName] = useState("MojProfi");
  const [platformLogo, setPlatformLogo] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data: settings } = await supabase
        .from("platform_settings")
        .select("platform_name, platform_logo_url")
        .limit(1)
        .single();

      if (settings) {
        setPlatformName(settings.platform_name || "MojProfi");
        setPlatformLogo(settings.platform_logo_url || null);
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsLoggedIn(!!session);

      if (!session?.user) {
        setProfile(null);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("account_type, slug")
        .eq("user_id", session.user.id)
        .maybeSingle();

      setProfile(profileData);
    }

    loadData();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadData();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const publicProfileLink =
    profile?.account_type === "company"
      ? `/company/${profile.slug}`
      : profile?.account_type === "professional"
      ? `/professional/${profile.slug}`
      : "/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-3 text-2xl font-black">
          {platformLogo ? (
            <img
              src={platformLogo}
              alt={platformName}
              className="h-10 w-10 rounded-lg object-cover"
            />
          ) : (
            <span className="rounded-lg bg-blue-600 px-2 py-1 text-white">
              M
            </span>
          )}

          <span>{platformName}</span>
        </a>

        <nav className="hidden items-center gap-10 text-sm font-bold text-slate-900 md:flex">
          <a href="/#categories">Kategoritë</a>
          <a href="/#cities">Qytetet</a>
          <a href="/#companies">Për kompanitë</a>
          <a href="/#how">Si funksionon</a>
          <a href="/contact">Kontakt</a>
        </nav>

        <div className="flex items-center gap-4">
          <span className="text-sm font-bold">AL | MK</span>

          {isLoggedIn ? (
            <>
              <a
                href="/dashboard"
                className="rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-900"
              >
                Dashboard
              </a>

              <a
                href={publicProfileLink}
                className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow"
              >
                Profili Im
              </a>

              <a
                href="/logout"
                className="rounded-xl border border-red-200 px-5 py-3 font-bold text-red-600"
              >
                Dil
              </a>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-900"
              >
                Kyçu
              </a>

              <a
                href="/register"
                className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow"
              >
                Regjistrohu
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}